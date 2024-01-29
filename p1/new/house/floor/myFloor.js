

class MyFloor 
{
	material;
	toolFloor;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.material = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, lightMap: lightMap_1, dithering: true });
		
		//this.toolFloor = this.createPlaneOutlineFloor();
	}
		

	// создаем участок пола
	createFloor({points, walls, sides, depth = 0.01, id = null})
	{
		const geometry = this.crGeometry({type: 'extrude', points, depth});		
		
		const floor = new THREE.Mesh( geometry, [this.material.clone(), this.material.clone()] ); 
		floor.position.set( 0, points[0].position.y, 0 );
		//floor.rotation.set( -Math.PI / 2, 0, 0 );		

		if(!id) { id = countId; countId++; }
		
		floor.userData.tag = 'room';
		floor.userData.id = id;
		floor.userData.room = {};
		floor.userData.room.areaTxt = 0;
		floor.userData.room.p = points;
		floor.userData.room.w = walls;
		floor.userData.room.s = sides;
		floor.userData.room.zone = { id: undefined, name: '' };
		floor.userData.room.zone.id = -1;
		floor.userData.room.contour = [];
		floor.userData.room.depth = depth;
		floor.userData.room.html = {};
		floor.userData.room.html.label = null; 
		floor.userData.material = { tag: 'room', color: floor.material[0].color, img: null };
		

		myTexture.setImage({obj: floor, material: { img: "img/load/floor_1.jpg" }});

		floor.userData.room.html.label = createHtmlLabelWall({count: 1, display: 'none', tag: 'elem_type_room'})[0]; 		
		if(infProject.settings.floor.label.visible) assignRoomType({id: floor.userData.room.zone.id, obj: floor});
		
		getYardageSpace([floor]);
		
		// определяем к какой стороне стены принадлежит зона и записываем зону к этой стене 
		for ( let i = 0; i < walls.length; i++ ) 
		{ 
			let ind = (sides[i] == 0) ? 2 : 1; 
			walls[i].userData.wall.room.side2[ind] = floor; 
		}	
		
		myHouse.myRoom.addParamPointOnZone(points, floor);		
		
		scene.add(floor);
		
		room.push(floor);
		
		this.createCeil({id, points});
		
		return floor;
	}
	
	
	createCeil({id, points})
	{
		const geometry = this.crGeometry({type: 'plane', points});
		
		const ceil = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({ color: 0xff0000, lightMap: lightMap_1, dithering: true }) );
		ceiling.push(ceil);
		
		ceil.position.set( 0, points[0].position.y + infProject.settings.height, 0 );  
		ceil.rotation.set( Math.PI / 2, 0, 0 );		
		ceil.userData.tag = 'ceiling';
		ceil.userData.id = id;
		ceil.userData.material = { tag: 'ceiling', color: ceil.material.color, img: null };
		ceil.visible = false;

		//scene.add(ceil);
	}
	
	
	// создаем новую пола или потолка
	crGeometry({type = 'plane', points, depth = 0})
	{
		let geometry = null;
		
		const form = [];
		for ( let i = 0; i < points.length - 1; i++ ) 
		{  
			form.push(new THREE.Vector2(points[i].position.x, -points[i].position.z));		
		}	 
		
		const shape = new THREE.Shape( form );
		
		if(type === 'extrude')
		{
			geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth });
			geometry.rotateX(-Math.PI / 2);
						
			this.upFaceGeometry({geometry});

			boxUnwrapUVs(geometry);
		}
		if(type === 'plane')
		{
			geometry = new THREE.ShapeGeometry( shape );
		}
		
		return geometry;
	}
	
	
	// нужно чтобы нижняя и верхняя часть пола показывали разные материалы
	upFaceGeometry({geometry})
	{
		geometry.computeFaceNormals();
		
		for ( let i = 0; i < geometry.faces.length; i++ )
		{
			geometry.faces[i].normal.normalize();
			if(geometry.faces[i].normal.y === -1) { geometry.faces[i].materialIndex = 1; } 
			else { geometry.faces[i].materialIndex = 0; }
		}		
	}
	
	
	// получаем высоту пола
	getDepthFloor({floor})
	{
		return floor.userData.room.depth;
	}
	
	
	// получаем материал пола (верхнюю часть, та что с текстурой)
	getMaterialFloor({floor})
	{
		return floor.material[0];
	}	

	// назначаем материал для пола (верхнюю часть, та что с текстурой)
	setMaterialFloor({floor, material})
	{
		floor.material[0] = material.clone();
	}	
	
	// при изменении формы пола обновляем geometry.faces
	updateShapeFloors(arrRoom)
	{  	
		for ( let i = 0; i < arrRoom.length; i++ ) 
		{
			const points = arrRoom[i].userData.room.p;
			
			const depth = this.getDepthFloor({floor: arrRoom[i]});
			arrRoom[i].geometry.dispose();
			arrRoom[i].geometry = this.crGeometry({type: 'extrude', points, depth});

			getYardageSpace([arrRoom[i]]); 

			// потолок	
			let num = -1;	
	
			const arrFl = infProject.scene.array.floor;
			const arrCeil = infProject.scene.array.ceiling;
			
			for ( let i2 = 0; i2 < arrFl.length; i2++ ) { if(arrFl[i2].userData.id == arrRoom[i].userData.id) { num = i2; break; } }	// находим потолок	
			
			if(num > -1)
			{
				arrCeil[num].geometry.dispose();			
				arrCeil[num].geometry = this.crGeometry({type: 'plane', points});				
			}
		}
	}
	
	
	// изменить высоту всех полов на активном этаже
	changeDepthFloorsOnLevel({depth, floors = null})
	{
		const idActLevel = myLevels.getIdActLevel();
		
		if(!floors) 
		{
			const house = myLevels.getDestructObject(idActLevel);
			floors = house.floors;
		}
		
		for ( let i = 0; i < floors.length; i++ )
		{
			floors[i].userData.room.depth = depth;
		}
		
		this.updateShapeFloors(floors);
		
		this.render();
	}


	// создаем плоскость для пола, которая будет принемать ее форму и виделяться Outline 
	// пока отключено, нужно будет доделать и включить (была проблема при обрезании крышей пола, нужно рассчитывать корректный контур)
	createPlaneOutlineFloor()
	{
		var shape = new THREE.Shape( [new THREE.Vector2(-2, 1), new THREE.Vector2(2, 1), new THREE.Vector2(2, -1), new THREE.Vector2(-2, -1)] );
		var geometry = new THREE.ShapeGeometry( shape );

		var plane = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: 0x0000ff, transparent: true, opacity: 0 } ) );
		plane.position.set( 0, infProject.settings.floor.posY, 0 );
		plane.rotation.set( -Math.PI / 2, 0, 0 );
		//plane.visible = false; // когда буду делать, то это удалить
		scene.add(plane);

		return plane;
	}

	// кликнули на пол
	clickFloor({obj})
	{
		// меняем форму плоскости под форму пола и выделяем outline
		// TODO: прячем выделенный пол(клон с измененной геометрией), потому что при обрезки пола(клона) крышей,
		// нужно дополнительно будет делать доп.расчеты для геометрии. вообщем долго объяснять 			
		if(1===2)
		{
			const contour = obj.userData.room.contour;
			const contour2 = [];
			
			for(let i = 0; i < contour.length; i++)
			{
				contour2[i] = new THREE.Vector2(contour[i].x, -contour[i].z);
			}

			const plane = this.toolFloor;	
			plane.geometry.dispose();
			plane.geometry = new THREE.ShapeGeometry( new THREE.Shape(contour2) );
			plane.userData.floorId = obj.userData.id;	// нужно чтобы понять к какому полу приклеплен
			myComposerRenderer.outlineAddObj({arr: [plane]});			
		}
		else
		{
			myComposerRenderer.outlineAddObj({arr: [obj]});
			myPanelR.myContentObj.activeObjRightPanelUI_1({obj});			
		}			
	}	
	
	render()
	{
		renderCamera();
	}
}







