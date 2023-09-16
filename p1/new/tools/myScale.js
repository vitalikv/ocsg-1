

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
		scaleObj.userData.startPos = new THREE.Vector3();
		scaleObj.userData.dir = new THREE.Vector3();	
		scaleObj.userData.propScale = this.propScale;
		
		
		const arr = [];
		arr[0] = {axis: 'x', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0.6, y: 0, z: 0}, clone: true, rot: {x: 0, y: Math.PI, z: 0}, color: 'rgb(247, 72, 72)', opacity: 0};
		arr[1] = {axis: 'y', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0.6, z: 0}, clone: true, rot: {x: 0, y: 0, z: -Math.PI/2}, color: 'rgb(17, 255, 0)', opacity: 0};
		arr[2] = {axis: 'z', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0, z: -0.6}, clone: true, rot: {x: 0, y: -Math.PI/2, z: 0}, color: 'rgb(72, 116, 247)', opacity: 0};


		const geometry = this.crGeomBox({x: 1, y: 1, z: 1});
		
		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: arr[i].opacity, depthTest: false, lightMap: lightMap_1 });
			if(material.opacity == 0) material.visible = false;
			
			const obj = new THREE.Mesh( geometry, material );
			obj.scale.set(arr[i].size.x, arr[i].size.y, arr[i].size.z);
			obj.userData.tag = 'scale';
			obj.userData.axis = arr[i].axis;	
			obj.renderOrder = 2;
			
			if(arr[i].pos) obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );
			if(arr[i].rot) obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );
			
			scaleObj.add( obj );
			
			if(arr[i].clone)
			{
				const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });
				
				const obj = new THREE.Mesh( geometry, material );
				obj.scale.set(arr[i].size.x, arr[i].size.y / 5, arr[i].size.z / 5);
				obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );				
				obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );	
				obj.renderOrder = 2;
				
				scaleObj.add( obj );					
			}
		}
			
		
		const geomBox = this.crGeomBox({x: 0.1, y: 0.1, z: 0.1});
		createBox({ind: 'x'});
		createBox({ind: 'y'});
		createBox({ind: 'z'});
		
		// создаем box для scaleObj
		function createBox({ind})
		{
			let dl = 0.6 + 0.1/2;
			dl = 0.6;
			let arr = [];
			arr['x'] = {axis: 'x', pos: new THREE.Vector3(dl,0,0), rot: new THREE.Vector3(0,0,0), color: 0xff0000};
			arr['y'] = {axis: 'y', pos: new THREE.Vector3(0,dl,0), rot: new THREE.Vector3(-Math.PI/2,-Math.PI/2,0), color: 0x00ff00};
			arr['z'] = {axis: 'z', pos: new THREE.Vector3(0,0,-dl), rot: new THREE.Vector3(Math.PI,-Math.PI/2,0), color: 0x0000ff};			
			
			let material = new THREE.MeshStandardMaterial({ color : arr[ind].color, depthTest: false, transparent: true, lightMap: lightMap_1, opacity: 1 });
			
			let obj = new THREE.Mesh( geomBox, material ); 
			obj.userData.tag = 'scale';
			obj.userData.axis = arr[ind].axis;
			obj.renderOrder = 2;
			obj.position.copy(arr[ind].pos);
			obj.rotation.set(arr[ind].rot.x, arr[ind].rot.y, arr[ind].rot.z);
			scaleObj.add( obj );
			
			return obj;
		}
		
		
		//scaleObj.visible = false;
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



	mousedown = ({event, rayhit}) => 
	{
		const axisObj = rayhit.object;  					
		this.actAxis = axisObj.userData.axis;
		
		const scaleObj = this.obj;
		//scaleObj.updateMatrixWorld();
		scaleObj.userData.startPos = scaleObj.position.clone();
		scaleObj.userData.dir = new THREE.Vector3().subVectors(axisObj.getWorldPosition(new THREE.Vector3()), scaleObj.position).normalize();
		
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
		let pos = rayhit[0].point;					
		
		let dist = scaleObj.userData.dir.dot(new THREE.Vector3().subVectors(pos, scaleObj.userData.startPos));
		pos = scaleObj.userData.startPos.clone().add(new THREE.Vector3().addScaledVector(scaleObj.userData.dir, dist));
			
		const offset = new THREE.Vector3().subVectors( pos, scaleObj.userData.startPos );
		
		
		console.log(dist, this.actAxis);
					
		const selectObj = myToolPG.obj;
		
		if(selectObj)
		{
			const axis = this.actAxis;
			let size = new THREE.Vector3();

			if(selectObj.userData.tag === 'obj')
			{
				size = myHouse.myObjAction.getObjSize({obj: selectObj});
			}

			if(selectObj.userData.tag === 'roof')
			{
				size = myHouse.myRoofAction.getObjSize({obj: selectObj});
			}			
			
			size[axis] = dist * 2; 	

			const limit = { x_min : 0.01, x_max : 30, y_min : 0.01, y_max : 30, z_min : 0.01, z_max : 30 };
			
			if(size.x < limit.x_min) { size.x = limit.x_min; }
			else if(size.x > limit.x_max) { size.x = limit.x_max; }
			
			if(size.y < limit.y_min) { size.y = limit.y_min; }
			else if(size.y > limit.y_max) { size.y = limit.y_max; }

			if(size.z < limit.z_min) { size.z = limit.z_min; }
			else if(size.z > limit.z_max) { size.z = limit.z_max; }			

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
		}
		
		//scaleObj.userData.propScale({type: 'offsetPivot', offset});			
		//scaleObj.userData.propScale({type: 'moveObjs', obj: myToolPG.obj, arrO: [], offset});
		
		//myToolPG.setPosPivotGizmo({pos: scaleObj.position});	
		
		this.render();
	}

	mouseup = (e) => 
	{		
		this.render();
	}
			
	// ф-ция со всеми действиями Pivot
	propScale = (params) =>
	{
		const pivot = this.obj;
		
		let type = params.type;			
		
		if(type == 'setScale') { setScale({obj: params.obj, arrO: params.arrO, pos: params.pos, qt: params.qt}); }
		if(type == 'moveObjs') { moveObjs({obj: params.obj, arrO: params.arrO, offset: params.offset}); }		
		if(type == 'offsetPivot') { offsetPivot({offset: params.offset}); }
		if(type == 'setPosScale') { setPosScale({pos: params.pos}); }
		if(type == 'setRotScale') { setRotScale({qt: params.qt}); }
		if(type == 'updateScale') { updateScale(); }
		if(type == 'hide') { hide(); }
		

		// установить и показать Pivot
		function setScale(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;
			let pos = params.pos;
			let qt = params.qt;
			
			pivot.visible = true;	
			pivot.position.copy(pos);
			pivot.quaternion.copy(qt);
			
			pivot.userData.propScale({type: 'updateScale'});
		}


		
		function offsetPivot(params)
		{ 
			let offset = params.offset;
			pivot.position.add( offset );
			pivot.userData.startPos.add( offset );
			
			pivot.userData.propScale({type: 'updateScale'});
		}			


		// перемещение объектов
		function moveObjs(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;			
			let offset = params.offset;
			

			if(obj && obj.userData.tag == 'new_point')		// точка трубы
			{
				obj.movePointTube({offset: offset});	
			}			 
			else if(obj && obj.userData.tag == 'wtGrid') 
			{ 
				obj.userData.propObj({type: 'moveObj', obj: obj, offset: offset}); 
			}
			else 
			{
				if(obj && arrO.length === 0)
				{
					obj.position.add(offset);
				}
				else
				{
					for(let i = 0; i < arrO.length; i++)
					{
						arrO[i].position.add(offset);		
					}									
				}
			}	
		}

		
		// прекращаем действия с pivot
		function endPivot(params)
		{
			
		}


		// установить position Pivot, когда меняем через input
		function setPosScale(params)
		{
			if (!pivot.visible) return;
			
			let pos = params.pos;
			
			pivot.position.copy(pos);			
			pivot.userData.propScale({type: 'updateScale'});
		}
		
		// установить rotation, когда меняем через input
		function setRotScale(params)
		{
			if (!pivot.visible) return;
			
			let qt = params.qt;
			
			pivot.quaternion.copy(qt);			
		}

		
		function updateScale() 
		{
			if (!pivot.visible) return;
			
			let scale = 1;
			
			if(myCameraOrbit.activeCam.userData.isCam2D) { scale = 1 / myCameraOrbit.activeCam.zoom; }
			if(myCameraOrbit.activeCam.userData.isCam3D) { scale = myCameraOrbit.activeCam.position.distanceTo(pivot.position) / 6; }			
			
			pivot.scale.set(scale, scale, scale);
		}


		function hide() 
		{
			pivot.visible = false;
		}
				
	}
	
	render()
	{
		renderCamera();
	}		
}






