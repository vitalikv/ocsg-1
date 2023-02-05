
function initArrLevel()
{
	let count = 4;
	let level = [];
	
	for ( var i = 0; i < count; i++ )
	{
		level[i] = {};
		level[i].wall = [];
		level[i].point = [];
		level[i].window = [];
		level[i].door = [];		
		level[i].floor = [];
		level[i].ceiling = [];
		level[i].obj = [];
		level[i].roof = [];
		level[i].height = 2.8;		
	}
	
	return level;
}


// создаем собитие по клику на кнопки этажей
function initElBtnLevel()
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	
	let btn1 = elBlock.querySelector('[nameId="btn_level_1"]');
	let btn2 = elBlock.querySelector('[nameId="btn_level_2"]');
	let btn3 = elBlock.querySelector('[nameId="btn_level_3"]');
	let btn4 = elBlock.querySelector('[nameId="btn_level_4"]');
	
	btn1.onmousedown = () => { switchLevel(0); }
	btn2.onmousedown = () => { switchLevel(1); }
	btn3.onmousedown = () => { switchLevel(2); }
	btn4.onmousedown = () => { switchLevel(3); }
	
	startSetLevel_UI();
	
	// input высоты этажа
	let input1 = elBlock.querySelector('[nameId="rp_level_1_h2"]');
	let input2 = elBlock.querySelector('[nameId="rp_level_2_h2"]');
	let input3 = elBlock.querySelector('[nameId="rp_level_3_h2"]');
	let input4 = elBlock.querySelector('[nameId="rp_level_4_h2"]');	
	
	input1.onkeyup = (event) => changeHeightWallLevel(event, 0);
	input2.onkeyup = (event) => changeHeightWallLevel(event, 1);
	input3.onkeyup = (event) => changeHeightWallLevel(event, 2);
	input4.onkeyup = (event) => changeHeightWallLevel(event, 3);
	
	let checkBox1 = elBlock.querySelector('[nameId="type_cam_vis_1"]');
	let checkBox2 = elBlock.querySelector('[nameId="type_cam_vis_2"]');
	
	checkBox1.onmousedown = () => { changeCheckBoxLevelVis({elem: checkBox1, type: 'allLevel'}); }
	checkBox2.onmousedown = () => { changeCheckBoxLevelVis({elem: checkBox2, type: 'wallTransparent'}); }	
}


function showHideDivTypeCam()
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	let div = elBlock.querySelector('[nameId="div_type_cam_vis"]');
	
	if(camera === cameraTop) div.style.display = 'none';
	if(camera === camera3D) div.style.display = '';
}

function changeCheckBoxLevelVis({elem, type})
{
	elem.children[0].style.background = (elem.children[0].style.background === 'none') ? 'rgb(213, 213, 213)' : 'none';
	
	let visible = (elem.children[0].style.background === 'none') ? false : true;
	
	if(type === 'allLevel')
	{
		infProject.jsonProject.showAllLevel = visible;
		
		changeVisibleLevels();		
	}
	
	if(type === 'wallTransparent')
	{
		infProject.jsonProject.wallTransparent = visible;
		
		if(camera === camera3D)
		{
			getInfoRenderWall();
			if(infProject.jsonProject.wallTransparent && camera3D.userData.camera.type === 'fly') wallAfterRender_2();
			else showAllWallRender();						
		}
	}	
}

function levelBackground_UI({id})
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	
	let el1 = elBlock.querySelector('[nameId="div_level_1"]');
	let el2 = elBlock.querySelector('[nameId="div_level_2"]');
	let el3 = elBlock.querySelector('[nameId="div_level_3"]');
	let el4 = elBlock.querySelector('[nameId="div_level_4"]');	
	
	let arr = [el1, el2, el3, el4];
	
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].style.background = 'none';
		if(i === id) arr[i].style.background = '#d5d5d5';
	}
}

function startSetLevel_UI()
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	let input1 = elBlock.querySelector('[nameId="rp_level_1_h2"]');
	let input2 = elBlock.querySelector('[nameId="rp_level_2_h2"]');
	let input3 = elBlock.querySelector('[nameId="rp_level_3_h2"]');
	let input4 = elBlock.querySelector('[nameId="rp_level_4_h2"]');		
	
	let level = infProject.jsonProject.level;	
	input1.value = level[0].height;
	input2.value = level[1].height;
	input3.value = level[2].height;
	input4.value = level[3].height;	
}


