

class MyManagerClick
{

	
	// определяем на какой объект кликнули
	getRayhit(event)
	{ 
		let rayhit = null;	
					
		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;
				
		if(myToolPG.pivot.visible)
		{
			var ray = rayIntersect( event, myToolPG.pivot.children, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
		}
		
		if(myToolPG.gizmo.visible)
		{
			var arr = [];
			for ( var i = 0; i < myToolPG.gizmo.children.length; i++ )
			{ 
				if(myToolPG.gizmo.children[i].visible) arr.push(myToolPG.gizmo.children[i]); 
			}
			
			var ray = rayIntersect( event, arr, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
		}
		
		if(myToolPG.scale.visible)
		{
			var ray = rayIntersect( event, myToolPG.scale.children, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
		}


		rayhit = myWarmFloor.clickRayhit({event});		
		if(rayhit) return rayhit;
		

		if(isCam2D && !rayhit)
		{
			if(!infProject.scene.block.click.controll_wd)
			{
				var ray = rayIntersect( event, [myHouse.myWDPoints.points[0], myHouse.myWDPoints.points[1]], 'arr' );
				if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
			}
			
			if(!rayhit)
			{
				var arr = [];
				var objs = [...infProject.scene.array.door, ...infProject.scene.array.window];
				
				for ( var i = 0; i < objs.length; i++ )
				{ 
					if(!objs[i].visible) continue;
					arr.push(objs[i]); 
				}	
				
				var ray = rayIntersect( event, arr, 'arr' );
				if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
			}
			
			if(!infProject.scene.block.click.point)
			{
				var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
				if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
			}

			if(!infProject.scene.block.click.wall)
			{
				var arr = [];
				for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
				{ 
					if(!infProject.scene.array.wall[i].userData.wall.show) continue;
					arr[arr.length] = infProject.scene.array.wall[i]; 
				}		
				
				var ray = rayIntersect( event, arr, 'arr' );
				if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
			}

			
			if(!infProject.scene.block.click.obj)
			{
				var ray = rayIntersect( event, infProject.scene.array.obj, 'arr', true );
				
				if(ray.length > 0)
				{   	
					rayhit = null;
					
					for (var i = 0; i < ray.length; i++)
					{
						if(ray[i].object.userData.obj3D) continue;
						
						rayhit = ray[i]; console.log(i, rayhit );
						break;
					}
					
					var object = null; 
					
					if(rayhit) { object = getParentObj({obj: rayhit.object}); }
					
					if(!object) { rayhit = null; }
					else { rayhit.object = object; }
				}			
			}

			if(!rayhit && myCameraOrbit.activeCam.userData.isCam2D)
			{
				rayhit = myHouse.myRoofAction.getRayIntersect();		
			}
			
			if(!rayhit)
			{
				var ray = rayIntersect( event, infProject.scene.array.floor, 'arr' );
				if(ray.length > 0) { rayhit = ray[0]; }			
			}	
			
		}
		
		if(isCam3D && !rayhit)
		{
			var ray = rayIntersect( event, infProject.scene.array.obj, 'arr', true );
			
			let rayhitObj = null;
			
			if(ray.length > 0)
			{   						
				for (var i = 0; i < ray.length; i++)
				{
					if(ray[i].object.userData.obj3D) continue;
					
					rayhitObj = ray[i];
					break;
				}
				
				let object = null; 
				
				if(rayhitObj) { object = getParentObj({obj: rayhitObj.object}); }
				
				if(object) { rayhitObj.object = object; }
			}			
			
			let rayhitRoof = myHouse.myRoofAction.getRayIntersect();
			
			let arr = [];
			let objs = [...infProject.scene.array.door, ...infProject.scene.array.window];
			
			for ( var i = 0; i < objs.length; i++ )
			{ 
				if(!objs[i].visible) continue;
				arr.push(objs[i]); 
			}

			for ( var i = 0; i < infProject.scene.array.wall.length; i++ )
			{ 
				if(!infProject.scene.array.wall[i].userData.wall.show) continue;
				arr.push(infProject.scene.array.wall[i]); 
			}

			arr.push(...infProject.scene.array.floor);
			
			
			
			var ray = rayIntersect( event, arr, 'arr' );			
			if(ray.length > 0) { rayhit = ray[0]; }	

			if(rayhitObj)
			{
				if(!rayhit) rayhit = rayhitObj;
				else if(rayhitObj.distance < rayhit.distance) rayhit = rayhitObj;
			}

			if(rayhitRoof)
			{
				if(!rayhit) rayhit = rayhitRoof;
				else if(rayhitRoof.distance < rayhit.distance) rayhit = rayhitRoof;
			}			
		}
		
		return rayhit;
	}


	click({event, type, rayhit})
	{ 		
		this.hideMenuObjUI_2D({type});		
		if(!rayhit) return;

		let obj = rayhit.object;				
		
		const tag = obj.userData.tag;
		let flag = true;
		
		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;
		
		if(type === 'down')
		{  
			if(tag == 'pivot') { myToolPG.mousedown({event, rayhit});  }
			else if(tag == 'gizmo') { myToolPG.mousedown({event, rayhit}); }
			else if(tag == 'scale') { myToolPG.mousedown({event, rayhit}); }
			else if(tag == 'wall' && isCam2D) { myHouse.myWallMove.mousedown({event, obj}); }
			else if(tag == 'room' && isCam2D) { clickFloor({obj}); }
			else if(tag == 'point') { myHouse.myMovePoint.mousedown({event, obj}); }
			else if(tag == 'window' && isCam2D) { myHouse.myWDMove.mousedown({event, obj}); }
			else if(tag == 'door' && isCam2D) { myHouse.myWDMove.mousedown({event, obj}); }
			else if(tag == 'controll_wd') { myHouse.myWDPointsMove.mousedown({event, obj}); }						
			else if(tag == 'roof' && isCam2D) { myHouse.myRoofMove.click({event, obj}); }				
			else if(tag == 'obj' && isCam2D) { myHouse.myObjMove.click({event, obj}); }
			else if(tag == 'pointWf' && isCam2D) { myWarmFloor.myPointWfMove.mousedown({event, obj}); }
			else if(tag == 'tubeWf' && isCam2D) { myWarmFloor.myTubeWfMove.mousedown({event, obj, rayPos: rayhit.point}); }
			else if(tag == 'objWf' && isCam2D) { myWarmFloor.myObjWfMove.mousedown({event, obj}); }
			else { flag = false; }
		}
		else if(type === 'up')
		{	
			if(tag == 'wall' && isCam3D) { myHouse.myWallMove.click3D({obj, rayhit}); }
			else if(tag == 'room' && isCam3D) { clickFloor({obj}); }
			else if(tag == 'window' && isCam3D) { myHouse.myWDMove.mousedown({event, obj}); }
			else if(tag == 'door' && isCam3D) { myHouse.myWDMove.mousedown({event, obj}); }
			else if(tag == 'roof' && isCam3D) { myHouse.myRoofMove.click({event, obj}); }
			else if(tag == 'obj' && isCam3D) { myHouse.myObjMove.click({event, obj}); }
			else if(tag == 'pointWf' && isCam3D) { myWarmFloor.myPointWfMove.mousedown({event, obj}); }
			else if(tag == 'tubeWf' && isCam3D) { myWarmFloor.myTubeWfMove.mousedown({event, obj, rayPos: rayhit.point}); }
			else if(tag == 'objWf' && isCam3D) { myWarmFloor.myObjWfMove.mousedown({event, obj}); }
			else { flag = false; }
		}	

		
		if(flag) 
		{			
			clickO.move = obj;
			//clickO.last_obj = obj;
			
			this.consoleInfo( obj );
		}
		
		return flag ? obj : undefined;
	}


	mousemove = (event, obj) =>
	{
		const tag = obj.userData.tag;
			
		if(tag == 'pivot') { myToolPG.mousemove(event); }
		else if(tag == 'gizmo') { myToolPG.mousemove(event); }
		else if(tag == 'scale') { myToolPG.mousemove(event); }
		else if(tag == 'wall') { myHouse.myWallMove.mousemove(event); }
		else if(tag == 'window') { myHouse.myWDMove.mousemove(event); }
		else if(tag == 'door') { myHouse.myWDMove.mousemove(event); }
		else if(tag == 'controll_wd') { myHouse.myWDPointsMove.mousemove(event); }
		else if(tag == 'point') { myHouse.myMovePoint.mousemove( event ); }
		else if(tag == 'room') {  }		
		else if(tag == 'free_dw') { dragWD_2( event, obj ); }
		else if(tag == 'roof') { myHouse.myRoofMove.mousemove(event); }
		else if(tag == 'obj') { myHouse.myObjMove.mousemove(event); }
		else if(tag == 'pointWf') { myWarmFloor.myPointWfMove.mousemove(event); }
		else if(tag == 'tubeWf') { myWarmFloor.myTubeWfMove.mousemove(event); }
		else if(tag == 'objWf') { myWarmFloor.myObjWfMove.mousemove(event); }
	}


	mouseup = (event, obj) =>
	{
		var tag = obj.userData.tag;
		
		if(tag == 'point') { myHouse.myMovePoint.mouseup({event, obj}); }
		else if(tag == 'wall') { myHouse.myWallMove.mouseup(); }
		else if(tag == 'window' || obj.userData.tag == 'door') { myHouse.myWDMove.mouseup(); }	
		else if(tag == 'controll_wd') { myHouse.myWDPointsMove.mouseup(); } 		
		else if(tag == 'pivot') { myToolPG.mouseup(); }
		else if(tag == 'gizmo') { myToolPG.mouseup(); }
		else if(tag == 'scale') { myToolPG.mouseup(); }
		else if(tag == 'roof') { myHouse.myRoofMove.mouseup(); }
		else if(tag == 'obj') { myHouse.myObjMove.mouseup(); }
		else if(tag == 'pointWf') { myWarmFloor.myPointWfMove.mouseup(); }
		else if(tag == 'tubeWf') { myWarmFloor.myTubeWfMove.mouseup(); }
		else if(tag == 'objWf') { myWarmFloor.myObjWfMove.mouseup(); }
	}

	
	// деактивируем выбранный объект
	hideMenuObjUI_2D({type} = {type: ''})
	{
		const obj = myComposerRenderer.getOutlineObj();
		
		if(objDeActiveColor_2D_selectBox(obj)) { return; }
						
		let flag = true;
		
		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;

		if(obj)
		{ 
			const tag = obj.userData.tag;
			
			if(type === 'down')
			{
				if(tag == 'wall' && isCam2D) { getCalcWall({wall: obj}); this.hideMenuUI(); }
				else if(tag == 'point' && isCam2D) { this.hideMenuUI(); }
				else if(tag == 'window' && isCam2D) { hideSizeWD(obj); this.hideMenuUI(); }
				else if(tag == 'door' && isCam2D) { hideSizeWD(obj); this.hideMenuUI(); }
				else if(tag == 'controll_wd') { hideSizeWD(obj); this.hideMenuUI(); }				
				else if(tag == 'roof' && isCam2D) 
				{ 
					let hide = true;
					const rayObj = myMouse.getRayhitObj();
					if(rayObj && (rayObj.userData.tag === 'pivot' || rayObj.userData.tag === 'gizmo' || rayObj.userData.tag === 'scale')) hide = false;
					
					if(hide)
					{
						myToolPG.hide(); 
						this.hideMenuUI();
					}					 
				}
				else if(tag == 'obj' && isCam2D) 
				{ 
					let hide = true;
					const rayObj = myMouse.getRayhitObj();
					if(rayObj && (rayObj.userData.tag === 'pivot' || rayObj.userData.tag === 'gizmo' || rayObj.userData.tag === 'scale')) hide = false;
					
					if(hide)
					{
						myToolPG.hide(); 
						this.hideMenuUI();
					}					 
				}
				else if(tag == 'pointWf' && isCam2D) { this.hideMenuUI({obj}); }
				else if(tag == 'tubeWf' && isCam2D) { this.hideMenuUI({obj}); }
				else if(tag == 'objWf' && isCam2D) { this.hideMenuUI({obj}); }
				else { flag = false; }
			}
			else if(type === 'up')
			{
				if(tag == 'wall' && isCam3D) { this.hideMenuUI();  }
				else if(tag == 'room' && isCam2D) { this.hideMenuUI(); }
				else if(tag == 'room' && isCam3D) { this.hideMenuUI(); }
				else if(tag == 'window' && isCam3D) { hideSizeWD(); this.hideMenuUI(); }
				else if(tag == 'door' && isCam3D) { hideSizeWD(); this.hideMenuUI(); }
				else if(tag == 'roof' && isCam3D) { myToolPG.hide(); this.hideMenuUI(); }
				else if(tag == 'obj' && isCam3D) { myToolPG.hide(); this.hideMenuUI(); }
				else if(tag == 'pointWf' && isCam3D) { this.hideMenuUI({obj}); }
				else if(tag == 'tubeWf' && isCam3D) { this.hideMenuUI({obj}); }
				else if(tag == 'objWf' && isCam3D) { this.hideMenuUI({obj}); }
				else { flag = false; }
			}
			else
			{
				if(tag == 'wall') { getCalcWall({wall: obj}); this.hideMenuUI(); }
				else if(tag == 'point') { this.hideMenuUI(); }
				else if(tag == 'window') { hideSizeWD(); this.hideMenuUI(); }
				else if(tag == 'door') { hideSizeWD(); this.hideMenuUI(); }
				else if(tag == 'controll_wd') { hideSizeWD(); this.hideMenuUI(); }
				else if(tag == 'room') { this.hideMenuUI(); }
				else if(tag == 'obj') { myToolPG.hide(); this.hideMenuUI(); }
				else if(tag == 'roof') { myToolPG.hide(); this.hideMenuUI(); }
				else if(tag == 'pointWf') { this.hideMenuUI({obj}); }
				else if(tag == 'tubeWf') { this.hideMenuUI({obj}); }
				else if(tag == 'objWf') { this.hideMenuUI({obj}); }
				else { flag = false; }
			}
		}
		
		if(flag) 
		{		
			//clickO.last_obj = null;
			
		}
	}

	hideMenuUI({obj}={}) 
	{
		console.log('hideMenuUI');
		
		if(obj)
		{
			const tag = obj.userData.tag;
			
			if(tag)
			{
				if(tag == 'pointWf') 
				{  
					const tube = myWarmFloor.myPointWf.getTubeFromPoint({point: obj});
					if(tube) myWarmFloor.myTubeWf.visiblePointsOnTube({tube, visible: false});
					myToolPG.hide();
				}
				else if(tag == 'tubeWf') 
				{ 
					myWarmFloor.myTubeWf.visiblePointsOnTube({tube: obj, visible: false});
					myToolPG.hide();
				}
				else if(tag == 'objWf') 
				{ 
					myToolPG.hide(); 
				}				
			}
		}

		myPanelR.myContentObj.activeObjRightPanelUI_1();
		myComposerRenderer.outlineRemoveObj();
	}

	
	render()
	{
		//renderCamera()
	}
	
	
	// по клику получаем инфу об объекте
	consoleInfo( obj )
	{	
		if(!obj) return;
		if(!obj.userData.tag) return;
		
		const tag = obj.userData.tag;
		console.log(obj.userData.tag);
		if ( tag == 'room' ) 
		{
			let txt = '';
			
			for ( let i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
			
			console.log( "room id : " + obj.userData.id + " | point : " + txt, " | userData : ", obj.userData, obj );
		}
		else if( tag == 'wall' )
		{ 
			console.log(obj);
			console.log( "wall id : " + obj.userData.id + " | point : " + obj.userData.wall.p[0].userData.id + " | " + obj.userData.wall.p[1].userData.id + " | userData : ", obj.userData ); 
		}
		else if( tag == 'point' )
		{ 
			console.log( "point id : " + obj.userData.id + " | userData : ", obj.userData, obj ); 
		}
		else if( tag == 'window' || tag == 'door' )
		{ 
			let txt = {};		
			console.log( tag + " id : " + obj.userData.id + " | lotid : " + obj.userData.door.lotid + " | " + " type : " + obj.userData.door.type, txt, " | userData : ", obj.userData, obj ); 
		}
		else if ( tag == 'controll_wd' ) 
		{
			console.log( "controll_wd number : " + obj.userData.controll_wd.id, obj );
		}
		else if ( tag == 'obj' ) 
		{
			console.log( "obj : " + obj.userData.id + " | lotid : " + obj.lotid  + " | userData : ", obj.userData, obj );
		}		
		else 
		{
			console.log( "pr_id : " + obj.userData.id + " | lotid : " + obj.lotid + " | caption : " + obj.caption, obj );
		}	
	}
	
}

