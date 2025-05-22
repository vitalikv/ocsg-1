
// класс для блоков
class MyBlocksObjs
{
	listPathImgs = {};
	material;
	arrTypeG = [];
	roofs = [];
	blockOffset = 0;
	
	
	constructor()
	{
		this.listPathImgs.kirpich = infProject.path+'img/widgets/blocks/one_kirpich.jpg';
		this.listPathImgs.block = infProject.path+'img/widgets/blocks/block_1.jpg';
		
		this.listPathImgs.kirpich = this.listPathImgs.block;
		
		this.material = new THREE.MeshStandardMaterial({ color: 0xcccccc, lightMap : lightMap_1, wireframe: false });
		this.setImage({material: this.material, img: this.listPathImgs.kirpich});		
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


	setOffsetBlock({value, type})
	{
		if(type === 'mm')
		{
			value /= 1000; 			
		}
		
		this.blockOffset = value;
	}
	
	
	getOffsetBlock()
	{
		return this.blockOffset;
	}	

	
	// после всех рассчетов создаем блоки
	createHouseBlocks()
	{
		const data = myCalcBlocks.getLevelsData();
		
		const arrParams = this.getUniqueBlocksParams({data});
		this.arrTypeG = this.createGeometryByParams({arrParams});		
		console.log(777, data, this.arrTypeG);		
		
		
		
		const groups = [];
		
		for ( let i = 0; i < data.length; i++ )
		{			
			const groups = data[i].groups;

			for ( let i2 = 0; i2 < groups.length; i2++ )
			{
				this.caclCladka({group: groups[i2]});
			}
		}
		
		this.roofs = this.getCutRoofs();
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const groups = data[i].groups;
			const levelHeight = data[i].levelHeight;
			
			//this.showResult({arrW2: data[i].arrW2, levelHeight: data[i].levelHeight});			
			
			for ( let i2 = 0; i2 < groups.length; i2++ )
			{
				this.crDomByTypes({group: groups[i2], levelHeight});
			}			
		}
		
		//renderCamera();

		myCalcBlocks.myBlocksCamera.changeCamera();
	}

	
	// расчет для кладки блоков (1 и 2 ряд)
	caclCladka({group, showLines = false})
	{
		const offset = this.getOffsetBlock();
		
		const type = group.type;
		const lines2 = group.lines2;
		const dlina = group.paramsBlock.length;
		
		// зазор/кладка для первых и последних блоков		
		for ( let i = 0; i < lines2.length; i++ )
		{	
			const dir = lines2[i].row[0].dir;
			
			if(type === 'single')
			{
				if(i === 0)
				{
					lines2[i].row[0].cut2.pos.sub(dir.clone().multiplyScalar(offset));
				}
				else if(i === lines2.length - 1)
				{
					lines2[i].row[1].cut1.pos.add(dir.clone().multiplyScalar(offset));
				}
				else
				{
					lines2[i].row[0].cut2.pos.sub(dir.clone().multiplyScalar(offset));
					lines2[i].row[1].cut1.pos.add(dir.clone().multiplyScalar(offset));						
				}
				
				continue;
			}
			
			
			lines2[i].row[0].cut2.pos.sub(dir.clone().multiplyScalar(offset));
			lines2[i].row[1].cut1.pos.add(dir.clone().multiplyScalar(offset));	

			if(type === 'inside')
			{
				lines2[i].row[0].pos[0].add(dir.clone().multiplyScalar(offset));
				lines2[i].row[1].pos[0].add(dir.clone().multiplyScalar(offset));
				
				lines2[i].row[0].cut1.pos.add(dir.clone().multiplyScalar(offset));
				lines2[i].row[1].cut2.pos.sub(dir.clone().multiplyScalar(offset));					
			}			
		}			

		
		// смещаем 2-ой ряд, так чтобы блоки относительно 1-ого были смещены на половину длины блока (+кладка)
		for ( let i = 0; i < lines2.length; i++ )
		{
			const pos1 = lines2[i].row[0].pos[0];
			const pos2 = lines2[i].row[1].pos[0];
			const dir = lines2[i].row[1].dir;
			
			const dist = pos1.distanceTo(pos2);
			
			const offset2 = (type === 'single') ? 0 : offset;
			
			const posStart2 = pos2.clone().sub(dir.clone().multiplyScalar(dist - offset2 + dlina/2));
			lines2[i].row[1].pos[0] = posStart2;
		}

		

		if(showLines && 1===1)
		{
			for (let i = 0; i < lines2.length; i++)
			{
				const result = lines2[i].row[1];
				const width = lines2[i].width;
				
				const posZ = result.normal.clone().multiplyScalar(width);
		
				//this.helpLine({v: [result.pos[0], result.pos[1]], color: 0x00ff00});
				//this.helpLine({v: [result.pos[0].clone().add(posZ), result.pos[1].clone().add(posZ)], color: 0xff0000});				
			}			
		}		
	}
	

