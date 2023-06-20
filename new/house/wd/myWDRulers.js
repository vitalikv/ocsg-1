
// линейки для окно/дверей в 2D 
class MyWDRulers
{
	objRulers = [];
	
	constructor()
	{
		this.objRulers = this.createRulers();
	}

	createRulers()
	{
		const arr = [];
		
		const material = new THREE.MeshStandardMaterial({ color: 0x616161, transparent: true, opacity: 1.0, depthTest: false });
		
		const count = 6;
		
		for ( let i = 0; i < count; i++ )
		{
			arr[i] = new THREE.Mesh( createGeometryCube(1, 0.025, 0.025), material );
			
			const v = arr[i].geometry.vertices; 
			v[0].x = v[1].x = v[6].x = v[7].x = -0.5;
			v[3].x = v[2].x = v[5].x = v[4].x = 0.5;
			
			v[0].y = v[3].y = v[4].y = v[7].y = -0.025/2;
			v[1].y = v[2].y = v[5].y = v[6].y = 0.025/2;
			
			arr[i].geometry.verticesNeedUpdate = true;			
			arr[i].visible = false;	 
			arr[i].renderOrder = 2;
			arr[i].userData = {};
			arr[i].userData.cone = [];
			scene.add( arr[i] );
			
			for ( let i2 = 0; i2 < 2; i2++ )
			{
				const cone = new THREE.Mesh(infProject.geometry.cone[1], material); 
				cone.visible = false;
				scene.add( cone );	
				
				arr[i].userData.cone[i2] = cone;			
			}
		}
		
		return arr;		
	}
	
	
	show()
	{
		if(!myCameraOrbit.activeCam.userData.isCam2D) return;
		
		
	}
	
	
	setPosRot({arrP, wall})
	{
		for ( var i = 0; i < this.objRulers.length; i++ )
		{
			const line = this.objRulers[i];
			const dist = arrP[i].p1.distanceTo( arrP[i].p2 );	
			
			const v = line.geometry.vertices;
			v[0].x = v[1].x = v[6].x = v[7].x = -dist/2;
			v[3].x = v[2].x = v[5].x = v[4].x = dist/2;		
			line.geometry.verticesNeedUpdate = true;			
			
			const pos = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).divideScalar( 2 ).add(arrP[i].p2);	
			
			line.position.copy(pos).add(arrP[i].offset);
			line.rotation.copy(wall.rotation);		
								
			
			line.visible = true;			
			line.updateMatrixWorld();
			
			for ( let i2 = 0; i2 < line.userData.cone.length; i2++ )
			{
				const cone = line.userData.cone[i2];
				
				const xp = (i2 === 0) ? v[0].x : v[3].x;
				const zr = (i2 === 0) ? -Math.PI/2 : Math.PI/2;
				
				const pos = line.localToWorld( new THREE.Vector3(xp, 0, 0) );
				cone.position.copy(pos);
				cone.rotation.set(-Math.PI/2, 0, wall.rotation.y-zr);
				
				cone.visible = true;
			}
		}		
	}
	
	setScale({value})
	{
		for ( let i = 0; i < this.objRulers.length; i++ )
		{ 
			this.objRulers[i].scale.set(1, 1/value, 1/value);
			this.objRulers[i].userData.cone[0].scale.set(1.3/value, 1.3/value, 1.3/value);
			this.objRulers[i].userData.cone[1].scale.set(1.3/value, 1.3/value, 1.3/value);
		}
	}
	
	hide()
	{
		for ( let i = 0; i < this.objRulers.length; i++ ) 
		{ 
			let line = this.objRulers[i];
			line.visible = false; 
			
			for ( let i2 = 0; i2 < line.userData.cone.length; i2++ )
			{
				line.userData.cone[i2].visible = false; 
			}	
		}		
	}
}






