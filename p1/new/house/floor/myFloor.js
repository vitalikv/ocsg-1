

class MyFloor 
{
	geometry;
	material;
	defVert;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		//this.geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.material = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, lightMap: lightMap_1, dithering: true });
	}
		


	createFloor({points, walls, sides, depth = 0.01, id = null})
	{
		const geometry = this.crGeometry({type: 'extrude', points, depth});		
		
		const floor = new THREE.Mesh( geometry, this.material.clone() ); 
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
		floor.userData.material = { tag: 'room', color: floor.material.color, img: null };
		

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
		
		addParamPointOnZone(points, floor);		
		
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
		}
		if(type === 'plane')
		{
			geometry = new THREE.ShapeGeometry( shape );
		}
		
		return geometry;
	}
	
	
	// получаем высоту пола
	getDepthFloor({floor})
	{
		return floor.userData.room.depth;
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

			//upUvs_1( arrRoom[i] );
			boxUnwrapUVs(arrRoom[i].geometry);
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
			house = myLevels.getDestructObject(idActLevel);
			floors = house.floors;
		}
		
		console.log(idActLevel, depth, floors);
		
		for ( let i = 0; i < floors.length; i++ )
		{
			floors[i].userData.room.depth = depth;
		}
		
		this.updateShapeFloors(floors);
		
		this.render();
	}
	
	
	render()
	{
		renderCamera();
	}
}







