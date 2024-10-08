



var resetPop =
{	
	infProjectSceneArray : function()
	{
		var array = { point: obj_point, wall: [], window: [], door: [], floor: room, ceiling: ceiling, obj: [], roof: [] };
		array.base = (infProject.start)? infProject.scene.array.base : [];	// массив клонируемых объектов
		
		return array;
	},

	infProjectMySceneArray : function()
	{
		var array = { point: obj_point, wall: [], window: [], door: [], floor: room, ceiling: ceiling, obj: [], roof: [] };
		array.base = infProject.scene.array.base;	// массив клонируемых объектов
		
		return array;
	},
	
	listColor : function()
	{	
		var array = {};
		
		array.door2D = 'rgb(224, 224, 224)';
		array.window2D = 'rgb(224, 224, 224)';
		array.active2D = 'rgb(255, 162, 23)';
		array.hover2D = 'rgb(69, 165, 58)';

		return array;
	},
	
	clickO : function()
	{
		var inf = { obj: null, last_obj: null, hover: null, rayhit : null, button : null };
		inf.down = null;
		inf.move = null;
		inf.up = null;
		inf.offset = new THREE.Vector3();
		inf.actMove = false;
		inf.pos = { clickDown : new THREE.Vector3() };
		inf.click = { wall : [], point : [], side_wall: 0 };
		inf.selectBox = { arr : [], drag : false, move : false };
		inf.keys = [];
		inf.options = null;
		inf.elem = null;
		
		return inf;
	},
	
	active : function()
	{
		var inf = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true, unlock : true };
		
		return inf;
	}	
};



function resetScene() 
{
	myMouse.clearClick();
	//hideMenuUI(clickO.last_obj);		
	
	//myLevels.deleteOneLevel(myLevels.activeId);		
	
	obj_point = [];
	room = [];
	ceiling = [];
	arrWallFront = [];
	

	
	
	// прячем размеры и линейки
	myHouse.myWDPoints.hide();
	myHouse.myWDRulers.hide();
		
	for ( var i = 0; i < infProject.html.wd.length; i++ ) 
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
	

	
	clickO = resetPop.clickO();
	infProject.project = null;
	infProject.scene.array = resetPop.infProjectSceneArray();
	
	myLevels.deleteAllLevels();
	myHouse.myGhostLevel.deleteLevel();
	
	countId = 2;
	
	//getConsoleRendererInfo();
	//console.log('infProject.scene.array');
	//console.log(infProject.scene.array);
}



function getConsoleRendererInfo()
{	
	console.log(renderer.info.programs);
	console.log(renderer.info.render);
	console.log(renderer.info.memory);	
}






// удалем из GPU объекты
function disposeHierchy(cdm) 
{
	var obj = cdm.obj;	
	
	obj.traverse(function(child) 
	{
		disposeNode(child);
	});	
}



function disposeNode(node) 
{
	if (node instanceof THREE.Mesh || node instanceof THREE.Line) 
	{ 
		if (node.geometry) { node.geometry.dispose(); }
		
		if (node.material) 
		{
			var materialArray = [];
			
			if(node.material instanceof Array) { materialArray = node.material; }
			else { materialArray = [node.material]; }
			
			if(materialArray) 
			{
				materialArray.forEach(function (mtrl, idx) 
				{
					if (mtrl.map) mtrl.map.dispose();
					if (mtrl.lightMap) mtrl.lightMap.dispose();
					if (mtrl.bumpMap) mtrl.bumpMap.dispose();
					if (mtrl.normalMap) mtrl.normalMap.dispose();
					if (mtrl.specularMap) mtrl.specularMap.dispose();
					if (mtrl.envMap) mtrl.envMap.dispose();
					mtrl.dispose();
				});
			}
		}
	}
}


function compileJsonFile()
{
	myLevels.updateArrLevel();
	
	const id = myLevels.activeId;
	const level = [];

	const posY = myLevels.getLevelPos0({lastId: id, newId: 0});
	
	for ( let i = 0; i < myLevels.levels.length; i++ )
	{		
		const house = compileJsonFile_2(myLevels.levels[i], posY);
		
		level[level.length] = {...house};
	}
	
	const wf = myWarmFloor.getDataForSave({posY});
	
	const json = {level, wf};
	
	return json;
}


