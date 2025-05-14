
// клон стен (фейковая кладка для блоков)
class MyBlocksWalls
{
	material;
	
	constructor()
	{
		const mat = new THREE.MeshStandardMaterial({ color: 0x696969, lightMap: lightMap_1 });
		this.material = [ mat.clone(), mat.clone(), mat.clone(), mat.clone() ];
	}

	initWalls()
	{
		const data = this.getWalls();
		this.crCloneWalls({data});
	}
	
	
	getWalls()
	{
		const level = myLevels.levels;
		const data = [];
		
		for(let i = 0; i < level.length; i++)
		{
			data[i] = {idLevel: i, walls: []};
			
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				data[i].walls.push(level[i].wall[i2]);
			}			
		}

		return data;
	}
	
	crCloneWalls({data})
	{
		const roofs = myCalcBlocks.setCutRoof();
		
		for(let i = 0; i < data.length; i++)
		{			
			for(let i2 = 0; i2 < data[i].walls.length; i2++)
			{
				const wall = data[i].walls[i2];
				
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
				let width = wall.userData.wall.width - 0.001;
				width /= 2;
				v[0].z = v[1].z = v[6].z = v[7].z = width;
				v[4].z = v[5].z = v[10].z = v[11].z = -width;
			
				geometry.verticesNeedUpdate = true;
				geometry.elementsNeedUpdate = true;	
				geometry.computeBoundingSphere();
		
				let wallClone = new THREE.Mesh(geometry, this.material);
				
				wallClone.position.copy( posW );
				wallClone.quaternion.copy( quaW );
				wallClone.scale.copy( scaW );
				
				const arrO = myCalcBlocks.setCutWD({arrO: wall.userData.wall.arrO});
				
				for ( let i3 = 0; i3 < arrO.length; i3++ )
				{
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
			}			
		}		
	}
}