	// создаем стены по типу (наружные, внутренние, отдельные)
	crDomByTypes({group, levelHeight})
	{
		const offset = this.getOffsetBlock();					
		const h = group.paramsBlock.height;
		
		
		let countY = 0;			
		
		for (let i = 0; i < levelHeight; i += h + offset) 
		{
			let delLastBlock = countY % 2 === 0 ? false : true;
			
			if(countY < 2222) 
			{
				this.crBloksRow({group, currentY: i, levelHeight, delLastBlock});
			}
			
			countY++;
		}
		
		const lines2 = group.lines2;
		
		// обрезаем блоки под окна/двери
		for (let i = 0; i < lines2.length; i++)
		{
			const arrO = this.setCutWD({arrO: lines2[i].arrO});
			
			let arrBloks = lines2[i].arrBloks;
			
			for (let i2 = 0; i2 < arrO.length; i2++)
			{
				arrBloks = this.cutBlockes({obj: arrO[i2], w: arrBloks});
				arrO[i2].geometry.dispose();
			}
			
			lines2[i].arrBloks = arrBloks;
		}
		
		
		
		
		for (let i = 0; i < lines2.length; i++)
		{
			let arrBloks = lines2[i].arrBloks;
			
			for (let i2 = 0; i2 < this.roofs.length; i2++)
			{
				const roof = this.roofs[i2];
				
				for (let i3 = 0; i3 < roof.length; i3++)
				{
					arrBloks = this.cutBlockes({obj: roof[i3], w: arrBloks});
					roof[i3].geometry.dispose();					
				}
			}
			
			lines2[i].arrBloks = arrBloks;
		}		
	}
	

	// обрезаем блоки в начале/конце и под высоту этажа
	crBloksRow({group, currentY, levelHeight, delLastBlock})
	{
		const ind = delLastBlock ? 1 : 0;
		
		const lines2 = group.lines2;
		
		const dlina = group.paramsBlock.length;
		const h = group.paramsBlock.height;
		
		//lines2.length = 0;
		for (let i = 0; i < lines2.length; i++)
		{
			const result = lines2[i].row[ind];
			
			const dist = result.pos[0].distanceTo(result.pos[1]);
			
			const answer = this.rowBlockes2({x: dist, posStart: result.pos[0], dir: result.dir, currentY, normal: result.normal, z: lines2[i].width, dlina, h});
			let arrBloks = answer.arrBloks;
			
			const z = lines2[i].width;
			
			// обрезаем начало стены
			if(1===1)
			{
				const normal = result.cut1.normal;
				const dir2 = result.cut1.dir;
				const pos = result.cut1.pos;
				const offsetZ = 0;
		
				const geometry = createGeometryCube(dlina * 2, levelHeight + 1, z * 10);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.lookAt(normal);
				obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina - offsetZ)));
				obj.position.add(normal.clone().multiplyScalar(z/10));
				
				//scene.add(obj);	
				//obj.visible = false;

