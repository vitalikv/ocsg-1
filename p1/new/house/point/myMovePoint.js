

class MyMovePoint 
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	isTypeToolPoint = false;	// режим добавления точки из каталога
	sObj = null;		// выделенный объект (точка)
	
	constructor()
	{
		
	}
	
	clickRight({obj})
	{
		if(!this.isTypeToolPoint) return;
		
		obj = this.sObj;
		
		if(obj.w.length == 0){ deleteOnePoint(obj); }  
		else 
		{ 
			let point = null;
			if(obj.userData.point.type == 'continue_create_wall')
			{
				point = obj.p[0]; 
				deleteWall_3({wall: obj.w[0]}); 
				//upLabelPlan_1([point.w[0]]);					
			} 

			if(point && point.userData.point.last.cdm == 'new_point_1') { deletePoint( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
		}
		
		setStyleCursor('default');
		this.isTypeToolPoint = false;
		this.clearPoint();		
	}
	
	mousedown = ({event, obj, toolPoint, btn} = {event, obj: undefined, toolPoint: undefined, btn: undefined}) =>
	{
		this.isDown = false;
		this.isMove = false;		
		
		if(this.isTypeToolPoint) 
		{
			// определяем с чем точка пересеклась и дальнейшие действия
			obj = myHouse.myPointAction.clickCreateWall( obj );
			
			this.sObj = obj;
			
			if(!this.sObj) 
			{				
				this.isTypeToolPoint = false;
				this.clearPoint();
				return;
			}
		}
		
		if(toolPoint !== undefined) this.isTypeToolPoint = toolPoint;
		
		this.sObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		
		
		param_wall.wallR = detectChangeArrWall([], obj);

		// запоминаем последнее положение точки и дверей/окон
		if(1==1)
		{  
			obj.userData.point.last.pos = obj.position.clone(); 		
			
			for ( var i = 0; i < param_wall.wallR.length; i++ )
			{						
				for ( var i2 = 0; i2 < param_wall.wallR[i].userData.wall.arrO.length; i2++ )
				{
					var wd = param_wall.wallR[i].userData.wall.arrO[i2];
					 
					wd.userData.door.last.pos = wd.position.clone();
					wd.userData.door.last.rot = wd.rotation.clone(); 
				}
			}		 			
		}

		myComposerRenderer.outlineAddObj({arr: [obj]});
		myContentObj.activeObjRightPanelUI_1({obj: obj}); 	// UI

		this.isDown = true;

		return this.sObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		const isMove = this.isMove;
		this.isMove = true;
		
		const obj = this.sObj;
	
		if(obj.userData.point.type) 
		{ 
			if(obj.userData.point.type == 'continue_create_wall') {  } 
			else { dragToolPoint( event, obj ); return; } 
		}	
		
		if(!isMove) clickMovePoint_BSP(param_wall.wallR);	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		obj.position.add( offset );				
		dragToolPoint( event, obj );	// направляющие
				
		 
		for ( let i = 0; i < obj.w.length; i++ )
		{			
			updateWall(obj.w[i]);	
		}		
	
		upLineYY(obj);			
		
		
		// отображение длины стен
		let arrW = [];
		for ( let i = 0; i < obj.p.length; i++ )
		{
			arrW.push(...obj.p[i].w);		
		}		
		arrW = [...new Set(arrW)];
		upLabelPlan_1(arrW);
	}
	
	mouseup = ({event}) =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();
		
		if (!isDown) return;
		if (!isMove) return;
		
		obj.userData.point.last.pos = obj.position.clone();
		
		upLineYY(obj);			
		
		upLabelPlan_1(param_wall.wallR);

		// определяем с чем точка пересеклась и дальнейшие действия
		if(!obj.userData.point.type) myHouse.myPointAction.clickCreateWall(obj);
	}
	
	clearPoint()
	{
		if(this.isTypeToolPoint) return;
		
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;		
	}
}







