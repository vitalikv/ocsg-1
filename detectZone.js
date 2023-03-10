



// создаем пол 
function detectRoomZone()
{		
	var arrRoom = [];
	
	for ( var i = 0; i < obj_point.length; i++ )
	{			
		if(obj_point[i].p.length < 2){ continue; }

		for ( var i2 = 0; i2 < obj_point[i].p.length; i2++ )
		{
			if(obj_point[i].p[i2].p.length < 2){ continue; }									
			//if(checkeQuallyPointsZone(obj_point[i], obj_point[i].p[i2])){ continue; }
			

			var p = getContour_2([obj_point[i]], obj_point[i].p[i2]); 		
			 
			
			if(p[0] != p[p.length - 1]){ continue; }	
			if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }
			if(checkClockWise(p) <= 0){ continue; }		//var txt = ''; for ( var i3 = 0; i3 < p.length; i3++ ) { txt += ' | ' + p[i3].userData.id; } console.log(txt);						
			if(detectSameZone( obj_point[i].zone, p )){ continue; }
								
			 
			var arr = compileArrPointRoom_1(p);						
			
			arrRoom[arrRoom.length] = createFloor({point : p, wall : arr[0], side : arr[1]});			
			break; 
		}
	}

	return arrRoom;
}






// проверяем если зона с такими же точками
function detectSameZone( arrRoom, arrP )
{
	var flag = false;
	
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		var ln = 0;
		
		if(arrRoom[i].p.length != arrP.length) { continue; }
			
		for ( var i2 = 0; i2 < arrRoom[i].p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length - 1; i3++ )
			{
				if(arrRoom[i].p[i2] == arrP[i3]) { ln++; }
			}
		}
		
		if(ln == arrP.length - 1) 
		{ 
			//console.log(ln);
			//var txt = '---p---'; for ( var i3 = 0; i3 < arrP.length; i3++ ) { txt += ' | ' + arrP[i3].userData.id; } console.log(txt);	
			//var txt = '---zone---'; for ( var i3 = 0; i3 < arrRoom[i].p.length; i3++ ) { txt += ' | ' + arrRoom[i].p[i3].userData.id; } console.log(txt); 
			flag = true; 
			break; 
		}
	}
	
	return flag;
}





 

// проверяем, 2 точки принадлежат ли одной зоне или нет
function checkeQuallyPointsZone(p1, p2)
{
	for ( var i = 0; i < p1.zone.length; i++ )
	{
		for ( var i2 = 0; i2 < p2.zone.length; i2++ )
		{
			if(p1.zone[i] == p2.zone[i2]) 
			{ 
				if(p1 == p2.zoneP[i2]){ return true; } // принадлежат к этой же зоне
				if(p1.zoneP[i] == p2){ return true; }
			}
		}
	}
	
	return false;	// не принадлежат одной зоне
}





// ищем замкнутый контур
function getContour_2(arr, point)
{
	var p2 = arr[arr.length - 1];
	arr[arr.length] = point;
	
	
	var dir1 = new THREE.Vector3().subVectors( point.position, p2.position ).normalize();	
	
	var arrD = [];
	var n = 0;
	for ( var i = 0; i < point.p.length; i++ )
	{
		if(point.p[i] == p2){ continue; }		
		if(point.p[i].p.length < 2){ continue; }
		
		var dir2 = new THREE.Vector3().subVectors( point.p[i].position, point.position ).normalize();
		
		arrD[n] = [];
		arrD[n][1] = point.p[i];
		
		var d = (point.p[i].position.x - p2.position.x) * (point.position.z - p2.position.z) - (point.p[i].position.z - p2.position.z) * (point.position.x - p2.position.x);
		
		var angle = dir1.angleTo( dir2 );
		
		if(d > 0){ angle *= -1; }
		
		arrD[n][0] = angle;
		if(!isNumeric(angle)) { return arr; }
		//console.log([point.p[i].tag_2, d, angle * 180 / Math.PI]);
		
		n++;
	}	
	
	
	if(arrD.length > 0)
	{ 
		arrD.sort(function (a, b) { return a[0] - b[0]; });
		
		for ( var i = 0; i < arrD.length; i++ )
		{			
			if(arr[0] != arrD[i][1]) { return getContour_2(arr, arrD[i][1]); }
			else { arr[arr.length] = arrD[i][1]; break; }						
		}
	}
	
	return arr;
}




 
// получаем стены принадлежащие контуру и как они расположены
function compileArrPointRoom_1(p)
{
	var w = [];  
	var s = [];
	
	for ( var i = 0; i < p.length - 1; i++ )
	{ 		
		for ( var y1 = 0; y1 < p[i].w.length; y1++ )
		{
			for ( var y2 = 0; y2 < p[i + 1].w.length; y2++ )
			{
				if(p[i].w[y1] == p[i + 1].w[y2])
				{
					w[i] = p[i].w[y1];
					s[i] = p[i].start[y1];
					continue;
				}
			}
		}
	}	
	
	return [w, s];			
}





