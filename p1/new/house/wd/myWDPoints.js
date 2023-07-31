
// контроллеры для изменения ширины/высоты окна
class MyWDPoints
{
	points = [];
	
	constructor()
	{
		this.points = this.createPoints();
	}


	createPoints()
	{
		const objs = []; 
		
		const geometry1 = new THREE.SphereGeometry( 0.07, 16, 16 );
		const geometry2 = new THREE.SphereGeometry( 0.05, 16, 16 );
		
		for ( var i = 0; i < 4; i++ )
		{
			const obj = new THREE.Mesh( geometry1, new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 } ) );
			
			obj.userData.tag = 'controll_wd';
			obj.userData.controll_wd = { id : i, obj : null };		
			obj.visible = false;
			
			
			const child = new THREE.Mesh( geometry2, new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, opacity: 1, depthTest: false, lightMap : lightMap_1 } ) );
			child.renderOrder = 2;
			obj.add( child );
			 
			objs[i] = obj;
			scene.add( objs[i] );
		}		
		
		return objs;		
	}
	
	setOffset(offset)
	{
		for ( let i = 0; i < this.points.length; i++ ) 
		{ 
			this.points[i].position.add(offset); 
		}		
	}
	
	// показываем и устанваливаем контроллеры
	show( obj )
	{	
		let arrVisible = [false, false, false, false];
		
		if(myCameraOrbit.activeCam.userData.isCam2D) { arrVisible = [true, true, false, false]; }
		else if(myCameraOrbit.activeCam.userData.isCam3D) { arrVisible = [false, false, false, false]; }
		
		obj.geometry.computeBoundingBox(); 
		obj.geometry.computeBoundingSphere();		
		const bound = obj.geometry.boundingBox;
		const center = obj.geometry.boundingSphere.center; 
		
		// позиция котроллеров
		const pos = [];
		pos[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, center.y, center.z) );
		pos[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, center.y, center.z) );
		pos[2] = obj.localToWorld( new THREE.Vector3(center.x, bound.min.y, center.z) );
		pos[3] = obj.localToWorld( new THREE.Vector3(center.x, bound.max.y, center.z) );		

		const wall = obj.userData.door.wall;
		
		for ( let i = 0; i < this.points.length; i++ )
		{		
			this.points[i].position.copy( pos[i] );	
			this.points[i].rotation.copy( wall.rotation );
			this.points[i].visible = arrVisible[i];
			this.points[i].obj = obj; 
			this.points[i].userData.controll_wd.obj = obj;
		}
	}
	
	
	hide()
	{
		for ( let i = 0; i < this.points.length; i++ ) 
		{ 
			this.points[i].visible = false; 
		}
	}
}