function compileJsonFile_2(array, posY)
{
	let json = {level: []};
	
	json.level[0] = 
	{
		version: {},
		points: [],
		walls: [],	
		rooms: [],
		object: [],
		roofs: [],
		height: array.height,		
	};
	
	let points = [];
	let walls = [];
	let rooms = [];
	let object = [];
	let roofs = [];
	
	let wall = array.wall;
	//var point = infProject.scene.array.point;
	
	for ( var i = 0; i < wall.length; i++ )
	{			
		var p = wall[i].userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y - posY, p[i2].position.z);
				points[m].type = 'w';
			}
		}
	}	
	
	
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var p = wall[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = wall[i].userData.id;
		walls[i].p = { id: [p[0].userData.id, p[1].userData.id] };
		//walls[i].width = wall[i].userData.wall.width; 
		//walls[i].height = wall[i].userData.wall.height_1; 
		walls[i].size = {y: wall[i].userData.wall.height_1, z: wall[i].userData.wall.width};

		// смещение стены
		if(1==2)
		{
			var x1 = p[1].position.z - p[0].position.z;
			var z1 = p[0].position.x - p[1].position.x;	
			var dir = new THREE.Vector3(z1, 0, -x1).normalize();						// перпендикуляр стены  (перевернуты x и y)
			dir.multiplyScalar( wall[i].userData.wall.offsetZ );
			walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);			
		}
				
		var wd = saveWindows(wall[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;

		
		walls[i].material = [wall[i].userData.material[1], wall[i].userData.material[2]];						
	}	

	var floor = array.floor;
	var ceiling = array.ceiling;
	
	for ( var i = 0; i < floor.length; i++ )
	{
		rooms[i] = { contour : [] };
		
		rooms[i].id = floor[i].userData.id;  
		
		rooms[i].contour = [];
		var s = 0; 
		for ( var i2 = floor[i].userData.room.p.length - 1; i2 >= 1; i2-- ) 
		{ 
			rooms[i].contour[s] = floor[i].userData.room.p[i2].userData.id; 
			s++; 
		}

		rooms[i].depth = myHouse.myFloor.getDepthFloor({floor: floor[i]});
		
		rooms[i].material = [floor[i].userData.material, ceiling[i].userData.material];	

		rooms[i].zone = (floor[i].userData.room.zone.id == -1) ? null : floor[i].userData.room.zone.id;
	}
	

	
	for ( var i = 0; i < array.obj.length; i++ )
	{
		var obj = array.obj[i];		
			
		var m = object.length;
		object[m] = {};
		object[m].id = Number(obj.userData.id);
		object[m].lotid = Number(obj.userData.obj3D.lotid);
		object[m].pos = new THREE.Vector3(obj.position.x, obj.position.y - posY, obj.position.z);
		//object[m].rot = new THREE.Vector3( THREE.Math.radToDeg(obj.rotation.x), THREE.Math.radToDeg(obj.rotation.y), THREE.Math.radToDeg(obj.rotation.z) );
		object[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		object[m].scale = obj.scale;
		object[m].typeGroup = obj.userData.obj3D.typeGroup;
		object[m].material = obj.userData.material;
	}	
	
	let roof = array.roof;
	
	for ( var i = 0; i < roof.length; i++ )
	{
		var obj = roof[i];		
			
		var m = roofs.length;
		roofs[m] = {};
		roofs[m].id = Number(obj.userData.id);
		roofs[m].lotid = Number(obj.userData.roof.lotid);
		roofs[m].pos = new THREE.Vector3(obj.position.x, obj.position.y - posY, obj.position.z);
		//object[m].rot = new THREE.Vector3( THREE.Math.radToDeg(obj.rotation.x), THREE.Math.radToDeg(obj.rotation.y), THREE.Math.radToDeg(obj.rotation.z) );
		roofs[m].q = {x: obj.quaternion.x, y: obj.quaternion.y, z: obj.quaternion.z, w: obj.quaternion.w};
		roofs[m].scale = obj.scale;
		roofs[m].material = {};
		roofs[m].material.color = obj.children[0].material.color;
		//roofs[m].material.img = obj.children[0].material.map ? obj.userData.material.map.image;
	}	
		
	json.level[0].points = points;
	json.level[0].walls = walls;
	json.level[0].rooms = rooms;
	json.level[0].object = object;
	json.level[0].roofs = roofs;
	
	// version
	json.level[0].version.id = 2;
	
	
	return json.level[0];
}





// сохраняем окна/двери
function saveWindows(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices; 

			wd.updateMatrixWorld();
			wd.geometry.computeBoundingBox();
			wd.geometry.computeBoundingSphere();
			var dX = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
			var dY = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;
			var center = wd.geometry.boundingSphere.center;
		
		
			var v7 = wd.localToWorld( center.clone() );			
			var qt1 = quaternionDirection( new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize() );
			var x = localTransformPoint(new THREE.Vector3().subVectors( v7, p[0].position ), qt1).z; 
			
			x = x / p[1].position.distanceTo( p[0].position );		// процентное соотношение от начала стены			
			var y = wall.worldToLocal( wd.localToWorld(new THREE.Vector3(0, wd.geometry.boundingBox.min.y, 0)) ).y;
			
			
			var arr = {};
			
			arr.id = wd.userData.id;							
			arr.lotid  = wd.userData.door.lotid;				  
			arr.size = {x: dX, y: dY};									
			arr.pos = {x: x, y: y};
			arr.openId = wd.userData.door.openId;
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}



function getJsonProject()
{
	return JSON.stringify( compileJsonFile() );
}



async function saveFile({id = undefined, local = false, txt = false}) 
{ 
	
	const json = JSON.stringify( compileJsonFile() );
	
	
	if(local)	// сохраняем в папку
	{
		const url = infProject.path+'saveJson.php';			
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'myarray='+encodeURIComponent(json)+'&nameFile='+infProject.settings.save.file,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },				
		});
		const data = await response.json();		
		console.log(data);			
	}
	
	
	if(id)	// сохраняем в бд
	{		
		const url = infProject.path+'components/saveSql.php';			
		
		// preview= пустое, чтобы не сохранять изображение
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'id='+id+'&user_id='+infProject.user.id+'&preview=&json='+encodeURIComponent(json),
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },				
		});
		const data = await response.json();		
		console.log(data);	
		
		return data;	
	}
	
	if(txt)
	{	
		var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(json);	
		
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.href = csvData;
		link.target = '_blank';
		link.download = 'file.json';
		link.click();			
	}	
}





