

class MyScale
{
	obj;
	actAxis;	
	
	constructor()
	{
		this.obj = this.createObj()
	}
	
	createObj() 
	{
		const scaleObj = new THREE.Group();
		scaleObj.userData = {};
		scaleObj.userData.startOffset = new THREE.Vector3();
		scaleObj.userData.limitPos = new THREE.Vector3();
		scaleObj.userData.dir = new THREE.Vector3();	
		scaleObj.userData.propScale = this.propScale;
	
		
		const geomBox = this.crGeomBox({x: 0.1, y: 0.1, z: 0.1});
		
		const arr = [];
		const dl = 0.6;
		arr.push({axis: 'x', pos: new THREE.Vector3(dl,0,0), rot: new THREE.Vector3(0,0,0), color: 0xff0000});
		arr.push({axis: 'x', pos: new THREE.Vector3(-dl,0,0), rot: new THREE.Vector3(0,Math.PI,0), color: 0xff0000});
		arr.push({axis: 'y', pos: new THREE.Vector3(0,dl,0), rot: new THREE.Vector3(-Math.PI/2,-Math.PI/2,0), color: 0x00ff00});
		arr.push({axis: 'y', pos: new THREE.Vector3(0,-dl,0), rot: new THREE.Vector3(-Math.PI/2,Math.PI/2,0), color: 0x00ff00});
		arr.push({axis: 'z', pos: new THREE.Vector3(0,0,dl), rot: new THREE.Vector3(-Math.PI,Math.PI/2,0), color: 0x0000ff});	
		arr.push({axis: 'z', pos: new THREE.Vector3(0,0,-dl), rot: new THREE.Vector3(Math.PI,-Math.PI/2,0), color: 0x0000ff});
		
		for ( let i = 0; i < arr.length; i++ )
		{
			createBox({data: arr[i]});
		}
		
		// создаем box для scaleObj
		function createBox({data})
		{
			const material = new THREE.MeshStandardMaterial({ color : data.color, depthTest: true, transparent: true, lightMap: lightMap_1, opacity: 1 });
			
			const obj = new THREE.Mesh( geomBox, material ); 
			obj.userData.tag = 'scale';
			obj.userData.axis = data.axis;
			obj.renderOrder = 2;
			obj.position.copy(data.pos);
			obj.rotation.set(data.rot.x, data.rot.y, data.rot.z);
			scaleObj.add(obj);
			
			return obj;
		}
		
		
		scaleObj.visible = false;
		scene.add( scaleObj );


		return scaleObj;
	}
	
	// создаем геометрию линий/боксов
	crGeomBox(params)
	{
		let x = params.x;
		let y = params.y;
		let z = params.z;
		
		let geometry = new THREE.Geometry();
		y /= 2;
		z /= 2;
		let vertices = [
					new THREE.Vector3(0,-y,z),
					new THREE.Vector3(0,y,z),
					new THREE.Vector3(x,y,z),
					new THREE.Vector3(x,-y,z),
					new THREE.Vector3(x,-y,-z),
					new THREE.Vector3(x,y,-z),
					new THREE.Vector3(0,y,-z),
					new THREE.Vector3(0,-y,-z),
				];	
				
		let faces = [
					new THREE.Face3(0,3,2),
					new THREE.Face3(2,1,0),
					new THREE.Face3(4,7,6),
					new THREE.Face3(6,5,4),				
					new THREE.Face3(0,1,6),
					new THREE.Face3(6,7,0),					
					new THREE.Face3(1,2,5),
					new THREE.Face3(5,6,1),				
					new THREE.Face3(2,3,4),
					new THREE.Face3(4,5,2),				
					new THREE.Face3(3,0,7),
					new THREE.Face3(7,4,3),
				];
		
		let uvs1 = [
					new THREE.Vector2(0,0),
					new THREE.Vector2(1,0),
					new THREE.Vector2(1,1),
				];
		let uvs2 = [
					new THREE.Vector2(1,1),
					new THREE.Vector2(0,1),
					new THREE.Vector2(0,0),
				];	

				
		geometry.vertices = vertices;
		geometry.faces = faces;
		geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
		geometry.computeFaceNormals();	
		geometry.uvsNeedUpdate = true;		
		
		return geometry;		
	}

