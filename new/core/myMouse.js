

class MyMouse
{
	scene;
	container;
	longClick = false;
	lastClickTime = 0;
	catchTime = 0.30;

	isMove = false;
	rayhit = null;
	selectedObj = null;
	
	constructor({container, scene})
	{
		this.container = container;
		this.scene = scene;
		
		this.initEvent();
	}
	
	initEvent()
	{
		this.container.addEventListener( 'contextmenu', (event) => { event.preventDefault() });
		this.container.addEventListener( 'mousedown', this.mousedown );
		this.container.addEventListener( 'mousemove', this.mousemove );
		this.container.addEventListener( 'mouseup', this.mouseup );

		this.container.addEventListener( 'touchstart', this.mousedown );
		this.container.addEventListener( 'touchmove', this.mousemove );
		this.container.addEventListener( 'touchend', this.mouseup );				
	}

	mouseDownRight()
	{		
		clickO.button = null; 
		
		const obj = this.selectedObj;
		
		if(obj)
		{			
			if(obj.userData.tag === 'point') 
			{ 
				myHouse.myMovePoint.clickRight({obj}); 
			}			
			else if(obj.userData.tag === 'free_dw') 
			{ 
				deleteWinDoor({wd: obj, upWall: false}); 
			}
			else if(obj.userData.tag === 'obj')
			{
				deleteObjectPop({obj: obj, undoRedo: false}); 
			}		

			clickO = resetPop.clickO();
		}	
		
		this.clearClick();
		this.setMouseStop(false);	
	}

	
	mousedown = (event) =>
	{
		//if(onfM.stop) return;

		if (window.location.hostname == 'ocsg-1'){} 
		else if (window.location.hostname == 'engineering-plan.ru'){}
		else if (window.location.hostname == 'engineering-plan-test'){} 
		else if (window.location.hostname == 'engineering-plan-new'){} 
		else if (window.location.hostname == 'room-3d'){} 
		else if (window.location.hostname == 'room-3d.ru'){} 	
		else { return; }
	 
		this.longClick = false;
		this.lastClickTime = new Date().getTime();

		if(selectionBoxDown(event)) { return; }		// selectionBox
		
		let btn = '';
		
		if(event.changedTouches)
		{
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
			btn = 'left';
		}	

		switch ( event.button ) 
		{
			case 0: btn = 'left'; break;
			case 1: btn = 'right'; /*middle*/ break;
			case 2: btn = 'right'; break;
		}


		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;
		
		
		if (btn === 'right') { this.mouseDownRight( event ); return; } 
		
		
		// к курсору приклеина toolPoint
		if(this.selectedObj && this.selectedObj.userData.tag === 'point' && myHouse.myMovePoint.isTypeToolPoint) 
		{ 			
			this.selectedObj = myHouse.myMovePoint.mousedown({event, obj: this.selectedObj, toolPoint: true, btn});
			
			if(!this.selectedObj)
			{
				this.clearClick();
				this.setMouseStop(false);				
			}
			
			return;
		}
		
		// к курсору приклеина free_dw (кликнули на стену или окно/дверь, когда к мышки привязана вставляемая дверь)
		if(this.selectedObj && this.selectedObj.userData.tag === 'free_dw')
		{
			if(this.selectedObj.userData.door.wall)
			{
				myHouse.myWD.addWD({ obj: this.selectedObj });
				
				this.clearClick();
				this.setMouseStop(false);				
			}
			
			return;
		}		
		
		
		
		
		this.isMove = false;
		 				
		clickO.selectBox.drag = false;
		this.rayhit = myManagerClick.getRayhit(event); 
		
		this.selectedObj = myManagerClick.click({event, type: 'down', rayhit: this.rayhit});
		this.selectedObj !== undefined ? this.setMouseStop(true) : this.setMouseStop(false);
		
		this.render();
	}
	

