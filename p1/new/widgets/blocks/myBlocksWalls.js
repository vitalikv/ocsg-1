
// клон стен (фейковая кладка для блоков)
class MyBlocksWalls
{
	dataWallsClone = [];
	

	initWalls({data})
	{
		this.crCloneWalls({data});
		
		const type = myCalcBlocks.myBlocksMode.getTab();
		myCalcBlocks.myBlocksMode.changeTab({type});
	}
	
	
	// создание стен с уменьшиной тощиной и высотой
	crCloneWalls({data})
	{
		const kof = 0.001;
		
		const roofs = myCalcBlocks.myBlocksObjs.getCutRoofs();
		
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
			const groups = data[i].groups;
			
			const wallsClone = [];
			
			for(let i2 = 0; i2 < groups.length; i2++)
			{
				const lines2 = groups[i2].lines2;				
				const color = new THREE.Color(Math.random(), Math.random(), Math.random());
				const arrWClone = [];
				
				for(let i3 = 0; i3 < lines2.length; i3++)
				{
					const line = lines2[i3];
					const walls = line.walls;
					
					for(let x1 = 0; x1 < walls.length; x1++)
					{
						const wall = walls[x1];
						
						const wallClone = this.crWall({wall, roofs, color, kof});

						wallClone.userData.group = groups[i2];
						wallClone.userData.line = line;
						wallClone.userData.colors = { def: 0x8c8c8c, select: color };
						
						line.wallsClone.push(wallClone);
						
						arrWClone.push(wallClone);
						wallsClone.push(wallClone);
					}					
				}
				
				// добавляем walls, arrWClone чтобы при выборе одной стены, мы знали все стены группы
				for(let x1 = 0; x1 < arrWClone.length; x1++)
				{
					arrWClone[x1].userData.arrWClone = arrWClone;
				}
				
			}

			arr.push({idLevel, walls: wallsClone});
		}

		this.setDataWallsClone({data: arr});
	}
	
	
	crWall({wall, roofs, color, kof})
	{
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
		
		const wallClone = new THREE.Mesh(geometry, material);
		wallClone.userData.tag = 'blockWallClone';
		
		wallClone.position.copy( posW );
		wallClone.quaternion.copy( quaW );
		wallClone.scale.copy( scaW );
		
		const arrO = myCalcBlocks.myBlocksObjs.setCutWD({arrO: wall.userData.wall.arrO});
		
		for ( let i3 = 0; i3 < arrO.length; i3++ )
		{
			arrO[i3].scale.set(1.001, 1.001, 1);	// немного увеличиваем размер, чтобы вырез был глубже чем у блоков
			myCalcBlocks.myBlocksObjs.cutBlockes({obj: arrO[i3], w: [wallClone]});
			
			arrO[i3].geometry.dispose();
		}


		for (let i3 = 0; i3 < roofs.length; i3++)
		{
			const roof = roofs[i3];
			
			for (let i4 = 0; i4 < roof.length; i4++)
			{
				myCalcBlocks.myBlocksObjs.cutBlockes({obj: roof[i4], w: [wallClone]});
				
				roof[i4].geometry.dispose();					
			}
		}	


		wallClone.geometry.computeFaceNormals();	
		boxUnwrapUVs(wallClone.geometry);
		for ( let i2 = 0; i2 < wallClone.geometry.faces.length; i2++ )
		{
			wallClone.geometry.faces[i2].normal.normalize();
			if(wallClone.geometry.faces[i2].normal.z == 1) { wallClone.geometry.faces[i2].materialIndex = 1; }
			else if(wallClone.geometry.faces[i2].normal.z == -1) { wallClone.geometry.faces[i2].materialIndex = 2; }
			else if(wallClone.geometry.faces[i2].normal.x == 1) { wallClone.geometry.faces[i2].materialIndex = 0; }
			else if(wallClone.geometry.faces[i2].normal.x == -1) { wallClone.geometry.faces[i2].materialIndex = 0; }
			else { wallClone.geometry.faces[i2].materialIndex = 3; }
		}		
		
		scene.add(wallClone);
		
		return wallClone;				
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
	
	
	// меняем цвет стен, в зависимости от режима
	changeColorWalls({mode = 'def'})
	{
		const walls = this.getWallsClone({});

		for ( let i = 0; i < walls.length; i++ )
		{	
			const wall = walls[i];
			
			const color = (mode === 'def') ? wall.userData.colors.def : wall.userData.colors.select;
			
			for ( let i2 = 0; i2 < wall.material.length; i2++ )
			{
				wall.material[i2].color = new THREE.Color(color);
			}
			if(mode === 'def') 
			{
				wall.material[0].color = new THREE.Color(0x696969);
				wall.material[3].color = new THREE.Color(0x696969);
			}
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
			
			//wall.geometry.dispose();
			disposeNode(wall);
			scene.remove(wall);
		}

		this.setDataWallsClone({data: []});
	}
}







