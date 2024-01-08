

class MyTubeWfMove 
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
		//myContentObj.activeObjRightPanelUI_1({obj: obj}); 	// UI
		
		myWarmFloor.myTubeWf.visiblePointsOnTube({tube: obj, visible: true});

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

		const points = myWarmFloor.myTubeWf.getPointsInArrayTube({tube: obj});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].position.add( offset );
		}
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		// после смещения трубы, возращаем в 0 и обновляем геометрию
		if(obj)
		{
			obj.position.set(0, 0, 0);
			myWarmFloor.myTubeWf.upTube({tube: obj});			
		}
		
		this.clearPoint();
		
		if (!isDown) return;
		if (!isMove) return;
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







