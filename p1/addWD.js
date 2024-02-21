


 
// перетаскиваем free_dw
function dragWD_2( event, obj ) 
{ 
	var arrDp = [];
	
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;
	
	for ( var i = 0; i < wall.length; i++ ){ arrDp[arrDp.length] = wall[i]; } 
	for ( var i = 0; i < window.length; i++ ){ arrDp[arrDp.length] = window[i]; } 
	for ( var i = 0; i < door.length; i++ ){ arrDp[arrDp.length] = door[i]; } 
	arrDp[arrDp.length] = planeMath; 

	var intersects = rayIntersect( event, arrDp, 'arr' );
	
	var wall = null;
	
	var pos = new THREE.Vector3();
	//obj.material.color = obj.userData.door.color;
	
	for ( var i = 0; i < intersects.length; i++ )
	{
		if (intersects[ i ].face != null) 
		{
			var object = intersects[ i ].object;
			
			if(object.userData.tag == 'planeMath'){ obj.position.copy( intersects[i].point ); } 			
			else if(object.userData.tag == 'wall')
			{ 
				wall = object; 
				obj.rotation.copy( wall.rotation ); 
				pos = intersects[i].point; 
			}
			else if(object.userData.tag == 'window' || object.userData.tag == 'door'){ obj.material.color = new THREE.Color(infProject.listColor.active2D); } 
		}
	}

	if(obj.material.color == new THREE.Color(infProject.listColor.active2D)) { obj.userData.door.wall = null; calcSvgFormWD({obj: obj}); return; }
	if(!wall) { obj.userData.door.wall = null; calcSvgFormWD({obj: obj}); return; }

	

	wall.updateMatrixWorld();			
	var pos = wall.worldToLocal( pos.clone() );	
	var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0 ) ); 	
	
	  
	if(myCameraOrbit.activeCam.userData.isCam3D) 
	{ 
		obj.position.set( pos.x, pos.y, pos.z ); 
	}
	else 
	{ 
		obj.position.set( pos.x, obj.userData.door.h1, pos.z ); 
	}		

	changeWidthWD(obj, wall);

	calcSvgFormWD({obj: obj});
}







//обновляем форму и положение wd svg
function calcSvgFormWD(cdm)
{
	//if(!myCameraOrbit.activeCam.userData.isCam2D) return; в 3D тоже нужно, когда меняем размер через input
	
	var obj = cdm.obj;
	var openId = obj.userData.door.openId;	// положение открытие wd (в какую сторону повернут obj3D)
	
	obj.updateMatrixWorld();
	
	const force = (myCameraOrbit.activeCam.userData.isCam3D) ? true : false;
	
	// базовая форма svg
	if(obj.userData.door.svg.el)
	{
		var v = [];
		var bound = obj.geometry.boundingBox;
		
		v[0] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.max.z) );	
		v[1] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.max.z) );	
		v[2] = obj.localToWorld( new THREE.Vector3(bound.min.x, 0, bound.min.z) );	
		v[3] = obj.localToWorld( new THREE.Vector3(bound.max.x, 0, bound.min.z) );	
		 
		if(myCameraOrbit.activeCam.userData.isCam2D) showElementSvg([obj.userData.door.svg.el]);	
		updateSvgPath({el: obj.userData.door.svg.el, arrP: [v[0], v[1], v[3], v[2], v[0]]}, force); 
	}

	// центр открытия двери 
	if(obj.userData.door.svg.arc)
	{
		var posArcStart = new THREE.Vector3().subVectors( v[0], v[2] ).divideScalar( 2 ).add(v[2]);
		
		if(openId == 2 || openId == 3)
		{
			var posArcStart = new THREE.Vector3().subVectors( v[1], v[3] ).divideScalar( 2 ).add(v[3]);
		}
	}

	// svg полотно
	if(obj.userData.door.svg.path)
	{
		var minZ = (bound.min.z < -0.05) ? -0.05 : bound.min.z;
		var maxZ = (bound.max.z > 0.05) ? 0.05 : bound.max.z;
		
		v[0] = new THREE.Vector3(bound.min.x, 0, maxZ);	
		v[1] = new THREE.Vector3(bound.max.x, 0, maxZ);	
		v[2] = new THREE.Vector3(bound.min.x, 0, minZ);	
		v[3] = new THREE.Vector3(bound.max.x, 0, minZ); 
		
		// поворачиваем полотно
		if(obj.userData.tag == 'door')
		{
			var dist = [];
			dist[0] = bound.max.x - bound.min.x;
			dist[1] = (maxZ - minZ)/2;
			dist[2] = bound.max.x - bound.min.x;
			dist[3] = (maxZ - minZ)/2;
			
			var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
			var v1 = (maxZ - minZ)/2;
			var offX = 0;
			
			if(openId == 2 || openId == 3)
			{
				var v0 = new THREE.Vector3((bound.max.x - bound.min.x)/2, 0, (maxZ - minZ)/2 + minZ);
				var v1 = -(maxZ - minZ)/2;
				var offX = bound.min.x * 2;
			}
			
			
			for(var i = 0; i < v.length; i++)
			{				
				var radXZ = Math.atan2(v[i].x - v0.x, v[i].z - v0.z);
				
				if(openId == 0) { radXZ += Math.PI/2; }
				else if(openId == 1) { radXZ -= Math.PI/2; }
				else if(openId == 2) { radXZ += Math.PI/2; }
				else if(openId == 3) { radXZ -= Math.PI/2; }
				
				v[i].x = Math.sin(radXZ)*dist[i] + v0.x - v1 + offX;
				v[i].z = Math.cos(radXZ)*dist[i] + v0.z;
			}
		}
		
		for(var i = 0; i < v.length; i++)
		{
			v[i] = obj.localToWorld( v[i].clone() );
		}				
		
		if(myCameraOrbit.activeCam.userData.isCam2D) showElementSvg([obj.userData.door.svg.path]); 		
		updateSvgPath({el: obj.userData.door.svg.path, arrP: [v[0], v[1], v[3], v[2], v[0]]}, force);
		
		
		var posArcEnd = v[2].clone();
		
		if(openId == 1 || openId == 2)
		{
			var posArcEnd = v[0].clone();
		}
	}
	
	// svg дуга
	if(obj.userData.door.svg.arc)
	{
		var param = {p2: posArcEnd, p1: posArcStart};
		
		if(openId == 0 || openId == 3) { var param = {p2: posArcEnd, p1: posArcStart}; }
		else if(openId == 1 || openId == 2) { var param = {p2: posArcStart, p1: posArcEnd}; }
		
		if(myCameraOrbit.activeCam.userData.isCam2D) showElementSvg([obj.userData.door.svg.arc]);
		updateSvgArc({el: obj.userData.door.svg.arc, param: param}, force);
	}
	
	
}



