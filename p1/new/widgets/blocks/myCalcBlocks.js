
// автоматическая расчет кол-во блоков/кирпичей
class MyCalcBlocks
{
	arrB = [];
	listPathImgs = {};
	geometry;
	material;
	blockParams = {dlina: 0.6, h: 0.3, z: 0.32, offset: 0.01};
	
	constructor()
	{
		this.listPathImgs.kirpich = infProject.path+'img/widgets/blocks/one_kirpich.jpg';
		this.listPathImgs.block = infProject.path+'img/widgets/blocks/block_1.jpg';
		
		const {dlina, h, z} = this.blockParams;
		this.geometry = createGeometryCube(dlina, h, z);
		//this.geometry = new THREE.BufferGeometry().fromGeometry(this.geometry);

		
		this.material = new THREE.MeshStandardMaterial({ color: 0xffffff, lightMap : lightMap_1, wireframe: false });
		this.setImage({material: this.material, img: this.listPathImgs.kirpich});
	}
	
	init()
	{
		
		this.test({level: myLevels.levels[0]});
	}
	
	createBlock({pos})
	{ 
		const obj = new THREE.Mesh( this.geometry, this.material ); 
		obj.position.copy(pos);
		scene.add(obj);

		return obj;
	}
	
	
	
	// добавляем img к obj
	async setImage({material, img})
	{
		const data = await this.xhrImg_1(img);	

		const image = new Image();
		image.src = data;
		
		material.color = new THREE.Color( 0xffffff );
		const texture = new THREE.Texture(image);			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();			
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.needsUpdate = true; 			
	}
	
	
	// загрузка файла (img)
	xhrImg_1(url) 
	{
		return new Promise((resolve, reject) => 
		{
			const request = new XMLHttpRequest();
			request.responseType = 'blob';
			request.open('GET', url, true);
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function () 
			{
				if (request.status >= 200 && request.status < 400) 
				{
					const data = window.URL.createObjectURL(request.response);
					resolve(data);
				}
			};
			
			request.onprogress = (event) => {};

			request.onerror = () => { reject(request.response); };			
			
			request.send();
		});
	}

	
	//---
	

	
	test({level})
	{
		//const posY = myLevels.getLevelPos0({lastId: 0, newId: 0});
		
		const wall = level.wall;
		const levelHeight = level.height;
		
		
		// outside - наружные
		// inside - внутренние
		// single - отдельные
		const arrW = { outside: [], inside: [], single: [] };
		
		for ( let i = 0; i < wall.length; i++ )
		{
			const room = myHouse.myRoom.detectCommonZone_1( wall[i] );
			
			if(room.length === 0)
			{
				arrW.single.push({wall: wall[i], side: 1});
			}
			
			if(room.length === 1)
			{
				let side = 0;
				for ( let i2 = 0; i2 < room[0].userData.room.w.length; i2++ ) 
				{ 
					if(room[0].userData.room.w[i2] == wall[i]) { side = room[0].userData.room.s[i2]; break; } 
				}					
				
				arrW.outside.push({wall: wall[i], side});
				//console.log(wall[i].userData.wall.v);
			}
		}
		

		if(arrW.single.length > 0) this.caclColumn({data: arrW.single, levelHeight, type: 'single'});
		if(arrW.outside.length > 0) this.caclColumn({data: arrW.outside, levelHeight, type: 'outside'});

		renderCamera();
	}
	
	caclColumn({data, levelHeight, type})
	{
		const gArrBloks = [];
		
		const { dlina, h, offset, z } = this.blockParams;
		let countY = 0;			
		
		for (let i = 0; i < levelHeight; i += h + offset) 
		{
			const startX = countY % 2 === 0 ? dlina / 2 : 0;	// т.к. у блока центр по центру, вначале мы его смещаем
			const endX = countY % 2 === 0 ? 0 : dlina / 2;		// нужно знать, чтобы не строить лишние блоке в ряде
			
			if(countY < 2222) 
			{
				this.caclRow({data, gArrBloks, levelHeight, currentY: i, startX, endX, type});
			}
			
			countY++;
		}		
	}
	