// 1. удаляем у точек параметр зоны, к которым они принадлежали
// 2. обновляем точки (контур) существующей зоны
// 3. обновляем размеры стен
// 4. обновляем форму существующей зоны и обновляем площадь существующей зоны
function updateZone( point, obj, arrRoom, num, cdm )
{
	deletePointZone(arrRoom);		// 1 	
	updateZonePoints(cdm, arrRoom, num, point); 				// 2
	console.log(arrRoom);
	for ( var i = 0; i < arrRoom.length; i++ ) { calculateOneArea2(arrRoom[i], num[i], point, cdm); }	// 2
	
	if(obj.userData.tag == 'wall'){ var arr = detectChangeArrWall_2(obj); }
	else if(obj.userData.tag == 'point'){ var arr = detectChangeArrWall([], obj); }

	upLabelPlan_1(arr);				// 3
	updateShapeFloor(arrRoom);		// 4 	 
}

 
// обновляем кол-во точек для существующего контура 
// 1.1 добавили точку на стену
// 1.2 удалили точку на контуре
function updateZonePoints(cdm, arrRoom, numS, point)
{
	var zone = arrRoom;
	var num = numS;
	
	if(cdm.name == 'join')
	{
		zone = cdm.zone;
		num = cdm.num; 
		cdm = 'del';
	}
	
	for ( var i = 0; i < zone.length; i++ )
	{
		if(cdm == 'add') 			// 1.1
		{ 
			zone[i].p.splice(num[i], 0, point); 
		}		
		else if(cdm == 'del') 		// 1.2
		{ 				
			if(num[i] == 0 || num[i] == zone[i].p.length - 1)	// удалили точку которая в массиве контура стояла в начале или конце
			{
				zone[i].p.splice(0, 1);	
				zone[i].p.splice(zone[i].p.length - 1, 1);			
				zone[i].p[zone[i].p.length] = zone[i].p[0];
			}
			else { zone[i].p.splice(num[i], 1); }		// удалили точку которая была где-то в центре массива
		}		
	}
}



// 2. получаем стены принадлежащие контуру и как они расположены
// 3. добавляем к точкам параметр зона и предидущая точка 
// 4. обновляем принадлежащие стены и их расположение для контура
function calculateOneArea2(zoneIndex, num, point, cdm)
{		
	var arr = compileArrPointRoom_1(zoneIndex.p);	// 2			
	
	addParamPointOnZone(zoneIndex.p, zoneIndex);	// 3
				
	zoneIndex.w = arr[0]; 		// 4
	zoneIndex.s = arr[1];	
}




// проверяем если у point2 зона, которой нету у point1 (если есть то true) 
function checkCommonZonePoints(point1, point2)
{
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { return true; }
	}
	
	return false;
}


