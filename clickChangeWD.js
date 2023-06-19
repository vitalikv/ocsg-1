


	
		

// показываем линейки и контроллеры для окна/двери (собираем инфу, для перемещения линеек) 
function showRulerWD(obj)
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	   
	myHouse.myWDPoints.show( obj );		// показываем контроллеры 
	
	var wall = obj.userData.door.wall;
	
	var boundPos = [];
	
/* 	if(camera == cameraWall)
	{
		var arr = detectDirectionWall_1(wall, arrWallFront.wall[0].index, detectRoomWallSide(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();		
	} 
	else*/	
	{
		// находим (границы) позиции от выбранного окна/двери до ближайших окон/дверей/края стены
		var arr = detectDirectionWall_1(wall, 1, detectRoomWallSide(wall, 1));	
		boundPos[0] = arr[0].clone();
		boundPos[1] = arr[2].clone();
		
		var arr = detectDirectionWall_1(wall, 2, detectRoomWallSide(wall, 0));
		boundPos[2] = arr[0].clone();
		boundPos[3] = arr[2].clone();  		
	}	
	
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		if(!arrWallFront.wall[i].obj.userData.wall.html.label) continue;
		
		arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'none';
		arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'none';
		
		arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = false;
		arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = false;
	}
	
	var v = wall.userData.wall.v;
	var vZ = v[0].z + (v[4].z - v[0].z) / 2; 
	
	for ( var i = 0; i < boundPos.length; i++ ){ boundPos[i].z = vZ; boundPos[i].y = 0; wall.localToWorld( boundPos[i] ); } 

	// инфа для перемещения линеек	
	obj.userData.door.ruler.boundPos = boundPos;	
	
	// может быть myMouse.rayhit.object.userData.tag == 'controll_wd' ( когда кликнули на контроллер, а потом ввели значение в input и нажали enter )
	if(myMouse.rayhit.object.userData.tag == 'window' || myMouse.rayhit.object.userData.tag == 'door') 
	{ 
		//obj.userData.door.ruler.faceIndex = myMouse.rayhit.faceIndex; 		
		obj.userData.door.ruler.faceIndex = myMouse.rayhit.face.normal.z;
	}	 
	
	showRulerWD_2D(obj);  
}



// перемещаем линейки и лайблы 2D
function showRulerWD_2D(wd)
{
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	var wall = wd.userData.door.wall;
	
	var line = infProject.scene.size.wd_1.line;	
	var label_2 = infProject.html.wd;
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;
	
	// для label
	var dirW = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var ang2 = Math.atan2(dirW.x, dirW.z);
	if(ang2 <= 0.001){ ang2 += Math.PI / 2;  }
	else { ang2 -= Math.PI / 2; }	
	
	
	// габариты wd (начало/конец) 
	var b2 = [];
	wd.updateMatrixWorld();
	var bound = wd.geometry.boundingBox;
	b2[0] = wd.localToWorld( new THREE.Vector3(bound.min.x, 0, 0) ); 
	b2[1] = wd.localToWorld( new THREE.Vector3(bound.max.x, 0, 0) );	
	b2[0].y = b2[1].y = p1.y;
	
	
	// габариты wall (начало/конец)
	var pw = [];
	
	if(1==2)	// расстояние не от одной стены, а от нескольких, если они образуют единую стену
	{
		pw[0] = wd.userData.door.ruler.boundPos[0]; 	// wall == v[0].x
		pw[1] = wd.userData.door.ruler.boundPos[1]; 	// wall == v[6].x 
		pw[2] = wd.userData.door.ruler.boundPos[2]; 	// wall == v[4].x
		pw[3] = wd.userData.door.ruler.boundPos[3]; 	// wall == v[10].x		
	}
	else
	{
		pw[0] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[0].x, 0, 0) ); 
		pw[1] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[6].x, 0, 0) ); 
		pw[2] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[4].x, 0, 0) ); 
		pw[3] = wall.localToWorld( new THREE.Vector3(wall.userData.wall.v[10].x, 0, 0) );		
	}		 	
	
	// смщение от центра до краев стены
	var dirW = wall.getWorldDirection(new THREE.Vector3());
	var offset_1 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[0].z ).multiplyScalar( 1.3 );
	var offset_2 = new THREE.Vector3().addScaledVector( dirW, wall.userData.wall.v[4].z ).multiplyScalar( 1.3 );


	var dir = [];
	dir[0] = new THREE.Vector3().subVectors( p2, p1 ).normalize();
	dir[1] = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	
	// массив с позициями начала/конца линейки, смещение от центра стены, начальное направление линейки
	var arrP = [];
	arrP[0] = {p1: b2[0], p2: pw[0], offset: offset_1, dir: dir[0]};
	arrP[1] = {p1: b2[1], p2: pw[1], offset: offset_1, dir: dir[1]};
	arrP[2] = {p1: b2[0], p2: pw[2], offset: offset_2, dir: dir[0]};
	arrP[3] = {p1: b2[1], p2: pw[3], offset: offset_2, dir: dir[1]};			
	arrP[4] = {p1: b2[0], p2: b2[1], offset: offset_1, dir: dir[1]};
	arrP[5] = {p1: b2[0], p2: b2[1], offset: offset_2, dir: dir[1]};
	
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var d = arrP[i].p1.distanceTo( arrP[i].p2 );	
		
		var v = line[i].geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = -d/2;
		v[3].x = v[2].x = v[5].x = v[4].x = d/2;		
		line[i].geometry.verticesNeedUpdate = true;			
		
		var pos = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).divideScalar( 2 ).add(arrP[i].p2);	
		
		// если wd выходит за пределы wall, то ставим отрицательное значение в label
		if(1==1)
		{
			var dir = new THREE.Vector3().subVectors( arrP[i].p1, arrP[i].p2 ).normalize();			
			d = (dir.dot(arrP[i].dir) < - 0.99) ? -d : d;
		}
		
		line[i].position.copy(pos).add(arrP[i].offset);
		line[i].rotation.copy(wall.rotation);		
					
		label_2[i].textContent = Math.round(d * 100) / 100;
		label_2[i].userData.elem.pos = pos.clone().add(arrP[i].offset.clone().multiplyScalar( 2 ));		
		label_2[i].style.transform = 'translate(-50%, -50%) rotate('+THREE.Math.radToDeg(-ang2)+'deg)';
		label_2[i].style.display = 'block';
		label_2[i].userData.elem.show = true;
		
		upPosLabels_2({elem: label_2[i]});		
		
		line[i].visible = true;			
		line[i].updateMatrixWorld();
		
		for ( var i2 = 0; i2 < line[i].userData.rulerwd.cone.length; i2++ )
		{
			var cone = line[i].userData.rulerwd.cone[i2];
			
			var xp = v[0].x;
			var zr = -Math.PI/2;
			
			if(i2 == 1) { xp = v[3].x; zr = Math.PI/2; }
			
			var pos = line[i].localToWorld( new THREE.Vector3(xp, 0, 0) );
			cone.position.copy(pos);
			cone.rotation.set(-Math.PI/2, 0, wall.rotation.y-zr);
			
			cone.visible = true;
		}
	}
		
}






 


