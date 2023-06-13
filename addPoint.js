


// пускаем луч и определяем к какой комнате принадлежит объект
function rayFurniture( obj ) 
{
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	
	//var pos = obj.position.clone();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	pos.y = 1;
	
	var ray = new THREE.Raycaster();
	ray.set( pos, new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObjects( room, true );	
	
	var floor = (intersects.length == 0) ? null : intersects[0].object;				
	
	return { id : (floor) ? floor.userData.id : 0, obj : floor };
}



 





// отпускаем перетаскиваемую точку на planeMath
function movePointWallPlaneMath(point) 
{
	updateShapeFloor(point.zone); 
	
	clickPointUP_BSP(param_wall.wallR);
}


// возращаем перетаскиваемую точку на прежнее место
function turnBackPosPoint(point)
{
	var flag = false;
	var crossObj = point.userData.point.cross;
	
	if(crossObj.userData.tag == 'point' || crossObj.userData.tag == 'wall')
	{  
		if(point.w.length > 1)
		{
			if(Math.abs(point.position.y - crossObj.position.y) < 0.3) { flag = true; }			// у перетаскиваемой точки больше одной стены
		}		
	}
		
	
	if(crossLineOnLine_1(point)) { flag = true; }	// стена пересекласть с другой стеной
	
	
	if(flag)
	{
		undoRedoChangeMovePoint( point, param_wall.wallR ); 			
		
		console.log('возращаем точку в прежнее положение');		
	}
	
	return flag;
}




// находим общую стену у двух точек
function findCommmonWallPoint(point1, point2)
{
	var wall = null;
	
	for ( var i = 0; i < point1.p.length; i++ )
	{
		if(point1.p[i] == point2) { wall = point1.w[i]; break; }
	}

	return wall;
}



// разделение стены на две половины по центру 
function addPointCenterWall({wall})
{	
	var pos1 = wall.userData.wall.p[0].position;
	var pos2 = wall.userData.wall.p[1].position;
	
	var pos = new THREE.Vector3().subVectors( pos2, pos1 ).divideScalar( 2 ).add(pos1); 
	var point = myHouse.myPoint.createPoint( pos, 0 );
	
	addPoint_1( wall, point );
}





// определяем с какой стороны окна/двери на стене (в момент, когда мы разделяем стену точкой)
function wallLeftRightWD(wall, posx)
{
	var arrL = [], arrR = [];
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		if (v.x <= posx){ arrL[arrL.length] = wall.userData.wall.arrO[i]; }
		else { arrR[arrR.length] = wall.userData.wall.arrO[i]; }
	}	

	return { wall_1 : arrL, wall_2 : arrR };
}



