
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
		level[i].obj = [];
		level[i].floor = [];
		level[i].ceiling = [];
		level[i].height = 2.8;		
	}
	
	return level;
}


// создаем собитие по клику на кнопки этажей
function initElBtnLevel()
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	
	let btn1 = document.querySelector('[nameId="btn_level_1"]');
	let btn2 = document.querySelector('[nameId="btn_level_2"]');
	let btn3 = document.querySelector('[nameId="btn_level_3"]');
	let btn4 = document.querySelector('[nameId="btn_level_4"]');
	
	btn1.onmousedown = () => { console.log(1); switchLevel(0); }
	btn2.onmousedown = () => { console.log(2); switchLevel(1); }
	btn3.onmousedown = () => { console.log(3); switchLevel(2); }
	btn4.onmousedown = () => { console.log(4); switchLevel(3); }
}


// делаем выбранный этаж основным
function startLevel(id)
{
	obj_point = infProject.jsonProject.level[id].point;
	room = infProject.jsonProject.level[id].floor;
	ceiling = infProject.jsonProject.level[id].ceiling;
	arr_obj_3d = infProject.jsonProject.level[id].obj;

	infProject.scene.array.wall = infProject.jsonProject.level[id].wall;
	infProject.scene.array.point = infProject.jsonProject.level[id].point;
	infProject.scene.array.window = infProject.jsonProject.level[id].window;
	infProject.scene.array.door = infProject.jsonProject.level[id].door;
	infProject.scene.array.obj = infProject.jsonProject.level[id].obj;
	infProject.scene.array.floor = infProject.jsonProject.level[id].floor;
	infProject.scene.array.ceiling = infProject.jsonProject.level[id].ceiling;

	getInfoRenderWall();
	if(camera === cameraTop) showAllWallRender();
	else wallAfterRender_2();
	
	infProject.jsonProject.actLevel = id;	
}

// переключения одного этажа на другой
function switchLevel(id)
{	
	if(infProject.jsonProject.actLevel === id) return;
	
	let posY = getLevelPos0({lastId: infProject.jsonProject.actLevel, newId: id});
	
	deactiveLevel();
	
	startLevel(id);
	
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		changePosYLevel(posY, i);
	}

	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		if(camera === cameraTop) visibleLevelCam2D(i, false)
		else visibleLevelCam3D(i, true);
	}
	
	if(camera === cameraTop) visibleLevelCam2D(id, true);
	else visibleLevelCam3D(id, true);
	
	changeDepthColor();
}

// получаем значение, на который нужно сдвинуть этажи, чтобы текущий этаж был на нулевом уровне
function getLevelPos0({lastId, newId})
{
	let sumY1 = 0;
	let sumY2 = 0;
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		sumY1 += infProject.jsonProject.level[i].height;
		if(i === lastId) break;
	}
	
	for ( var i = 0; i < infProject.jsonProject.level.length; i++ )
	{
		sumY2 += infProject.jsonProject.level[i].height;
		if(i === newId) break;
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
	
	for ( var i = 0; i < arrW.length; i++ )
	{		
		arrW[i].position.y = arrW[i].position.y - posY;
		
		for ( var i2 = 0; i2 < arrW[i].userData.wall.arrO.length; i2++ )
		{
			arrW[i].userData.wall.arrO[i2].position.y = arrW[i].userData.wall.arrO[i2].position.y - posY;
		}
	}
	
	for ( var i = 0; i < obj_point.length; i++ ) obj_point[i].position.y = obj_point[i].position.y - posY;	
	for ( var i = 0; i < room.length; i++ ) room[i].position.y = room[i].position.y - posY;
	for ( var i = 0; i < ceiling.length; i++ ) ceiling[i].position.y = ceiling[i].position.y - posY;	
}


function visibleLevelCam2D(id, visible)
{
	var point = infProject.jsonProject.level[id].point;
	var wall = infProject.jsonProject.level[id].wall;
	var window = infProject.jsonProject.level[id].window;
	var door = infProject.jsonProject.level[id].door;	
	let room = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	
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
}

function visibleLevelCam3D(id, visible)
{
	var point = infProject.jsonProject.level[id].point;
	var wall = infProject.jsonProject.level[id].wall;
	var window = infProject.jsonProject.level[id].window;
	var door = infProject.jsonProject.level[id].door;	
	let room = infProject.jsonProject.level[id].floor;
	let ceiling = infProject.jsonProject.level[id].ceiling;
	
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
	infProject.jsonProject.level[id].obj = infProject.scene.array.obj;
	infProject.jsonProject.level[id].floor = infProject.scene.array.floor;
	infProject.jsonProject.level[id].ceiling = infProject.scene.array.ceiling;		
 	infProject.jsonProject.level[id].height = infProject.settings.height;
	
	obj_point = [];
	room = [];
	ceiling = [];
	arr_obj_3d = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	
	infProject.scene.array = resetPop.infProjectSceneArray();
}