	// установить и показать Scale
	actScale({obj, pos, qt})
	{	
		const selectObj = obj;
		const scaleObj = this.obj;
		
		selectObj.material.visible = true;
		scaleObj.visible = true;	
		scaleObj.position.copy(pos);
		scaleObj.quaternion.copy(qt);

		this.setAxes(selectObj);
	}

	// устанавливаем контроллеры
	setAxes(selectObj)
	{
		const scaleObj = this.obj;
		let size = new THREE.Vector3();

		if(selectObj.userData.tag === 'obj') size = myHouse.myObjAction.getObjSize({obj: selectObj});
		if(selectObj.userData.tag === 'roof') size = myHouse.myRoofAction.getObjSize({obj: selectObj});
		
		for ( let i = 0; i < scaleObj.children.length; i++ )
		{
			const axisObj = scaleObj.children[i];
			const dir = axisObj.position.clone().normalize();
			const d = dir.dot(new THREE.Vector3());

			let value = 1;
			
			if(axisObj.userData.axis === 'x') value = (dir.x > 0) ? size.x/2 : -size.x/2;
			if(axisObj.userData.axis === 'y') value = (dir.y > 0) ? size.y/2 : -size.y/2;
			if(axisObj.userData.axis === 'z') value = (dir.z > 0) ? size.z/2 : -size.z/2;
			
			if(axisObj.userData.axis === 'x') axisObj.position.copy(new THREE.Vector3(value, 0, 0));
			if(axisObj.userData.axis === 'y') axisObj.position.copy(new THREE.Vector3(0, value, 0));
			if(axisObj.userData.axis === 'z') axisObj.position.copy(new THREE.Vector3(0, 0, value));
		}

		this.updateScale();
	}
	
	
	mousedown = ({event, rayhit}) => 
	{
		const axisObj = rayhit.object;  					
		this.actAxis = axisObj.userData.axis;
		
		const scaleObj = this.obj;
		//scaleObj.updateMatrixWorld();
		
		const posAxisW = axisObj.getWorldPosition(new THREE.Vector3());
		scaleObj.userData.startOffset = new THREE.Vector3().subVectors( posAxisW, rayhit.point );
		scaleObj.userData.limitPos = scaleObj.position.clone().sub(posAxisW).add(scaleObj.position);	// противоположное position Axis
		scaleObj.userData.dir = new THREE.Vector3().subVectors(posAxisW, scaleObj.position).normalize();		
		
		planeMath.quaternion.copy( quaternionDirection( scaleObj.userData.dir ) ); 
		planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));		
		
		planeMath.position.copy( rayhit.point );		
		
		this.render();
	}
	
	mousemove = (event) => 
	{
		const rayhit = rayIntersect( event, planeMath, 'one' ); 			
		if(rayhit.length === 0) return;
		
		const scaleObj = this.obj;
		let pos = rayhit[0].point.clone();					
		
		pos.add(scaleObj.userData.startOffset);		
		
		const dist = scaleObj.userData.dir.dot(new THREE.Vector3().subVectors(pos, scaleObj.userData.limitPos));
		pos = scaleObj.userData.limitPos.clone().add(new THREE.Vector3().addScaledVector(scaleObj.userData.dir, dist));
			
		const limitOffset = new THREE.Vector3().subVectors( pos, scaleObj.userData.limitPos );
					
		const selectObj = myToolPG.obj;
		
		if(selectObj)
		{
			const axis = this.actAxis;
			let size = new THREE.Vector3();

			if(selectObj.userData.tag === 'obj') size = myHouse.myObjAction.getObjSize({obj: selectObj});
			if(selectObj.userData.tag === 'roof') size = myHouse.myRoofAction.getObjSize({obj: selectObj});		
			
			size[axis] = dist * 1; 	

			const limit = { done: false, x_min : 0.01, x_max : 30, y_min : 0.01, y_max : 30, z_min : 0.01, z_max : 30 };
			
			if(size.x < limit.x_min) { size.x = limit.x_min; limit.done = true; }
			else if(size.x > limit.x_max) { size.x = limit.x_max; limit.done = true; }
			
			if(size.y < limit.y_min) { size.y = limit.y_min; limit.done = true; }
			else if(size.y > limit.y_max) { size.y = limit.y_max; limit.done = true; }

			if(size.z < limit.z_min) { size.z = limit.z_min; limit.done = true; }
			else if(size.z > limit.z_max) { size.z = limit.z_max; limit.done = true; }			

			if(selectObj.userData.tag === 'obj')
			{
				myHouse.myObjAction.setObjSize({obj: selectObj, size});
				upDateTextureObj3D({obj: selectObj})
			}

			if(selectObj.userData.tag === 'roof')
			{
				myHouse.myRoofAction.setObjSize({obj: selectObj, size});
				//myHouse.myRoofCSG.updateCgsRoof();
				myHouse.myRoofAction.upDateTextureRoof({obj: selectObj})	
				//myToolPG.activeTool({obj});		
			}

			
			
			// если сработал limit, то объект не смещаем
			if(!limit.done)
			{
				limitOffset.divideScalar( 2 )
				const pos2 = scaleObj.userData.limitPos.clone().add(limitOffset);
				const offset2 = pos2.clone().sub(scaleObj.position);
				
				const offset3 = scaleObj.position.clone().sub(myToolPG.calcPos({obj: selectObj}));
				
				scaleObj.position.add(offset2);
				selectObj.position.add(offset2);
				selectObj.position.add(offset3);
			}
			
			myToolPG.setPosPivotGizmo({pos: scaleObj.position});
			
			this.setAxes(selectObj);
		}
		
		myToolPG_UI.setSclUI();
		
		this.render();
	}

	mouseup = (e) => 
	{		
		this.render();
	}

	// меняем масштаб axis, при изменении положения камеры
	updateScale() 
	{
		const scaleObj = this.obj;
		if (!scaleObj.visible) return;
		
		let scale = 1;
		
		if(myCameraOrbit.activeCam.userData.isCam2D) { scale = 1 / myCameraOrbit.activeCam.zoom; }						

		for ( let i = 0; i < scaleObj.children.length; i++ )
		{
			const axisObj = scaleObj.children[i];
			
			if(myCameraOrbit.activeCam.userData.isCam3D) 
			{ 
				scale = myCameraOrbit.activeCam.position.distanceTo(axisObj.getWorldPosition(new THREE.Vector3())) / 6; 
			}
			
			axisObj.scale.set(scale, scale, scale);
		}			
	}

	hide() 
	{
		this.obj.visible = false;
		
		const selectObj = myToolPG.obj;
		if(selectObj)
		{
			selectObj.material.visible = false;
		}
	}	
			
	// ф-ция со всеми действиями Pivot
	propScale = (params) =>
	{
		const pivot = this.obj;
		
		let type = params.type;			
				
		if(type == 'setPosScale') { setPosScale({pos: params.pos}); }
		if(type == 'setRotScale') { setRotScale({qt: params.qt}); }


		// установить position Pivot, когда меняем через input
		function setPosScale(params)
		{
			if (!pivot.visible) return;
			
			let pos = params.pos;
			
			pivot.position.copy(pos);			
			//pivot.userData.propScale({type: 'updateScale'});
		}
		
		// установить rotation, когда меняем через input
		function setRotScale(params)
		{
			if (!pivot.visible) return;
			
			let qt = params.qt;
			
			pivot.quaternion.copy(qt);			
		}		
	}
	
	render()
	{
		renderCamera();
	}		
}






