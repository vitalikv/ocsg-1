

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
			else if(obj.userData.tag == 'point') 
			{ 	
				if(obj.w.length == 0){ deleteOnePoint(obj); }  
				else 
				{ 
					if(obj.userData.point.type == 'continue_create_wall')
					{
						var point = obj.p[0]; 
						deleteWall_3({wall: obj.w[0]}); 
						//upLabelPlan_1([point.w[0]]);					
					}
					
					if(point.userData.point.last.cdm == 'new_point_1') { deletePoint( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
				}
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


		if (btn === 'right') { this.mouseDownRight( event ); return; } 


		if(clickO.move && clickO.move.userData.tag === 'point' && clickO.move.userData.point.type)
		{
			clickCreateWall( clickO.move ); return;
		}
		
		this.isMove = false;
		 				
		clickO.selectBox.drag = false;
		this.rayhit = myManagerClick.getRayhit(event); 
		
		const obj = myManagerClick.click({type: 'down', rayhit: this.rayhit});		
		if(obj) 
		{
			this.selectedObj = obj;
			this.setMouseStop(true);
		}
		
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
		
		if ( obj ) 
		{
			var tag = obj.userData.tag;
				
			if ( tag == 'pivot' ) { movePivot( event ); }
			else if ( tag == 'gizmo' ) { moveGizmo( event ); }
			else if ( tag == 'wall' ) { moveWall( event, obj ); }
			else if ( tag == 'window' ) { moveWD( event, obj ); }
			else if ( tag == 'door' ) { moveWD( event, obj ); }
			else if ( tag == 'controll_wd' ) { moveToggleChangeWin( event, obj ); }
			else if ( tag == 'point' ) { movePoint( event, obj ); }
			else if ( tag == 'room' ) {  }		
			else if ( tag == 'free_dw' ) { dragWD_2( event, obj ); }
			else if ( tag == 'obj' ) { moveObjectPop( event ); }
			else if ( tag == 'obj_spot' ) { moveObjectPop( event ); }
			else if ( tag == 'roof' ) { clRoof.moveRoof( event ); }
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
			const obj = myManagerClick.click({type: 'up', rayhit: this.rayhit});		
			if(obj) 
			{
				this.selectedObj = obj;
				this.setMouseStop(true);
			}		
		}	
		
		var obj = clickO.move;		
		
		
		if(clickO.elem)
		{
			clickUpElementBoxScale();
		}
		
		if(obj)  
		{
			var tag = obj.userData.tag;
			
			if(tag == 'point') 
			{  		
				var point = clickO.move;
				clickPointMouseUp(point); 
				if(!clickO.move.userData.point.type) { clickCreateWall(clickO.move); }						
			}
			else if(tag == 'wall') { clickWallMouseUp(obj); }
			else if(tag == 'window' || obj.userData.tag == 'door') { clickWDMouseUp(obj); }	
			else if(tag == 'controll_wd') { clickMouseUpToggleWD(obj); } 
			else if(tag == 'obj' && this.isMove) { clickMouseUpObject(obj); }
			else if(tag == 'pivot' && this.isMove) { clickMouseUpPivot(); }
			else if(tag == 'gizmo' && this.isMove) { clickMouseUpGizmo(); }
			else if ( tag == 'roof' && this.isMove) { clRoof.moveRoof( event ); clRoof.clickUpRoof(obj); }
			
			if(tag == 'free_dw') {  }
			else if (tag == 'point') 
			{
				if(obj.userData.point.type) {  } 
				else { clickO.move = null; }
			}		
			else { clickO.move = null; }
		}
		else if(clickO.selectBox.drag)
		{		
			upSelectionBox();
		}	
		
		if(clickO.move === null) this.setMouseStop(false);
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
				this.selectedObj = null;
				
				const point = createPoint( intersects[0].point, 0 );
				point.position.y = 0;
				point.userData.point.type = clickO.button; 
				clickO.move = point;				
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