				arrBloks = this.cutBlockes({obj, w: arrBloks});
			}

			// обрезаем конец стены
			if(1===1)
			{
				const normal = result.cut2.normal;
				const dir2 = result.cut2.dir;
				const pos = result.cut2.pos;
				const offsetZ = 0;
		
				const geometry = createGeometryCube(dlina * 2, levelHeight + 1, z * 10);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				obj.lookAt(normal);
				obj.position.copy(pos.clone().sub(dir2.clone().multiplyScalar(dlina - offsetZ)));
				obj.position.add(normal.clone().multiplyScalar(z/10));

				//scene.add(obj);	
				//obj.visible = false;
				
				arrBloks = this.cutBlockes({obj, w: arrBloks});				
			}

			// обрезаем вверх стены
			if(1===1)
			{
				const dir = result.dir;
				const normal = result.normal;
				
				const geometry = createGeometryCube(dist * 2, h * 2, z * 2);
				const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, lightMap : lightMap_1 });
				const obj = new THREE.Mesh( geometry, material ); 
				
				const posC1 = result.pos[1].clone().sub(result.pos[0]).divideScalar(2).add(result.pos[0]);
				posC1.add(new THREE.Vector3(0, levelHeight, 0));
				posC1.add(normal.clone().multiplyScalar((z/2) * 2));
				
				obj.position.copy(posC1);
				
				const rad = Math.atan2(dir.z, -dir.x);
				obj.rotateY(rad);

				//scene.add(obj);	
				//obj.visible = false;
				
				arrBloks = this.cutBlockes({obj, w: arrBloks});
			}			
		
			lines2[i].arrBloks.push(...arrBloks);
		}		
	}
	


	rowBlockes2({x, posStart, dir, currentY, normal, z, dlina, h})
	{		
		const offset = this.getOffsetBlock();
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
			
			const { geometry, volume } = this.getGeometryByParams({length: dlina, height: h, width: z});
			const block = this.createBlock({pos, geometry});			
			
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
	
	
	createBlock({pos, geometry})
	{ 
		const obj = new THREE.Mesh( geometry, this.material ); 
		obj.position.copy(pos);
		scene.add(obj);

		return obj;
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
		
	
	setCutWD({arrO})
	{
		const arr = [];
		
		for ( let i = 0; i < arrO.length; i++ )
		{
			const obj = createCloneWD_BSP( arrO[i] );
			arr.push(obj);
		}

		return arr;
	}


	getCutRoofs()
	{
		const levels = myLevels.levels;
		
		const roofsClone = [];
		
		for(let i = 0; i < levels.length; i++)
		{
			for(let i2 = 0; i2 < levels[i].roof.length; i2++)
			{
				const group = myHouse.myRoofCSG.cgs_2(levels[i].roof[i2]);
				roofsClone.push(group);
			}
		}
		
		return roofsClone;		
	}
	
	
	// назначаем размер блока (ширина, высота) для группы линий
	setParamsBlock({group, paramsBlock, type = 'm'})
	{
		if(type === 'mm')
		{
			for (const key in paramsBlock) 
			{
				paramsBlock[key] /= 1000; 
			}			
		}

		// назначаем только те key, которые пришли 
		for (const key in paramsBlock) 
		{
			group.paramsBlock[key] = paramsBlock[key];
		}
	}

	
	// получаем массив только с уникальными параметрами блока
	getUniqueBlocksParams({data})
	{
		const arrParamsBlock = [];
		
		// собираем массив параметров блоков со всех стен
		for ( let i = 0; i < data.length; i++ )
		{
			for ( let i2 = 0; i2 < data[i].groups.length; i2++ )
			{				
				const paramsBlock = data[i].groups[i2].paramsBlock;				
				
				for ( let i3 = 0; i3 < data[i].groups[i2].lines2.length; i3++ )
				{
					const width = data[i].groups[i2].lines2[i3].width;
					
					arrParamsBlock.push({length: paramsBlock.length, height: paramsBlock.height, width});
				}
			}			
		}
		
		console.log(222, arrParamsBlock);
		
		const uniqueObjects = Array.from(new Set(arrParamsBlock.map(obj => JSON.stringify(obj)))).map(str => JSON.parse(str));

		console.log(555, uniqueObjects);		
		
		return uniqueObjects;
	}


	// создаем геометрии блоков по ширине
	createGeometryByParams({arrParams})
	{
		const arr = [];
		
		for ( let i = 0; i < arrParams.length; i++ )
		{
			const {length, height, width} = arrParams[i];
			const geometry = createGeometryCube(length, height, width);
			
			const volume = this.calculateMeshVolume(geometry);
			
			arr.push({params: arrParams[i], geometry, volume});
		}

		return arr;
	}


	// находим геометрию блока по ширине и высоте
	getGeometryByParams({length, height, width})
	{
		const result = {geometry: null, volume: 0};
		
		for ( let i = 0; i < this.arrTypeG.length; i++ )
		{
			const blockP = this.arrTypeG[i].params;
			if(blockP.length === length && blockP.height === height && blockP.width === width)
			{
				result.geometry = this.arrTypeG[i].geometry;
				result.volume = this.arrTypeG[i].volume;				
				break;
			}
		}

		return result;
	}	

	
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


	// меняем высоту блоков при переключении этажа
	changePosYLevel({posY})
	{
		const arr = this.getAllBlocks({});

		for ( let i = 0; i < arr.length; i++ )
		{		
			arr[i].position.y -= posY;
		}		
	}
	
	// получить все блоки (всех этажей) или только одного этажа по id
	getAllBlocks({id = undefined})
	{
		const arr = [];
		
		const data = myCalcBlocks.getLevelsData();
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const idLevel = data[i].idLevel;
			
			if(id !== undefined && id !== idLevel) continue;
	
			const groups = data[i].groups;

			for ( let i2 = 0; i2 < groups.length; i2++ )
			{		
				const lines2 = groups[i2].lines2;

				for ( let i3 = 0; i3 < lines2.length; i3++ )
				{			
					arr.push(...lines2[i3].arrBloks);
				}				
			}			
		}

		return arr;
	}
	
	// удаляем все блоки и сбрасываем массивы
	clearResultBlocks()
	{
		const arr = this.getAllBlocks({});
		
		for ( let i = 0; i < arr.length; i++ )
		{		
			disposeNode( arr[i] );
			scene.remove( arr[i] );
		}
		
		renderCamera();	


		const data = myCalcBlocks.getLevelsData();
		
		for ( let i = 0; i < data.length; i++ )
		{		
			const groups = data[i].groups;

			for ( let i2 = 0; i2 < groups.length; i2++ )
			{		
				const lines2 = groups[i2].lines2;

				for ( let i3 = 0; i3 < lines2.length; i3++ )
				{			
					lines2[i3].arrBloks.length = 0;
				}				
			}			
		}		
	}
}







