




 

// показываем/скрываем кнопки/список текстур для стен
function showHideMenuTexture_1(cdm)
{
	if(cdm.type == 1)
	{
		$('[nameId="rp_catalog_texture_1"]').hide(); 
		$('[nameId="rp_block_wall_texture_1"]').show(); 		
	}
	else
	{
		$('[nameId="rp_catalog_texture_1"]').show(); 
		$('[nameId="rp_block_wall_texture_1"]').hide(); 		
	}
}




// после изменения input для плана (окно/дверь/толщина стены/высота этажа)
function upRightPlaneInput_1(cdm) 
{
	var el = cdm.el;
	var value = el.val();
	
	var inf = null;
	if(cdm.el[0] == $('[nameId="rp_wall_width_1"]')[0]) { var inf = { json: infProject.settings.wall, name: 'width', limit: {min: 0.01, max: 1} }; }
	else if(cdm.el[0] == $('[nameId="rp_door_length_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'width', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_door_height_1"]')[0]) { var inf = { json: infProject.settings.door, name: 'height', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_length_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'width', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_wind_height_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'height', limit: {min: 0.01, max: 5} }; }	
	else if(cdm.el[0] == $('[nameId="rp_wind_above_floor_1"]')[0]) { var inf = { json: infProject.settings.wind, name: 'h1', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_gate_length_1"]')[0]) { var inf = { json: infProject.settings.gate, name: 'width', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_gate_height_1"]')[0]) { var inf = { json: infProject.settings.gate, name: 'height', limit: {min: 0.01, max: 5} }; }
	else if(cdm.el[0] == $('[nameId="rp_roof_width_1"]')[0]) { var inf = { json: infProject.settings.roof, name: 'width', limit: {min: 0.01, max: 15} }; }
	else if(cdm.el[0] == $('[nameId="rp_roof_length_1"]')[0]) { var inf = { json: infProject.settings.roof, name: 'length', limit: {min: 0.01, max: 15} }; }
	else { return; }	
	
	var res = checkNumberInput({ value: value, unit: 1, limit: inf.limit });	
	
	if(!res) 
	{
		el.val(inf.json[inf.name]);
		return;
	}
	
	el.val(res.num);
	
	inf.json[inf.name] = res.num;	
}




// назначаем всем построеннным комнатам тип помещения
function assignListRoomTypesApi(cdm)
{
	var arr = cdm.arr;
	var floor = infProject.scene.array.floor;
	
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < floor.length; i2++ )
		{
			if(arr[i].id !== floor[i2].userData.id) continue;
			
			if(arr[i].zone == undefined){ arr[i].zone = -1; };
			
			floor[i].userData.room.zone.id = arr[i].zone;
			
			if(infProject.settings.floor.label.visible)  
			{ 				 
				assignRoomType({id: floor[i].userData.room.zone.id, obj: floor[i]});			
			}
			
			break;
		}		
	}
	
	renderCamera();		
}



function assignRoomType(cdm)
{ 
	var type = infProject.settings.room.type;	
	
	var id = cdm.id;
	var obj = null;
	
	if(cdm.button) { obj = myComposerRenderer.getOutlineObj(); }
	if(cdm.obj) { obj = cdm.obj; }
	
	var elem = obj.userData.room.html.label;
	elem.style.display = 'none';
	elem.userData.elem.show = false;
	
	
	
	if(!id) return;
	if(!obj) return;
	if(type.length == 0) return;	
	
	for(var i = 0; i < type.length; i++)
	{ 
		if(type[i].id !== id) continue;
		
		obj.userData.room.zone.id = type[i].id;
		obj.userData.room.zone.name = type[i].title;		
		
		elem.textContent = type[i].title;
		elem.style.display = 'block';
		elem.userData.elem.show = true;
		
		upPosLabels_2({elem: elem});
		
		break;
	}
	
	renderCamera();
}



