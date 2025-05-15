
// клон стен (фейковая кладка для блоков)
class MyBlocksWalls
{
	material;
	dataWallsClone = [];
	
	constructor()
	{
		const mat = new THREE.MeshStandardMaterial({ color: 0x696969, lightMap: lightMap_1 });
		this.material = [ mat.clone(), mat.clone(), mat.clone(), mat.clone() ];
	}

	initWalls({data})
	{
		const result = this.getWalls_1({data});
		this.crCloneWalls({data: result});
	}
	
	
	// получаем все стены 
	getWalls_1({data})
	{
		const arr = [];
		
		const getBlocks = (lines2) =>
		{
			const color = Math.floor(Math.random() * 0xffffff);
			
			const arr = {objs: [], color};
			
			for ( let i = 0; i < lines2.length; i++ )
			{			
				arr.objs.push(...lines2[i].walls);
			}

			return arr;
		}
		
		
		for ( let i = 0; i < data.length; i++ )
		{	
			const idLevel = data[i].idLevel;
			const arrW2 = data[i].arrW2;			
			
			arr[i] = {idLevel, walls: []};
			
			for ( let i2 = 0; i2 < arrW2.outside.length; i2++ )
			{		
				const result = getBlocks(arrW2.outside[i2].lines2);
				arr[i].walls.push(result);
			}			

			for ( let i2 = 0; i2 < arrW2.inside.length; i2++ )
			{		
				const result = getBlocks(arrW2.inside[i2].lines2);
				arr[i].walls.push(result);
			}

			for ( let i2 = 0; i2 < arrW2.single.length; i2++ )
			{		
				const result = getBlocks(arrW2.single[i2].lines2);
				arr[i].walls.push(result);
			}			
		}		


		return arr;
	}
	
	
	// создание стен с уменьшиной тощиной и высотой
	crCloneWalls({data})
	{
		const kof = 0.001;
		
		const roofs = myCalcBlocks.setCutRoof();
		
		for (let i = 0; i < roofs.length; i++)
		{
			const roof = roofs[i];
			
			for (let i2 = 0; i2 < roof.length; i2++)
			{
				roof[i2].position.y -= kof;
			}
		}
		
		
		const arr = [];
		
		for(let i = 0; i < data.length; i++)
		{	
			const idLevel = data[i].idLevel;
			const wallsClone = [];
			
			for(let i2 = 0; i2 < data[i].walls.length; i2++)
			{
				
				const objs = data[i].walls[i2].objs;
				//const color = data[i].walls[i2].color;
				const color = new THREE.Color(Math.random(), Math.random(), Math.random());
				
				
				for(let x1 = 0; x1 < objs.length; x1++)
				{
					const wall = objs[x1];
					
					const posW = wall.getWorldPosition(new THREE.Vector3());
					const quaW = wall.getWorldQuaternion(new THREE.Quaternion());							
					const scaW = wall.getWorldScale(new THREE.Vector3());

					// геометрия простой стены
					const p1 = wall.userData.wall.p[0].position;
					const p2 = wall.userData.wall.p[1].position;	
					const d = p1.distanceTo( p2 );		
					const geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);			
					 
					// добавляем откосы
					const v = geometry.vertices;
					for ( let i3 = 0; i3 < v.length; i3++ ) { v[i3] = wall.userData.wall.v[i3].clone(); }
					
					// уменьшаем ширину стены
					let width = wall.userData.wall.width - kof;
					width /= 2;
					v[0].z = v[1].z = v[6].z = v[7].z = width;
					v[4].z = v[5].z = v[10].z = v[11].z = -width;

					// уменьшаем высоту стены
					v[1].y -= kof;
					v[3].y -= kof;
					v[5].y -= kof;
					v[7].y -= kof;
					v[9].y -= kof;
					v[11].y -= kof;
					
					geometry.verticesNeedUpdate = true;
					geometry.elementsNeedUpdate = true;	
					geometry.computeBoundingSphere();
			
					const mat = new THREE.MeshStandardMaterial({ color, lightMap: lightMap_1 });
					const material = [ mat.clone(), mat.clone(), mat.clone(), mat.clone() ];
					
					let wallClone = new THREE.Mesh(geometry, material);
					
					wallClone.position.copy( posW );
					wallClone.quaternion.copy( quaW );
					wallClone.scale.copy( scaW );
					
					const arrO = myCalcBlocks.setCutWD({arrO: wall.userData.wall.arrO});
					
					for ( let i3 = 0; i3 < arrO.length; i3++ )
					{
						arrO[i3].scale.set(1.001, 1.001, 1);
						myCalcBlocks.cutBlockes({obj: arrO[i3], w: [wallClone]});
						
						arrO[i3].geometry.dispose();
					}


					for (let i3 = 0; i3 < roofs.length; i3++)
					{
						const roof = roofs[i3];
						
						for (let i4 = 0; i4 < roof.length; i4++)
						{
							myCalcBlocks.cutBlockes({obj: roof[i4], w: [wallClone]});
							
							roof[i4].geometry.dispose();					
						}
					}				

					scene.add(wallClone);
					
					wallsClone.push(wallClone);
					
				}
				
			}

			arr.push({idLevel, walls: wallsClone});
		}

		this.setDataWallsClone({data: arr});
	}
	
	
	setDataWallsClone({data})
	{
		this.dataWallsClone = data;
	}
	
	getDataWallsClone()
	{
		return this.dataWallsClone;
	}
		
	
	// получаем стены (всех этажей) или только одного этажа по id
	getWallsClone({id = undefined})
	{
		const arr = [];
		
		const data = this.getDataWallsClone();
		
		for (let i = 0; i < data.length; i++)
		{
			const idLevel = data[i].idLevel;
			
			if(id !== undefined && id !== idLevel) continue;
			
			arr.push(...data[i].walls);
		}
		
		return arr;
	}


	// меняем высоту стен при переключении этажа
	changePosYLevel({posY})
	{
		const walls = this.getWallsClone({});

		for ( let i = 0; i < walls.length; i++ )
		{		
			walls[i].position.y -= posY;
		}		
	}
	
	
	// показываем стены (всех этажей) или только одного этажа по id
	showWalls({idLevel = undefined})
	{
		const walls = this.getWallsClone({id: idLevel});
		
		for (let i = 0; i < walls.length; i++)
		{
			walls[i].visible = true;
		}		
	}
	

	// скрываем все стены всех этажей
	hideWalls()
	{
		const walls = this.getWallsClone({});
		
		for (let i = 0; i < walls.length; i++)
		{
			walls[i].visible = false;
		}		
	}

	
	// удаляем все стены
	deleteWalls()
	{
		const walls = this.getWallsClone({});
		
		for (let i = 0; i < walls.length; i++)
		{
			const wall = walls[i];
			
			wall.geometry.dispose();
			scene.remove(wall);
		}

		this.setDataWallsClone({data: []});
	}
}







