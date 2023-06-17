

var param_win = { click : false };




// находим у окна/двери ближайшие объекты (ограничевающие перемещение)
// если их нету, то находим концы стены
function findOnWallWD(wd)
{
	wd.geometry.computeBoundingBox();
	
	var wall = wd.userData.door.wall;
	wall.geometry.computeBoundingBox();	
	
	var off = 0.0;	// отступы от краев
	var off_2 = 0.0;
	
	wd.userData.door.bound = { min : { x : wall.geometry.boundingBox.min.x + off, y : wall.geometry.boundingBox.min.y + off_2 }, max : { x : wall.geometry.boundingBox.max.x - off, y : wall.geometry.boundingBox.max.y - off } };
	
	//var arrWD = wallLeftRightWD_2(wd);
	var arrWD = {};
	if(arrWD.left && 1==2)
	{
		arrWD.left.updateMatrixWorld();
		var pos = arrWD.left.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.left.geometry.vertices, pos);
		
		var pos = arrWD.left.localToWorld( arrWD.left.geometry.vertices[n].clone() );		
		
		wd.userData.door.bound.min.x = wall.worldToLocal( pos.clone() ).x + off;
	}
	

	if(arrWD.right && 1==2)
	{
		arrWD.right.updateMatrixWorld();
		var pos = arrWD.right.worldToLocal( wd.position.clone() );	 	
		var n = getMinDistanceVertex(arrWD.right.geometry.vertices, pos);
		
		var pos = arrWD.right.localToWorld( arrWD.right.geometry.vertices[n].clone() );
		
		wd.userData.door.bound.max.x = wall.worldToLocal( pos.clone() ).x - off;
	}		
	
	wd.userData.door.last.pos = wd.position.clone();	
}




// определяем есть ли между окном другие окна/двери и находим ближайшие
function wallLeftRightWD_2(wd)
{	
	var wall = wd.userData.door.wall;

	wall.updateMatrixWorld();
	
	var posC = wall.worldToLocal( wd.position.clone() );	// позиция главного окна относительно стены
	
	var arrL = { x : 99999, o : null }, arrR = { x : 99999, o : null };
	
	for ( var i = 0; i < wall.userData.wall.arrO.length; i++ )
	{		
		if(wall.userData.wall.arrO[i] == wd) continue;
		
		var v = wall.worldToLocal( wall.userData.wall.arrO[i].position.clone() );
		
		var x = Math.abs(v.x - posC.x); 
		
		if (v.x <= posC.x) { if(x < arrL.x) { arrL.x = x; arrL.o = wall.userData.wall.arrO[i]; } }
		else { if(x < arrR.x) { arrR.x = x; arrR.o = wall.userData.wall.arrO[i]; } }		
	}	
	
	return { left : arrL.o, right : arrR.o };
}




// находим ближайшую точку к выброанной позиции
function getMinDistanceVertex(v, pos)
{
	var minDist = 99999;
	var hit = 0;

	for ( var i = 0; i < v.length; i++ )
	{
		var dist = pos.distanceTo(v[i]);
		if (dist <= minDist)
		{
			minDist = dist;
			hit = i;
		}
	}	

	return hit;
}


 



var objsBSP = null;
var objClone = new THREE.Mesh();
var wallClone = new THREE.Mesh();



// скрываем размеры и котнроллеры у окна/двери
function hideSizeWD( obj )
{	
	
	if(myMouse.rayhit) 
	{
		if(myMouse.rayhit.object == obj) return;	// кликнули на один и тот же активный объект
		
		if(myMouse.rayhit.object.userData.tag == 'controll_wd')
		{
			if(myMouse.rayhit.object.userData.controll_wd.obj == obj) { return; }
		}		
	}		
		
	if(obj && myCameraOrbit.activeCam.userData.isCam2D)
	{
		if(obj.userData.tag == 'door' || obj.userData.tag == 'window')
		{
			for ( var i = 0; i < arrWallFront.wall.length; i++ )
			{
				if(!arrWallFront.wall[i].obj.userData.wall.html.label) continue;
				
				arrWallFront.wall[i].obj.userData.wall.html.label[0].style.display = 'block';
				arrWallFront.wall[i].obj.userData.wall.html.label[1].style.display = 'block';
				 
				arrWallFront.wall[i].obj.userData.wall.html.label[0].userData.elem.show = true;
				arrWallFront.wall[i].obj.userData.wall.html.label[1].userData.elem.show = true;	

				upPosLabels_2({elem: arrWallFront.wall[i].obj.userData.wall.html.label[0]});
				upPosLabels_2({elem: arrWallFront.wall[i].obj.userData.wall.html.label[1]});
			}					
		}			
	}
	
	for ( var i = 0; i < infProject.tools.controllWD.length; i++ ) { infProject.tools.controllWD[i].visible = false; }
	for ( var i = 0; i < infProject.scene.size.wd_1.line.length; i++ ) 
	{ 
		var line = infProject.scene.size.wd_1.line[i];
		line.visible = false; 
		for ( var i2 = 0; i2 < line.userData.rulerwd.cone.length; i2++ )
		{
			line.userData.rulerwd.cone[i2].visible = false; 
		}	
	}
	
	for ( var i = 0; i < infProject.html.wd.length; i++ )
	{ 
		infProject.html.wd[i].style.display = 'none'; 
		infProject.html.wd[i].userData.elem.show = false;
	}
}