// устанавливаем (поварачиваем) 3D объект wd 
function setPosWD_Obj3D(cdm)
{
	var wd = cdm.wd;		
	var obj3D = wd.userData.door.obj3D;
	
	if(!obj3D) return;
		
	//wd.geometry.computeBoundingBox();	
	var openId = wd.userData.door.openId;	
	
	//if(openId == 0 || openId == 1) { obj3D.scale.x = Math.abs(obj3D.scale.x); }	
	//else { obj3D.scale.x = -Math.abs(obj3D.scale.x); }

	
	if(openId == 0)
	{
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 1) 
	{ 
		obj3D.scale.set(Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 2) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, Math.abs(obj3D.scale.z)); 
	}
	else if(openId == 3) 
	{ 
		obj3D.scale.set(-Math.abs(obj3D.scale.x), obj3D.scale.y, -Math.abs(obj3D.scale.z)); 
	}
}



// вставляем в wd(форму) 3D объект окна/двери
function setObjInWD({obj, wd})
{
	var obj3D = obj;
	
	obj3D.material.visible = false;
	
	wd.add( obj3D );
	
	wd.userData.door.obj3D = obj3D;
	
	wd.updateMatrixWorld();
	var centerWD = wd.geometry.boundingSphere.center.clone();	

	obj3D.updateMatrixWorld();
	obj3D.geometry.computeBoundingBox();
	obj3D.geometry.computeBoundingSphere();
	
	var center = obj3D.geometry.boundingSphere.center;	
	
	obj3D.position.set(0,0,0);
	obj3D.rotation.set(0,0,0);
	//obj3D.position.set(center.x/objPop.scale.x, center.y/objPop.scale.y, center.z/objPop.scale.z);
	//obj3D.position.copy(centerWD);
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		obj3D.visible = false;
	}

	// изменяем у ПОП объекта ширину/высоту/центрируем 
	if(1==1)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		obj3D.geometry.computeBoundingBox();		
		var dX = obj3D.geometry.boundingBox.max.x - obj3D.geometry.boundingBox.min.x;
		var dY = obj3D.geometry.boundingBox.max.y - obj3D.geometry.boundingBox.min.y;				
		
		obj3D.scale.set(x/dX, y/dY, 1);			
	}
	
	setPosWD_Obj3D({wd: wd});
}



// изменение ширины формы окна/двери
function changeWidthWD(obj, wall)
{
	if(obj.userData.door.wall == wall) return;
	//if(obj.userData.door.width == wall.userData.wall.width) return;
	
	var v = obj.geometry.vertices;
	var minZ = obj.userData.door.form.v.minZ; 
	var maxZ = obj.userData.door.form.v.maxZ;
	
	var width = wall.userData.wall.width; 
	wall.geometry.computeBoundingBox();
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z = wall.geometry.boundingBox.min.z; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z = wall.geometry.boundingBox.max.z; }
	
	obj.geometry.verticesNeedUpdate = true; 
	obj.geometry.elementsNeedUpdate = true;
	obj.geometry.computeBoundingSphere();
	obj.geometry.computeBoundingBox();	
	obj.geometry.computeFaceNormals();		
	
	obj.userData.door.width = width;
	obj.userData.door.wall = wall;	
} 
 


 