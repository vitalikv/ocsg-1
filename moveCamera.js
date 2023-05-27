



function cameraZoomTop( delta )
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;

	myCameraOrbit.cam2D.zoom = delta;
	myCameraOrbit.cam2D.updateProjectionMatrix();	
	
	infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
	infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
	
	// zoom label
	var k = 1 / delta;
	if(k <= infProject.settings.camera.limitZoom && 1==2) 
	{		
		// point geometry
		var point = infProject.tools.point;	
		var v = point.geometry.vertices;
		var v2 = point.userData.tool_point.v2;
			
		for ( var i = 0; i < v2.length; i++ )
		{
			v[i].x = v2[i].x * 1/delta;
			v[i].z = v2[i].z * 1/delta;
		}	

		infProject.tools.point.geometry.verticesNeedUpdate = true;
		infProject.tools.point.geometry.elementsNeedUpdate = true;


		// wd рулетки 
		for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
	}
}




// центрируем камеру cameraTop
function centerCamera2D({arr}={})
{
	if(!arr) return;
	if(arr.length === 0) return;
	
	let pos = new THREE.Vector3();

	let minX = Infinity; 
	let maxX = -Infinity;
	let minZ = Infinity; 
	let maxZ = -Infinity;		
	
	for ( let i = 0; i < arr.length; i++ )
	{
		if(arr[i].position.x < minX) { minX = arr[i].position.x; }
		if(arr[i].position.x > maxX) { maxX = arr[i].position.x; }
		if(arr[i].position.z < minZ) { minZ = arr[i].position.z; }
		if(arr[i].position.z > maxZ) { maxZ = arr[i].position.z; }
	}				
	
	pos = new THREE.Vector3((maxX - minX)/2 + minX, 0, (maxZ - minZ)/2 + minZ);		
			
	myCameraOrbit.cam2D.position.x = pos.x;
	myCameraOrbit.cam2D.position.z = pos.z;
}





function moveCameraToNewPosition()
{

	if ( !newCameraPosition ) return;
	
	if ( camera == camera3D && newCameraPosition.positionFirst || camera == camera3D && newCameraPosition.positionFly )
	{
		var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
		
		camera.position.lerp( pos, 0.1 );
		
		
		if(newCameraPosition.positionFirst)
		{
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.add( newCameraPosition.positionFirst );	
			camera.lookAt( dir );
		}
		if(newCameraPosition.positionFly)
		{
			var radius_1 = camera3D.userData.camera.save.radius;
			var radius_2 = infProject.camera.d3.targetO.position.distanceTo(camera.position);
			
			var k = Math.abs((radius_2/radius_1) - 1);
			
			var dir = camera.getWorldDirection(new THREE.Vector3()); 			
			dir.y = 0; 
			dir.normalize();
			dir.x *= 15*k;
			dir.z *= 15*k;
			dir.add( infProject.camera.d3.targetO.position );	
			
			camera.lookAt( dir ); 
		}		
		
		
		if(comparePos(camera.position, pos)) 
		{ 	
			newCameraPosition = null; 
		};		
	}
	else
	{
		newCameraPosition = null;
	}
	
	renderCamera();
}




