

class MyGridWfMove 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	isTypeToolPoint = false;	// режим добавления точки из каталога
	sObj = null;		// выделенный объект (точка)
	
	
	clickRight({obj})
	{
		if(!this.isTypeToolPoint) return;
		
		myWarmFloor.deleteObj({obj});		
		
		this.isTypeToolPoint = false;
		this.clearPoint();

		this.render();
	}
	
	mousedown = ({event, obj, toolPoint = false}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		// при первом создании Tool, это игнорируется
		if(this.isTypeToolPoint) 
		{
			// определяем с чем точка пересеклась и дальнейшие действия
			obj = myWarmFloor.myPointWf.crPoint({pos: obj.position.clone(), lastPoint: obj});
			
			this.sObj = obj;
			
			if(!this.sObj) 
			{				
				this.isTypeToolPoint = false;
				this.clearPoint();
				return null;
			}
		}
		
		this.isTypeToolPoint = toolPoint;
		
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
		
		this.moveGridPointsWf({obj, offset});
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;

		// после смещения трубы, возращаем в 0 и обновляем геометрию
		if(obj && isMove)
		{
			this.mouseupEndGridWf({obj});			
		}
		
		this.clearPoint();
		
		if (!isDown) return;
		if (!isMove) return;
	}
	
	// перемещаем точки стеки
	moveGridPointsWf({obj, offset})
	{
		const points = myWarmFloor.myGridWf.getPoints({obj});
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].position.add( offset );
		}	
	}


	mouseupEndGridWf({obj})
	{
		if(!obj) return;
		
		obj.position.set(0, 0, 0);
		myWarmFloor.myGridWf.upGeometryGrid({obj});

		myWarmFloor.myGridWf.myGridLinesWf.upGeometryGridLines({grid: obj});
		myWarmFloor.myGridWf.myGridWfCSG.upGeometryLines({grid: obj});
	}	
	
	clearPoint()
	{
		if(this.isTypeToolPoint) return;
		
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	render()
	{
		renderCamera();
	}
}







