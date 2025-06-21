
// кол-во блоков
class MyBlocksVolume
{
	// расчитываем объем блока
	calculateMeshVolume(geometry) 
	{
		const vertices = geometry.vertices; // Массив вершин
		const faces = geometry.faces; // Массив граней (треугольников)
		let volume = 0;

		// Проходим по всем граням (треугольникам)
		for (let i = 0; i < faces.length; i++) 
		{
			const face = faces[i];

			// Получаем вершины треугольника
			const a = vertices[face.a];
			const b = vertices[face.b];
			const c = vertices[face.c];

			// Вычисляем объём для текущего треугольника
			const cross = new THREE.Vector3();
			cross.crossVectors(new THREE.Vector3().subVectors(b, a), new THREE.Vector3().subVectors(c, a));
			volume += a.dot(cross) / 6;
		}

		return Math.abs(volume); // Возвращаем абсолютное значение объёма
	}


	upVolume(block)
	{
		const volume = this.calculateMeshVolume(block.geometry);		

		const originalNumber = block.userData.originalVolume; // Исходное число (100%)
		const obtainedValue = volume; // Полученное значение

		// Вычисляем процент
		const percentage = (obtainedValue / originalNumber) * 100;

		// Округляем до 2 знаков после запятой
		const roundedPercentage = Number(percentage.toFixed(2));

		block.userData.upVolume = volume;
		block.userData.percentage = roundedPercentage;

		if(percentage < 95 && 1 ===2)
		{	
			block.material = block.material.clone();
			block.material.color = new THREE.Color().setHSL(percentage / 200, 1, 0.5);
		}
		
		if(percentage < 80 && percentage > 50 && 1 ===2)
		{
			block.material = block.material.clone();
			block.material.color = new THREE.Color( 0x00ff00 );
		}
		
		if(percentage <= 50 && 1 ===2)
		{
			block.material = block.material.clone();
			block.material.color = new THREE.Color( 0x0000ff );
		}		
	}

	
	// собираем данные по кол-во блоков на этаже и группируем
	calcCountBlocks()
	{
		const data = [];
		
		for ( let i = 0; i < 4; i++ )
		{
			const arr = myCalcBlocks.myBlocksObjs.getLinesAllBlocks({id: i});
			
			const lines = [];
			
			for ( let i2 = 0; i2 < arr.length; i2++ )
			{
				const count = arr[i2].arrBloks.length;
				const paramsBlock = arr[i2].paramsBlock;
				const wallsClone = arr[i2].wallsClone;
				
				let countFloat = 0;
				for ( let i3 = 0; i3 < arr[i2].arrBloks.length; i3++ )
				{
					countFloat += arr[i2].arrBloks[i3].userData.percentage / 100;
				}
				countFloat = countFloat.toFixed(2);
				
				lines.push({count, countFloat, paramsBlock, wallsClone});				
			}
			
			const group = this.sumCountsByBlockParams({lines});
			
			if(group.length === 0) continue;
			
			
			const blockTypes = [];
			for ( let i2 = 0; i2 < group.length; i2++ )
			{
				blockTypes.push(group[i2].paramsBlock);
			}
			
			
			const blocksData = [];		
			for ( let i2 = 0; i2 < arr.length; i2++ )
			{	
				for ( let i3 = 0; i3 < arr[i2].arrBloks.length; i3++ )
				{
					blocksData.push(arr[i2].arrBloks[i3].userData);				
				}
			}
			
			const optimizer = new MyBlocksOptimizer(blocksData, blockTypes);
			const result = optimizer.optimize();
			const statsByType = optimizer.getStatsByType();

console.log('====================');
console.log('Блоки по типам:', result.blocksUsedByType);
console.log('Обрезки по типам:', result.leftoversByType);
console.log('====================');	
		
			data.push({ idLevel: i, group, lines, statsByType });
		}
		
		return data;
	}
	
	
	// группирует объекты по параметрам и суммирует их количество
	sumCountsByBlockParams({lines})
	{
		const result = lines.reduce((acc, item) => 
		{
			// Преобразуем paramsBlock в строку для сравнения
			const paramsKey = JSON.stringify(item.paramsBlock);

			// Если такой paramsBlock уже есть, прибавляем count
			if (acc[paramsKey]) 
			{
				acc[paramsKey].totalCount += item.count;
			}			
			else 	// Иначе создаем новую запись
			{
				acc[paramsKey] = { paramsBlock: item.paramsBlock, totalCount: item.count };
			}

			return acc;
		}, {});

		// Преобразуем объект в массив (если нужно)
		const groupedData = Object.values(result);		

		return groupedData;
	}
	
}