// разбиваем стену точкой, на 2 стены
// разбиваему стену удаляем, на её месте создаем 2 новых стены
function splitWalls( wall, point )
{
	// собираем данные о стене
	var width = wall.userData.wall.width;
	var height = wall.userData.wall.height_1;
	var offsetZ = wall.userData.wall.offsetZ;
	var material = wall.material; 
	var userData = wall.userData;
	var p1 = { id : wall.userData.wall.p[0].userData.id, pos : wall.userData.wall.p[0].position.clone() };
	var p2 = { id : wall.userData.wall.p[1].userData.id, pos : wall.userData.wall.p[1].position.clone() };
	
	 
	var arrW_2 = [];
	var point1 = wall.userData.wall.p[0];
	var point2 = wall.userData.wall.p[1];
	for ( var i = 0; i < point1.w.length; i++ ) { if(point1.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point1.w[i]; }
	for ( var i = 0; i < point2.w.length; i++ ) { if(point2.w[i] == wall) { continue; } arrW_2[arrW_2.length] = point2.w[i]; }
	
	if(point.p.length > 0)
	{ 
		for ( var i = 0; i < point.p[0].w.length; i++ )
		{
			for ( var i2 = 0; i2 < arrW_2.length; i2++ )
			{
				if(point.p[0].w[i] == arrW_2[i2]) continue;
				
				arrW_2[arrW_2.length] = point.p[0].w[i]; break;
			}
		}		
	}
	var wallC = point.w[0];
	var point_0 = point.p[0];
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall] : detectChangeArrWall_3(wallC);
	clickMovePoint_BSP( arrW );	
	
	// определяем с какой стороны (справа/слева) окна/двери (если есть) относительно точки
	wall.updateMatrixWorld();
	var ps = wall.worldToLocal( point.position.clone() );	
	var wd = wallLeftRightWD(wall, ps.x);	// собираем данные об окнах/дверях, принадлежащие разделяемой стене 

	// замыкаем стену (а не просто создаем точку на стене)  
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point')
	{	
		var zone = rayFurniture( point.w[0] ).obj;
		var oldZ_1 = findNumberInArrRoom(zone);
	}

	var v2 = wall.userData.wall.v;
	for ( var i2 = 0; i2 < wall.userData.wall.v.length; i2++ ) { v2[i2] = wall.userData.wall.v[i2].clone(); }

	var oldZones = detectCommonZone_1( wall );   	// определяем с какими зонами соприкасается стена
	var oldZ = findNumberInArrRoom( oldZones );
	deleteArrZone( oldZones );						// удаляем зоны  с которыми соприкасается стена					
	
	deleteWall_3({wall: wall, delWD: false, upWall: false});  		// удаляем разделяемую стену (без удаления зон)(без удаления окон/дверей)	
	
	// находим точки (если стена была отдельна, то эти точки удалены и их нужно заново создать)
	var point1 = findObjFromId( 'point', p1.id );
	var point2 = findObjFromId( 'point', p2.id );	
	
	if(point1 == null) { point1 = myHouse.myPoint.createPoint( p1.pos, p1.id ); }
	if(point2 == null) { point2 = myHouse.myPoint.createPoint( p2.pos, p2.id ); }		
	
	// создаем 2 новых стены
	var wall_1 = crtW({ p: [point1, point], width: width, offsetZ : offsetZ, height : height });	 			
	var wall_2 = crtW({ p: [point, point2], width: width, offsetZ : offsetZ, height : height });

	// накладываем материал
	wall_1.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];  
	wall_2.material = [ material[0].clone(), material[1].clone(), material[2].clone(), material[3].clone() ];
	wall_1.userData.material = userData.material; 
	wall_2.userData.material = userData.material; 
	
	for ( var i = 0; i < v2.length/2; i++ ) { wall_1.userData.wall.v[i] = v2[i].clone(); wall_1.geometry.vertices[i] = v2[i].clone(); }
	
	var sub = v2[8].x - wall_2.userData.wall.v[8].x;
	for ( var i = v2.length/2; i < v2.length; i++ ) { v2[i].x -= sub; } 
	for ( var i = v2.length/2; i < v2.length; i++ ) { wall_2.userData.wall.v[i] = v2[i].clone(); wall_2.geometry.vertices[i] = v2[i].clone(); }
	
	var arrW = (point.userData.point.last.cdm == 'add_point') ? [wall_1, wall_2] : detectChangeArrWall_3(wallC);
	
	if(point.userData.point.last.cdm == 'add_point')
	{
		upLineYY_2(point);
	}
	else
	{
		upLineYY_2(point);
		upLineYY_2(point_0);
	}
	
	upLabelPlan_1(arrW); 	
	clickPointUP_BSP( arrW );
	
	var newZones = detectRoomZone();		// создаем пол, для новых помещений	
	
	// передаем параметры старых зон новым	(название зоны)	
	var flag = false;
	if(point.userData.point.last.cdm == 'new_point_2' || point.userData.point.last.cdm == 'new_point') { if(zone) { flag = true; } }	// если замыкаем стену, то проверяем, есть ли пересечение с помещением
	
	if(flag) { assignOldToNewZones_2(newZones, oldZ_1[0], true); } 
	else { assignOldToNewZones_1(oldZ, newZones, 'add'); }		
	
	
	// вставляем окна/двери
	for ( var i = 0; i < wd.wall_1.length; i++ ) 
	{ 
		var obj = wd.wall_1[i];
		
		obj.userData.door.wall = wall_1;
		wall_1.userData.wall.arrO[wall_1.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_1, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 		
	} 
	
	for ( var i = 0; i < wd.wall_2.length; i++ ) 
	{ 
		var obj = wd.wall_2[i];
		
		obj.userData.door.wall = wall_2;
		wall_2.userData.wall.arrO[wall_2.userData.wall.arrO.length] = obj; 
		
		objsBSP = { wall : wall_2, wd : createCloneWD_BSP( obj ) };				
		MeshBSP( obj, objsBSP ); 	
	} 	
	
	
	return [wall_1, wall_2];
}







 











 



