

class MyWallMove 
{
	isDown = false;
	isMove = false;
	startPos = new THREE.Vector3();
	idSide = 0;	
	sObj = null;		// выделенный объект (стена)
	
	constructor()
	{
		
	}
	

	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;		
		
		this.sObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.startPos = intersects[0].point;	

		//--------------
	
		
		param_wall.wallR = detectChangeArrWall_2(obj);

		var p = obj.userData.wall.p;
		
		for ( var i = 0; i < p[0].w.length; i++ )
		{  
			var dir = new THREE.Vector3().subVectors( p[0].position, p[0].p[i].position ).normalize();	
			param_wall.qt_1[i] = quaternionDirection(dir);
		}
		
		for ( var i = 0; i < p[1].w.length; i++ )
		{ 
			var dir = new THREE.Vector3().subVectors( p[1].position, p[1].p[i].position ).normalize();
			param_wall.qt_2[i] = quaternionDirection(dir);
		}
		
		param_wall.arrZone = compileArrPickZone(obj);

		clickO.click.wall = [...new Set([...p[0].w, ...p[1].w])]; 

		//--------------

		myComposerRenderer.outlineAddObj({arr: [obj]});
		myContentObj.activeObjRightPanelUI_1({obj: obj}); 	// UI

		this.isDown = true;		
	}
	
	mousemove = (event) =>
	{
		if (myCameraOrbit.activeCam.userData.isCam3D) { return; }		
		if (!this.isDown) return;
		

		if (!this.isMove) 
		{
			clickMovePoint_BSP(param_wall.wallR);
			this.isMove = true;
		}
		
		const obj = this.sObj;		

		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;			

		// перемещение стены вдоль своей оси
		var x1 = obj.userData.wall.p[1].position.z - obj.userData.wall.p[0].position.z;
		var z1 = obj.userData.wall.p[0].position.x - obj.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		
		let dist = dir.dot(new THREE.Vector3().subVectors(intersects[0].point, this.startPos));
		let pos = this.startPos.clone().add(new THREE.Vector3().addScaledVector(dir, dist));
		
		let offset = new THREE.Vector3().subVectors( pos, this.startPos );
		this.startPos.add( offset );
		
				
		//let pos2 = new THREE.Vector3().subVectors( pos, obj.position );					
		//pos2 = new THREE.Vector3().subVectors ( changeWallLimit(obj.userData.wall.p[0], pos2, param_wall.qt_1, dir), obj.userData.wall.p[0].position ); 
		//pos2 = new THREE.Vector3().subVectors ( changeWallLimit(obj.userData.wall.p[1], pos2, param_wall.qt_2, dir), obj.userData.wall.p[1].position );
		//pos2 = new THREE.Vector3(pos2.x, 0, pos2.z);
						
		obj.userData.wall.p[0].position.add( offset );
		obj.userData.wall.p[1].position.add( offset );		
		
		
		for ( var i = 0; i < clickO.click.wall.length; i++ )
		{ 
			updateWall(clickO.click.wall[i]);		
		}
		
		upLineYY(obj.userData.wall.p[0]);
		upLineYY(obj.userData.wall.p[1]);
		
		upLabelPlan_1(obj.userData.wall.p[0].w);
		upLabelPlan_1(obj.userData.wall.p[1].w);		
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clear();
		
		if (!isDown) return;
		if (!isMove) return;
		
		upLineYY( obj.userData.wall.p[ 0 ] );
		upLineYY( obj.userData.wall.p[ 1 ] );
		upLabelPlan_1( param_wall.wallR ); 
		updateShapeFloor( param_wall.arrZone ); 		
		
		clickPointUP_BSP(param_wall.wallR);
	}
	
	clear()
	{		
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;		
	}


	// кликнули на стену в 3D режиме
	click3D({obj, rayhit})
	{
		var intersect = rayhit;

		if(!intersect) return;
		if(!intersect.face) return;
		var index = intersect.face.materialIndex;	
		
		if(index == 1 || index == 2) { } 
		else { return; }
		
		clickO.index = index;
		this.idSide = index;

		myComposerRenderer.outlineAddObj({arr: [obj]});
		myContentObj.activeObjRightPanelUI_1({obj: obj, side: index});
	}


}







