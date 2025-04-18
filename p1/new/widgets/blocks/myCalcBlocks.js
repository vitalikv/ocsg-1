
// автоматическая расчет кол-во блоков/кирпичей
class MyCalcBlocks
{
	arrB = [];
	listPathImgs = {};
	geometry;
	material;
	blockParams = {dlina: 0.6, h: 0.3, z: 0.4, offset: 0.01};
	
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
	
	// получаем массив стен по типу
	getArrTypeWalls({wall})
	{
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
				arrW.single.push({wall: wall[i], side: 0, array: [wall[i].userData.wall.p[0].userData.id, wall[i].userData.wall.p[1].userData.id]});
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

		return arrW;
	}
	
	
	test({level})
	{
		//const posY = myLevels.getLevelPos0({lastId: 0, newId: 0});
		
		const wall = level.wall;
		const levelHeight = level.height;
		
		
		const arrW = this.getArrTypeWalls({wall});
		
		const arrW2 = { outside: [], inside: [], single: [] };
		
		
		while(arrW.single.length > 0)
		{
			console.log('single - отдельные', arrW.single.length);
			
			const result = this.findUniqueEdgeElements(arrW.single);		
		
			const firstElem = result[0].item;
			const reverseWall = (firstElem.array[0] === result[0].nums[0]) ? 0 : 1;
			//console.log(999, result);
			
			arrW.single = this.moveElementToFirstPosition({data: arrW.single, elementToMove: firstElem})
			
			//console.log(333, reverseWall, firstElem.array[0], result[0].nums[0]);
			
			const newArr = this.sortChains(arrW.single);
			
			// удаляем из общего массива полученный кусок стен
			for ( let i = 0; i < newArr.length; i++ )
			{
				const index = arrW.single.indexOf(newArr[i]);
				if (index !== -1) 
				{
					arrW.single.splice(index, 1);
				}
			}
			
			//arrW.single.length = 0;
			let pStart = reverseWall;
			let side = reverseWall;
			
			if(newArr.length > 0)
			{
				const ind = arrW2.single.length;
				arrW2.single[ind] = [];
				
				// !!! - при старте стены, по идее нужно узнавать из array, это 1 точка у стены или 2-ая и от этого назначать pStart = 0 или 1
				// решено, теперь знаем если стартовая точка не имеет связей (она одна), то pStart = 0
				// решение только для не замкнутой стены, для замкнутой, нужно доробатывать
				if(newArr.length > 0)
				{
					newArr.push(newArr[0]);
					for ( let i = 0; i < newArr.length - 1; i++ )
					{
						const array = newArr[i].array;
						const wall = newArr[i].wall;
						//const side = newArr[i].side;
						
						arrW2.single[ind].push({wall, side, pStart});
						
						const array2 = newArr[i+1].array;
						
						console.log(array, pStart, array2[0], array[1]);
						
						
						if(!(array2[0] === array[1] || array2[1] === array[0]))
						{
							pStart = (pStart === 0) ? 1 : 0;
							side = pStart;
						}
					}					
				}
				else
				{
					arrW2.single[ind].push({wall, side: 0, pStart: 0});
				}
			}
		}
		console.log('single - отдельные', arrW2.single);
		
		
		while(arrW.outside.length > 0)
		{
			console.log('outside - наружные');
			
			const newArr = this.sortChains(arrW.outside);
			
			const reverseWall = (newArr[0].array[0] === newArr[1].array[1]) ? 1 : 0;
			
			// удаляем из общего массива полученный кусок стен
			for ( let i = 0; i < newArr.length; i++ )
			{
				const index = arrW.outside.indexOf(newArr[i]);
				if (index !== -1) 
				{
					arrW.outside.splice(index, 1);
				}
			}
			
			let pStart = reverseWall;

			const ind = arrW2.outside.length;
			arrW2.outside[ind] = [];
				
			// !!! - при старте стены, по идее нужно узнавать из array, это 1 точка у стены или 2-ая и от этого назначать pStart = 0 или 1
			newArr.push(newArr[0]);
			for ( let i = 0; i < newArr.length - 1; i++ )
			{
				const array = newArr[i].array;
				const wall = newArr[i].wall;
				const side = newArr[i].side;
				
				arrW2.outside[ind].push({wall, side, pStart});
				
				const array2 = newArr[i+1].array;
				
				console.log(array, pStart, array2[0], array[1]);
				
				
				if(!(array2[0] === array[1] || array2[1] === array[0]))
				{
					pStart = (pStart === 0) ? 1 : 0;
				}
			}			
		}

		for ( let i = 0; i < arrW2.single.length; i++ )
		{
			this.caclColumn({data: arrW2.single[i], levelHeight, type: 'single'});
		}			

		
		for ( let i = 0; i < arrW2.outside.length; i++ )
		{
			this.caclColumn({data: arrW2.outside[i], levelHeight, type: 'outside'});
		}			
	

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
	sortChains(arr) 
	{
		if (arr.length === 0) return [];

		const result = [arr[0]];
		const remaining = [...arr.slice(1)];

		while (remaining.length > 0) 
		{
			let found = false;
			const lastArray = result[result.length - 1].array;

			// Ищем следующий элемент, который имеет общее число с последним в результате
			for (let i = 0; i < remaining.length; i++) 
			{
				const currentArray = remaining[i].array;

				if (lastArray.some(num => currentArray.includes(num))) 
				{
					result.push(remaining[i]);
					remaining.splice(i, 1);
					found = true;
					break;
				}
			}

			// Если не нашли связь, прерываем цикл
			if (!found) break;
		}

		return result;
	}
	
	// найти элементы массива, у которых числа в свойстве array либо не встречаются в других элементах, либо встречаются только один раз во всех других элементах
	// возвращает объекты с информацией о найденных элементах и числах, которые делают их уникальными
	/*
	входные данные
	[
		{ array: [1, 3], side: 1 },    
		{ array: [3, 5], side: 1 }, 
		{ array: [41, 5], side: 1 },   
		{ array: [40, 41], side: 1 },  
		{ array: [45, 40], side: 1 },
		{ array: [45, 35], side: 1 }, 
		{ array: [35, 36], side: 1 },  
		{ array: [36, 77], side: 1 },   
	]
	ответ
	[
	  {
		item: { array: [1, 3], side: 1 },
		nums: [1] // 1 уникален (встречается только здесь), 3 встречается еще в [3, 5]
	  },
	  {
		item: { array: [36, 77], side: 1 },
		nums: [77] // 77 уникален (встречается только здесь), 36 встречается еще в [35, 36]
	  }
	]	
	*/
	findUniqueEdgeElements(elements) 
	{
		// Создаем карту для подсчета встречаемости каждого числа
		const numberCounts = new Map();

		// Подсчитываем вхождения каждого числа во всех массивах
		elements.forEach(({ array }) => 
		{
			array.forEach(num => { numberCounts.set(num, (numberCounts.get(num) || 0) + 1); });
		});

		// Обрабатываем элементы и собираем результат
		return elements.reduce((result, item) => 
		{
			const [num1, num2] = item.array;

			// Количество вхождений каждого числа в других элементах
			const count1 = numberCounts.get(num1) - 1; // исключаем текущий элемент
			const count2 = numberCounts.get(num2) - 1;

			// Условие 1: оба числа не встречаются в других элементах
			const bothUnique = count1 === 0 && count2 === 0;

			// Условие 2: только одно число встречается в других элементах (ровно 1 раз)
			const oneShared = (count1 === 0 && count2 === 1) || (count1 === 1 && count2 === 0);

			if (bothUnique || oneShared) 
			{
				// Определяем уникальные числа
				const uniqueNums = [];
				if (count1 === 0) uniqueNums.push(num1);
				if (count2 === 0) uniqueNums.push(num2);

				// Добавляем в результат
				result.push({
					item: item,
					nums: uniqueNums.length ? uniqueNums : [num1, num2] // если оба уникальны
				});
			}

			return result;
		}, []);
	}

	
	// сдвинуть элементы массива так, чтобы определенный элемент стал первым, а остальные сохранили свою последовательность
	/*
	входные данные
	const data = [
	  { array: [2, 3], side: 1 },    
	  { array: [3, 5], side: 1 }, 
	  { array: [41, 5], side: 1 },   
	  { array: [40, 41], side: 1 },  
	  { array: [45, 40], side: 1 },
	  { array: [45, 35], side: 1 }, 
	  { array: [35, 36], side: 1 },  
	  { array: [36, 2], side: 1 },   
	];
	ответ ( запрос -> moveElementToFirstPosition({data, elementToMove: { array: [45, 35], side: 1 }}) )
	[
	  { array: [45, 35], side: 1 },
	  { array: [35, 36], side: 1 },
	  { array: [36, 2], side: 1 },
	  { array: [2, 3], side: 1 },
	  { array: [3, 5], side: 1 },
	  { array: [41, 5], side: 1 },
	  { array: [40, 41], side: 1 },
	  { array: [45, 40], side: 1 }
	]	
	*/
	moveElementToFirstPosition({data, elementToMove}) 
	{
		// Находим индекс элемента, который нужно переместить в начало
		const index = data.findIndex(item => 
		item.array[0] === elementToMove.array[0] && 
		item.array[1] === elementToMove.array[1]
		);

		if (index === -1) return data; // если элемент не найден, возвращаем исходный массив

		// Создаем новый массив: элементы после индекса + элементы до индекса
		return [...data.slice(index), ...data.slice(0, index)];
	}
	
	
	caclColumn({data, levelHeight, type})
	{
		const gArrBloks = [];
		
		const { dlina, h, offset, z } = this.blockParams;					

		const lines2 = this.calcWalls({data, type});
		
		let countY = 0;			
		
		for (let i = 0; i < levelHeight; i += h + offset) 
		{
			let delLastBlock = countY % 2 === 0 ? false : true;
			
			if(countY < 222) 
			{
				this.crBloksRow({lines2, currentY: i, levelHeight, delLastBlock});
			}
			
			countY++;
		}

		for (let i = 0; i < lines2.length; i++)
		{
			const arrO = this.setCutWD({arrO: lines2[i][0].arrO});
			
			let arrBloks = lines2[i][0].arrBloks;
			
			for (let i2 = 0; i2 < arrO.length; i2++)
			{
				arrBloks = this.cutBlockes({obj: arrO[i2], w: arrBloks});
			}
		}
	}
	
	
	calcWalls({data, type})
	{
		const lines = [];		
		
		
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const wall = data[i].wall;
			const side = data[i].side;
			const pStart = data[i].pStart;			
			const width = wall.userData.wall.width;
			
			const arrO = [];
			if(wall.userData.wall.arrO) arrO.push(...wall.userData.wall.arrO);
			
			const resultP = this.getPosWallV({ wall, side, pStart });
			lines.push({pos: [resultP.pos1, resultP.pos2], side, pStart, width, arrO});

			wall.visible = false;
		}
		
		const lines2 = this.showLines({lines, type});
		

		return lines2;
	}
	
	
	crBloksRow({lines2, currentY, levelHeight, delLastBlock})
	{
		const ind = delLastBlock ? 1 : 0;
		
		//lines2.length = 0;
		for (let i = 0; i < lines2.length; i++)
		{
			const result = lines2[i][ind];
			
			const wallDlina = result.pos[0].distanceTo(result.pos[1]);
			
			const answer = this.rowBlockes2({x: wallDlina, posStart: result.pos[0], dir: result.dir, currentY, normal: result.normal});
			let arrBloks = answer.arrBloks;
			
			// обрезаем начало стены
			if(1===1)
			{
				const normal = result.cut1.normal;
				const dir2 = result.cut1.dir;
				const pos = result.cut1.pos;
				const offsetZ = result.offset.start;
				
				const {dlina, z} = this.blockParams;
				//let z2 = (side === 0) ? z : -z;
				//if (pStart !== 0) z2 *= -1;
				let z2 = z;
		
				const geometry = createGeometryCube(dlina * 2, levelHeight + 1, z * 10);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.lookAt(normal);
				obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina - offsetZ)));
				obj.position.add(normal.clone().multiplyScalar(z2/10));
				
