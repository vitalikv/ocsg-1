

class MyRoofMove 
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
			//findOnWallWD(obj);			
			//showRulerWD( obj ); 	// показываем линейки 							
		}

		myComposerRenderer.outlineAddObj({arr: [obj]});
		tabObject.activeObjRightPanelUI_1({obj: obj}); 	// UI
		
		myToolPG.activeTool({obj});

		this.isDown = true;		
	}
	
	mousemove = (event) =>
	{
		if (myCameraOrbit.activeCam.userData.isCam3D) { return; }
		if (!this.isDown) return;
		this.isMove = true;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;

		this.sObj.position.add(offset);			
		
		myToolPG.activeTool({obj: this.sObj});
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clear();
		
		if (!isDown) return;
		if (!isMove) return;

	}
	
	
			
	clear()
	{
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;		
	}
}






