

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
		this.container.addEventListener( 'mousedown', this.onmousedown );
		this.container.addEventListener( 'mousemove', this.onmousemove );
		this.container.addEventListener( 'mouseup', this.onmouseup );

		this.container.addEventListener( 'touchstart', this.onmousedown );
		this.container.addEventListener( 'touchmove', this.onmousemove );
		this.container.addEventListener( 'touchend', this.onmouseup );				
	}

	mouseDownRight()
	{		
		clickO.button = null; 
		
		var obj = clickO.move;
		
		if(obj)
		{
			if(obj.userData.tag == 'free_dw') 
			{ 
				deleteWinDoor({wd: obj, upWall: false}); 
			}
			else if(obj.userData.tag == 'obj')
			{
				deleteObjectPop({obj: obj, undoRedo: false}); 
			}		

			clickO = resetPop.clickO();
		}	
		
		clickO.move = null;	
	}

	
	onmousedown = (event) =>
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
		

		if(myHouse.myMovePoint.isTypeToolPoint) 
		{
			// к курсору приклеина toolPoint
			myHouse.myMovePoint.onmousedown({event, toolPoint: true, btn})
			return;
		}
		
		if (btn === 'right') { this.mouseDownRight( event ); return; } 
		
		this.isMove = false;
		 				
		clickO.selectBox.drag = false;
		this.rayhit = myManagerClick.getRayhit(event); 
		
		this.selectedObj = myManagerClick.click({event, type: 'down', rayhit: this.rayhit});
		this.selectedObj !== undefined ? this.setMouseStop(true) : this.setMouseStop(false);
		
		this.render();
	}
	

	onmousemove = (event) => 
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
		
		var obj = clickO.move;
		
		if (obj) 
		{ 
			myManagerClick.onmousemove(event, obj); 
		}		
		else if(isCam2D && clickO.selectBox.drag) 
		{		
			moveSelectionBox(event); 
		}
		
		activeHover2D( event );

		this.render();
	}



	onmouseup = (event) => 
	{
		//if(onfM.stop) return;
		
		if(selectionBoxUp(event)) { return; }		// selectionBox	
		
		if(!this.longClick) 
		{ 
			this.selectedObj = myManagerClick.click({type: 'up', rayhit: this.rayhit});
			this.selectedObj !== undefined ? this.setMouseStop(true) : this.setMouseStop(false);		
		}	
		
		var obj = clickO.move;		
		
		
		if(clickO.elem)
		{
			clickUpElementBoxScale();
		}
		
		if(this.selectedObj)  
		{
			myManagerClick.onmouseup(event, this.selectedObj);
		}
		else if(clickO.selectBox.drag)
		{		
			upSelectionBox();
		}	
		
		
		//if(this.selectedObj === null) this.setMouseStop(false);
		param_win.click = false;
		
		clickO.elem = null;
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;	
		
		clickO.offset = new THREE.Vector3();
		
		this.render();
	}

	// если кликнули на объект, то блокируем камеру
	setMouseStop(value) 
	{
		myCameraOrbit.stopMove = value;
	}

	// нажали на кнопку интерфейса, загружаем объект	
	clickButton( event )
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
			if(clickO.button == 'create_wall')
			{
				clickO.last_obj = null;
				
				
				const point = myHouse.myPoint.createPoint( intersects[0].point, 0 );
				point.position.y = 0;
				point.userData.point.type = clickO.button; 
				clickO.move = point;
				this.selectedObj = point;
				
				// кликнули в интерфейсе на создание стены
				myHouse.myMovePoint.onmousedown({event, obj: point, toolPoint: true})
			}
			else if(clickO.button == 'create_wd_1')
			{
				createEmptyFormWD_1({type:'door', lotid: null});
			}		
			else if(clickO.button == 'create_wd_2')
			{
				createEmptyFormWD_1({type:'door', lotid: 10});
			}
			else if(clickO.button == 'add_wind')
			{
				createEmptyFormWD_1({type:'window', lotid: clickO.options});
			}
			else if(clickO.button == 'create_gate_1')
			{
				createEmptyFormWD_1({type:'door', lotid: -2});
			}			
			else if(clickO.button == 'add_roof')
			{
				loadObjServer({lotid: clickO.options, roof: true, cursor: true});
			}		
			else if(clickO.button == 'add_lotid')
			{
				loadObjServer({lotid: clickO.options, cursor: true});
			}		
		}
		else if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			if(clickO.button == 'add_lotid')
			{
				loadObjServer({lotid: clickO.options, cursor: true});
			}		
		}
		
		
		clickO.button = null;
	}


	// очищаем клик/декативируем старое выделение (объект и меню)
	clearClick()
	{		
		myManagerClick.hideMenuObjUI_2D({obj: this.selectedObj});

		this.selectedObj = null;
		this.rayhit = null;		
	}
	
	
	render()
	{
		renderCamera()
	}
}

