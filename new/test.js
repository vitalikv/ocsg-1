





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
	infProject.jsonProject.level[id].height = infProject.settings.height;
	infProject.jsonProject.level[id].obj = infProject.scene.array.obj;
	
 	changeDepthColor222();
	obj_point = [];
	room = [];
	ceiling = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	
	infProject.scene.array = resetPop.infProjectMySceneArray();

	infProject.jsonProject.actLevel = id;	
}









