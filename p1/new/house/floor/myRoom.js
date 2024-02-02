
// рассчитываем и создаем полы
class MyRoom 
{

	// рассчитываем и создаем полы
	// проверяем, если пол по контуру уже создан, то не создаем этот пол. создаем только новые полы, если есть новые контуры
	calcRoomZone()
	{		
		const arrRoom = [];
		
		const depth = this.getDepthActFloor();
		
		for ( let i = 0; i < obj_point.length; i++ )
		{			
			if(obj_point[i].p.length < 2){ continue; }

			for ( let i2 = 0; i2 < obj_point[i].p.length; i2++ )
			{
				if(obj_point[i].p[i2].p.length < 2){ continue; }									
				//if(checkeQuallyPointsZone(obj_point[i], obj_point[i].p[i2])){ continue; }
				
				const p = this.getRoomContour([obj_point[i]], obj_point[i].p[i2]); 						 
				
				if(p[0] !== p[p.length - 1]){ continue; }	
				if(p.length > 5){ if(p[1] === p[p.length - 2]) continue; }
				if(this.checkClockWise(p) <= 0){ continue; }		//var txt = ''; for ( var i3 = 0; i3 < p.length; i3++ ) { txt += ' | ' + p[i3].userData.id; } console.log(txt);						
				if(this.detectEqualZone( obj_point[i].zone, p )){ continue; }
									
				 
				const arr = this.compileArrPointRoom_1(p);						
				
				const floor = myHouse.myFloor.createFloor({points: p, walls: arr[0], sides: arr[1], depth});
				
				arrRoom.push(floor);
				
				break; 
			}
		}

		return arrRoom;
	}

	// получаем высоту пола у активного этажа (нужно когда строим новый участок пола или когда разделяем комнату стеной/создаем новый пол)
	getDepthActFloor()
	{
		let depth = undefined;
		
		const idActLevel = myLevels.getIdActLevel();
		
		const { floors } = myLevels.getDestructObject(idActLevel);
			
		if(floors.length > 0) 
		{
			depth = myHouse.myFloor.getDepthFloor({floor: floors[0]});
		}				
		
		return depth;
	}

