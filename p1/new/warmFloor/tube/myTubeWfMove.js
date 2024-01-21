

class MyTubeWfMove 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	sObj = null;		// выделенный объект (точка)
	
	
	mousedown = ({event, obj, rayPos = null}) =>
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
		
		myWarmFloor.myTubeWf.visiblePointsOnTube({tube: obj, visible: true});
		
		const pos = myWarmFloor.myTubeWf.getPosForPivot({tube: obj, rayPos});
		const visible = {tool: {p: true, r: false, s: false}, ui: {p: true, r: false, s: false}};
		//if(myCameraOrbit.activeCam.userData.isCam3D) visible.tool.p = true;
		myToolPG.activeTool({type: 'pivot', obj, pos, visible});

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

		this.moveTubeWf_2({obj, offset});
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		// после смещения трубы, возращаем в 0 и обновляем геометрию
		if(obj && isMove)
		{
			this.mouseupTubeWf_2({obj});			
		}
		
		this.clearPoint();
		
		if (!isDown) return;
		if (!isMove) return;
	}
	
	
	moveTubeWf_2({obj, offset})
	{
		const points = myWarmFloor.myTubeWf.getPointsInArrayTube({tube: obj});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].position.add( offset );
		}	
	}
	
	mouseupTubeWf_2({obj})
	{
		if(!obj) return;
		
		obj.position.set(0, 0, 0);
		myWarmFloor.myTubeWf.upTube({tube: obj});	
	}	
	
	
	clearPoint()
	{	
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	render()
	{
		renderCamera();
	}
}







