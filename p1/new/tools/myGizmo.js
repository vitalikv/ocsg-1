


class MyGizmo 
{
	obj;
	
	constructor()
	{
		this.obj = this.createObj()
	}

	createObj() 
	{
		let gizmo = new THREE.Group();		
		gizmo.userData.propGizmo = this.propGizmo;
		
		
		let arr = [];
		arr[0] = {axis: 'y', rot: new THREE.Vector3(0, 0, 0), color: 'rgb(17, 255, 0)'};
		arr[1] = {axis: 'x', rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(247, 72, 72)'};
		arr[2] = {axis: 'z', rot: new THREE.Vector3(Math.PI/2, 0, 0), color: 'rgb(72, 116, 247)'};	
		
		let geom1 = this.crGeom({size: 0.03});
		let geom2 = this.crGeom({size: 0.01});
		
		for ( let i = 0; i < arr.length; i++ )
		{
			let mat1 = new THREE.MeshStandardMaterial({ color: arr[i].color, depthTest: false, transparent: true, opacity: 1.0 });
			mat1.visible = false;

			let obj = new THREE.Mesh( geom1, mat1 );
			obj.userData.tag = 'gizmo'; 
			obj.userData.axis = arr[i].axis;		
			obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );
			
			let mat2 = new THREE.MeshStandardMaterial({ color: arr[i].color, depthTest: false, transparent: true, clippingPlanes: [new THREE.Plane()], lightMap: lightMap_1 });
			let obj2 = new THREE.Mesh( geom2, mat2 );			
			obj.add( obj2 );			
			
			gizmo.add( obj );
		}
		
		crSphere();
		
		// Sphere
		function crSphere()
		{			
			let geometry = new THREE.SphereGeometry( 0.98*0.5, 32, 32 );
			let material = new THREE.MeshStandardMaterial({color: 0x000000, depthTest: false, transparent: true, opacity: 0.1});
			let sphere = new THREE.Mesh( geometry, material );
			gizmo.add( sphere );			
		}
		
		
		gizmo.visible = false;
		scene.add( gizmo );

		return gizmo;
	}
	
	
	crGeom({size})
	{
		let count = 68; 
		let circle = [];
		let g = (Math.PI * 2) / count;
		
		for ( let i = 0; i < count; i++ )
		{
			let angle = g * i;
			circle[i] = new THREE.Vector3();
			circle[i].x = Math.sin(angle)*0.5;
			circle[i].z = Math.cos(angle)*0.5;
			//circle[i].y = 0;
		}	

		
		let pipeSpline = new THREE.CatmullRomCurve3(circle);
		pipeSpline.curveType = 'catmullrom';
		pipeSpline.tension = 0;	

		let geometry = new THREE.TubeBufferGeometry( pipeSpline, circle.length, size, 12, true );
		
		return geometry;
	}
	