// кликнули на окно/дверь (показываем длина/ширина/высота )
function showTableWD(wd)
{			
	wd.geometry.computeBoundingBox();
	
	var minX = wd.geometry.boundingBox.min.x;
	var maxX = wd.geometry.boundingBox.max.x;
	var minY = wd.geometry.boundingBox.min.y;
	var maxY = wd.geometry.boundingBox.max.y;

	var d1 = Math.abs( maxX - minX );		
	var d2 = Math.abs( maxY - minY );			
	
	$('[nameId="size-wd-length"]').val(Math.round(d1 * 100) / 100);
	$('[nameId="size-wd-height"]').val(Math.round(d2 * 100) / 100);
	$('[nameId="rp_wd_h1"]').val(Math.round((wd.userData.door.h1 + minY) * 100) / 100);
}



// измененяем ширину и высоту окна/двери, высоту над полом
function inputWidthHeightWD(wd)
{  
	if(!wd) return;
	if(wd.userData.tag == 'window' || wd.userData.tag == 'door'){}
	else { return; }
	
	var wall = wd.userData.door.wall;
	
	var x = $('[nameId="size-wd-length"]').val();		// ширина окна	
	var y = $('[nameId="size-wd-height"]').val();		// высота окна
	var h = $('[nameId="rp_wd_h1"]').val();				// высота над полом	
	
	
	
	wd.geometry.computeBoundingBox();
	var x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
	var y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));
	var h2 = wd.userData.door.h1 + wd.geometry.boundingBox.min.y;	
		
	var resX = checkNumberInput({ value: x, unit: 1, limit: {min: 0.1, max: 5} });
	var resY = checkNumberInput({ value: y, unit: 1, limit: {min: 0.1, max: 5} });
	var resH = checkNumberInput({ value: h, unit: 1, limit: {min: 0, max: 5} });
	
	x = (!resX) ? x2 : resX.num;
	y = (!resY) ? y2 : resY.num;	 
	h = (!resH) ? h2 : resH.num;
	
	
	wd.userData.door.h1 = h - wd.geometry.boundingBox.min.y - (y2 - y)/2;    // вычитаем изменение высоты окна/двери  
	
	var pos = wd.position.clone(); 
	pos.y = wd.userData.door.h1; 
	
	сhangeSizePosWD( wd, pos, x, y );	// изменяем размер окна/двери, а также перемещаем
	
	wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
	wallClone.position.copy( wd.userData.door.wall.position ); 
	wallClone.rotation.copy( wd.userData.door.wall.rotation );	 	

	MeshBSP( wd, { wall : wallClone, wd : createCloneWD_BSP( wd ) } ); 	
	
	wd.updateMatrixWorld();
	
	showRulerWD(wd);	// показываем линейки и контроллеры для окна/двери	
	showTableWD(wd);	// обновляем меню
	
	calcSvgFormWD({obj: wd});
	
	renderCamera();
}




// изменяем размер окна/двери, а также перемещаем
function сhangeSizePosWD( wd, pos, x, y )
{	
	var v = wd.geometry.vertices;
	var v2 = wd.userData.door.form.v2;
	var size = wd.userData.door.form.size;
	
	var scale = new THREE.Vector3(x/size.x, y/size.y, 1);	
	
	for ( var i = 0; i < v2.length; i++ )
	{
		v[i].x = v2[i].x * scale.x;
		v[i].y = v2[i].y * scale.y;
		//v[i].z *= obj3D.scale.z;
	}		

	wd.geometry.verticesNeedUpdate = true;
	wd.geometry.elementsNeedUpdate = true;	
	wd.geometry.computeBoundingSphere();

	wd.position.copy( pos );
	
	 
	// изменяем у ПОП объекта ширину/высоту/центрируем 
	if(wd.userData.door.obj3D)
	{
		wd.updateMatrixWorld();
		wd.geometry.computeBoundingBox();
		wd.geometry.computeBoundingSphere();
		var x = wd.geometry.boundingBox.max.x - wd.geometry.boundingBox.min.x;
		var y = wd.geometry.boundingBox.max.y - wd.geometry.boundingBox.min.y;		
		
		var obj3D = wd.userData.door.obj3D;
		
		obj3D.geometry.computeBoundingBox();		
		var dX = obj3D.geometry.boundingBox.max.x - obj3D.geometry.boundingBox.min.x;
		var dY = obj3D.geometry.boundingBox.max.y - obj3D.geometry.boundingBox.min.y;				
		
		obj3D.scale.set(x/dX, y/dY, 1);	

		setPosWD_Obj3D({wd});
	}	
}







