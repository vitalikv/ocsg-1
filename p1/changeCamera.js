

    


// переключение камеры
function changeCamera()
{  
	changeDepthColor();		


	if(myCameraOrbit.activeCam.userData.isCam2D)
	{	
		myHouse.myGhostLevel.createLevel();	// показываем призрачный этаж
		
		blockActiveObj({visible_1: false, visible_2: false});

		showAllWallRender();	// показываем стены, которые были спрятаны
		
		myHouse.myRoofCSG.resetWall();
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{	
		myHouse.myGhostLevel.deleteLevel();	// прячем призрачный этаж
		
		blockActiveObj({visible_1: true, visible_2: true});			
		
		// прячем стены
		getInfoRenderWall();
		if(myPanelR.myLevelVisible.wallTransparent && myCameraOrbit.cam3D.userData.type === 'fly') wallAfterRender_2();	
		else showAllWallRender();
		
		myHouse.myRoofCSG.cgs();
	}
	
	myHouse.myRoofInit.changeMaterialTransparent();
	
	infProject.tools.axis[0].visible = false;
	infProject.tools.axis[1].visible = false;	

	clickO = resetPop.clickO();
	
	myLevels.changeVisibleLevels();
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		myCameraOrbit.cam2D.updateMatrixWorld();
		upPosLabels_1({resize: true});		
	}
}






// меняем уровень отрисовки объектов 
function changeDepthColor()
{
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
		var visible_2 = true;
		var visible_3 = false;
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
		var visible_3 = true;
	}
	else { return; } 
	
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	
	
	
	
	var label = [];
	for ( var i = 0; i < wall.length; i++ )
	{
		if(!wall[i].userData.wall.html.label) continue;
		
		for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
		{
			label[label.length] = wall[i].userData.wall.html.label[i2];  
		}
	}		

	if(infProject.settings.floor.label.visible)
	{
		for ( var i = 0; i < floor.length; i++ )
		{ 
			if(visible)
			{
				if(floor[i].userData.room.zone.id !== undefined)
				{
					label[label.length] = floor[i].userData.room.html.label; 
				}
			}
			else
			{
				label[label.length] = floor[i].userData.room.html.label;
			}			 
		}		
	}
	
	if(visible) { showElementHtml(label); }
	else 
	{ 
		hideElementHtml(label); 
		hideElementHtml(infProject.html.furn.size);
		hideElementHtml(infProject.html.furn.offset);		
	}

	//hideElementSvg(infProject.svg.arr);
	
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}		

	var svg = [];
	
	for ( var i = 0; i < door.length; i++ )
	{  
		if(door[i].userData.door.svg.el) { svg[svg.length] = door[i].userData.door.svg.el; }		
		if(door[i].userData.door.svg.path) { svg[svg.length] = door[i].userData.door.svg.path; }
		if(door[i].userData.door.svg.arc) { svg[svg.length] = door[i].userData.door.svg.arc; }
		
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible_3;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		if(window[i].userData.door.svg.el) { svg[svg.length] = window[i].userData.door.svg.el; }
		if(window[i].userData.door.svg.path) { svg[svg.length] = window[i].userData.door.svg.path; }
		
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible_3;		
	}
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		showElementSvg(svg);
	}
	else if(myCameraOrbit.activeCam.userData.isCam3D)
	{
		hideElementSvg(svg);
	}	
	
	showHideArrObj(window, visible_2);
	showHideArrObj(door, visible_2);
	
}


// скрываем/показываем объекты
function showHideArrObj(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].material.visible = visible; }				
}











// блокируем/разблокируем объекты
function blockActiveObj(cdm)
{
	var visible_1 = cdm.visible_1;
	var visible_2 = cdm.visible_2;
	
	//infProject.scene.block.click.wall = visible_1;
	//infProject.scene.block.hover.wall = visible_1;

	infProject.scene.block.click.point = visible_1;
	infProject.scene.block.hover.point = visible_1;

	//infProject.scene.block.click.window = visible_1;
	//infProject.scene.block.hover.window = visible_1;

	//infProject.scene.block.click.door = visible_1;
	//infProject.scene.block.hover.door = visible_1;

	infProject.scene.block.click.room = visible_1;
	infProject.scene.block.hover.room = visible_1;

	infProject.scene.block.click.controll_wd = visible_1;
	infProject.scene.block.hover.controll_wd = visible_1;	
}





