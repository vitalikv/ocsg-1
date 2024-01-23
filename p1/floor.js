


function createFloor(cdm)
{	
	var arrP = cdm.point;
	var arrW = cdm.wall;
	var arrS = cdm.side;
	var id = (cdm.id) ? cdm.id : null;
	var material = (cdm.material) ? cdm.material : null;
	
	var point_room = [];
	for ( var i = 0; i < arrP.length - 1; i++ ) 
	{  
		point_room[i] = new THREE.Vector2 ( arrP[i].position.x, arrP[i].position.z );		
	}	 
	
	var shape = new THREE.Shape( point_room );
	var geometry = new THREE.ShapeGeometry( shape );
	
	var n = room.length;	
	
	var color = 0xe3e3e5;
	
	if(infProject.settings.floor.color){ color = infProject.settings.floor.color; }
	
	var material = new THREE.MeshStandardMaterial({ color: color, lightMap: lightMap_1, dithering: true });
	
	var floor = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: infProject.settings.floor.height } ), material ); 
	room[n] = floor;
	
	//floor.position.set( 0, infProject.settings.floor.posY, 0 );
	floor.position.set( 0, arrP[0].position.y + infProject.settings.floor.height, 0 );
	floor.rotation.set( Math.PI / 2, 0, 0 );	
	floor.p = arrP;
	floor.w = arrW; 
	floor.s = arrS;	
	
	
	if(!id) { id = countId; countId++; }  
	 
	floor.userData.tag = 'room';
	floor.userData.id = id;
	floor.userData.room = {};
	floor.userData.room.areaTxt = 0;
	floor.userData.room.p = floor.p;
	floor.userData.room.w = floor.w;
	floor.userData.room.s = floor.s;
	floor.userData.room.zone = { id: undefined, name: '' };
	floor.userData.room.zone.id = -1;
	floor.userData.room.contour = [];
	floor.userData.room.height = infProject.settings.floor.height;
	floor.userData.room.html = {};
	floor.userData.room.html.label = null; 
	floor.userData.material = { tag: 'room', color: floor.material.color, img: null };	
	
	var ceil = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({ color: 0xffffff, lightMap: lightMap_1, dithering: true }) );
	ceiling[n] = ceil;
	
	ceil.position.set( 0, arrP[0].position.y + infProject.settings.height, 0 );  
	ceil.rotation.set( Math.PI / 2, 0, 0 );		
	ceil.userData.tag = 'ceiling';
	ceil.userData.id = id;
	ceil.userData.material = { tag: 'ceiling', color: ceil.material.color, img: null };
	ceil.visible = false;

	
	cdm.material = { img: "img/load/floor_1.jpg" };
	
	if(cdm.material)
	{  
		myTexture.setImage({obj: floor, material: cdm.material});	
	}
	
	if(infProject.settings.floor.o)
	{ 	
		floor.userData.room.html.label = createHtmlLabelWall({count: 1, display: 'none', tag: 'elem_type_room'})[0]; 
		
		if(infProject.settings.floor.label.visible) 
		{ 
			assignRoomType({id: floor.userData.room.zone.id, obj: floor});			 
		} 
			
		getYardageSpace([floor]); 
		scene.add(floor); 
		//scene.add(ceil);		
	}
	else
	{
		upLabelPlan_1(arrW); // если нет пола (фундамент, то считаем длину стен)
	}

	// определяем к какой стороне стены принадлежит зона и записываем зону к этой стене 
	for ( var i = 0; i < arrW.length; i++ ) 
	{ 
		var ind = (arrS[i] == 0) ? 2 : 1; 
		arrW[i].userData.wall.room.side2[ind] = floor; 
	}	
	
	addParamPointOnZone(arrP, floor);
	
	floor.castShadow = true; 
	floor.receiveShadow = true;
	ceil.castShadow = true; 
	ceil.receiveShadow = true;	
	
	return floor;
}





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