	caclRow({data, gArrBloks, levelHeight, currentY, startX, endX, type})
	{
		
		let posStart = null;		// позиция от которой начинается строиться блок на соседней стене
		let offsetJoint = true;		// добавляем смещение цемента по горизонтали
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const wall = data[i].wall;
			let side = data[i].side;
			
			wall.visible = false;			
			
			const result = this.getPosWallV({ wall, side });
			side = result.side;
			const dir = result.pos2.clone().sub(result.pos1).normalize();
			const normal = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: false});
			const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
			
			
			if(!posStart)
			{
				posStart = result.pos1;
			}
			else
			{
				// создаем математический объект/точку от которой начинается стена
				const tempObject = new THREE.Object3D();
				tempObject.position.copy(result.pos1); 
				tempObject.lookAt(normal2.clone().add(result.pos1)); 				
				tempObject.updateMatrixWorld();		
				
				// posStart - позиция (крайняя точка) последнего блока соседней стены
				// relativePosition.x - локальная точка от старта стены
				const relativePosition = new THREE.Vector3();
				tempObject.worldToLocal(relativePosition.copy(posStart));
				
				// wPosition - получаем глобальную позицию стартовой позиции для построения блока с учетом
				// где был построен последний блок + смещение на цемент (если нужно)
				const wPosition = new THREE.Vector3();
				const { offset } = this.blockParams;
				const offsetX = (offsetJoint) ? 0 : offset;
				tempObject.localToWorld(wPosition.set(relativePosition.x + offsetX, 0, 0));
				
				//this.helpBox({pos: wPosition, size: new THREE.Vector3(0.05, 0.05, 0.05), color: 0x000000});
				result.pos1 = wPosition;
				posStart = result.pos1.clone();
			}
			
			this.helpBox({pos: result.pos2, size: new THREE.Vector3(0.05, 0.05, 0.05), color: 0x000000});
			
			const x = result.pos1.distanceTo(result.pos2);
			const y = levelHeight;			
			
			
			const answer = this.rowBlockes({x, y, posStart, dir, normal, currentY, startX, endX, type, side});
			let arrBloks = answer.arrBloks;
			const delLastBlock = answer.delLastBlock;
			offsetJoint = delLastBlock;
			
			if(1===1)
			{
				const {dlina, z} = this.blockParams;
				const z2 = (side === 0) ? z : -z;
				
				const geometry = createGeometryCube(dlina * 2, y + 1, z * 2);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.position.copy(result.pos1.clone().sub(dir.clone().multiplyScalar(dlina)));
				obj.position.add(normal.clone().multiplyScalar(z2/2));
				
				const rad = Math.atan2(dir.z, -dir.x);
				obj.rotateY(rad);

				scene.add(obj);	

				arrBloks = this.cutBlockes({obj, w: arrBloks});
				
				
				obj.visible = false;
			}
			
			if(1===1)
			{
				const {dlina, z, offset} = this.blockParams;
				const z2 = (side === 0) ? z : -z;
				
				const geometry = createGeometryCube(dlina * 2, y + 1, z * 2);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.position.copy(result.pos2.clone().add(dir.clone().multiplyScalar(dlina)));
				if(type === 'outside')
				{
					if(delLastBlock) obj.position.sub(dir.clone().multiplyScalar(z + offset));
				}				
				obj.position.add(normal.clone().multiplyScalar(z2/2));
				
				const rad = Math.atan2(dir.z, -dir.x);
				obj.rotateY(rad);

				scene.add(obj);	

				arrBloks = this.cutBlockes({obj, w: arrBloks});
				
				obj.visible = false;
				
				//if(type === 'single') obj.visible = true;
			}			

			if(1===1)
			{
				const {dlina, h, z} = this.blockParams;
				const z2 = (side === 0) ? z : -z;
				
				const geometry = createGeometryCube(x + dlina * 2, h * 2, z * 2);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				const posC1 = result.pos2.clone().sub(result.pos1).divideScalar(2).add(result.pos1);
				posC1.add(new THREE.Vector3(0, y, 0));
				posC1.add(normal.clone().multiplyScalar(z2/2));
				
				obj.position.copy(posC1);
				
				const rad = Math.atan2(dir.z, -dir.x);
				obj.rotateY(rad);

				scene.add(obj);	

				arrBloks = this.cutBlockes({obj, w: arrBloks});
				
				obj.visible = false;
			}
			
			
			for (let i2 = 0; i2 < arrBloks.length; i2++)
			{
				const block = arrBloks[i2];
				this.upVolume(block);
			}
		
			gArrBloks.push(arrBloks);
			
			this.arrB.push(...arrBloks);
			
			if(i > 0) 
			{
				//this.intersectBlockes({arr: [gArrBloks[i - 1], gArrBloks[i]]});
				
				//break;
			}
			
			posStart = null;
			
			if(type === 'outside' && 1===1)
			{
				// получаем последний блок в ряде				
				const obj = arrBloks[arrBloks.length - 1];	
				
				const tempObject = new THREE.Object3D();
				tempObject.position.copy(result.pos1); 
				const rad = Math.atan2(-dir.z, dir.x);
				tempObject.rotateY(rad);					
				//tempObject.lookAt(normal2.clone().add(result.pos1)); 				
				tempObject.updateMatrixWorld();				
				
				// находим 2 крайнии точки
				const globalPositions = this.getArrPosWorldObj({obj});
				const arr2 = [];
				
				// находим относительное положение точек от стартового положения построение блоков
				globalPositions.forEach(pos => 
				{
					const relativePosition = new THREE.Vector3();
					tempObject.worldToLocal(relativePosition.set(pos.x, tempObject.position.y, pos.z));
					
					arr2.push({dist: relativePosition.z, pos});
				});

				// 
				if(side === 0)
				{
					if(!delLastBlock) arr2.sort(function (a, b) { return a.dist - b.dist; });
					else arr2.sort(function (a, b) { return b.dist - a.dist; });					
				}				
				if(side === 1)
				{
					if(!delLastBlock) arr2.sort(function (a, b) { return b.dist - a.dist; });
					else arr2.sort(function (a, b) { return a.dist - b.dist; });					
				}				
				
				
				if(arr2.length > 0)
				{
					this.helpBox({pos: arr2[0].pos, size: new THREE.Vector3(0.05, 0.05, 0.05), color: 0xff0000});
					
					posStart = arr2[0].pos.clone();	

					const { dlina } = this.blockParams;
					startX = dlina / 2;
					endX = 0;					
				}
			}
		}

				
	}
	
	rowBlockes({x, y, posStart, dir, normal, currentY, startX, endX, type, side})
	{		
		const { dlina, h, offset, z } = this.blockParams;
		const z2 = (side === 0) ? z : -z;
		
		const arrBloks = [];
		
		const n1 = (x + endX)/(dlina + offset);
		const n2 = Math.ceil(n1);
		const delLastBlock = (1 - (n2 - n1) < 0.5) ? true : false;
		
		
		for (let i2 = 0; i2 <= x + endX; i2 += dlina + offset) 
		{
			if(type === 'outside')
			{
				// если последний блок выступающий за пределы стены, выступает больше чем на половину, то не содаем его
				if(i2 > ((x + endX) - (dlina + offset)) && delLastBlock) break;
			}			
			
			const pos = posStart.clone().add(dir.clone().multiplyScalar(i2).add(dir.clone().multiplyScalar(startX)).add(new THREE.Vector3(0, currentY, 0)));
			pos.add(normal.clone().multiplyScalar(z2/2));
			
			const block = this.createBlock({pos});
			const volume = this.calculateMeshVolume(block.geometry);
			
			block.userData.originalVolume = volume;
			block.userData.upVolume = volume;
			block.userData.percentage = 100;
			
			const rad = Math.atan2(dir.z, -dir.x);
			block.rotateY(rad);
			
			arrBloks.push(block);
		}		

		return { arrBloks, delLastBlock };
	}
	
	cutBlockes({obj, w})
	{
		obj.updateMatrixWorld();
		let objBSP = new ThreeBSP( obj );
		
		for ( let i = 0; i < w.length; i++ )
		{
			if(w[i].geometry.vertices.length === 0) continue;
			
			w[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( w[i] );
			
			let newBSP = wBSP.subtract( objBSP );		// вычитаем из стены объект нужной формы
			
			w[i].geometry.dispose();				
			w[i].geometry = newBSP.toGeometry();
			
			//wall.geometry.computeVertexNormals();	
			w[i].geometry.computeFaceNormals();	
			//boxUnwrapUVs(w[i].geometry);
		}

		return w;
	}
	
	
	intersectBlockes({arr})
	{
		const arr1 = arr[0];
		const arr2 = arr[1];
		let count = 0;
		
		const arr3 = [];
		
		for ( let i = 0; i < arr1.length; i++ )
		{
			const obj1 = arr1[i];
			
			obj1.updateMatrixWorld();
			let objBSP = new ThreeBSP( obj1 );
		
			for ( let i2 = 0; i2 < arr2.length; i2++ )
			{
				const obj2 = arr2[i2];
				
				obj2.updateMatrixWorld();
				let wBSP = new ThreeBSP( obj2 );
				
				let newBSP = wBSP.intersect( objBSP );

				const geometry = newBSP.toGeometry();
				
				if(geometry.vertices.length === 0) 
				{
					console.log(9999)
					continue;
				}
				else if(0.001 < this.calculateMeshVolume(geometry))
				{
					console.log(100000)
					//continue;					
				}
				
				geometry.dispose();
				if(1===2)
				{
					const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, lightMap : lightMap_1, transparent: true, opacity: 1, depthTest: true });
					
					const obj3 = new THREE.Mesh( geometry, material ); 
					obj3.position.copy(obj2.position);
					obj3.rotation.copy(obj2.rotation);
					scene.add(obj3);					
				}
				
				count++;
				
				arr3.push({obj1, obj2});
			}
		}
		
		console.log(111, count, arr3.length);
		
		for ( let i = 0; i < arr3.length; i++ )
		{
			const {obj1, obj2} = arr3[i];
			
			if(obj1.userData.percentage < obj2.userData.percentage)
			{
				this.cutBlockes({obj: obj1, w: [obj2]});
				obj2.updateMatrixWorld();
				this.upVolume(obj2);
				//obj2.visible = false;
			}
			else
			{
				this.cutBlockes({obj: obj2, w: [obj1]});
				obj1.updateMatrixWorld();
				this.upVolume(obj1);
				//obj1.visible = false;
			}
		}
		
	}


	getPosWallV({ wall, side }) 
	{
		const v = wall.userData.wall.v;		
		wall.updateMatrixWorld();
		
		const data = {};
		
		console.log(side);
		if(side === 0)
		{
			data.pos1 = wall.localToWorld( v[0].clone() );
			data.pos2 = wall.localToWorld( v[6].clone() );
			data.side = side;
		}
		if(side === 1)
		{
			data.pos1 = wall.localToWorld( v[4].clone() );
			data.pos2 = wall.localToWorld( v[10].clone() );
			data.side = side;
		}		
		else
		{
			const pos1 = wall.localToWorld( v[0].clone() );
			const pos2 = wall.localToWorld( v[6].clone() );
			
			const pos3 = wall.localToWorld( v[4].clone() );
			const pos4 = wall.localToWorld( v[10].clone() );	

			const dist1 = pos1.distanceTo(pos2);
			const dist2 = pos3.distanceTo(pos4);
			
			if(dist1 > dist2)
			{
				data.pos1 = pos1;
				data.pos2 = pos2;
				data.side = 0;
			}
			else
			{
				data.pos1 = pos3;
				data.pos2 = pos4;
				data.side = 1;
			}			
		}
		
		return data;
	}
	
	
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
		const roundedPercentage = percentage.toFixed(2);

		block.userData.upVolume = volume;
		block.userData.percentage = roundedPercentage;
		
		//console.log(111, block.userData);		
	}


	getArrPosWorldObj({obj})
	{
		// Вычисляем boundingBox в локальных координатах
		//const boundingBox = new THREE.Box3().setFromObject(obj);
		obj.geometry.computeBoundingBox();
		const boundingBox = obj.geometry.boundingBox;
		
		// Создаем массив для хранения глобальных позиций вершин boundingBox
		const globalPositions = [];

	
		
		const vertices = [
			new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z), // 0
			//new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z), // 1
			//new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z), // 2
			//new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z), // 3
			new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z), // 4
			//new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z), // 5
			//new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z), // 6
			//new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z), // 7
		];

		// Преобразуем каждую вершину в глобальные координаты
		obj.updateMatrixWorld();
		vertices.forEach(vertex => 
		{
			vertex.applyMatrix4(obj.matrixWorld); // Применяем мировую матрицу объекта
			globalPositions.push(vertex.clone()); // Сохраняем глобальную позицию
		});	

		return globalPositions;
	}

	helpBox({size = new THREE.Vector3(0.1, 0.1, 0.1), pos, color = 0x00ff00})
	{
		const geometry = createGeometryCube(size.x, size.y, size.z);
		const material = new THREE.MeshStandardMaterial({ color, lightMap: lightMap_1, transparent: true, opacity: 1, depthTest: false });
		const obj = new THREE.Mesh( geometry, material ); 
		obj.position.copy(pos);
		scene.add(obj);	

		return obj;
	}
}