function checkCommonZonePoints_2(point1, point2) 
{
	var arr = [];
	
	for ( var i = 0; i < point2.zone.length; i++ )
	{ 
		var flag = false;
		for ( var i2 = 0; i2 < point1.zone.length; i2++ )
		{			
			if(point2.zone[i] == point1.zone[i2]) { flag = true; break; }
		}
		if(!flag) { arr[arr.length] = point2.zone[i]; }
	}
	
	return arr;
}

 
// удаляем выбранные зоны 
function deleteArrZone(arrRoom)
{
	var roomType = [];
	var arrN = [];
	
	
	// обновляем у сторон стен зоны, к которым они принадлежат
	for(var i = 0; i < arrRoom.length; i++)
	{
		for(var i2 = 0; i2 < arrRoom[i].userData.room.w.length; i2++)
		{
			var wall = arrRoom[i].userData.room.w[i2];
			
			if(wall.userData.wall.room.side2[1] == arrRoom[i]){ wall.userData.wall.room.side2[1] = null; }
			else if(wall.userData.wall.room.side2[2] == arrRoom[i]){ wall.userData.wall.room.side2[2] = null; }
		}
	}
	
	
	// удаляем из массива room удаляемые зоны
	for ( var i = 0; i < room.length; i++ ) 
	{
		for ( var i2 = 0; i2 < arrRoom.length; i2++ ) 
		{ 
			if(room[i] == arrRoom[i2])
			{  				 
				arrN[arrN.length] = i; break;
			}
		}
	}

	deletePointZone(arrRoom);
	
	for ( var i = arrN.length - 1; i >= 0; i-- )
	{
		roomType[roomType.length] = 
		{ 
			nameTxt : room[arrN[i]].userData.room.roomType,  
			material : room[arrN[i]].material, 
			userData : room[arrN[i]].userData, 
			area : Number(room[arrN[i]].userData.room.areaTxt), 
		}; 
		
		var floor = room[arrN[i]];    			
		room.splice(arrN[i], 1); 
		
		var ceil = ceiling[arrN[i]];
		ceiling.splice(arrN[i], 1);	 
		
		
		deleteValueFromArrya({arr: infProject.html.label, o: floor.userData.room.html.label});
		floor.userData.room.html.label.remove();
	
		disposeNode( floor );
		disposeNode( ceil );		
		
		scene.remove( floor );
		scene.remove( ceil );		
	}
	
	return roomType;
}



// удаляем из точек зоны, к которым они принадлежали 
function deletePointZone(arrRoom)
{
	for ( var i = 0; i < arrRoom.length; i++ )
	{
		for ( var i2 = 0; i2 < arrRoom[i].p.length; i2++ )
		{
			for ( var i3 = 0; i3 < arrRoom[i].p[i2].zone.length; i3++ )
			{
				if(arrRoom[i].p[i2].zone[i3] == arrRoom[i])
				{ 
					arrRoom[i].p[i2].zone.splice(i3, 1);
					arrRoom[i].p[i2].zoneP.splice(i3, 1); 
					break;
				}							
			}
		}
	}
}



// проверяем если зона с такими же точками (нужно saveLoad.js , загрузка файла)
function detectSameZone_2( arrRoom, arrP )
{
	var flag = false;
	var ln = 0;
	
	if(arrRoom.p.length - 1 != arrP.length) { return flag; }
		
	for ( var i2 = 0; i2 < arrRoom.p.length - 1; i2++ )
	{
		for ( var i3 = 0; i3 < arrP.length; i3++ )
		{
			if(arrRoom.p[i2].userData.id == arrP[i3]) { ln++; }
		}
	}
	
	if(arrRoom.p.length - 1 == ln) 
	{ 
		//console.log(ln);
		//var txt = '---p---'; for ( var i3 = 0; i3 < arrP.length; i3++ ) { txt += ' | ' + arrP[i3]; } console.log(txt);	
		//var txt = '---zone---'; for ( var i3 = 0; i3 < arrRoom.p.length - 1; i3++ ) { txt += ' | ' + arrRoom.p[i3].userData.id; } console.log(txt); 
		flag = true; 
	}
	
	return flag;
}