function saveArrLevel(id)
{
	console.log(id, infProject.jsonProject.level[id]); 
	//infProject.jsonProject.level[id] = {};
	infProject.jsonProject.level[id].wall = infProject.scene.array.wall;
	infProject.jsonProject.level[id].point = infProject.scene.array.point;
	infProject.jsonProject.level[id].window = infProject.scene.array.window;
	infProject.jsonProject.level[id].door = infProject.scene.array.door;	
	infProject.jsonProject.level[id].floor = infProject.scene.array.floor;
	infProject.jsonProject.level[id].ceiling = infProject.scene.array.ceiling;
	infProject.jsonProject.level[id].obj = infProject.scene.array.obj;
	infProject.jsonProject.level[id].roof = infProject.scene.array.roof;
	infProject.jsonProject.level[id].height = infProject.settings.height;
	
	
 	changeDepthColor222();
	obj_point = [];
	room = [];
	ceiling = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];	
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.roof = [];
	
	infProject.scene.array = resetPop.infProjectMySceneArray();

	infProject.jsonProject.actLevel = id;	
}

// меняем высоту этажа и сдвигаем все остальные этажы
function changeHeightWallLevel(event, id)
{
	if (event.keyCode !== 13) return;
	
	let level = infProject.jsonProject.level;
	
	let value = checkNumberInput({ value: event.target.value, unit: 1, limit: {min: 0.1, max: 5} });

	if(!value) 
	{
		event.target.value = Math.round(level[id].height * 100) / 100;
		return;
	}	
	
	let posY = level[id].height - value.num;
	 
	
	level[id].height = value.num;
	event.target.value = value.num;
	
	if(infProject.jsonProject.actLevel === id) infProject.settings.height = value.num;
	
	// меняем высоту текщего этажа и поднимаем потолок и крышу
	if(1===1)
	{
		clickMovePoint_BSP( level[id].wall );
		
		for ( var i = 0; i < level[id].wall.length; i++ )
		{
			var v = level[id].wall[i].geometry.vertices;
			
			v[1].y = value.num;
			v[3].y = value.num;
			v[5].y = value.num;
			v[7].y = value.num;
			v[9].y = value.num;
			v[11].y = value.num;
			level[id].wall[i].geometry.verticesNeedUpdate = true;
			level[id].wall[i].geometry.elementsNeedUpdate = true;
			
			level[id].wall[i].userData.wall.height_1 = value.num;
		}
		
		upLabelPlan_1( level[id].wall );
		clickPointUP_BSP( level[id].wall );

		let floor = level[id].floor;
		let ceiling = level[id].ceiling;
		let roof = level[id].roof;
		
		for ( let i = 0; i < floor.length; i++ ) ceiling[i].position.set( 0, floor[i].position.y + value.num, 0 );
		for ( let i = 0; i < roof.length; i++ ) roof[i].position.set( 0, roof[i].position.y + value.num, 0 );
	}
	
	if(infProject.jsonProject.actLevel > id)
	{
		for ( let i = 0; i < infProject.jsonProject.level.length; i++ )
		{
			if(i > id) continue;					
			changePosYLevel(-posY, i);
		}		
	}
	else
	{
		for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
		{
			if(i <= id) continue;			
			changePosYLevel(posY, i);
		}				
	}
	
	renderCamera();
}


// делаем выбранный этаж основным
function startLevel(id)
{
	obj_point = infProject.jsonProject.level[id].point;
	room = infProject.jsonProject.level[id].floor;
	ceiling = infProject.jsonProject.level[id].ceiling;

	infProject.scene.array.wall = infProject.jsonProject.level[id].wall;
	infProject.scene.array.point = infProject.jsonProject.level[id].point;
	infProject.scene.array.window = infProject.jsonProject.level[id].window;
	infProject.scene.array.door = infProject.jsonProject.level[id].door;	
	infProject.scene.array.floor = infProject.jsonProject.level[id].floor;
	infProject.scene.array.ceiling = infProject.jsonProject.level[id].ceiling;
	infProject.scene.array.obj = infProject.jsonProject.level[id].obj;
	infProject.scene.array.roof = infProject.jsonProject.level[id].roof;
	infProject.settings.height = infProject.jsonProject.level[id].height;

	getInfoRenderWall();
	if(camera === cameraTop) 
	{
		showAllWallRender();
	}
	else 
	{
		if(infProject.jsonProject.wallTransparent && camera3D.userData.camera.type === 'fly') wallAfterRender_2();
		else showAllWallRender();
	}
	
	if(camera === cameraTop) upPosLabels_1({resize: true});
	
	infProject.jsonProject.actLevel = id;

	levelBackground_UI({id});
}