	mousemove = (event) => 
	{ 
		//if(onfM.stop) return;
		this.isMove = true;
		
		if(event.changedTouches)
		{
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
		}
		
		if(selectionBoxMove(event)) { return; }		// selectionBox 
		
		if(clickO.elem) { moveElementBoxScale2D(event); }

		this.clickButton( event );
			

		if (!this.longClick) { this.longClick = ( this.lastClickTime - new Date().getTime() < this.catchTime ) ? true : false; }

		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		
		const obj = this.selectedObj;
		
		if (obj) 
		{ 
			myManagerClick.mousemove(event, obj); 
		}		
		else if(isCam2D && clickO.selectBox.drag) 
		{		
			moveSelectionBox(event); 
		}
		
		activeHover2D( event );

		this.render();
	}



	mouseup = (event) => 
	{
		//if(onfM.stop) return;
		
		if(selectionBoxUp(event)) { return; }		// selectionBox	
		
		if(!this.longClick && !this.selectedObj) 
		{ 
			this.selectedObj = myManagerClick.click({event, type: 'up', rayhit: this.rayhit});
			this.selectedObj !== undefined ? this.setMouseStop(true) : this.setMouseStop(false);		
		}			
		
		
		if(clickO.elem)
		{
			clickUpElementBoxScale();
		}
		
		if(this.selectedObj)  
		{			
			myManagerClick.mouseup(event, this.selectedObj);
		}
		else if(clickO.selectBox.drag)
		{		
			upSelectionBox();
		}	
		
		
		//if(this.selectedObj === null) this.setMouseStop(false);
		
		clickO.elem = null;
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;			
		
		this.render();
	}

	// если кликнули на объект, то блокируем камеру
	setMouseStop(value) 
	{
		myCameraOrbit.stopMove = value;		
	}

	// нажали на кнопку интерфейса, загружаем объект	
	async clickButton( event )
	{
		if(!clickO.button) return;	
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			planeMath.position.set(0, 0, 0);
			planeMath.rotation.set(-Math.PI/2, 0, 0);
		}
		
		planeMath.updateMatrixWorld();

		const intersects = rayIntersect( event, planeMath, 'one' );		
		if(intersects.length === 0) return;	
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{ 
			let obj = null;
			
			if(clickO.button == 'create_wall')
			{
				clickO.last_obj = null;
				
				
				obj = myHouse.myPoint.createPoint( intersects[0].point, 0 );
				obj.position.y = 0;
				obj.userData.point.type = clickO.button; 				
				
				// кликнули в интерфейсе на создание стены
				myHouse.myMovePoint.mousedown({event, obj, toolPoint: true})
			}
			else if(clickO.button == 'create_wd_1')
			{
				obj = myHouse.myWD.createWD({type:'door', lotid: null});
			}		
			else if(clickO.button == 'create_wd_2')
			{
				obj = myHouse.myWD.createWD({type:'door', lotid: 10});
			}
			else if(clickO.button == 'add_wind')
			{
				obj = myHouse.myWD.createWD({type:'window', lotid: clickO.options});
			}
			else if(clickO.button == 'create_gate_1')
			{
				obj = myHouse.myWD.createWD({type:'door', lotid: -2});
			}			
			else if(clickO.button == 'add_roof')
			{
				obj = await loadObjServer({lotid: clickO.options, roof: true, cursor: true});
				obj.position.copy(intersects[0].point);
				myHouse.myRoofMove.mousedown({event, obj});
			}		
			else if(clickO.button == 'add_lotid')
			{
				obj = await loadObjServer({lotid: clickO.options, cursor: true});
				obj.position.copy(intersects[0].point); 
				myHouse.myObjMove.mousedown({event, obj});
			}

			if(obj) 
			{
				this.selectedObj = obj;
				this.setMouseStop(true);				
			}
		}
		else if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			let obj = null;
			
			if(clickO.button === 'add_lotid')
			{
				obj = await loadObjServer({lotid: clickO.options, cursor: true});
			}

			if(obj) 
			{
				this.selectedObj = obj;
				this.setMouseStop(true);				
			}			
		}
		
		
		clickO.button = null;
	}


	// очищаем клик/декативируем старое выделение (объект и меню)
	clearClick()
	{		
		myManagerClick.hideMenuObjUI_2D();

		this.selectedObj = null;
		this.rayhit = null;		
	}
	
	
	getSelectedObj()
	{
		return this.selectedObj;
	}
	
	render()
	{
		renderCamera()
	}
}

