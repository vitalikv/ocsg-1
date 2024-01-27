





// добавляем к точкам параметр зона и предыдущая точка
function addParamPointOnZone(arrP, zone)
{
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		var k1 = (i == 0) ? arrP.length - 2 : i - 1;				
		var f = arrP[i].zone.length;
		arrP[i].zone[f] = zone; 
		arrP[i].zoneP[f] = arrP[k1]; 		
	}		
}



// добавляем к точкам параметр зона и предыдущая точка
function replaceParamPointOnZone(zone, newPoint, replacePoint)
{
	for ( var i = 0; i < zone.length; i++ )  
	{  		
		for ( var i2 = 0; i2 < zone[i].p.length; i2++ )
		{
			if(zone[i].p[i2] == replacePoint) { zone[i].p[i2] = newPoint; }
		}			
	}			
}







// находим потолок, который соответсвует полу
function findNumberInArrRoom(arr) 
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




// создаем плоскость для пола, которая будет принемать ее форму и виделяться Outline
function createPlaneOutlineFloor()
{
	var shape = new THREE.Shape( [new THREE.Vector2(-2, 1), new THREE.Vector2(2, 1), new THREE.Vector2(2, -1), new THREE.Vector2(-2, -1)] );
	var geometry = new THREE.ShapeGeometry( shape );

	var plane = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0x0000ff, transparent: true, opacity: 0 } ) );
	plane.position.set( 0, infProject.settings.floor.posY, 0 );
	plane.rotation.set( -Math.PI / 2, 0, 0 );
	plane.visible = false; // когда буду делать, то это удалить
	scene.add(plane);

	return plane;
}

// кликнули на пол
function clickFloor({obj})
{	
	const contour = obj.userData.room.contour;
	const contour2 = [];
	
	for(let i = 0; i < contour.length; i++)
	{
		contour2[i] = new THREE.Vector2(contour[i].x, -contour[i].z);
	}

	// меняем форму плоскости под форму пола и выделяем outline
	const plane = infProject.tools.floorPl;	
	plane.geometry.dispose();
	plane.geometry = new THREE.ShapeGeometry( new THREE.Shape(contour2) );	
	//myComposerRenderer.outlineAddObj({arr: [plane]});
	
	
	// TODO: прячем выделенный пол(клон с измененной геометрией), потому что при обрезки пола(клона) крышей,
	// нужно дополнительно будет делать доп.расчеты для геометрии. вообщем долго объяснять 
	plane.visible = false;	
	myComposerRenderer.outlineAddObj({arr: [obj]});
	plane.userData.floorId = obj.userData.id;	// нужно чтобы понять к какому полу приклеплен
	
	myPanelR.myContentObj.activeObjRightPanelUI_1({obj});
}