// пускаем луч и определяем к какой комнате принадлежит объект
function rayDetectedRoom(cdm) 
{	
	var ray = new THREE.Raycaster();
	ray.set( new THREE.Vector3(cdm.pos.x, 1, cdm.pos.z), new THREE.Vector3(0, -1, 0) );
	
	var intersects = ray.intersectObject( cdm.obj );	
	
	var floor = (!intersects[0]) ? null : intersects[0].object;				
	
	return { o: floor };
}



// при добавлении или удалении точки, передаем параметры страх зон новым 
// находим одинаковые зоны (старые(которые были удалены) и новые (которые были созданны)), сравниванием кол-во совпавших точек
function assignOldToNewZones_1( oldZ, newZones, cdm ) 
{
	// у новой зоны должно быть на 1 точку (на 2, если считать p.length) меньше одинаковых точек
	for ( var i = 0; i < newZones.length; i++ ) 
	{
		for ( var i2 = 0; i2 < oldZ.length; i2++ ) 
		{ 			
			var oldZones = oldZ[i2].floor; 
			var count = 0;
			
			for ( var i3 = 0; i3 < newZones[i].p.length - 1; i3++ )
			{
				for ( var i4 = 0; i4 < oldZones.p.length - 1; i4++ )
				{
					if(newZones[i].p[i3].userData.id == oldZones.p[i4].userData.id) { count++; break; };
				}				
			}

			
			if(cdm == 'add') { var countNew = newZones[i].p.length - 2; }
			else if(cdm == 'delete') { var countNew = newZones[i].p.length - 1; }
			else if(cdm == 'copy') { var countNew = newZones[i].p.length - 1; }
			
			if(countNew == count)
			{
				assignOldToNewZones_2([newZones[i]], oldZ[i2], false);				
				break;
			}			
		}
	}

}



// замыкаем точку (создание новой комнаты/зоны) 
// берем у замыкающей точки стену и у этой стены находим центр, а затем бросаем луч и определяем какую зону он делит
// у этой зоны берем параметры и переносим на 2 новые зоны
function splitZone(wall) 
{
	var oldZone = rayFurniture( wall ).obj;
	var oldZ = findNumberInArrRoom(oldZone);
	
	if(oldZone) { deleteArrZone( [oldZone] ); }			// удаляем старый пол
		
	var newZones = detectRoomZone();			// создаем пол, для новых помещений	
	 
	if(oldZone) { assignOldToNewZones_2(newZones, oldZ[0], true); } 
}


// переносим параметры от стрых зон к новым 
function assignOldToNewZones_2(newZones, oldZ, addId)
{
	var newZ = findNumberInArrRoom(newZones);
	
	for ( var i = 0; i < newZ.length; i++ )
	{	 
		var floor = newZ[i].floor;		
		var ceiling = newZ[i].ceiling;
		
		floor.userData.id = oldZ.floor.userData.id;	
		floor.userData.material = Object.assign({}, oldZ.floor.userData.material);		
		floor.material = oldZ.floor.material.clone();
		

		ceiling.userData.id = oldZ.ceiling.userData.id;	
		ceiling.userData.material = Object.assign({}, oldZ.ceiling.userData.material);
		ceiling.material = oldZ.ceiling.material.clone();
		
		if(addId) 
		{ 
			floor.userData.id = countId; countId++; 
			ceiling.userData.id = countId; countId++;
		}  
		getYardageSpace( [floor] );
	}
}



// находим у стены две общие зоны (если есть, а то может быть только одна зона)
// получаем зоны, к которой примыкает стена (0, 1, 2 - зоны)
function detectCommonZone_1( wall )
{
	var arrRoom = [];	
	for ( var i = 0; i < wall.userData.wall.p[0].zone.length; i++ ) 
	{
		for ( var i2 = 0; i2 < wall.userData.wall.p[1].zone.length; i2++ )
		{
			if(wall.userData.wall.p[0].zone[i] == wall.userData.wall.p[1].zone[i2])
			{
				arrRoom[arrRoom.length] = wall.userData.wall.p[0].zone[i]; 
			}
		}
	}

	return arrRoom;
}