async function loadFile({id = undefined, local = undefined}) 
{
	let data = {level: []};
	
	if(local)	// загрузка json из папки
	{		
		const url = infProject.path + local;		
		const response = await fetch(url, 
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },						
		});		
		data = await response.json();					
	}
	else if(id)	// загрузка json из бд
	{
		const url = infProject.path + 'components/loadSql.php';		
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'id='+id,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },						
		});		
		data = await response.json();		
	}

	await loadFilePL(data);
}






async function loadFilePL(json) 
{
	resetScene();
	
	// получаем объект из бд (т.к. все объекты параметрические)
	let inf = await getObjFromBase({lotid: 10});	// дверь
	if(inf.model) addObjInBase(inf, new THREE.ObjectLoader().parse( inf.model ));
	

	//await getListRoomTypesApi();	// получаем типы помещений из api, добавляем в меню
	//await addObjInCatalogUI_1();		// наполняем каталог объектов UI
	 
	//if(!arr) return;	
	for ( var i = 0; i < json.level.length; i++ )
	{
		await loadFileLevel(json.level[i]);
		saveArrLevel(i);
		myLevels.visibleLevelCam2D(i, false);
	}	
	
	myPanelR.myContentLevel.setStartInputValue();
	
	myLevels.activateLevel(0);
	myLevels.visibleLevelCam2D(0, true);
	myLevels.switchLevel(0);
	
	
	if(json.wf) myWarmFloor.load({data: json.wf});	
	
	readyProject(); 
}


