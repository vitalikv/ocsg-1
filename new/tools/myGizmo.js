


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
		arr[0] = {axis: 'x', rot: new THREE.Vector3(0, 0, 0), color: 'rgb(17, 255, 0)'};
		arr[1] = {axis: 'y', rot: new THREE.Vector3(0, 0, Math.PI/2), color: 'rgb(247, 72, 72)'};
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
		
		
		//gizmo.visible = false;
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
	

	// ф-ция со всеми действиями Pivot
	propGizmo = (params) =>
	{
		const gizmo = this.obj;
				
		let type = params.type;			
		
		if(type == 'clippingGizmo') { clippingGizmo(); }		
		if(type == 'setGizmo') { setGizmo({obj: params.obj, arrO: params.arrO, pos: params.pos, qt: params.qt}); }
		if(type == 'addEvent') { addEvent({rayhit: params.rayhit}); }
		if(type == 'rotObjs') { rotObjs({pos: params.pos, arrO: params.arrO, q_Offset: params.q_Offset, rotY_Old: params.rotY_Old}); }
		if(type == 'setPosGizmo') { setPosGizmo({pos: params.pos}); }
		if(type == 'setRotGizmo') { setRotGizmo({qt: params.qt}); }
		if(type == 'updateScale') { updateScale(); }
		if(type == 'hide') { hide(); }		
		


		// прячем текстуру если она находится за плоскостью 
		function clippingGizmo() 
		{
			if (!gizmo.visible) return;
			
			
			if(camOrbit.activeCam.userData.isCam2D)
			{
				let plane = new THREE.Plane(new THREE.Vector3(0,1,0), 100);
				gizmo.children[0].children[0].material.clippingPlanes[0].copy(plane);		
			}
			
			if(camOrbit.activeCam.userData.isCam3D)
			{
				let obj = new THREE.Object3D();
				
				obj.position.copy(gizmo.position);
				
				obj.lookAt(camOrbit.activeCam.position);
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
			
			let visible = (camOrbit.activeCam.userData.isCam2D) ? false : true;			
			gizmo.children[1].visible = visible;
			gizmo.children[2].visible = visible;				
				
			
			gizmo.userData.propGizmo({type: 'updateScale'});
			gizmo.userData.propGizmo({type: 'clippingGizmo'});
		}


		function addEvent(params)
		{
			startGizmo(params);
			
			camOrbit.stopMove = true;
			setMouseStop(true);
			
			container.onmousemove = (e) => 
			{
				moveGizmo({event: e});		
				
				camOrbit.render();
			};

			container.onmouseup = (e) => 
			{
				container.onmousemove = null;
				container.onmouseup = null;
				
				camOrbit.stopMove = false;
				setMouseStop(false);

				camOrbit.render();
			};			
		}


		// кликнули на gizmo
		function startGizmo(params)
		{
			let rayhit = params.rayhit;
			
			let obj = rayhit.object;  									
			
			planeMath.quaternion.copy( obj.getWorldQuaternion(new THREE.Quaternion()) );
			planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));			
			planeMath.position.copy( gizmo.position );
			
			planeMath.updateMatrixWorld();			
			let dir = planeMath.worldToLocal(rayhit.point.clone());
			gizmo.userData.rotY = Math.atan2(dir.x, dir.y);			
			gizmo.userData.dir = new THREE.Vector3().subVectors(planeMath.localToWorld( new THREE.Vector3( 0, 0, -1 ) ), planeMath.position).normalize();
		} 


		// вращение gizmo
		function moveGizmo(params)
		{
			let event = params.event;
			
			let rayhit = rayIntersect( event, planeMath, 'one' ); 			
			if(rayhit.length == 0) return;
			
			let q_Old = gizmo.quaternion.clone();
			let rotY_Old = gizmo.userData.rotY;
			
			let dir = planeMath.worldToLocal(rayhit[0].point.clone());
			let rotY = Math.atan2(dir.x, dir.y);	
			
			//gizmo.rotateOnWorldAxis(gizmo.userData.dir, rotY - gizmo.userData.rotY);
			let q = new THREE.Quaternion().setFromAxisAngle(gizmo.userData.dir, rotY - gizmo.userData.rotY);
			gizmo.quaternion.copy(q.clone().multiply(gizmo.quaternion));
			gizmo.userData.rotY = rotY;
			
										
			gizmo.userData.propGizmo({type: 'rotObjs', pos: gizmo.position, arrO: infProject.tools.pg.arrO, rotY_Old: rotY_Old});

			infProject.tools.pg.setRotPivotGizmo({qt: gizmo.quaternion});
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
		

		// прекращаем действия с gizmo
		function endGizmo(params)
		{
			
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
			
			if(camOrbit.activeCam.userData.isCam2D) { scale = 1 / camOrbit.activeCam.zoom; }
			if(camOrbit.activeCam.userData.isCam3D) { scale = camOrbit.activeCam.position.distanceTo(gizmo.position) / 6; }			
			
			gizmo.scale.set(scale, scale, scale);
		}
		
		
		function hide() 
		{
			gizmo.visible = false;
		}		
					
		
	}

}








