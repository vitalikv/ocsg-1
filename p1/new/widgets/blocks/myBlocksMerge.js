
// объединяем блоки в один меш
class MyBlocksMerge
{

	crMergeBlocks()
	{
		const data = myCalcBlocks.getLevelsData();
		
		for ( let i = 0; i < data.length; i++ )
		{
			const idLevel = data[i].idLevel;
			
			const arrBlocks = myCalcBlocks.myBlocksObjs.getAllBlocks({id: idLevel});
			this.mergeMeshes({meshes: arrBlocks});
		}				
	}


	// merge блоков без конвертации в BufferGeometry (без дубликатов материалов)
	mergeMeshes({meshes})
	{
		var mergedGeometry = new THREE.Geometry();
		var materials = [];
		var materialMap = {}; // { material: index }

		meshes.forEach((mesh) => 
		{
			var geom = mesh.geometry.clone();
			mesh.updateMatrix();

			// Находим или добавляем материал в общий массив
			var material = mesh.material;
			var materialIndex;

			if (materialMap[material.uuid] !== undefined) 
			{
				materialIndex = materialMap[material.uuid]; // берём существующий индекс
			} 
			else 
			{
				materialIndex = materials.length;
				materials.push(material);
				materialMap[material.uuid] = materialIndex;
			}

			// Назначаем materialIndex граням
			geom.faces.forEach((face) => 
			{
				face.materialIndex = materialIndex;
			});

			mergedGeometry.merge(geom, mesh.matrix);
		});

		var mergedMesh = new THREE.Mesh(mergedGeometry, materials);
		scene.add(mergedMesh);	
		
		const uniqueMaterialsCount = countUniqueMaterials(scene);
		console.log(`Уникальных материалов: ${uniqueMaterialsCount}`);			
	}

	
	// не используется (оставил для примера)
	// merge блоков с конвертацией из Geometry в BufferGeometry (с дублями материалов)
	mergeMeshes2()
	{
		const arr = myCalcBlocks.myBlocksObjs.getAllBlocks({});
		
		//var meshes = [...arr]; // массив мешей
		var meshes = arr.map(function(mesh) 
		{
			mesh.updateMatrix();
			var geom = new THREE.BufferGeometry().fromGeometry(mesh.geometry);

			mesh.updateMatrix();
			geom.applyMatrix4(mesh.matrix);

			mesh.geometry = geom;
			return mesh;
		})

		var materials = meshes.map((mesh) => { return mesh.material; })

		// Создаем пустую объединенную геометрию
		var mergedGeometry = new THREE.BufferGeometry();

		// Массивы для атрибутов
		var positions = [];
		var normals = [];
		var uvs = [];
		var indices = [];
		var materialIndices = []; // массив индексов материалов для каждой вершины

		var vertexOffset = 0;

		meshes.forEach(function(mesh, meshIndex) 
		{
			//console.log(mesh.geometry)
			//var geom = new THREE.BufferGeometry().fromGeometry(mesh.geometry);
			var geom = mesh.geometry;

			// Копируем атрибуты
			positions.push.apply(positions, geom.attributes.position.array);
			if (geom.attributes.normal) normals.push.apply(normals, geom.attributes.normal.array);
			if (geom.attributes.uv) uvs.push.apply(uvs, geom.attributes.uv.array);

			// Копируем индексы (если есть)
			if (geom.index) 
			{
				for (var i = 0; i < geom.index.count; i++) 
				{
					indices.push(geom.index.array[i] + vertexOffset);
				}
			} 
			else 
			{
				// Если индексов нет, генерируем их вручную
				for (var i = 0; i < geom.attributes.position.count; i++) 
				{
					indices.push(vertexOffset + i);
				}
			}

			// Записываем материал для каждой вершины
			for (var i = 0; i < geom.attributes.position.count; i++) 
			{
				materialIndices.push(meshIndex);
			}

			vertexOffset += geom.attributes.position.count;
		});

		// Устанавливаем атрибуты
		mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
		if (normals.length) mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
		if (uvs.length) mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

		// Устанавливаем индексы (если есть)
		if (indices.length) mergedGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

		// Разбиваем на группы по материалам
		var currentVertex = 0;
		meshes.forEach((mesh, i) => 
		{
			var vertexCount = mesh.geometry.attributes.position.count;
			mergedGeometry.addGroup(currentVertex, vertexCount, i); // i = индекс материала
			currentVertex += vertexCount;
		});

		
		// Создаем итоговый меш с массивом материалов
		var mergedMesh = new THREE.Mesh(mergedGeometry, materials);
		scene.add(mergedMesh);		
	}


	// не используется, низкая производительность при рендеринге (оставил для примера)
	// merge блоков с конвертацией из Geometry в BufferGeometry (без дубликатов материалов)
	mergeMeshes3() 
	{
		const arr = myCalcBlocks.myBlocksObjs.getAllBlocks({});
		
		// Подготовка мешей и конвертация в BufferGeometry
		var meshes = arr.map(function(mesh) {
			mesh.updateMatrix();
			var geom = new THREE.BufferGeometry().fromGeometry(mesh.geometry);
			geom.applyMatrix4(mesh.matrix);
			mesh.geometry = geom;
			return mesh;
		});

		// Собираем уникальные материалы и создаем карту соответствия
		var uniqueMaterials = [];
		var materialMap = new Map(); // Хранит соответствие старого индекса -> нового
		
		meshes.forEach(function(mesh) {
			if (!materialMap.has(mesh.material)) {
				materialMap.set(mesh.material, uniqueMaterials.length);
				uniqueMaterials.push(mesh.material);
			}
		});

		// Создаем пустую объединенную геометрию
		var mergedGeometry = new THREE.BufferGeometry();

		// Массивы для атрибутов
		var positions = [];
		var normals = [];
		var uvs = [];
		var indices = [];

		var vertexOffset = 0;
		var materialGroups = []; // Хранит информацию о группах с новыми индексами материалов

		meshes.forEach(function(mesh) {
			var geom = mesh.geometry;
			var newMaterialIndex = materialMap.get(mesh.material);
			var vertexStart = vertexOffset;
			
			// Копируем атрибуты
			positions.push.apply(positions, geom.attributes.position.array);
			if (geom.attributes.normal) normals.push.apply(normals, geom.attributes.normal.array);
			if (geom.attributes.uv) uvs.push.apply(uvs, geom.attributes.uv.array);

			// Копируем индексы
			if (geom.index) {
				for (var i = 0; i < geom.index.count; i++) {
					indices.push(geom.index.array[i] + vertexOffset);
				}
			} else {
				for (var i = 0; i < geom.attributes.position.count; i++) {
					indices.push(vertexOffset + i);
				}
			}

			// Сохраняем информацию о группе
			materialGroups.push({
				start: vertexStart,
				count: geom.attributes.position.count,
				materialIndex: newMaterialIndex
			});

			vertexOffset += geom.attributes.position.count;
		});

		// Устанавливаем атрибуты
		mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
		if (normals.length) mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
		if (uvs.length) mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

		// Устанавливаем индексы
		if (indices.length) mergedGeometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

		// Добавляем группы с новыми индексами материалов
		materialGroups.forEach(function(group) {
			mergedGeometry.addGroup(group.start, group.count, group.materialIndex);
		});

		// Создаем итоговый меш с уникальными материалами
		var mergedMesh = new THREE.Mesh(mergedGeometry, uniqueMaterials);
		scene.add(mergedMesh);			
	}

		
}







