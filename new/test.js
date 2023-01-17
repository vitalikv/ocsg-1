

function newTestLoad()
{
	return;
	let posY = 2.8;
	let arrW = infProject.scene.array.wall;
	
	console.log(777, arrW);
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
	
	infProject.scene.grid.position.y = infProject.scene.grid.position.y - posY;
	
/* 	changeDepthColor222();
	obj_point = [];
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	
	infProject.scene.array = resetPop.infProjectSceneArray();	 */
}



function saveArrLevel(id)
{
	
	infProject.jsonProject.level[id] = {};
	infProject.jsonProject.level[id].wall = infProject.scene.array.wall;
	infProject.jsonProject.level[id].point = infProject.scene.array.point;
	infProject.jsonProject.level[id].window = infProject.scene.array.window;
	infProject.jsonProject.level[id].door = infProject.scene.array.door;
	infProject.jsonProject.level[id].obj = infProject.scene.array.obj;
	infProject.jsonProject.level[id].floor = infProject.scene.array.floor;
	infProject.jsonProject.level[id].ceiling = infProject.scene.array.ceiling;
	
 	changeDepthColor222();
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


function activeLevel(id)
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

	changeDepthColor();

	infProject.jsonProject.actLevel = id;	
}



function getElBtnLevel()
{
	let elBlock = document.querySelector('[nameId="wrap_level"]');
	
	let btn1 = document.querySelector('[nameId="btn_level_1"]');
	let btn2 = document.querySelector('[nameId="btn_level_2"]');
	let btn3 = document.querySelector('[nameId="btn_level_3"]');
	let btn4 = document.querySelector('[nameId="btn_level_4"]');
	
	btn1.onmousedown = () => { console.log(1); activeLevel(0); }
	btn2.onmousedown = () => { console.log(2); activeLevel(1); }
	btn3.onmousedown = () => { console.log(3); activeLevel(2); }
	btn4.onmousedown = () => { console.log(4); activeLevel(3); }
	console.log(elBlock);
}



