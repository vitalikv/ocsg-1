





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




