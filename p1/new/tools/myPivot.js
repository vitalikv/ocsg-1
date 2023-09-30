

class MyPivot
{
	obj;
	
	constructor()
	{
		this.obj = this.createObj()
	}
	
	createObj() 
	{
		const pivot = new THREE.Group();
		pivot.userData = {};
		pivot.userData.startPos = new THREE.Vector3();
		pivot.userData.dir = new THREE.Vector3();	
		pivot.userData.propPivot = this.propPivot;
		
		
		const arr = [];
		arr[0] = {axis: 'x', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0.6, y: 0, z: 0}, clone: true, rot: {x: 0, y: Math.PI, z: 0}, color: 'rgb(247, 72, 72)', opacity: 0};
		arr[1] = {axis: 'y', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0.6, z: 0}, clone: true, rot: {x: 0, y: 0, z: -Math.PI/2}, color: 'rgb(17, 255, 0)', opacity: 0};
		arr[2] = {axis: 'z', size: {x: 0.6, y: 0.1, z: 0.1}, pos: {x: 0, y: 0, z: -0.6}, clone: true, rot: {x: 0, y: -Math.PI/2, z: 0}, color: 'rgb(72, 116, 247)', opacity: 0};
		arr[3] = {axis: 'xz', size: new THREE.Vector3(0.3, 0.001, 0.3), pos: new THREE.Vector3(0.01, 0.0, -0.16), color: 'rgb(194, 194, 194)', opacity: 0.4};
		arr[4] = {axis: 'center', size: new THREE.Vector3(0.03, 0.03, 0.03), pos: new THREE.Vector3(-0.015, 0.0, 0.0), color: 'rgb(102, 102, 102)', opacity: 1};


		const geometry = this.crGeomBox({x: 1, y: 1, z: 1});
		const geomCone = this.crGeomCone();
		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: arr[i].opacity, depthTest: false, lightMap: lightMap_1 });
			if(material.opacity == 0) material.visible = false;
			
			const obj = new THREE.Mesh( geometry, material );
			obj.scale.set(arr[i].size.x, arr[i].size.y, arr[i].size.z);
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[i].axis;	
			obj.renderOrder = 2;
			
			if(arr[i].pos) obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );
			if(arr[i].rot) obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );
			
			pivot.add( obj );
			
			if(arr[i].clone)
			{
				const material = new THREE.MeshStandardMaterial({ color: arr[i].color, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });
				
				const obj = new THREE.Mesh( geometry, material );
				obj.scale.set(arr[i].size.x, arr[i].size.y / 5, arr[i].size.z / 5);
				obj.position.set( arr[i].pos.x, arr[i].pos.y, arr[i].pos.z );				
				obj.rotation.set( arr[i].rot.x, arr[i].rot.y, arr[i].rot.z );	
				obj.renderOrder = 2;
				
				pivot.add( obj );					
			}
		}
			
		
		createCone({ind: 'x'});
		createCone({ind: 'y'});
		createCone({ind: 'z'});
		
		// создаем конусы для Pivot
		function createCone({ind})
		{
			let arr = [];
			arr['x'] = {axis: 'x', pos: new THREE.Vector3(0.6,0,0), rot: new THREE.Vector3(0,0,-Math.PI/2), color: 0xff0000};
			arr['y'] = {axis: 'y', pos: new THREE.Vector3(0,0.6,0), rot: new THREE.Vector3(0,0,0), color: 0x00ff00};
			arr['z'] = {axis: 'z', pos: new THREE.Vector3(0,0,-0.6), rot: new THREE.Vector3(-Math.PI/2,0,0), color: 0x0000ff};			
			
			let material = new THREE.MeshStandardMaterial({ color : arr[ind].color, depthTest: false, transparent: true, lightMap: lightMap_1 });
			
			let obj = new THREE.Mesh( geomCone, material ); 
			obj.userData.tag = 'pivot';
			obj.userData.axis = arr[ind].axis;
			obj.renderOrder = 2;
			obj.position.copy(arr[ind].pos);
			obj.rotation.set(arr[ind].rot.x, arr[ind].rot.y, arr[ind].rot.z);
			pivot.add( obj );
			
			return obj;
		}
		
		//infProject.tools.pivot = pivot;
		pivot.visible = false;
		scene.add( pivot );


		return pivot;
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


	// создаем геометрию конуса
	crGeomCone()
	{
		let circle = crCircle();
		let vertices = crVertices();
		let geometry = crGeometry(vertices);
		
		function crCircle()
		{
			let count = 48;
			let circle = [];
			let g = (Math.PI * 2) / count;
			
			for ( let i = 0; i < count; i++ )
			{
				let angle = g * i;
				circle[i] = new THREE.Vector3();
				circle[i].x = Math.sin(angle);
				circle[i].z = Math.cos(angle);
				//circle[i].y = 0;
			}

			return circle;
		}		
		
		function crVertices()
		{
			let n = 0;
			let v = [];
			
			for ( let i = 0; i < circle.length; i++ )
			{
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.06 );
				v[n].y = 0;		
				n++;		
				
				v[n] = new THREE.Vector3();
				v[n].y = 0;
				n++;
				
				v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.003 );
				v[n].y = 0.25;
				n++;	
				
				v[n] = new THREE.Vector3();
				v[n].y = 0.25;
				n++;		
			}	
			
			return v;
		}

		function crGeometry( vertices )
		{
			var geometry = new THREE.Geometry();

			var faces = [];

			var n = 0;
			for ( var i = 0; i < vertices.length - 4; i += 4 )
			{
				faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
				faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

				faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
				faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

				faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

				faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
				faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
			}


			faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
			faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

			faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
			faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

			faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

			faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
			faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;


			geometry.vertices = vertices;
			geometry.faces = faces;
			geometry.computeFaceNormals();
			geometry.uvsNeedUpdate = true;

			return geometry;
		}
		
		return geometry;		
	}


	mousedown = ({event, rayhit}) => 
	{
		const obj = rayhit.object;  					
		const axis = obj.userData.axis;	
		
		const pivot = this.obj;
		//pivot.updateMatrixWorld();
		pivot.userData.startPos = rayhit.point.clone();
		pivot.userData.dir = null;				
			
		
		if(axis == 'xz' || axis == 'center')
		{ 
			planeMath.rotation.set( Math.PI/2, 0, 0 ); 
		}		 
		else
		{				
			pivot.userData.dir = new THREE.Vector3().subVectors(pivot.position, obj.getWorldPosition(new THREE.Vector3())).normalize();
			planeMath.quaternion.copy( quaternionDirection( pivot.userData.dir ) ); 
			planeMath.quaternion.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0)));
		}			
		
		planeMath.position.copy( rayhit.point );		
		
		this.render();
	}
	
	mousemove = (event) => 
	{
		const rayhit = rayIntersect( event, planeMath, 'one' ); 			
		if(rayhit.length === 0) return;
		
		const pivot = this.obj;
		let pos = rayhit[0].point;					
		
		if(pivot.userData.dir)
		{
			let dist = pivot.userData.dir.dot(new THREE.Vector3().subVectors(pos, pivot.userData.startPos));
			pos = pivot.userData.startPos.clone().add(new THREE.Vector3().addScaledVector(pivot.userData.dir, dist));				
		}		

		
		const offset = new THREE.Vector3().subVectors( pos, pivot.userData.startPos );
		
		pivot.userData.propPivot({type: 'offsetPivot', offset});			
		pivot.userData.propPivot({type: 'moveObjs', obj: myToolPG.obj, arrO: [], offset});
		
		myToolPG.setPosPivotGizmo({pos: pivot.position});	
		
		this.render();
	}

	mouseup = (e) => 
	{		
		this.render();
	}
			
	// ф-ция со всеми действиями Pivot
	propPivot = (params) =>
	{
		const pivot = this.obj;
		
		let type = params.type;			
		
		if(type == 'setPivot') { setPivot({obj: params.obj, arrO: params.arrO, pos: params.pos, qt: params.qt}); }
		if(type == 'moveObjs') { moveObjs({obj: params.obj, arrO: params.arrO, offset: params.offset}); }		
		if(type == 'offsetPivot') { offsetPivot({offset: params.offset}); }
		if(type == 'setPosPivot') { setPosPivot({pos: params.pos}); }
		if(type == 'setRotPivot') { setRotPivot({qt: params.qt}); }
		if(type == 'updateScale') { updateScale(); }
		if(type == 'hide') { hide(); }
		

		// установить и показать Pivot
		function setPivot(params)
		{
			let obj = params.obj;
			let arrO = params.arrO;
			let pos = params.pos;
			let qt = params.qt;
			
			pivot.visible = true;	
			pivot.position.copy(pos);
			pivot.quaternion.copy(qt);
			
			for ( let i = 0; i < pivot.children.length; i++ )
			{
				if(pivot.children[i].userData.axis == 'y') pivot.children[i].visible = (myCameraOrbit.activeCam.userData.isCam2D) ? false : true;
			}
			
			pivot.userData.propPivot({type: 'updateScale'});
		}


		
		function offsetPivot(params)
		{ 
			let offset = params.offset;
			pivot.position.add( offset );
			pivot.userData.startPos.add( offset );
			
			pivot.userData.propPivot({type: 'updateScale'});
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
		function setPosPivot(params)
		{
			if (!pivot.visible) return;
			
			let pos = params.pos;
			
			pivot.position.copy(pos);			
			pivot.userData.propPivot({type: 'updateScale'});
		}
		
		// установить rotation Pivot, когда меняем rot через input
		function setRotPivot(params)
		{
			if (!pivot.visible) return;
			
			const obj = myToolPG.obj;
			const qt = myToolPG.calcRot({obj});
			
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