	// проверяем, 2 точки принадлежат ли одной зоне или нет (не исользуется, закомментино, хз, надо ли это вообще и так норм работает)
	checkeQuallyPointsZone(p1, p2)
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
	
	
	// ищем замкнутый контур помещения
	getRoomContour(arr, point)
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
				if(arr[0] != arrD[i][1]) { return this.getRoomContour(arr, arrD[i][1]); }
				else { arr[arr.length] = arrD[i][1]; break; }						
			}
		}
		
		return arr;
	}



	//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
	checkClockWise( arrP )
	{  
		let res = 0;
		const n = arrP.length;
		
		for (let i = 0; i < n; i++) 
		{
			const p1 = arrP[i].position;
			let p2 = new THREE.Vector3();
			let p3 = new THREE.Vector3();
			
			if (i == 0)
			{
				p2 = arrP[n-1].position;
				p3 = arrP[i+1].position;					
			}
			else if (i == n-1)
			{
				p2 = arrP[i-1].position;
				p3 = arrP[0].position;			
			}
			else
			{
				p2 = arrP[i-1].position;
				p3 = arrP[i+1].position;			
			}
			
			res += p1.x*(p2.z - p3.z);
		}
		
		
		res = res / 2;
		res = Math.round(res * 10) / 10;
		
		return res;
	}


	// проверяем если зона с такими же точками
	detectEqualZone( arrRoom, arrP )
	{
		let flag = false;
		
		for ( let i = 0; i < arrRoom.length; i++ )
		{
			let ln = 0;
			
			if(arrRoom[i].userData.room.p.length != arrP.length) { continue; }
				
			for ( let i2 = 0; i2 < arrRoom[i].userData.room.p.length - 1; i2++ )
			{
				for ( let i3 = 0; i3 < arrP.length - 1; i3++ )
				{
					if(arrRoom[i].userData.room.p[i2] == arrP[i3]) { ln++; }
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


	// получаем стены принадлежащие контуру и как они расположены
	compileArrPointRoom_1(p)
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



	// добавляем к точкам параметр зона и предыдущая точка
	addParamPointOnZone(arrP, zone)
	{
		for ( let i = 0; i < arrP.length - 1; i++ ) 
		{  
			let k1 = (i == 0) ? arrP.length - 2 : i - 1;				
			let f = arrP[i].zone.length;
			arrP[i].zone[f] = zone; 
			arrP[i].zoneP[f] = arrP[k1]; 		
		}		
	}


	// находим потолок, который соответсвует полу
	findNumberInArrRoom(arr) 
	{
		var arrN = [];
		if(!Array.isArray(arr)) { var res = arr; var arr = [res]; }
		
		for ( var i = 0; i < arr.length; i++ )
		{
			for ( var i2 = 0; i2 < room.length; i2++ )
			{
				if(room[i2] == arr[i]) { arrN[i] = { floor : room[i2], ceiling : ceiling[i2] }; break; }
			}		
		}	
		
		return arrN;
	}


	// удаляем выбранные зоны 
	deleteArrZone(arrRoom)
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

		this.deletePointZone(arrRoom);
		
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
	deletePointZone(arrRoom)
	{
		for ( var i = 0; i < arrRoom.length; i++ )
		{
			for ( var i2 = 0; i2 < arrRoom[i].userData.room.p.length; i2++ )
			{
				for ( var i3 = 0; i3 < arrRoom[i].userData.room.p[i2].zone.length; i3++ )
				{
					if(arrRoom[i].userData.room.p[i2].zone[i3] == arrRoom[i])
					{ 
						arrRoom[i].userData.room.p[i2].zone.splice(i3, 1);
						arrRoom[i].userData.room.p[i2].zoneP.splice(i3, 1); 
						break;
					}							
				}
			}
		}
	}

	// при добавлении или удалении точки, передаем параметры страх зон новым 
	// находим одинаковые зоны (старые(которые были удалены) и новые (которые были созданны)), сравниванием кол-во совпавших точек
	assignOldToNewZones_1( oldZ, newZones, cdm ) 
	{
		// у новой зоны должно быть на 1 точку (на 2, если считать p.length) меньше одинаковых точек
		for ( var i = 0; i < newZones.length; i++ ) 
		{
			for ( var i2 = 0; i2 < oldZ.length; i2++ ) 
			{ 			
				var oldZones = oldZ[i2].floor; 
				var count = 0;
				
				for ( var i3 = 0; i3 < newZones[i].userData.room.p.length - 1; i3++ )
				{
					for ( var i4 = 0; i4 < oldZones.userData.room.p.length - 1; i4++ )
					{
						if(newZones[i].userData.room.p[i3].userData.id == oldZones.userData.room.p[i4].userData.id) { count++; break; };
					}				
				}

				
				if(cdm == 'add') { var countNew = newZones[i].userData.room.p.length - 2; }
				else if(cdm == 'delete') { var countNew = newZones[i].userData.room.p.length - 1; }
				else if(cdm == 'copy') { var countNew = newZones[i].userData.room.p.length - 1; }
				
				if(countNew == count)
				{
					this.assignOldToNewZones_2([newZones[i]], oldZ[i2], false);				
					break;
				}			
			}
		}

	}


	// замыкаем точку (создание новой комнаты/зоны) 
	// берем у замыкающей точки стену и у этой стены находим центр, а затем бросаем луч и определяем какую зону он делит
	// у этой зоны берем параметры и переносим на 2 новые зоны
	splitZone(wall) 
	{
		var oldZone = rayFurniture( wall ).obj;
		var oldZ = this.findNumberInArrRoom(oldZone);
		
		if(oldZone) { this.deleteArrZone( [oldZone] ); }			// удаляем старый пол
			
		var newZones = this.calcRoomZone();			// создаем пол, для новых помещений	
		 
		if(oldZone) { this.assignOldToNewZones_2(newZones, oldZ[0], true); } 
	}
	
	
	// переносим параметры от стрых зон к новым 
	assignOldToNewZones_2(newZones, oldZ, addId)
	{
		var newZ = this.findNumberInArrRoom(newZones);
		
		for ( var i = 0; i < newZ.length; i++ )
		{	 
			var floor = newZ[i].floor;		
			var ceiling = newZ[i].ceiling;
			
			floor.userData.id = oldZ.floor.userData.id;	
			floor.userData.material = Object.assign({}, oldZ.floor.userData.material);

			const mat = myHouse.myFloor.getMaterialFloor({floor: oldZ.floor});
			myHouse.myFloor.setMaterialFloor({floor, material: mat});  
			

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
	detectCommonZone_1( wall )
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
	


	// проверяем если зона с такими же точками (нужно saveLoad.js , загрузка файла)
	detectSameZone_2( arrRoom, arrP )
	{
		var flag = false;
		var ln = 0;
		
		if(arrRoom.userData.room.p.length - 1 != arrP.length) { return flag; }
			
		for ( var i2 = 0; i2 < arrRoom.userData.room.p.length - 1; i2++ )
		{
			for ( var i3 = 0; i3 < arrP.length; i3++ )
			{
				if(arrRoom.userData.room.p[i2].userData.id == arrP[i3]) { ln++; }
			}
		}
		
		if(arrRoom.userData.room.p.length - 1 == ln) 
		{ 
			//console.log(ln);
			//var txt = '---p---'; for ( var i3 = 0; i3 < arrP.length; i3++ ) { txt += ' | ' + arrP[i3]; } console.log(txt);	
			//var txt = '---zone---'; for ( var i3 = 0; i3 < arrRoom.p.length - 1; i3++ ) { txt += ' | ' + arrRoom.p[i3].userData.id; } console.log(txt); 
			flag = true; 
		}
		
		return flag;
	}


	// пускаем луч и определяем к какой комнате принадлежит объект
	rayDetectedRoom(cdm) 
	{	
		var ray = new THREE.Raycaster();
		ray.set( new THREE.Vector3(cdm.pos.x, 1, cdm.pos.z), new THREE.Vector3(0, -1, 0) );
		
		var intersects = ray.intersectObject( cdm.obj );	
		
		var floor = (!intersects[0]) ? null : intersects[0].object;				
		
		return { o: floor };
	}

	
	render()
	{
		renderCamera();
	}

}







