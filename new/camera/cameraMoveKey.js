

// пермещение камеры через клаву
class MyCameraMoveKey
{
	constructor()
	{
		
	}

	updateKeyDown()
	{  
		if(!docReady) return;
		if(infProject.settings.blockKeyCode) return;
		
		const keys = clickO.keys;  		
		if(keys.length === 0) return;

		if (myCameraOrbit.activeCam.userData.isCam2D) this.moveCam2D(keys);
		if (myCameraOrbit.activeCam.userData.isCam3D) this.moveCam3D(keys);
	}
	
	moveCam2D(keys)
	{
		const cam2D = myCameraOrbit.activeCam;
		let x = 0;
		let z = 0;
		const kof = 0.05;
		
		if ( keys[ 87 ] || keys[ 38 ] ) z -= kof;
		else if ( keys[ 83 ] || keys[ 40 ] ) z += kof;
		
		if ( keys[ 65 ] || keys[ 37 ] ) x -= kof;
		else if ( keys[ 68 ] || keys[ 39 ] ) x += kof;
		
		if(x !== 0 || z !== 0)
		{			
			cam2D.position.x += x;
			cam2D.position.z += z;
			
			myCameraOrbit.cam2D.updateMatrixWorld();
			//myCameraOrbit.cam2D.updateProjectionMatrix();
			upPosLabels_1();
			
			this.render()
		}		
	}
	
	moveCam3D(keys)
	{
		const cam3D = myCameraOrbit.activeCam;
		
		const kof = (cam3D.userData.type === 'fly') ? 0.1 : 0.05;
		let dirX = new THREE.Vector3();
		let dirZ = new THREE.Vector3();
		
		if ( keys[ 87 ] || keys[ 38 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y );
			const z = Math.cos( cam3D.rotation.y );
			dirX = new THREE.Vector3( -x, 0, -z );
			dirX = new THREE.Vector3().addScaledVector( dirX, kof );
		}
		else if ( keys[ 83 ] || keys[ 40 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y );
			const z = Math.cos( cam3D.rotation.y );
			dirX = new THREE.Vector3( x, 0, z );
			dirX = new THREE.Vector3().addScaledVector( dirX, kof );
		}
		if ( keys[ 65 ] || keys[ 37 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y - 1.5707963267948966 );
			const z = Math.cos( cam3D.rotation.y - 1.5707963267948966 );
			dirZ = new THREE.Vector3( x, 0, z );
			dirZ = new THREE.Vector3().addScaledVector( dirZ, kof );
		}
		else if ( keys[ 68 ] || keys[ 39 ] ) 
		{
			const x = Math.sin( cam3D.rotation.y + 1.5707963267948966 );
			const z = Math.cos( cam3D.rotation.y + 1.5707963267948966 );
			dirZ = new THREE.Vector3( x, 0, z );
			dirZ = new THREE.Vector3().addScaledVector( dirZ, kof );
		}
		if ( keys[ 88 ] && 1==2 ) 
		{
			dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, -kof );
		}
		else if ( keys[ 67 ] && 1==2 ) 
		{
			dir = new THREE.Vector3( 0, 1, 0 );
			dir = new THREE.Vector3().addScaledVector( dir, kof );
		}
		
		if(dirX.length() > 0 || dirZ.length() > 0) 
		{					
			if(dirX.length() > 0 && dirZ.length() > 0)
			{
				dirX = new THREE.Vector3().addScaledVector( dirX, 0.75 );
				dirZ = new THREE.Vector3().addScaledVector( dirZ, 0.75 );
			}
			
			cam3D.position.add( dirX );
			cam3D.position.add( dirZ );
			
			cam3D.userData.targetO.position.add( dirX );
			cam3D.userData.targetO.position.add( dirZ );
			
			this.render();
		}		
	}	

	render()
	{
		renderCamera(); 
	}
}












