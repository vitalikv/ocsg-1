
// автоматическая расчет кол-во блоков/кирпичей
class MyCalcBlocks
{
	arrB = [];
	listPathImgs = {};
	geometry;
	material;
	blockParams = {dlina: 0.6, h: 0.3, z: 0.3, offset: 0.01};
	
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
			//console.log(wall[i].userData.wall.p[0].userData.id, wall[i].userData.wall.p[1].userData.id)
			if(room.length === 0)
			{
				arrW.single.push({wall: wall[i], side: 0, pStart: 0});
			}
			
			if(room.length === 1)
			{
				let side = 0;
				for ( let i2 = 0; i2 < room[0].userData.room.w.length; i2++ ) 
				{ 
					if(room[0].userData.room.w[i2] == wall[i]) { side = room[0].userData.room.s[i2]; break; } 
				}					
				
				arrW.outside.push({wall: wall[i], side, array: [wall[i].userData.wall.p[0].userData.id, wall[i].userData.wall.p[1].userData.id]});
			}
		}
		
		if(arrW.outside.length > 0)
		{
			const newArr = this.sortChains(arrW.outside);
			arrW.outside.length = 0;
			let pStart = 0;
			
			// !!! - при старте стены, по идее нужно узнавать из array, это 1 точка у стены или 2-ая и от этого назначать pStart = 0 или 1
			newArr.unshift(newArr[newArr.length - 1]);
			for ( let i = 1; i < newArr.length; i++ )
			{
				const array = newArr[i].array;
				const wall = newArr[i].wall;
				const side = newArr[i].side;
				
				const array2 = newArr[i-1].array;
				if(array2[1] !== array[0])
				{
					pStart = (pStart === 0) ? 1 : 0;
				}				
				
				arrW.outside.push({wall, side, pStart});
				
				console.log(array, pStart, array2[1], array[0]);
			}			
		}

		if(arrW.single.length > 0) this.caclColumn({data: arrW.single, levelHeight, type: 'single'});
		if(arrW.outside.length > 0) this.caclColumn({data: arrW.outside, levelHeight, type: 'outside'});

		renderCamera();
	}

	
	/* сортируем массив, чтобы array шел последовательно 
	входные данные
	const arrayObjects = [
		{ array: [2, 3], side: 1 },
		{ array: [3, 5], side: 1 },
		{ array: [7, 2], side: 1 },
		{ array: [7, 5], side: 1 }
	];
	ответ
	[
		{ array: [2, 3], side: 1 }, // last=3 → ищем 3 в следующих
		{ array: [3, 5], side: 1 }, // перемещён на позицию 1 (т.к. [3,5] содержит 3)
		{ array: [7, 5], side: 1 }, // last=5 → ищем 5 в следующих
		{ array: [7, 2], side: 1 }  // перемещён на позицию 2 (т.к. [7,5] содержит 5)
	] */
	sortChains(arr) {
		const result = [...arr];
		
		for (let i = 0; i < result.length - 1; i++) {
			const currentArray = result[i].array;
			const lastValue = currentArray[currentArray.length - 1];
			
			// Ищем первый массив после текущего, где есть совпадение с lastValue
			for (let j = i + 1; j < result.length; j++) {
				const nextArray = result[j].array;
				
				if (nextArray.includes(lastValue)) {
					// Перемещаем найденный массив на позицию i+1
					const [movedItem] = result.splice(j, 1);
					result.splice(i + 1, 0, movedItem);
					break;
				}
			}
		}
		
		return result;
	}
	
	
	caclColumn({data, levelHeight, type})
	{
		const gArrBloks = [];
		
		const { dlina, h, offset, z } = this.blockParams;
		let countY = 0;			
		
		for (let i = 0; i < levelHeight; i += h + offset) 
		{
			const startX = countY % 2 === 0 ? dlina / 2 : 0;	// т.к. у блока центр по центру, вначале мы его смещаем
			let delLastBlock = countY % 2 === 0 ? false : true;
			
			if(countY === 0) 
			{
				this.caclRow({data, gArrBloks, levelHeight, currentY: i, startX, type, delLastBlock});
			}
			
			countY++;
		}		
	}
	
	caclRow({data, gArrBloks, levelHeight, currentY, startX, type, delLastBlock})
	{
		
		let posStart = null;		// позиция от которой начинается строиться блок на соседней стене
		let offsetJoint = false;		// добавляем смещение цемента по горизонтали
		let lines = [];
		
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const wall = data[i].wall;
			let side = data[i].side;
			const pStart = data[i].pStart;
			
			
			if(i < 33)
			{
				const resultP = this.getPosWallV({ wall, side, pStart });
				lines.push({pos: [resultP.pos1, resultP.pos2, resultP.pos3, resultP.pos4], v: resultP.v});				
			}
			
			
			wall.visible = false;			
			continue;
			
			const result = this.getPosWallV({ wall, side, pStart });
			side = result.side;
			const dir = result.pos2.clone().sub(result.pos1).normalize();
			const normal = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: false});
			const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
			
			if(i > -1)
			{
				result.pos1 = this.getWallIn1({wall, ind: 0, side, pStart, offsetD: delLastBlock});
				result.pos2 = this.getWallIn2({wall, ind: 1, side, pStart, offsetD: !delLastBlock});
				posStart = result.pos1;
				const { dlina } = this.blockParams;
				startX = dlina / 2;
			}
			
			//if(i===1) this.getWallIn1({wall, ind: 0, side, pStart, offsetD: !delLastBlock});
			
			let x = result.pos1.distanceTo(result.pos2);
			

			console.log(wall.userData.wall.p[0].userData.id, wall.userData.wall.p[1].userData.id);
			
			if(!posStart)
			{
				posStart = result.pos1;
			}
			else if(1===2)
			{ //this.helpBox({pos: posStart, size: new THREE.Vector3(0.05, 0.05, 0.05), color: 0x000000});
				// создаем математический объект/точку от которой начинается стена
				const tempObject = new THREE.Object3D();
				tempObject.lookAt(normal2);
				tempObject.position.copy(result.pos1);				
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
				
				//result.pos1 = wPosition;
				
				if(1===1)
				{
					const pos2 = tempObject.worldToLocal(new THREE.Vector3().copy(result.pos3));
					const posGlobal2 = tempObject.localToWorld(new THREE.Vector3(pos2.x + offsetX, 0, 0));

					if(offsetJoint && pos2.x < 0)
					{
						result.pos1 = posGlobal2;
						
						//this.helpBox({pos: posGlobal2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x0000ff});						
					}
					if(!offsetJoint && pos2.x > 0)
					{
						result.pos1 = posGlobal2;
						
						//this.helpBox({pos: posGlobal2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x0000ff});						
					}					
				}
				
				
				posStart = result.pos1.clone();

				if(1===1)
				{
					//const tempObject = this.helpBox({pos: new THREE.Vector3(), size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});
					const tempObject = new THREE.Object3D();
					tempObject.lookAt(normal2);
					tempObject.position.copy(result.pos1); 					 				
					tempObject.updateMatrixWorld();		
										
					const pos2 = tempObject.worldToLocal(new THREE.Vector3().copy(result.pos4));
					const posGlobal2 = tempObject.localToWorld(new THREE.Vector3(pos2.x, 0, 0));
					
					
					const dist = result.pos1.distanceTo(result.pos2);
					if(offsetJoint && dist > pos2.x)
					{
						result.pos2 = posGlobal2;
					}
					if(!offsetJoint && dist < pos2.x)
					{
						result.pos2 = posGlobal2;						
					}				
				}
				
			}
			
			
			

			//this.helpBox({pos: result.pos1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			//this.helpBox({pos: result.pos2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});			
			
			x = result.pos1.distanceTo(result.pos2);
			const y = levelHeight;			
			
			
			const answer = this.rowBlockes({x, y, posStart, dir, normal, normal2, currentY, startX, type, side, pStart});
			let arrBloks = answer.arrBloks;
			offsetJoint = delLastBlock;
			
			if(1===2)
			{
				const {dlina, z} = this.blockParams;
				let z2 = (side === 0) ? z : -z;
				if (pStart !== 0) z2 *= -1;
		
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
			
			if(1===2)
			{
				const {dlina, z, offset} = this.blockParams;
				let z2 = (side === 0) ? z : -z;
				if (pStart !== 0) z2 *= -1;
				
				const geometry = createGeometryCube(dlina * 2, y + 1, z * 2);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.position.copy(result.pos2.clone().add(dir.clone().multiplyScalar(dlina)));
				//if(delLastBlock) obj.position.sub(dir.clone().multiplyScalar(z + offset));
				if(delLastBlock) obj.position.sub(dir.clone().multiplyScalar(offset));
				obj.position.add(normal.clone().multiplyScalar(z2/2));
				
				const rad = Math.atan2(dir.z, -dir.x);
				obj.rotateY(rad);

				scene.add(obj);	
				
				arrBloks = this.cutBlockes({obj, w: arrBloks});				
				obj.visible = false;
				
				//if(type === 'single') obj.visible = true;
			}			

			if(1===2)
			{
				const {dlina, h, z} = this.blockParams;
				let z2 = (side === 0) ? z : -z;
				if (pStart !== 0) z2 *= -1;
				
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
			
			if(1===1)
			{
				// получаем последний блок в ряде				
				const obj = arrBloks[arrBloks.length - 1];	
				
				const tempObject = new THREE.Object3D();
				tempObject.position.copy(result.pos1); 
				//const rad = Math.atan2(-dir.z, dir.x);
				//const rad = Math.atan2(dir.z, -dir.x);
				//tempObject.rotateY(rad);					
				tempObject.lookAt(normal2.clone().add(result.pos1)); 				
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
					if (pStart !== 0) arr2.reverse();
					//if(i === 1) this.helpBox({pos: arr2[0].pos, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x0000ff});					
					
					posStart = arr2[0].pos.clone();	

					const { dlina } = this.blockParams;
					startX = dlina / 2;						
				}
			}

		}
		
		if(1===1)
		{
			const lines2 = this.showLines({lines});
			//lines2.length = 0;
			for (let i = 0; i < lines2.length; i++)
			{
				const result = lines2[i];
				
				const wallDlina = result.pos[0].distanceTo(result.pos[1]);
				
				const answer = this.rowBlockes2({x: wallDlina, posStart: result.pos[0], dir: result.dir, currentY: 0, normal: result.normal});
				let arrBloks = answer.arrBloks;
				
				
				if(1===1)
				{
					const dir = result.dir;
					const normal = result.cut1.normal;
					const dir2 = result.cut1.dir;
					const pos = result.cut1.pos;
					
					const {dlina, z} = this.blockParams;
					//let z2 = (side === 0) ? z : -z;
					//if (pStart !== 0) z2 *= -1;
					let z2 = z;
			
					const geometry = createGeometryCube(dlina * 2, 1, z * 2);
					const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
					const obj = new THREE.Mesh( geometry, material ); 
					
					obj.lookAt(normal);
					obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina)));
					obj.position.add(normal.clone().multiplyScalar(z2/2));
					
					scene.add(obj);	

					arrBloks = this.cutBlockes({obj, w: arrBloks});
					obj.visible = false;
				}

				if(1===1)
				{
					const dir = result.dir;
					const normal = result.cut2.normal;
					const dir2 = result.cut2.dir;
					const pos = result.cut2.pos;
					
					const {dlina, z} = this.blockParams;
					//let z2 = (side === 0) ? z : -z;
					//if (pStart !== 0) z2 *= -1;
					let z2 = z;
			
					const geometry = createGeometryCube(dlina * 2, 1, z * 2);
					const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
					const obj = new THREE.Mesh( geometry, material ); 
					
					obj.lookAt(normal);
					obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina)));
					obj.position.add(normal.clone().multiplyScalar(z2/2));

					scene.add(obj);	

					arrBloks = this.cutBlockes({obj, w: arrBloks});
					obj.visible = false;
				}				
			
			}
			
		}
		
	}
	
	rowBlockes({x, y, posStart, dir, normal, normal2, currentY, startX, type, side, pStart})
	{		
		const { dlina, h, offset, z } = this.blockParams;
		let z2 = (side === 0) ? z : -z;
		if (pStart !== 0) z2 *= -1;
		
		const arrBloks = [];

		//const count1 = Math.ceil((x - dlina)/(dlina + offset));
		const dd = (startX === 0) ? dlina/2 : 0;
		
		let count2 = Math.ceil((x + dd)/(dlina + offset));
		
		if(type === 'single' && startX === 0)
		{
			//count2 = Math.ceil((x + dlina/2)/(dlina + offset));
		}
		
		for (let i = 0; i < count2; i++)
		{
			const step = i * (dlina + offset);
			const pos = posStart.clone().add(dir.clone().multiplyScalar(step));
			pos.add(dir.clone().multiplyScalar(startX - dlina/2));	
			pos.add(new THREE.Vector3(0, currentY, 0));			
			//this.helpBox({pos, size: new THREE.Vector3(0.03, 0.03, 0.03), color: 0x0000ff});


			pos.add(dir.clone().multiplyScalar(dlina/2));
			pos.add(normal.clone().multiplyScalar(z2/2));

			const block = this.createBlock({pos});
			const volume = this.calculateMeshVolume(block.geometry);
			
			block.userData.originalVolume = volume;
			block.userData.upVolume = volume;
			block.userData.percentage = 100;
			
			const rad = Math.atan2(dir.z, -dir.x);
			//block.rotateY(rad);
			block.lookAt(normal2.clone().add(pos));
			
			arrBloks.push(block);			
		}

		return { arrBloks };
	}
	
	cutBlockes({obj, w})
	{
		const w2 = [];
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
			
			if(w[i].geometry.vertices.length === 0) continue;
			
			w2.push(w[i]);
		}

		return w2;
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


	getPosWallV({ wall, side, pStart }) 
	{
		const v = wall.userData.wall.v;		
		wall.updateMatrixWorld();
		
		const data = {};
		
		//console.log({p:[wall.userData.wall.p[0].userData.id, wall.userData.wall.p[1].userData.id]}, side, pStart);
		const n1 = (pStart === 0) ? 0 : 6;
		const n2 = (pStart === 0) ? 6 : 0;

		const n3 = (pStart === 0) ? 4 : 10;
		const n4 = (pStart === 0) ? 10 : 4;
		
		if(side === 0)
		{
			data.pos1 = wall.localToWorld( v[n1].clone() );
			data.pos2 = wall.localToWorld( v[n2].clone() );
			data.pos3 = wall.localToWorld( v[n3].clone() );
			data.pos4 = wall.localToWorld( v[n4].clone() );			
			data.side = side;
			//console.log('ppp', n1, n2);
		}
		if(side === 1)
		{
			data.pos1 = wall.localToWorld( v[n3].clone() );
			data.pos2 = wall.localToWorld( v[n4].clone() );
			data.pos3 = wall.localToWorld( v[n1].clone() );
			data.pos4 = wall.localToWorld( v[n2].clone() );			
			data.side = side;
			//console.log('ppp', n3, n4);
		}		
		else if(1===2)
		{
			const pos1 = wall.localToWorld( v[n1].clone() );
			const pos2 = wall.localToWorld( v[n2].clone() );
			
			const pos3 = wall.localToWorld( v[n3].clone() );
			const pos4 = wall.localToWorld( v[n4].clone() );	

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
		
		data.v = [v[n1].clone(), v[n2].clone(), v[n3].clone(), v[n4].clone()];
		
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
		
		//this.helpBox({pos: globalPositions[0].clone().add(new THREE.Vector3(0, 0.5, 0)), size: new THREE.Vector3(0.05, 0.05, 0.05), color: 0xff0000});

		return globalPositions;
	}



	getWallIn1({wall, ind, side, pStart, offsetD})
	{
		const arrW = wall.userData.wall.p[ind].w;
		
		const arrW2 = [];
		
		for (let i = 0; i < arrW.length; i++)
		{
			if(arrW[i] === wall) continue;
			
			arrW2.push(arrW[i]);
		}
		
		const arrL = [];
		const lines = [];
		
		const result = this.getPosWallV({ wall, side, pStart });
		
		let fd = false;
		
		if(1===1)
		{
			
			
			this.helpBox({pos: result.pos1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			this.helpBox({pos: result.pos2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});
			this.helpBox({pos: result.pos3, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			this.helpBox({pos: result.pos4, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});			

			const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
			const tempObject = new THREE.Object3D();
			tempObject.lookAt(normal2);
			tempObject.position.copy(result.pos1);				
			tempObject.updateMatrixWorld();
			const pos3 = tempObject.worldToLocal(new THREE.Vector3().copy(result.pos3));
			
			if(pos3.x < 0)
			{
				arrL.push([result.pos1, result.pos2]);
				arrL.push([result.pos3, result.pos4]);	
				fd = true;
			}
			else
			{				
				arrL.push([result.pos3, result.pos4]);
				arrL.push([result.pos1, result.pos2]);
			}
			
			if(!offsetD) arrL.reverse();
		}
		
		if(!offsetD) fd = !fd;
		
		for (let i = 0; i < arrW2.length; i++)
		{
			const result2 = this.getPosWallV({ wall: arrW2[i], side: 0, pStart: 0 });
			
			this.helpBox({pos: result2.pos1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			this.helpBox({pos: result2.pos3, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});


			if(Math.abs(result2.pos2.length() - arrL[0][0].length()) < 0.001)
			{
				arrL.push([arrL[0][0], result2.pos1]);
				arrL.push([arrL[1][0], result2.pos3]);							
			}
			else
			{				
				arrL.push([arrL[0][0], result2.pos3]);
				arrL.push([arrL[1][0], result2.pos1]);
			}
		}

		for (let i2 = 0; i2 < arrL.length; i2++)
		{
			if(i2 === 1 || i2 === 2) {}
			else continue;
			//continue;
			//const dir = arrL[i2][1].clone().sub(arrL[i2][0]);
			const v = [arrL[i2][0], arrL[i2][1]];
			this.helpLine({v});
			lines.push(v);
		}
		
		if(1===1 && lines.length === 2)
		{
			const line1 = [arrL[1][0], arrL[1][1]];
			const line2 = [arrL[2][0], arrL[2][1]];
			//this.helpLine({v: line2});
			const crossP = myMath.getIntersection(line1[0], line1[1], line2[0], line2[1]);
			
			if(crossP)
			{
				
				
				lines.push([arrL[1][0], crossP]);
				
				//this.helpLine({v: [arrL[1][0], crossP]});
				//this.helpLine({v: [arrL[0][0], arrL[0][1]]});
				
				
				
				if(fd)
				{
					const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
					const tempObject = new THREE.Object3D();
					tempObject.lookAt(normal2);
					tempObject.position.copy(result.pos1);				
					tempObject.updateMatrixWorld();
					const pos3 = tempObject.worldToLocal(new THREE.Vector3().copy(crossP));
					
					if(pos3.x < 0)
					{
						const wPosition = new THREE.Vector3();
						tempObject.localToWorld(wPosition.set(pos3.x, 0, 0));
						console.log(999999999, pos3.x)
						result.pos1 = wPosition;						
					}
				}
				else
				{
					//this.helpBox({pos: crossP, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000})
					result.pos1 = crossP;
				}
				
				this.helpBox({pos: crossP, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x000000});
			}
			
		}
		
		return result.pos1;
	}
	
	
	getWallIn2({wall, ind, side, pStart, offsetD})
	{
		const arrW = wall.userData.wall.p[ind].w;
		
		const arrW2 = [];
		
		for (let i = 0; i < arrW.length; i++)
		{
			if(arrW[i] === wall) continue;
			
			arrW2.push(arrW[i]);
		}
		
		const arrL = [];
		const lines = [];
		const result = this.getPosWallV({ wall, side, pStart });
		
		if(1===1)
		{
			//this.helpBox({pos: result.pos1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			//this.helpBox({pos: result.pos2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});
			//this.helpBox({pos: result.pos3, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			//this.helpBox({pos: result.pos4, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});			

			const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
			const tempObject = new THREE.Object3D();
			tempObject.lookAt(normal2);
			tempObject.position.copy(result.pos1);				
			tempObject.updateMatrixWorld();
			const pos1 = tempObject.worldToLocal(new THREE.Vector3().copy(result.pos2));
			const pos2 = tempObject.worldToLocal(new THREE.Vector3().copy(result.pos4));
			
			if(pos1.x > pos2.x)
			{
				arrL.push([result.pos1, result.pos2]);
				arrL.push([result.pos3, result.pos4]);				
			}
			else
			{				
				arrL.push([result.pos3, result.pos4]);
				arrL.push([result.pos1, result.pos2]);
			}
			
			if(offsetD) arrL.reverse();
		}
		
		for (let i = 0; i < arrW2.length; i++)
		{
			const result2 = this.getPosWallV({ wall: arrW2[i], side: 0, pStart: 0 });
			
			//this.helpBox({pos: result2.pos2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			//this.helpBox({pos: result2.pos4, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});


			if(Math.abs(result2.pos1.length() - arrL[0][1].length()) < 0.001)
			{
				arrL.push([arrL[0][1], result2.pos2]);
				arrL.push([arrL[1][1], result2.pos4]);							
			}
			else
			{				
				arrL.push([arrL[0][1], result2.pos4]);
				arrL.push([arrL[1][1], result2.pos2]);
			}
		}

		for (let i2 = 0; i2 < arrL.length; i2++)
		{
			if(i2 === 1 || i2 === 2) {}
			else continue;
			//continue;
			//const dir = arrL[i2][1].clone().sub(arrL[i2][0]);
			const v = [arrL[i2][0], arrL[i2][1]];
			//this.helpLine({v});
			lines.push(v);
		}
		
		if(1===1 && lines.length === 2)
		{
			const line1 = [arrL[1][0], arrL[1][1]];
			const line2 = [arrL[2][0], arrL[2][1]];
			//this.helpLine({v: line2});
			const crossP = myMath.getIntersection(line1[0], line1[1], line2[0], line2[1]);
			
			if(crossP)
			{				
				lines.push([arrL[1][0], crossP]);
				
				//this.helpLine({v: [arrL[1][0], crossP]});
				//this.helpLine({v: [arrL[0][0], arrL[0][1]]});
				
				
				if(!offsetD)
				{
					const normal2 = myMath.calcNormal2D({p1: result.pos2, p2: result.pos1, reverse: true});
					const tempObject = new THREE.Object3D();
					tempObject.lookAt(normal2);
					tempObject.position.copy(result.pos4);				
					tempObject.updateMatrixWorld();
					const pos3 = tempObject.worldToLocal(new THREE.Vector3().copy(crossP));
					const wPosition = new THREE.Vector3();
					tempObject.localToWorld(wPosition.set(pos3.x, 0, 0));
					
					result.pos2 = wPosition;
				}
				else
				{
					result.pos2 = crossP;
				}
				
				//this.helpBox({pos: result.pos2, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x0000ff});				
			}
			
		}
		
		return result.pos2;
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
	
	helpLine({v, color = 0x00ff00})
	{
		const pipeSpline = new THREE.CatmullRomCurve3(v);
		pipeSpline.curveType = 'catmullrom';
		pipeSpline.tension = 0;
		 
		let length = 0;
			
		for(let i = 0; i < v.length - 1; i++) { length += v[i].distanceTo(v[i + 1]); }		
		
		const params = { extrusionSegments: Math.round(length * 30), radiusSegments: 10, diameter: 0.01, closed: false };
		
		const geometry = new THREE.TubeBufferGeometry( pipeSpline, params.extrusionSegments, params.diameter, params.radiusSegments, params.closed );	
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();			

		const matDef = new THREE.MeshLambertMaterial({ color, transparent: true, depthTest: false });
		
		const line = new THREE.Mesh( geometry, matDef );	
		scene.add( line );		
	}

	arrowHelper({dir, pos, length = 0.5, color = 0xff0000})
	{
		const arrowHelper = new THREE.ArrowHelper( dir, pos, length, color );
		scene.add( arrowHelper );
	}

	showLines({lines})
	{
		
		const { dlina, z } = this.blockParams;
		
		const lines2 = [];
		
		for ( let i = 0; i < lines.length; i++ )
		{
			const pos = lines[i].pos;
			const v = lines[i].v;
			
			//this.helpBox({pos: pos[0], size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			//this.helpBox({pos: pos[1], size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0xff0000});
			
			this.helpLine({v: [pos[0], pos[1]], color: 0x00ff00});
			
			const dir = pos[1].clone().sub(pos[0]).normalize();
			const posC = pos[1].clone().sub(pos[0]).multiplyScalar(0.5).add(pos[0]);
			const normal = myMath.calcNormal2D({p1: pos[1], p2: pos[0], reverse: false});
			const posN = posC.clone().add(normal.clone().multiplyScalar(-0.2));
			this.arrowHelper({dir, pos: posN});
			
			const posZ = posC.clone().add(normal.clone().multiplyScalar(z));
			const offsetZ = posZ.clone().sub(posC);
			//this.helpBox({pos: posZ, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x0000ff});
			
			const pos2 = [pos[0].clone().add(offsetZ), pos[1].clone().add(offsetZ)];
			this.helpLine({v: pos2, color: 0x0000ff});
			
			
			const data = {pos: [pos[0].clone(), pos[1].clone()], dir, normal, posDef: pos[0]};
			data.cut1 = {pos: pos[0], normal, dir};
			data.cut2 = {pos: pos[1], normal, dir: dir.clone().negate()};
			
			lines2.push(data);
			
			lines[i].pos2 = pos2;
			lines[i].dir = dir;
			lines[i].normal = normal;
			lines[i].posDef = pos;
		}
				
		
		for ( let i = 1; i < lines.length; i++ )
		{
			let line1 = lines[i - 1].pos;
			let line2 = lines[i].pos;
			const dir1 = lines[i - 1].dir;
			const dir2 = lines[i].dir;
			
			
			const getAngleBetweenVectors2D = (v2, v1) => 
			{
				const angleRad = Math.atan2(v1.x * v2.z - v1.z * v2.x, v1.x * v2.x + v1.z * v2.z);
				
				return THREE.Math.radToDeg(angleRad);
			}

			const angle = getAngleBetweenVectors2D(dir2, dir1.clone().negate());
			//console.log(angle);
			
			if(angle < 0)
			{
				line1 = lines[i - 1].pos2;
				line2 = lines[i].pos2;
			}
			
			let crossP = myMath.getIntersection(line1[0], line1[1], line2[0], line2[1]);
			if(!crossP) continue;
			

			if(angle < 0)
			{
				const pos = lines[i].pos;
				const normal = myMath.calcNormal2D({p1: pos[1], p2: pos[0], reverse: true});
				const o = new THREE.Object3D();
				o.lookAt(normal);
				o.position.copy(pos[0]);				
				o.updateMatrixWorld();
				const posLocal = o.worldToLocal(new THREE.Vector3().copy(crossP.clone()));
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(posLocal.x, 0, 0));

				crossP = wPosition;
			}			
			
			//this.helpBox({pos: posP1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});
			
			lines2[i].pos[0] = crossP;
			lines2[i].cut1.dir = (angle < 0) ? lines[i - 1].normal.clone().negate() : lines[i - 1].normal.clone();
			lines2[i].cut1.normal = lines[i - 1].dir.clone().negate();
			lines2[i].cut1.pos = (angle < 0) ? lines[i - 1].posDef[3].clone() : lines[i - 1].posDef[1].clone();
		}		


		for ( let i = 1; i < lines.length; i++ )
		{
			let line1 = lines[i - 1].pos;
			let line2 = lines[i].pos2;
			const dir1 = lines[i - 1].dir;
			const dir2 = lines[i].dir;			
			
			const getAngleBetweenVectors2D = (v2, v1) => 
			{
				const angleRad = Math.atan2(v1.x * v2.z - v1.z * v2.x, v1.x * v2.x + v1.z * v2.z);
				
				return THREE.Math.radToDeg(angleRad);
			}

			const angle = getAngleBetweenVectors2D(dir2, dir1.clone().negate());
			console.log(angle);			

			if(angle < 0)
			{
				line1 = lines[i - 1].pos2;
				line2 = lines[i].pos;
			}
			
			let crossP = myMath.getIntersection(line1[0], line1[1], line2[0], line2[1]);
			if(!crossP) continue;			
			
			if(angle < 0)
			{
				const pos = lines[i - 1].pos;
				const normal = myMath.calcNormal2D({p1: pos[1], p2: pos[0], reverse: true});
				const o = new THREE.Object3D();
				o.lookAt(normal);
				o.position.copy(pos[0]);				
				o.updateMatrixWorld();
				const posLocal = o.worldToLocal(new THREE.Vector3().copy(crossP.clone()));
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(posLocal.x, 0, 0));

				crossP = wPosition;
			}	

			//this.helpBox({pos: posP2, size: new THREE.Vector3(0.08, 0.1, 0.08), color: 0xff0000});
			
			lines2[i - 1].pos[1] = crossP;
			
			lines2[i - 1].cut2.dir = (angle < 0) ? lines[i].normal.clone().negate() : lines[i].normal.clone();
			lines2[i - 1].cut2.normal = lines[i].dir.clone().negate();	
			lines2[i - 1].cut2.pos = (angle < 0) ? lines[i - 1].posDef[1].clone() : lines[i - 1].posDef[3].clone();
		}
		
		//lines2.length = 0;
		for ( let i = 0; i < lines2.length; i++ )
		{
			const pos1 = lines2[i].pos[0];
			const pos2 = lines2[i].pos[1];
			this.helpBox({pos: pos1, size: new THREE.Vector3(0.1, 0.05, 0.1), color: 0x00ff00});
			this.helpBox({pos: pos2, size: new THREE.Vector3(0.08, 0.1, 0.08), color: 0xff0000});
		}
		
		return lines2;
	}
	
	rowBlockes2({x, posStart, dir, currentY, normal})
	{		
		const { dlina, h, offset, z } = this.blockParams;
		let z2 = z;
		
		const arrBloks = [];
		
		let count2 = Math.ceil(x/(dlina + offset));
		
		
		for (let i = 0; i < count2; i++)
		{
			const step = i * (dlina + offset);
			const pos = posStart.clone().add(dir.clone().multiplyScalar(step));
			//pos.add(dir.clone().multiplyScalar(startX - dlina/2));	
			pos.add(new THREE.Vector3(0, currentY, 0));			
			//this.helpBox({pos, size: new THREE.Vector3(0.03, 0.03, 0.03), color: 0x0000ff});


			pos.add(dir.clone().multiplyScalar(dlina/2));
			pos.add(normal.clone().multiplyScalar(z2/2));

			const block = this.createBlock({pos});
			const volume = this.calculateMeshVolume(block.geometry);
			
			block.userData.originalVolume = volume;
			block.userData.upVolume = volume;
			block.userData.percentage = 100;
			
			const rad = Math.atan2(dir.z, -dir.x);
			block.rotateY(rad);
			//block.lookAt(normal2.clone().add(pos));
			
			arrBloks.push(block);			
		}

		return { arrBloks };
	}
		
}