// переключения одного этажа на другой
function switchLevel(id)
{	
	if(infProject.jsonProject.actLevel === id) return;
	
	outlineRemoveObj();
	deActiveSelected();
	
	let posY = getLevelPos0({lastId: infProject.jsonProject.actLevel, newId: id});
	
	deactiveLevel();
	
	startLevel(id);
	
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		changePosYLevel(posY, i);
	}
	
	changeDepthColor();	
	
	changeVisibleLevels();
	
	if(camera === cameraTop) 
	{
		ghostLevel.createLevel();	// показываем призрачный этаж
		visibleLevelCam2D(id, true);
	}
	else 
	{
		visibleLevelCam3D(id, true);
	}		
}

// меняем видимость неактивных этажей
function changeVisibleLevels()
{
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{		
		if(camera === camera3D && infProject.jsonProject.actLevel !== i) 
		{
			let visible = infProject.jsonProject.showAllLevel;
			visibleLevelCam3D(i, visible);
		}
		if(camera === cameraTop && infProject.jsonProject.actLevel !== i) 
		{
			visibleLevelCam2D(i, false);
		}		
	}
	if(camera === cameraTop) upPosLabels_1({resize: true});	// поправляем размеры и svg
}


// получаем значение, на который нужно сдвинуть этажи, чтобы текущий этаж был на нулевом уровне
function getLevelPos0({lastId, newId})
{
	let sumY1 = 0;
	let sumY2 = 0;
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		if(i === lastId) break;
		sumY1 += infProject.jsonProject.level[i].height;		
	}
	
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		if(i === newId) break;
		sumY2 += infProject.jsonProject.level[i].height;		
	}
	
	let posY = sumY2 - sumY1;

	return posY;
}


// меняем высоту этажей, самый первый ставим на 0
function changePosYLevel(posY, id)
{
	let arrW = infProject.jsonProject.level[id].wall;
	let obj_point = infProject.jsonProject.level[id].point;
	let room = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	let obj3D = infProject.jsonProject.level[id].obj;
	let roof = infProject.jsonProject.level[id].roof;
		
	for ( var i = 0; i < arrW.length; i++ )
	{		
		arrW[i].position.y = arrW[i].position.y - posY;
		
		for ( var i2 = 0; i2 < arrW[i].userData.wall.arrO.length; i2++ )
		{
			arrW[i].userData.wall.arrO[i2].position.y = arrW[i].userData.wall.arrO[i2].position.y - posY;
		}
	}
	if(id === 0) infProject.scene.grid.position.y = infProject.scene.grid.position.y - posY;
	for ( var i = 0; i < obj_point.length; i++ ) obj_point[i].position.y = obj_point[i].position.y - posY;	
	for ( var i = 0; i < room.length; i++ ) room[i].position.y = room[i].position.y - posY;
	for ( var i = 0; i < ceiling.length; i++ ) ceiling[i].position.y = ceiling[i].position.y - posY;
	for ( var i = 0; i < obj3D.length; i++ ) obj3D[i].position.y = obj3D[i].position.y - posY;
	for ( var i = 0; i < roof.length; i++ ) roof[i].position.y = roof[i].position.y - posY;
}


function visibleLevelCam2D(id, visible)
{
	var point = infProject.jsonProject.level[id].point;
	var wall = infProject.jsonProject.level[id].wall;
	var window = infProject.jsonProject.level[id].window;
	var door = infProject.jsonProject.level[id].door;	
	let room = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	let obj3D = infProject.jsonProject.level[id].obj;
	let roof = infProject.jsonProject.level[id].roof;
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = visible; 
	}
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		wall[i].visible = visible; 
	}		
	
	for ( var i = 0; i < door.length; i++ )
	{  
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible;		
	}
	
	
	showHideArrObj(window, visible);
	showHideArrObj(door, visible);

		
	for ( var i = 0; i < room.length; i++ ) room[i].visible = visible;
	for ( var i = 0; i < ceiling.length; i++ ) ceiling[i].visible = visible;
	for ( var i = 0; i < obj3D.length; i++ ) obj3D[i].visible = visible;
	for ( var i = 0; i < roof.length; i++ ) roof[i].visible = visible;
}

