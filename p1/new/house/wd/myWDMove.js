

class MyWDMove 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	sObj = null;		// выделенный объект (точка)
	
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
		this.offset = intersects[0].point;		
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			findOnWallWD(obj);			
			showRulerWD( obj ); 	// показываем линейки 							
		}

		myComposerRenderer.outlineAddObj({arr: [obj]});
		tabObject.activeObjRightPanelUI_1({obj: obj}); 	// UI

		this.isDown = true;		
	}
	
	mousemove = (event) =>
	{
		if (myCameraOrbit.activeCam.userData.isCam3D) { return; }
		if (!this.isDown) return;
		this.isMove = true;
		
		const wd = this.sObj;	
		const wall = wd.userData.door.wall;
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;

		let pos = wd.position.clone().add(offset);			
		pos = wall.worldToLocal( pos.clone() );
		
		const x_min = wd.geometry.boundingBox.min.x;
		const x_max = wd.geometry.boundingBox.max.x;
		const y_min = wd.geometry.boundingBox.min.y;
		const y_max = wd.geometry.boundingBox.max.y;
		
		const bound = wd.userData.door.bound;
		
		if(pos.x + x_min < bound.min.x){ pos.x = bound.min.x - x_min; }
		else if(pos.x + x_max > bound.max.x){ pos.x = bound.max.x - x_max; }	
		
		// ограничение по высоте при перемещении wd
		if(!myCameraOrbit.activeCam.userData.isCam2D)
		{
			if(pos.y + y_min < bound.min.y){ pos.y = bound.min.y - y_min; }
			else if(pos.y + y_max > bound.max.y){ pos.y = bound.max.y - y_max; }
		}	
		
		if(myCameraOrbit.activeCam.userData.isCam2D){ pos.z = 0; }	
		
		pos = wall.localToWorld( pos.clone() );
		
		const pos2 = new THREE.Vector3().subVectors( pos, wd.position );
		
		wd.position.copy( pos );	

		wd.userData.door.h1 += pos2.y;
		
		myHouse.myWDPoints.setOffset(pos2);	// меняем расположение контроллеров	
		
		showRulerWD_2D(wd); 	// перемещаем линейки и лайблы
		
		calcSvgFormWD({obj: wd});		
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clear();
		
		if (!isDown) return;
		if (!isMove) return;
		
		const wd = obj;
		const wall = wd.userData.door.wall;
		const wallClone = new THREE.Mesh();
		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wall.position ); 
		wallClone.rotation.copy( wall.rotation );		
		const objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };				
		MeshBSP( wd, objsBSP );	

		calcSvgFormWD({obj});
	}
	
	
			
	clear()
	{
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;		
	}
}






