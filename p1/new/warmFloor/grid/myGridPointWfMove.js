

class MyGridPointWfMove 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	sObj = null;		// выделенный объект (точка)
	
	

	
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

		myComposerRenderer.outlineAddObj({arr: [obj]});
		myPanelR.myContentObj.activeObjRightPanelUI_1({obj}); 	// UI
		
		const visible = {tool: {p: true, r: false, s: false}, ui: {p: true, r: false, s: false}};
		//if(myCameraOrbit.activeCam.userData.isCam3D) visible.tool.p = true;
		myToolPG.activeTool({type: 'pivot', obj, visible});
		
		//const tube = myWarmFloor.myPointWf.getTubeFromPoint({point: obj});
		//if(tube) myWarmFloor.myTubeWf.visiblePointsOnTube({tube, visible: true});		

		this.isDown = true;

		return this.sObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		const isMove = this.isMove;
		this.isMove = true;
		
		const obj = this.sObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		obj.position.add( offset );	

		this.changeGeometryGridWf({obj});
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.mouseupEndGridWf({obj});
		
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	// обновляем форму сетки
	changeGeometryGridWf({obj})
	{
		const grid = myWarmFloor.myGridPointWf.getGrid({obj});
		myWarmFloor.myGridWf.upGeometryGrid({obj: grid});
		
		myWarmFloor.myGridWf.myGridLinesWf.upGeometryGridLines({grid});
	}
	
	mouseupEndGridWf({obj})
	{
		if(!obj) return;
		
		const grid = myWarmFloor.myGridPointWf.getGrid({obj});
		myWarmFloor.myGridWf.myGridWfCSG.upGeometryLines({grid});
		
		this.render();
	}	
	

	
	render()
	{
		renderCamera();
	}
}