	mousedown = ({event, rayhit}) => 
	{
		const obj = rayhit.object;  									
		const gizmo = this.obj;
		
		planeMath.quaternion.copy( obj.getWorldQuaternion(new THREE.Quaternion()) );
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));			
		planeMath.position.copy( gizmo.position );
		planeMath.updateMatrixWorld();
		
		rayhit = rayIntersect( event, planeMath, 'one' ); 			
		if(rayhit.length === 0) return;		
		rayhit = rayhit[0];
		
		const dir = planeMath.worldToLocal(rayhit.point.clone());		
		gizmo.userData.rotY = Math.atan2(dir.x, dir.y);			
		gizmo.userData.dir = new THREE.Vector3().subVectors(planeMath.localToWorld( new THREE.Vector3( 0, 0, -1 ) ), planeMath.position).normalize();		
		
		this.render();
	}
	
	mousemove = (event) => 
	{
		let rayhit = rayIntersect( event, planeMath, 'one' ); 			
		if(rayhit.length == 0) return;
		
		const gizmo = this.obj;
		
		const q_Old = gizmo.quaternion.clone();
		const rotY_Old = gizmo.userData.rotY;
		
		const dir = planeMath.worldToLocal(rayhit[0].point.clone());
		const rotY = Math.atan2(dir.x, dir.y);	
		
		//gizmo.rotateOnWorldAxis(gizmo.userData.dir, rotY - gizmo.userData.rotY);
		const q = new THREE.Quaternion().setFromAxisAngle(gizmo.userData.dir, rotY - gizmo.userData.rotY);
		gizmo.quaternion.copy(q.clone().multiply(gizmo.quaternion));
		gizmo.userData.rotY = rotY;
		
									
		gizmo.userData.propGizmo({type: 'rotObjs', pos: gizmo.position, arrO: [myToolPG.obj], rotY_Old});

		myToolPG.setRotPivotGizmo({qt: gizmo.quaternion});	
		
		this.render();
	}
	
	// метод который фиксирует поворот объекта на 90 градусов , метод не доконца работает , оставил, чтобы был как пример и не было мучительно долго вспоминать
	mousemove2222 = (event) => 
	{
		let rayhit = rayIntersect( event, planeMath, 'one' ); 			
		if(rayhit.length == 0) return;
		
		const gizmo = this.obj;
		
		const q_Old = gizmo.quaternion.clone();
		const rotY_Old = gizmo.userData.rotY;
		
		const dir = planeMath.worldToLocal(rayhit[0].point.clone());
		const rotY = Math.atan2(dir.x, dir.y);	
		
		//gizmo.rotateOnWorldAxis(gizmo.userData.dir, rotY - gizmo.userData.rotY);
		const q = new THREE.Quaternion().setFromAxisAngle(gizmo.userData.dir, rotY - gizmo.userData.rotY);
		
		const rotation = new THREE.Euler().setFromQuaternion(q.clone().multiply(gizmo.quaternion));
		//gizmo.quaternion.copy(q.clone().multiply(gizmo.quaternion));
		

		let x = rotation.x;
		let y = rotation.y;
		let z = rotation.z;
		
		x = Math.round(THREE.Math.radToDeg(x));
		y = Math.round(THREE.Math.radToDeg(y));
		z = Math.round(THREE.Math.radToDeg(z));


		const snapX = (Math.round(x % 360 / 10) * 10);
		const snapY = (Math.round(y % 360 / 10) * 10);
		const snapZ = (Math.round(z % 360 / 10) * 10);
		
		let done = false;
		if(gizmo.userData.axisSelected === 'y' && (Math.abs(snapX) === 0 || Math.abs(snapX) === 90)) { x = snapX; done = true; }
		if(gizmo.userData.axisSelected === 'x' && (Math.abs(snapY) === 0 || Math.abs(snapY) === 90)) { y = snapY; done = true; }
		if(gizmo.userData.axisSelected === 'z' && (Math.abs(snapZ) === 0 || Math.abs(snapZ) === 90)) { z = snapZ; done = true; }
		
		if(!done) gizmo.userData.rotY = rotY;
		
		x = THREE.Math.degToRad(x);
		y = THREE.Math.degToRad(y);
		z = THREE.Math.degToRad(z);
		
		
		
		let q_New = new THREE.Quaternion().setFromEuler(new THREE.Euler().set(x, y, z))
		let q_Offset = q_New.clone().multiply(myToolPG.qt.clone().inverse());
										
										
		gizmo.quaternion.copy(q_New);
		
		gizmo.userData.propGizmo({type: 'rotObjs', pos: gizmo.position, arrO: [myToolPG.obj], q_Offset});

		myToolPG.setRotPivotGizmo({qt: gizmo.quaternion});	
		
		this.render();
	}	

	mouseup = (e) => 
	{		
		this.render();
	}
	
	
	// ф-ция со всеми действиями Pivot
	propGizmo = (params) =>
	{
		const gizmo = this.obj;
				
		let type = params.type;			
		
		if(type == 'clippingGizmo') { clippingGizmo(); }		
		if(type == 'setGizmo') { setGizmo({obj: params.obj, arrO: params.arrO, pos: params.pos, qt: params.qt}); }
		if(type == 'rotObjs') { rotObjs({pos: params.pos, arrO: params.arrO, q_Offset: params.q_Offset, rotY_Old: params.rotY_Old}); }
		if(type == 'setPosGizmo') { setPosGizmo({pos: params.pos}); }
		if(type == 'setRotGizmo') { setRotGizmo({qt: params.qt}); }
		if(type == 'updateScale') { updateScale(); }
		if(type == 'hide') { hide(); }		
		


		// прячем текстуру если она находится за плоскостью 
		function clippingGizmo() 
		{
			if (!gizmo.visible) return;
			
			
			if(myCameraOrbit.activeCam.userData.isCam2D)
			{
				let plane = new THREE.Plane(new THREE.Vector3(0,1,0), 100);
				gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);		
			}
			
			if(myCameraOrbit.activeCam.userData.isCam3D)
			{
				let obj = new THREE.Object3D();
				
				obj.position.copy(gizmo.position);
				
				obj.lookAt(myCameraOrbit.activeCam.position);
				obj.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);
				obj.updateMatrixWorld();
	
				let plane = new THREE.Plane();
				plane.applyMatrix4(obj.matrixWorld);	
				
				gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);
				gizmo.children[1].children[0].material.clippingPlanes[0].copy(plane);
				gizmo.children[2].children[0].material.clippingPlanes[0].copy(plane);		
			}

		}		

		// установить и показать Gizmo
		function setGizmo(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;
			let pos = params.pos;
			let qt = params.qt;
			
			gizmo.visible = true;					
			
			gizmo.position.copy(pos);
			gizmo.quaternion.copy(qt);
			
			let visible = (myCameraOrbit.activeCam.userData.isCam2D) ? false : true;			
			gizmo.children[1].visible = visible;
			gizmo.children[2].visible = visible;				
				
			
			gizmo.userData.propGizmo({type: 'updateScale'});
			gizmo.userData.propGizmo({type: 'clippingGizmo'});
		}


		
		// вращаем объекты
		function rotObjs(params)
		{
			let pos = params.pos;
			let arrO = params.arrO;
			let rotY_Old = params.rotY_Old;
			let q_Offset = params.q_Offset;
			
			
			if(rotY_Old)		// вращение по оси
			{
				let dir = gizmo.userData.dir;
				let rotY = gizmo.userData.rotY;
				
				for (let i = 0; i < arrO.length; i++)
				{
					arrO[i].position.sub(pos);
					arrO[i].position.applyAxisAngle(dir, rotY - rotY_Old);
					arrO[i].position.add(pos);

					arrO[i].rotateOnWorldAxis(dir, rotY - rotY_Old);				
				}
			}
			else if(q_Offset) 		// вращение по quaternion
			{				
				for (let i = 0; i < arrO.length; i++)
				{
					arrO[i].position.sub(pos);
					arrO[i].position.applyQuaternion(q_Offset);
					arrO[i].position.add(pos);

					arrO[i].quaternion.copy(q_Offset.clone().multiply(arrO[i].quaternion));		// q_Offset разницу умнажаем, чтобы получить то же угол	
					//arrO[i].updateMatrixWorld();					
				}			
			}	
		}		
		

		
		// установить position Gizmo, когда меняем через input
		function setPosGizmo(params)
		{
			if (!gizmo.visible) return;
			
			let pos = params.pos;
			
			gizmo.position.copy(pos);			
			gizmo.userData.propGizmo({type: 'updateScale'});
			gizmo.userData.propGizmo({type: 'clippingGizmo'});
		}
		
		
		// установить rotation Gizmo, когда меняем через input
		function setRotGizmo(params)
		{
			if (!gizmo.visible) return;
			
			let qt = params.qt;
			
			gizmo.quaternion.copy(qt);			
		}		
		
		
		function updateScale() 
		{
			if (!gizmo.visible) return;
			
			let scale = 1;
			
			if(myCameraOrbit.activeCam.userData.isCam2D) { scale = 1 / myCameraOrbit.activeCam.zoom; }
			if(myCameraOrbit.activeCam.userData.isCam3D) { scale = myCameraOrbit.activeCam.position.distanceTo(gizmo.position) / 6; }			
			
			gizmo.scale.set(scale, scale, scale);
		}
		
		
		function hide() 
		{
			gizmo.visible = false;
		}				
	}

	render()
	{
		renderCamera();
	}	
}







