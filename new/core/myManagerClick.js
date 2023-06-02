

class MyManagerClick
{

	
	// определяем на какой объект кликнули
	getRayhit(event)
	{ 
		var rayhit = null;	
					
		
		if(infProject.tools.pivot.visible)
		{
			var ray = rayIntersect( event, infProject.tools.pivot.children, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
		}
		
		if(infProject.tools.gizmo.visible)
		{
			var arr = [];
			for ( var i = 0; i < infProject.tools.gizmo.children.length; i++ ){ arr[i] = infProject.tools.gizmo.children[i]; }
			
			var ray = rayIntersect( event, arr, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; return rayhit; }		
		}

		if(!rayhit && myCameraOrbit.activeCam.userData.isCam3D)
		{
			rayhit = clRoof.getRayIntersect();		
		}	

		if(!infProject.scene.block.click.controll_wd)
		{
			var ray = rayIntersect( event, [infProject.tools.controllWD[0], infProject.tools.controllWD[1]], 'arr' );
			if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
		}
		
		if(!infProject.scene.block.click.door)
		{
			var ray = rayIntersect( event, infProject.scene.array.door, 'arr' );
			if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
		}
		
		if(!infProject.scene.block.click.window)
		{
			var ray = rayIntersect( event, infProject.scene.array.window, 'arr' );
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
			rayhit = clRoof.getRayIntersect();		
		}
		
		if(!rayhit)
		{
			var ray = rayIntersect( event, infProject.scene.array.floor, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; }			
		}	
		
		
		return rayhit;
	}


	click(cdm)
	{ 
		if(!clickO.rayhit) { this.hideMenuObjUI_2D(cdm); return; }

		var obj = clickO.obj = clickO.rayhit.object;
		this.hideMenuObjUI_2D(cdm);
		
		
		var tag = obj.userData.tag;
		var rayhit = clickO.rayhit;
		var flag = true;
		
		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;
		
		if(cdm.type == 'down')
		{  
			if(clickToolWD(clickO.move)) { flag = false; }
			else if( tag == 'pivot' ) { clickPivot( rayhit ); }
			else if( tag == 'gizmo' ) { clickGizmo( rayhit ); } 
			else if( tag == 'wall' && isCam2D ) { clickWall_2D( rayhit ); }
			else if( tag == 'point' ) { clickPoint( rayhit ); }
			else if( tag == 'window' && isCam2D ) { clickWD( rayhit ); }
			else if( tag == 'door' && isCam2D ) { clickWD( rayhit ); }
			else if( tag == 'controll_wd' ) { clickToggleChangeWin( rayhit ); }
			else if( tag == 'obj' && isCam2D ) { clickObject3D({obj: obj, rayhit: rayhit}); }
			else if( tag == 'obj' && isCam3D && infProject.tools.pivot.userData.pivot.obj == obj) { clickObject3D({obj: obj, rayhit: rayhit}); }
			else if( tag == 'roof' && isCam2D ) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }
			else if( tag == 'roof' && isCam3D && infProject.tools.pivot.userData.pivot.obj == obj) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }		
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{	
			if( tag == 'wall' && isCam3D ) { clickWall_3D({obj: obj, rayhit: rayhit}); }
			else if( tag == 'obj' && isCam3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { clickObject3D({obj: obj, rayhit: rayhit}); }
			else if( tag == 'room' && isCam3D ) { clickFloor({obj: obj}); }
			else if( tag == 'room' && isCam3D ) { clickFloor({obj: obj}); }
			else if( tag == 'roof' && isCam3D && infProject.tools.pivot.userData.pivot.obj !== obj ) { clRoof.clickRoof({obj: obj, rayhit: rayhit}); }
			else if( tag == 'window' && isCam3D) { clickWD( rayhit ); }
			else if( tag == 'door' && isCam3D) { clickWD( rayhit ); }		
			else { flag = false; }
		}	

		
		if(flag) 
		{			
			this.objActiveColor_2D(obj);		

			if(tag == 'pivot') { obj = infProject.tools.pivot.userData.pivot.obj; }
			else if(tag == 'gizmo') { obj = infProject.tools.gizmo.userData.gizmo.obj; }		
			
			clickO.last_obj = obj;
			
			this.consoleInfo( obj );
		}
		
		return flag;
	}

	// выделяем/активируем объект
	// кликнули на объект (выделение) (cameraTop)
	objActiveColor_2D(obj)
	{ 
		if(!myCameraOrbit.activeCam.userData.isCam2D) return;
		if(!obj) { return; }   
		if(clickO.last_obj == obj) { return; }
				
		const tag = obj.userData.tag;
		
		if(tag === 'point'){ myComposerRenderer.outlineAddObj({arr: [obj]}); }	 
		else if(tag === 'wall'){ myComposerRenderer.outlineAddObj({arr: [obj]}); } 	
	}

	
	// деактивируем выбранный объект
	hideMenuObjUI_2D(cdm)
	{
		if(objDeActiveColor_2D_selectBox(clickO.obj)) { return; }
		
		var obj = clickO.last_obj;
		if(!cdm) { cdm = {type: ''}; }
		
		var flag = true;
		
		const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
		const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;

		if(obj)
		{ 
			objDeActiveColor_2D(); 
			console.log(obj.userData.tag);

			var tag = obj.userData.tag;
			
			if(cdm.type == 'down')
			{
				if(tag == 'wall' && isCam2D) { this.hideMenuUI(obj); }
				else if(tag == 'point' && isCam2D) { this.hideMenuUI(obj); }
				else if(tag == 'window' && isCam2D) { hideSizeWD(obj); this.hideMenuUI(obj); }
				else if(tag == 'door' && isCam2D) { hideSizeWD(obj); this.hideMenuUI(obj); }
				else if(tag == 'obj' && isCam2D) { hidePivotGizmo(obj); }
				else if(tag == 'roof' && isCam2D) { hidePivotGizmo(obj); }
				else { flag = false; }
			}
			else if(cdm.type == 'up')
			{
				if(tag == 'wall' && isCam3D) { this.hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
				else if(tag == 'room' && isCam2D) { this.hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
				else if(tag == 'room' && isCam3D) { this.hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
				else if(tag == 'obj' && isCam3D) { hidePivotGizmo(obj); }
				else if(tag == 'roof' && isCam3D) { hidePivotGizmo(obj); }
				else if(tag == 'window' && isCam3D) { hidePivotGizmo(obj); }
				else if(tag == 'door' && isCam3D) { hidePivotGizmo(obj); }
				else { flag = false; }
			}
			else
			{
				if(tag == 'wall') { this.hideMenuUI(obj); }
				else if(tag == 'point') { this.hideMenuUI(obj); }
				else if(tag == 'window') { hideSizeWD(obj); this.hideMenuUI(obj); }
				else if(tag == 'door') { hideSizeWD(obj); this.hideMenuUI(obj); }
				else if(tag == 'room') { this.hideMenuUI(obj); }
				else if(tag == 'obj') { hidePivotGizmo(obj); }
				else if(tag == 'roof') { hidePivotGizmo(obj); }
				else { flag = false; }
			}
		}
		
		if(flag) 
		{		
			clickO.last_obj = null;
		}
	}

	hideMenuUI(obj) 
	{
		if(!obj) return;  console.log('hideMenuUI', obj);
		if(!obj.userData) return;
		if(!obj.userData.tag) return;
		
		const tag = obj.userData.tag;
		
		if(tag == 'wall') { tabObject.activeObjRightPanelUI_1(); }
		else if(tag == 'point') { tabObject.activeObjRightPanelUI_1(); }
		else if(tag == 'window') { tabObject.activeObjRightPanelUI_1(); }
		else if(tag == 'door') { tabObject.activeObjRightPanelUI_1(); }
		else if(tag == 'room') { tabObject.activeObjRightPanelUI_1(); }
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
			console.log( "wall id : " + obj.userData.id + " index : " + clickO.index + " | point : " + obj.userData.wall.p[0].userData.id + " | " + obj.userData.wall.p[1].userData.id + " | userData : ", obj.userData ); 
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