				scene.add(obj);	

				arrBloks = this.cutBlockes({obj, w: arrBloks});
				obj.visible = false;
			}

			// обрезаем конец стены
			if(1===1)
			{
				const normal = result.cut2.normal;
				const dir2 = result.cut2.dir;
				const pos = result.cut2.pos;
				const offsetZ = result.offset.end;
				
				const {dlina, z} = this.blockParams;
				//let z2 = (side === 0) ? z : -z;
				//if (pStart !== 0) z2 *= -1;
				let z2 = z;
		
				const geometry = createGeometryCube(dlina * 2, levelHeight + 1, z * 10);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.lookAt(normal);
				obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina - offsetZ)));
				obj.position.add(normal.clone().multiplyScalar(z2/10));

				scene.add(obj);	

				arrBloks = this.cutBlockes({obj, w: arrBloks});
				obj.visible = false;
			}						
		
			lines2[i][0].arrBloks.push(...arrBloks);
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
						
			
			x = result.pos1.distanceTo(result.pos2);
			const y = levelHeight;			
			
			
			

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

	showLines({lines, type})
	{
		console.log('Расчет');
		
		const { dlina, z, offset } = this.blockParams;
		
		const lines2 = [];
		
		for ( let i = 0; i < lines.length; i++ )
		{
			let side = lines[i].side;
			const pStart = lines[i].pStart;
			const width = lines[i].width;
			const arrO = lines[i].arrO;
			
			const pos = lines[i].pos;	// 1-ая линия			
			//this.helpLine({v: [pos[0], pos[1]], color: 0x00ff00});
			const dir = pos[1].clone().sub(pos[0]).normalize();
			const posC = pos[1].clone().sub(pos[0]).multiplyScalar(0.5).add(pos[0]);
			const normal = myMath.calcNormal2D({p1: pos[1], p2: pos[0], reverse: false});
			
			//console.log(side, pStart);
			if(pStart === 1)
			{
				side = (side === 0) ? 1 : 0;				
				lines[i].side = side;
			}
			
			if(side === 1)
			{
				//dir.negate();
				normal.negate();
			}
			
			const posN = posC.clone().add(normal.clone().multiplyScalar(-0.2));
			this.arrowHelper({dir, pos: posN});
			
			const posZ = posC.clone().add(normal.clone().multiplyScalar(z));
			const offsetZ = posZ.clone().sub(posC);
			
			const pos2 = [pos[0].clone().add(offsetZ), pos[1].clone().add(offsetZ)];	// 2-ая линия
			//this.helpLine({v: pos2, color: 0x0000ff});
			
			// для 1-ого ряда
			const data1 = {pos: [pos[0].clone(), pos[1].clone()], dir, normal};
			data1.cut1 = {pos: pos[0].clone(), normal, dir};
			data1.cut2 = {pos: pos[1].clone(), normal, dir: dir.clone().negate()};
			data1.offset = {start: 0, end: 0};
			data1.width = width;
			data1.arrO = arrO;
			data1.arrBloks = [];
			
			// для 2-ого ряда 
			const posStart2 = pos[0].clone().sub(dir.clone().multiplyScalar(dlina/2));	// смещаем на пол блока назад
			const data2 = {pos: [posStart2.clone(), pos[1].clone()], dir, normal};
			data2.cut1 = {pos: pos[0].clone(), normal, dir};
			data2.cut2 = {pos: pos[1].clone(), normal, dir: dir.clone().negate()};
			data2.offset = {start: 0, end: 0};
			
			lines2.push([data1, data2]);
			
			lines[i].pos2 = pos2;
			lines[i].dir = dir;
			lines[i].cross = {};
			lines[i].normal = normal;
		}
		
		this.setDataLines({lines, lines2, type});
				
		//const lines1 = (type === 'outside') ? [lines[lines.length - 1], ...lines, lines[0]] : lines;
		
		this.calcPosStart_1({lines, lines2});			// вычисляем начало построение стены (без смещение блока)	
		this.calcPosEnd_1({lines, lines2});		// вычисляем конец построение стены (не доходит до конца стены)				

		this.calcPosStart_2({lines, lines2});	
		this.calcPosEnd_2({lines, lines2});
		

		// обрезаем первый и последний блок для замкнутых внешних стен
		if(type === 'outside' && lines2.length > 0)
		{
			// 1-ый ряд
			this.calcPosStart_1({lines: [lines[lines.length - 1], lines[0]], lines2, ind: 0});
			this.calcPosEnd_1({lines: [lines[lines.length - 1], lines[0]], lines2, ind: lines2.length - 1});
			
			// 2-ой ряд
			this.calcPosStart_2({lines: [lines[lines.length - 1], lines[0]], lines2, ind: 0});
			this.calcPosEnd_2({lines: [lines[lines.length - 1], lines[0]], lines2, ind: lines2.length - 1});			
		}

		
		// прямые соседнии участки линий объединяем в одну
		this.upDirLines({lines2, type});
		
		
		// зазор для первых и последних блоков		
		if(type === 'outside') 
		{			
			for ( let i = 0; i < lines2.length; i++ )
			{			
				lines2[i][0].offset.end = offset;
				lines2[i][1].offset.start = offset;
			}			
		}
		else
		{
			for ( let i = 0; i < lines2.length; i++ )
			{			
				if(i < lines2.length - 1) lines2[i][0].offset.end = offset;
				if(i > 1) lines2[i][1].offset.start = offset;
			}				
		}
		
		
		this.upCutLinesForAngle({lines2, type});
		
		
		// смещаем 2-ой ряд, так чтобы блоки относительно 1-ого были смещены на половину длины блока
		for ( let i = 0; i < lines2.length; i++ )
		{
			const pos1 = lines2[i][0].pos[0];
			const pos2 = lines2[i][1].pos[0];
			const dir = lines2[i][1].dir;
			
			const dist = pos1.distanceTo(pos2);
			
			const posStart2 = pos2.clone().sub(dir.clone().multiplyScalar(dist - offset/1 - dlina/2));
			lines2[i][1].pos[0] = posStart2;			
		}

		
		//lines2.length = 0;
		for ( let i = 0; i < lines2.length; i++ )
		{
			const pos1 = lines2[i][0].pos[0];
			const pos2 = lines2[i][0].pos[1];

			this.helpBox({pos: pos1.clone().add(new THREE.Vector3(0, 0.1, 0)), size: new THREE.Vector3(0.1, 0.1, 0.1), color: 0x00ff00});
			this.helpBox({pos: pos2.clone().add(new THREE.Vector3(0, 0.1 + (0.1 * (i + 1)), 0)), size: new THREE.Vector3(0.08, 0.1, 0.08), color: 0xff0000});
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

	setDataLines({lines, lines2, type})
	{
		if(type === 'outside')
		{
			lines.push(lines[0]);
		}
		
		for ( let i = 1; i < lines.length; i++ )
		{
			const line1 = lines[i - 1].pos;		// зеленая линия 
			const line2 = lines[i - 1].pos2;	// синия линия
			const line3 = lines[i].pos;			// зеленая линия
			const line4 = lines[i].pos2;		// синия линия
			const dir1 = lines[i - 1].dir;
			const dir2 = lines[i].dir;
			const side1 = lines[i - 1].side;
			const side2 = lines[i].side;
			
			const cross1 = myMath.getIntersection(line1[0], line1[1], line3[0], line3[1]);
			const cross2 = myMath.getIntersection(line2[0], line2[1], line3[0], line3[1]);
			const cross3 = myMath.getIntersection(line2[0], line2[1], line4[0], line4[1]);
			const cross4 = myMath.getIntersection(line1[0], line1[1], line4[0], line4[1]);
			
			let angle = 0;

			if(side1 === 0) angle = this.getAngleBetweenVectors2D(dir2, dir1.clone().negate());
			else angle = this.getAngleBetweenVectors2D(dir1, dir2.clone().negate());
			
			//if(side2 === 0) angle[1] = this.getAngleBetweenVectors2D(dir2, dir1.clone().negate());
			//else angle[1] = this.getAngleBetweenVectors2D(dir1, dir2.clone().negate());
			
			lines[i - 1].cross = {cross1, cross2, cross3, cross4};
			lines[i - 1].angle = angle;

			
			lines2[i - 1][0].cut2.angle = angle;
			lines2[i - 1][1].cut2.angle = angle;
			
			const n1 = (type === 'outside' && i === lines.length - 1) ? 0 : i;
			lines2[n1][0].cut1.angle = angle;
			lines2[n1][1].cut1.angle = angle;			
		}
		
		console.log(lines2);

		if(type === 'outside')
		{
			lines.pop();
		}		
	}

	// вычисляем начало построение стены (без смещение блока)
	calcPosStart_1({lines, lines2, ind = undefined})
	{
		
		for ( let i = 1; i < lines.length; i++ )
		{
			const line1 = lines[i - 1].pos;
			const line2 = lines[i - 1].pos2;
			const line3 = lines[i].pos;
			const line4 = lines[i].pos2;	
			
			let crossP = line3[0].clone();
			
			const {cross1, cross2, cross3, cross4} = lines[i - 1].cross;			
			const angle = lines[i - 1].angle;
			
			if(this.checkIs150degree({angle})) continue;
			
			const arrCr = [];
			
			if(angle < 0) arrCr.push(cross2, cross3);
			else arrCr.push(cross1, cross4);

			let normal = myMath.calcNormal2D({p1: line3[1], p2: line3[0], reverse: true});
			let o = new THREE.Object3D();
			o.lookAt(normal);
			o.position.copy(line3[0]);				
			o.updateMatrixWorld();
			
			const arrLocal = [];
			
			for ( let i2 = 0; i2 < arrCr.length; i2++ )
			{
				if(!arrCr[i2]) continue;
				const posLocal = o.worldToLocal(arrCr[i2].clone());
				arrLocal.push({dist: posLocal.x, pos: posLocal, posOrignal: arrCr[i2]});
				
				//this.helpBox({pos: arrCr[i2], size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}

			arrLocal.sort(function (a, b) { return a.dist - b.dist; });
			
			
			if(arrLocal.length > 0)
			{				
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(arrLocal[0].pos.x, 0, 0));
				
				crossP = wPosition;
				//this.helpBox({pos: wPosition, size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}
			
			const n = (ind !== undefined) ? ind : i;
			lines2[n][0].pos[0] = crossP;
			lines2[n][0].cut1.dir = (angle < 0) ? lines[i - 1].normal.clone().negate() : lines[i - 1].normal.clone();
			lines2[n][0].cut1.normal = lines[i - 1].dir.clone().negate();
			lines2[n][0].cut1.pos = (angle < 0) ? cross3.clone() : cross1.clone();
		}
	}
	

	// вычисляем конец построение стены (не доходит до конца стены)
	calcPosEnd_1({lines, lines2, ind = undefined})
	{
		for ( let i = 1; i < lines.length; i++ )
		{
			const line1 = lines[i - 1].pos;
			const line2 = lines[i - 1].pos2;
			const line3 = lines[i].pos;
			const line4 = lines[i].pos2;

			let crossP = line1[1].clone();
			
			const {cross1, cross2, cross3, cross4} = lines[i - 1].cross;
			const angle = lines[i - 1].angle;
			
			if(this.checkIs150degree({angle})) continue;
			
			const arrCr = [];
			
			if(angle < 0) arrCr.push(cross1, cross2);
			else arrCr.push(cross3, cross4);

			let normal = myMath.calcNormal2D({p1: line1[1], p2: line1[0], reverse: true});
			let o = new THREE.Object3D();
			o.lookAt(normal);
			o.position.copy(line1[0]);				
			o.updateMatrixWorld();
			
			const arrLocal = [];
			
			for ( let i2 = 0; i2 < arrCr.length; i2++ )
			{
				if(!arrCr[i2]) continue;
				const posLocal = o.worldToLocal(arrCr[i2].clone());
				arrLocal.push({dist: posLocal.x, pos: posLocal, posOrignal: arrCr[i2]});
				
				//this.helpBox({pos: arrCr[i2], size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}

			arrLocal.sort(function (a, b) { return b.dist - a.dist; });
			
			if(arrLocal.length > 0)
			{				
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(arrLocal[0].pos.x, 0, 0));
				
				crossP = wPosition;
				//this.helpBox({pos: wPosition, size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}
			
			
			const n = (ind !== undefined) ? ind : i - 1;
			lines2[n][0].pos[1] = crossP;	
			lines2[n][0].cut2.dir = (angle < 0) ? lines[i].normal.clone().negate() : lines[i].normal.clone();
			lines2[n][0].cut2.normal = lines[i].dir.clone().negate();	
			lines2[n][0].cut2.pos = (angle < 0) ? cross1.clone() : cross3.clone();	
		}
				
	}
	
	
	// вычисляем начало построение стены (со смещением блока, 2-ой ряд)
	calcPosStart_2({lines, lines2, ind = undefined})
	{
		for ( let i = 1; i < lines.length; i++ )
		{
			const line1 = lines[i - 1].pos;
			const line2 = lines[i - 1].pos2;
			const line3 = lines[i].pos;
			const line4 = lines[i].pos2;
			
			let crossP = line3[0].clone();
			
			const {cross1, cross2, cross3, cross4} = lines[i - 1].cross;			
			const angle = lines[i - 1].angle;
			
			if(this.checkIs150degree({angle})) continue;
			
			const arrCr = [];
			
			if(angle < 0) arrCr.push(cross1, cross4);
			else arrCr.push(cross2, cross3);
						

			let normal = myMath.calcNormal2D({p1: line3[1], p2: line3[0], reverse: true});
			let o = new THREE.Object3D();
			o.lookAt(normal);
			o.position.copy(line3[0]);				
			o.updateMatrixWorld();
			
			const arrLocal = [];
			
			for ( let i2 = 0; i2 < arrCr.length; i2++ )
			{
				if(!arrCr[i2]) continue;
				const posLocal = o.worldToLocal(arrCr[i2].clone());
				arrLocal.push({dist: posLocal.x, pos: posLocal, posOrignal: arrCr[i2]});
				
				//this.helpBox({pos: arrCr[i2], size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}

			arrLocal.sort(function (a, b) { return a.dist - b.dist; });
			
			if(arrLocal.length > 0)
			{				
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(arrLocal[0].pos.x, 0, 0));
				
				crossP = wPosition;
				//this.helpBox({pos: wPosition, size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}
			
			const n = (ind !== undefined) ? ind : i;
			lines2[n][1].pos[0] = crossP;
			lines2[n][1].cut1.dir = (angle < 0) ? lines[i - 1].normal.clone().negate() : lines[i - 1].normal.clone();
			lines2[n][1].cut1.normal = lines[i - 1].dir.clone().negate();
			lines2[n][1].cut1.pos = (angle < 0) ? cross4.clone() : cross2.clone();
		}
				
	}
	
	
	// вычисляем конец построение стены (до конца стены, 2-ой ряд)
	calcPosEnd_2({lines, lines2, ind = undefined})
	{
		for ( let i = 1; i < lines.length; i++ )
		{
			const line1 = lines[i - 1].pos;
			const line2 = lines[i - 1].pos2;
			const line3 = lines[i].pos;
			const line4 = lines[i].pos2;	
			
			let crossP = line1[1].clone();
			
			const {cross1, cross2, cross3, cross4} = lines[i - 1].cross;			
			const angle = lines[i - 1].angle;	
			
			if(this.checkIs150degree({angle})) continue;
			
			const arrCr = [];
			
			if(angle < 0) arrCr.push(cross3, cross4);
			else arrCr.push(cross1, cross2);

			let normal = myMath.calcNormal2D({p1: line1[1], p2: line1[0], reverse: true});
			let o = new THREE.Object3D();
			o.lookAt(normal);
			o.position.copy(line1[0]);				
			o.updateMatrixWorld();
			
			const arrLocal = [];
			
			for ( let i2 = 0; i2 < arrCr.length; i2++ )
			{
				if(!arrCr[i2]) continue;
				const posLocal = o.worldToLocal(arrCr[i2].clone());
				arrLocal.push({dist: posLocal.x, pos: posLocal, posOrignal: arrCr[i2]});
				
				//this.helpBox({pos: arrCr[i2], size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}

			arrLocal.sort(function (a, b) { return b.dist - a.dist; });
			
			if(arrLocal.length > 0)
			{				
				const wPosition = new THREE.Vector3();
				o.localToWorld(wPosition.set(arrLocal[0].pos.x, 0, 0));
				
				crossP = wPosition;
				//this.helpBox({pos: wPosition, size: new THREE.Vector3(0.14, 0.05, 0.14), color: 0x000000});
			}

			const n = (ind !== undefined) ? ind : i - 1;
			lines2[n][1].pos[1] = crossP;	
			lines2[n][1].cut2.dir = (angle < 0) ? lines[i].normal.clone().negate() : lines[i].normal.clone();
			lines2[n][1].cut2.normal = lines[i].dir.clone().negate();	
			lines2[n][1].cut2.pos = (angle < 0) ? cross4.clone() : cross2.clone();
		}
				
	}
	

	// прямые соседнии участки линий объединяем в одну
	upDirLines({lines2, type})
	{
		if(type === 'outside')
		{
			lines2.push(lines2[0]);
		}
		
		for ( let i = 1; i < lines2.length; i++ )
		{
			const n1 = (type === 'outside' && i === lines2.length - 1) ? 0 : i;
			
			const angle = lines2[n1][0].cut1.angle;

			if(lines2[i - 1][0].width !== lines2[n1][0].width) continue;			

			if(Math.abs(Math.abs(angle) - 180) > 0.0001) continue;
			console.log(angle, Math.abs(angle));
			
			lines2[i - 1][0].pos[1] = lines2[n1][0].pos[1];
			lines2[i - 1][0].cut2 = lines2[n1][0].cut2;
			lines2[i - 1][0].arrO.push(...lines2[n1][0].arrO);

			lines2[i - 1][1].pos[1] = lines2[n1][1].pos[1];
			lines2[i - 1][1].cut2 = lines2[n1][1].cut2;
			
			lines2.splice(i, 1);
			i--;
		}
 		
		if(type === 'outside')
		{
			lines2.pop();
		}		
	}
	
	
	// для 1-ого ряда, если угол между стенами почти прямой (150гр)
	upCutLinesForAngle({lines2, type})
	{
		if(type === 'outside')
		{
			lines2.push(lines2[0]);
		}
		
		for ( let i = 1; i < lines2.length; i++ )
		{
			const n1 = (type === 'outside' && i === lines2.length - 1) ? 0 : i;

			const angle = lines2[n1][0].cut1.angle;

			if(!this.checkIs150degree({angle})) continue;

			console.log(angle);
			lines2[i - 1][0].cut2.dir = lines2[n1][0].cut1.dir.clone().negate();
			lines2[i - 1][0].cut2.normal = lines2[n1][0].cut1.normal.clone();
			lines2[i - 1][0].cut2.pos = lines2[n1][0].cut1.pos.clone();  

			lines2[n1][1].cut1.dir = lines2[i - 1][1].cut2.dir.clone().negate();
			lines2[n1][1].cut1.normal = lines2[i - 1][1].cut2.normal.clone();
			lines2[n1][1].cut1.pos = lines2[i - 1][1].cut2.pos.clone();      
		}    

		if(type === 'outside')
		{
			lines2.pop();
		}		
	}
	
	// получаем угол от 0 до 180 и от 0 до -180
	getAngleBetweenVectors2D(v2, v1) 
	{
		const angleRad = Math.atan2(v1.x * v2.z - v1.z * v2.x, v1.x * v2.x + v1.z * v2.z);
		
		return THREE.Math.radToDeg(angleRad);
	}
	

	checkIs150degree({angle})
	{
		return (Math.abs(angle) > 120) ? true : false;
	}
	
	
	setCutWD({arrO})
	{
		const arr = [];
		
		for ( let i = 0; i < arrO.length; i++ )
		{
			const obj = new THREE.Mesh();
			obj.geometry = arrO[i].geometry.clone();
			
			const minZ = arrO[i].userData.door.form.v.minZ;
			const maxZ = arrO[i].userData.door.form.v.maxZ;
			
			const v = obj.geometry.vertices;
			
			for ( let i2 = 0; i2 < minZ.length; i2++ ) { v[minZ[i2]].z -= 3.2; }
			for ( let i2 = 0; i2 < maxZ.length; i2++ ) { v[maxZ[i2]].z += 3.2; }
			
			obj.material = arrO[i].material.clone();
			obj.position.copy( arrO[i].position );
			obj.rotation.copy( arrO[i].rotation );
			//scene.add(obj);
			
			console.log(111, obj);
			arr.push(obj);
		}

		return arr;
	}
}







