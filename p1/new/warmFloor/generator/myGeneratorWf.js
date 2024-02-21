
// автоматическая генерация отопления
class MyGeneratorWf 
{
	
	init()
	{
		this.getStructure();
		
	}
	
	getStructure()
	{
		const count = 4;
		
		for ( let i = 0; i < count; i++ )
		{
			const { walls, points, doors, windows, floors } = myLevels.getDestructObject(i);
			
			if(walls.length === 0) continue;
			
			for ( let i2 = 0; i2 < windows.length; i2++ )
			{
				//const obj = this.crTestBox();
				const obj = myWarmFloor.myObjsWfInit.getObjWf({typeObj: 'radiator_al_1', lotid: 35});

				const { offset, radY } = this.getOffsetRotToWall({wall: windows[i2].userData.door.wall});
				const pos = windows[i2].position.clone().add(offset);				
				obj.position.copy(pos);
				obj.rotation.set(0, radY, 0);
				
				this.setPosToFloor({obj, floors});				
			}
			
		}
	}
	
	// смещение от стены и поворот
	getOffsetRotToWall({wall})
	{
		// определяем с какой стороны наружная стена
		const rooms = myHouse.myRoom.detectCommonZone_1( wall );				
		let n1 = 0; 
		let n2 = 1;		
		let side = 0;
		for ( var i2 = 0; i2 < rooms[0].userData.room.w.length; i2++ ) 
		{ 
			if(rooms[0].userData.room.w[i2] === wall) { side = rooms[0].userData.room.s[i2]; break; } 
		}
		if(side !== 0) { n1 = 1; n2 = 0; }	
		
		const points = wall.userData.wall.p;
		const x1 = points[n2].position.z - points[n1].position.z;
		const z1 = points[n1].position.x - points[n2].position.x;	
		const dir = new THREE.Vector3(x1, 0, z1).normalize();		// перпендикуляр стены

		dir.x *= 0.2;
		dir.z *= 0.2;
		
		const radY = Math.atan2(x1, z1);		
		
		return { offset: dir, radY };
	}
	
	crTestBox()
	{
		const geometry = new THREE.BoxGeometry( 0.51, 0.21, 0.05 );
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });

		const obj = new THREE.Mesh( geometry, material );

		scene.add(obj);
		
		return obj;
	}
	
	// высота радиатора над полом
	setPosToFloor({obj, floors})
	{
		let posNew = obj.position.clone();
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();
		obj.geometry.computeBoundingSphere();
		let pos = obj.geometry.boundingSphere.center.clone();
		pos.y = obj.geometry.boundingBox.min.y;

		pos = obj.localToWorld( pos );	// нижняя точка радиатора
		
		const ray = new THREE.Raycaster();
		ray.set( pos, new THREE.Vector3(0, -1, 0) );
		
		const intersects = ray.intersectObjects( floors, true );	
		
		const offsetY = 0.15;	// смещение над полом
		if(intersects.length > 0) 
		{
			posNew.y += (intersects[0].point.y - pos.y) + offsetY;
		}

		obj.position.copy(posNew);
	}
}