async function loadFileLevel(json)
{
	let arr = json;
	
	if(!arr.points) { arr.points = []; }
	if(!arr.walls) { arr.walls = []; }
	if(!arr.rooms) { arr.rooms = []; }
	if(!arr.object) { arr.object = []; }
	if(arr.height) { infProject.settings.height = arr.height; }
	
	infProject.project = { file: arr, load: { furn: [] } };
		
	var point = arr.points;
	var walls = arr.walls;
	var rooms = arr.rooms;
	var furn = (arr.object) ? arr.object : [];
	var roofs = (arr.roofs) ? arr.roofs : [];
	
	//changeAllHeightWall_1({ load: true, height: arr.height, input: true, globalHeight: true });
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		//wall[i].offsetV = new THREE.Vector3(walls[i].startShift.z, 0, walls[i].startShift.x);   		
		
		wall[i].width = walls[i].size.z;
		wall[i].height = walls[i].size.y;		
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].p.id[0], pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].p.id[1], pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, point[i2].pos.y, point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, point[i2].pos.y, point[i2].pos.z); }
		}
		
		wall[i].material = walls[i].material;
		
		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  };
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].lotid = arrO[i2].lotid;
			wall[i].arrO[i2].pos = new THREE.Vector3(arrO[i2].pos.x, arrO[i2].pos.y, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(arrO[i2].size.x, arrO[i2].size.y);
			wall[i].arrO[i2].type = arrO[i2].type;
			wall[i].arrO[i2].openId = (arrO[i2].openId !== undefined) ? arrO[i2].openId : 0;
		} 	
	}
		

	//-------------
	 
	// создаем и устанавливаем все стены (без окон/дверей)
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = findObjFromId( 'point', wall[i].points[0].id );
		var point2 = findObjFromId( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = myHouse.myPoint.createPoint( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = myHouse.myPoint.createPoint( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		//var dir = new THREE.Vector3().subVectors( point2.position, point1.position ).normalize();
		//var offsetZ = localTransformPoint(wall[i].offsetV, quaternionDirection(dir)).z;
		var offsetZ = 0;
		var inf = { id: wall[i].id, p: [point1, point2], width: wall[i].width, offsetZ: -offsetZ, height: wall[i].height, load: true };
		//inf.material = wall[i].material; 
		
		var obj = myHouse.myWall.createWall(inf); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY_2(obj_point[i]); }
	
	upLabelPlan_1(infProject.scene.array.wall);	// размеры стен

	// восстанавливаем пол
	myHouse.myRoom.calcRoomZone();
	
	// новый вариант, пол считается из планировки, а затем ищутся одинаковые зоны из файла 
	for ( var n = 0; n < infProject.scene.array.floor.length; n++ )
	{
		for ( var i = 0; i < rooms.length; i++ )
		{
			if(rooms[i].reference)
			{
				var floor = myHouse.myRoom.rayDetectedRoom({pos: rooms[i].reference, obj: infProject.scene.array.floor[n]});
				
				if(floor.o == infProject.scene.array.floor[n])
				{
					infProject.scene.array.floor[n].userData.id = rooms[i].id;
					infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
					console.log(rooms[i].id);
					break;
				}
			}
			else if(rooms[i].contour)
			{
				if(!myHouse.myRoom.detectSameZone_2( infProject.scene.array.floor[n], rooms[i].contour )) continue;
				
				infProject.scene.array.floor[n].userData.id = rooms[i].id;
				infProject.scene.array.ceiling[n].userData.id = rooms[i].id;
				
				break;				
			}
		}
	}

	// толщина пола
	if(rooms.length > 0) 
	{ 
		if(rooms[0].depth) myHouse.myFloor.changeDepthFloorsOnLevel({depth: rooms[0].depth, floors: infProject.scene.array.floor});
	}			
		
	// восстанавливаем пол 
	
	// устанавливаем окна/двери
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			var inf = { status: 'load', id: wall[i].arrO[i2].id, pos: intP, wall: obj, type: wall[i].arrO[i2].type, openId: wall[i].arrO[i2].openId };
			inf.lotid = wall[i].arrO[i2].lotid;
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }				
						
			myHouse.myWD.createWD(inf); 
		}		
	}
	// устанавливаем окна/двери
	

	// получаем все текстуры в один массив и отправляем на установку
	{
		var arrTexture = [];
		for ( var i = 0; i < walls.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[0].img, index: walls[i].material[0].index };
			arrTexture[arrTexture.length] = { objId: walls[i].id, img: walls[i].material[1].img, index: walls[i].material[1].index };
		}
		for ( var i = 0; i < rooms.length; i++ )
		{
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[0].img, tag: rooms[i].material[0].tag };
			arrTexture[arrTexture.length] = { objId: rooms[i].id, img: rooms[i].material[1].img, tag: rooms[i].material[1].tag };
		}
		
		arrTexture = [...new Set(arrTexture)];	// удаляем из массива повторяющиеся элементы ES6
		
		
		loadTextureInBase({arr: arrTexture});
	}
	
	for ( var i = 0; i < roofs.length; i++ )
	{		
		roofs[i].roof = true;
		await loadObjServer(roofs[i]); 
	}
	  
	assignListRoomTypesApi({arr: rooms});	// получаем типы помещений, добавляем в меню и назначаем всем построеннным комнатам тип помещения
	
	await loadObjInBase({furn: furn});	
}