function visibleLevelCam3D(id, visible)
{
	var point = infProject.jsonProject.level[id].point;
	var wall = infProject.jsonProject.level[id].wall;
	var window = infProject.jsonProject.level[id].window;
	var door = infProject.jsonProject.level[id].door;	
	let room = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	let obj3D = infProject.jsonProject.level[id].obj;
	let roof = infProject.jsonProject.level[id].roof;
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		point[i].visible = false; 
	}
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		wall[i].visible = visible; 
	}		
	
	for ( var i = 0; i < door.length; i++ )
	{  
		if(!door[i].userData.door.obj3D) continue;
		door[i].userData.door.obj3D.visible = visible;		
	}	

	for ( var i = 0; i < window.length; i++ )
	{ 
		if(!window[i].userData.door.obj3D) continue;
		window[i].userData.door.obj3D.visible = visible;		
	}
	
	
	showHideArrObj(window, false);
	showHideArrObj(door, false);

		
	for ( var i = 0; i < room.length; i++ ) room[i].visible = visible;
	for ( var i = 0; i < ceiling.length; i++ ) ceiling[i].visible = visible;
	for ( var i = 0; i < obj3D.length; i++ ) obj3D[i].visible = visible;
	for ( var i = 0; i < roof.length; i++ ) roof[i].visible = visible;
}




// деактивируем уровень и сохраняем план в массиве для этого этажа
function deactiveLevel()
{
	let id = infProject.jsonProject.actLevel;

	getInfoRenderWall();
	showAllWallRender();
	changeDepthColor222();
	
	//infProject.jsonProject.level[id] = {};
	infProject.jsonProject.level[id].wall = infProject.scene.array.wall;
	infProject.jsonProject.level[id].point = infProject.scene.array.point;
	infProject.jsonProject.level[id].window = infProject.scene.array.window;
	infProject.jsonProject.level[id].door = infProject.scene.array.door;	
	infProject.jsonProject.level[id].floor = infProject.scene.array.floor;
	infProject.jsonProject.level[id].ceiling = infProject.scene.array.ceiling;
	infProject.jsonProject.level[id].obj = infProject.scene.array.obj;
	infProject.jsonProject.level[id].roof = infProject.scene.array.roof;
 	infProject.jsonProject.level[id].height = infProject.settings.height;
	
	obj_point = [];
	room = [];
	ceiling = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];	
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.roof = [];
	
	infProject.scene.array = resetPop.infProjectMySceneArray();
}

// удалем все этажи
function clearAllLevels()
{
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		clearOneLevel(i);
	}	
}

// удаляем один этаж
function clearOneLevel(id)
{
	deActiveSelected();
	
	let wall = infProject.jsonProject.level[id].wall;
	let point = infProject.jsonProject.level[id].point;
	let window = infProject.jsonProject.level[id].window;
	let door = infProject.jsonProject.level[id].door;	
	let floor = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	let obj = infProject.jsonProject.level[id].obj;
	let roof = infProject.jsonProject.level[id].roof;
	
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		if(wall[i].userData.wall.html.label)
		{
			for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
			{
				deleteValueFromArrya({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
				wall[i].userData.wall.html.label[i2].remove();
			}
		}					
		
		wall[i].userData.wall.p = [];
		
		disposeHierchy({obj: wall[i]});
		scene.remove(wall[i]); 
	}
	
	for ( var i = 0; i < point.length; i++ )
	{ 
		disposeHierchy({obj: point[i]});
		scene.remove(point[i]); 
	}	
	
	for ( var i = 0; i < window.length; i++ )
	{ 
		deleteSvgWD({obj: window[i]});	
		disposeHierchy({obj: window[i]});   
		scene.remove(window[i]); 
	}
	
	for ( var i = 0; i < door.length; i++ )
	{ 
		deleteSvgWD({obj: door[i]});
		disposeHierchy({obj: door[i]}); 
		scene.remove(door[i]); 
	}	
	
	
	for ( var i = 0; i < floor.length; i++ )
	{		
		disposeHierchy({obj: floor[i]});
		disposeHierchy({obj: ceiling[i]});
		
		deleteValueFromArrya({arr: infProject.html.label, o: floor[i].userData.room.html.label});
		floor[i].userData.room.html.label.remove(); 
		
		scene.remove(floor[i]); 
		scene.remove(ceiling[i]);	
	}
	
	for ( var i = 0; i < obj.length; i++ )
	{ 
		disposeHierchy({obj: obj[i]});
		scene.remove(obj[i]);
	}

	for ( var i = 0; i < roof.length; i++ )
	{ 
		disposeHierchy({obj: roof[i]});
		scene.remove(roof[i]);
	}
	
	infProject.jsonProject.level[id].wall = [];
	infProject.jsonProject.level[id].point = [];
	infProject.jsonProject.level[id].window = [];
	infProject.jsonProject.level[id].door = [];	
	infProject.jsonProject.level[id].floor = [];
	infProject.jsonProject.level[id].ceiling = [];
	infProject.jsonProject.level[id].obj = [];
	infProject.jsonProject.level[id].roof = [];
 	//infProject.jsonProject.level[id].height = 2.8;	
}



