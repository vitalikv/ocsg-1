

class MyMouse
{
	scene;
	container;
	longClick = false;
	lastClickTime = 0;
	catchTime = 0.30;	
	
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
		clickO.buttonAct = null;
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
		
		let clickButton = '';
		
		if(event.changedTouches)
		{
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
			clickButton = 'left';
		}	

		switch ( event.button ) 
		{
			case 0: clickButton = 'left'; break;
			case 1: clickButton = 'right'; /*middle*/ break;
			case 2: clickButton = 'right'; break;
		}


		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;


		if (clickButton == 'right') { this.mouseDownRight( event ); return; } 


		if(clickO.move)
		{
			if(clickO.move.userData.tag == 'point') 
			{			
				if(clickO.move.userData.point.type) { clickCreateWall( clickO.move ); return; }  
			}
		}
		 
		clickO.obj = null; 	
		clickO.actMove = false;	
		clickO.selectBox.drag = false;
		clickO.rayhit = myManagerClick.getRayhit(event); 
		
		myManagerClick.click({type: 'down'});
		
		this.render();
	}
	

	onmousemove = (event) => 
	{ 
		//if(onfM.stop) return;
		
		if(event.changedTouches)
		{
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
		}
		
		if(selectionBoxMove(event)) { return; }		// selectionBox 
		
		if(clickO.elem) { moveElementBoxScale2D(event); }

		clickButton( event );
			

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

		renderCamera();
	}



	onmouseup = (event) => 
	{
		//if(onfM.stop) return;
		
		if(selectionBoxUp(event)) { return; }		// selectionBox	
		
		if(!this.longClick) 
		{ 
			myManagerClick.click({type: 'up'}); 
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
			else if(tag == 'obj') { clickMouseUpObject(obj); }
			else if(tag == 'pivot') { clickMouseUpPivot(); }
			else if(tag == 'gizmo') { clickMouseUpGizmo(); }
			else if ( tag == 'roof' ) { clRoof.moveRoof( event ); clRoof.clickUpRoof(obj); }
			
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
		
		if(clickO.move === null) setMouseStop(false);
		param_win.click = false;
		isMouseDown1 = false;
		clickO.elem = null;
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;	
		
		clickO.offset = new THREE.Vector3();
		
		this.render();
	}



	
	render()
	{
		renderCamera()
	}
}