// получаем типы помещений из api, добавляем в меню
async function getListRoomTypesApi()
{
	var url = infProject.settings.api.type.room; 
	

	var response = await fetch(url, { method: 'GET' });
	var json = await response.json();
	json.unshift({id: -1, title: "Без функции"});

	infProject.settings.room.type = json;	
	
	var json = infProject.settings.room.type;
	
	for(var i = 0; i < json.length; i++)
	{		
		var str = 
		'<div class="right_panel_1_1_list_item" type_room="'+json[i].id+'">\
			<div class="right_panel_1_1_list_item_text">'
			+json[i].title+
			'</div>\
		</div>';
		
		
		var el = $(str).appendTo('[list_ui="room_type"]');
		var id = json[i].id;
		(function(id) 
		{
			el.on('mousedown', function(){ assignRoomType({button: true, id: id}); });	
		}(id));		
	}	
}



function loadTextureInBase(cdm)
{
	console.log(cdm.arr);
	
	var wall = infProject.scene.array.wall;
	
	for ( var i = 0; i < cdm.arr.length; i++ )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(cdm.arr[i].objId == wall[i2].userData.id)
			{ 
				myTexture.setImage({obj: wall[i2], material: cdm.arr[i]});
			}			
		}
		for ( var i2 = 0; i2 < room.length; i2++ )
		{
			if(cdm.arr[i].objId == room[i2].userData.id && cdm.arr[i].tag == 'room')
			{ 
				myTexture.setImage({obj: room[i2], material: cdm.arr[i]});
			}			
		}	
		for ( var i2 = 0; i2 < ceiling.length; i2++ )
		{
			if(cdm.arr[i].objId == ceiling[i2].userData.id && cdm.arr[i].tag == 'ceiling')
			{ 
				myTexture.setImage({obj: ceiling[i2], material: cdm.arr[i]});
			}			
		}			
	}
}


// сохранение объектов в базу (создаем уникальную копию)
async function loadObjInBase(cdm)
{
	var furn = cdm.furn;
	var lotid = [];
	
	for ( var i = 0; i < furn.length; i++ )
	{
		lotid[lotid.length] = Number(furn[i].lotid);

		//createSpotObj(inf, furn[i]);
	}
	
	lotid = [...new Set(lotid)];  
	
	var strId = '';
	
	for ( var i = 0; i < lotid.length; i++ )
	{
		strId += '&id['+i+']='+lotid[i];
	}

	var url = infProject.path+'components_2/getListObjSql.php';		
	var response = await fetch(url, 
	{
		method: 'POST',
		body: 'select_list=id, name'+strId ,
		headers: 
		{
			'Content-Type': 'application/x-www-form-urlencoded'
		},		
		
	});
	var json = await response.json();

	
	for ( var i = 0; i < json.length; i++ )
	{		
		for ( var i2 = 0; i2 < furn.length; i2++ )
		{
			if(furn[i2].lotid == json[i].id) 
			{ 
				await loadObjServer(furn[i2]);

				infProject.project.load.furn[infProject.project.load.furn.length] = furn[i2].lotid;				
				
				var rat = (Math.round((infProject.project.load.furn.length/infProject.project.file.object.length)*100)) + '%';
				$('[nameId="txt_loader_slider_UI"]').text(rat);
			}
		}
	}
}





function readyProject(cdm)
{
	
	// восстанавливаем countId
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}	
	countId++; 
	// восстанавливаем countId		
	
	console.log('READY', countId);
	
	$('[nameId="menu_loader_slider_UI"]').hide();
	
	myStartProject.setCamera();	
}


// меняем уровень отрисовки объектов 
function changeDepthColor222()
{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
		var visible_2 = false;
		var visible_3 = true;
	
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
	
	hideElementSvg(svg);	
	
	showHideArrObj(window, visible_2);
	showHideArrObj(door, visible_2);
	
}



