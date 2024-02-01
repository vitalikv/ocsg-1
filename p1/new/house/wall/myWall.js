

class MyWall 
{

	
	constructor()
	{
		
	}

	createWall( cdm )
	{ 
		var point1 = cdm.p[0];
		var point2 = cdm.p[1];
		var width = (cdm.width) ? cdm.width : infProject.settings.wall.width;
		var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;  
		var height = (cdm.height) ? cdm.height : infProject.settings.height; 
		
		var p1 = point1.position;
		var p2 = point2.position;	
		var d = p1.distanceTo( p2 );
		
		// default material
		{
			var color = [0x7d7d7d, 0x696969]; 	
			
			if(infProject.settings.wall.color) 
			{  
				if(infProject.settings.wall.color.front) color[0] = infProject.settings.wall.color.front; 
				if(infProject.settings.wall.color.top) color[1] = infProject.settings.wall.color.top; 
			}	
			
			var material = new THREE.MeshPhongMaterial({ color : color[0], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
			var materialTop = new THREE.MeshPhongMaterial({ color: color[1], transparent: true, opacity: 1, lightMap : lightMap_1, dithering: true, precision: 'highp' });
			
			var material = new THREE.MeshStandardMaterial({ color : color[0], transparent: true, opacity: 1 });
			var materialTop = new THREE.MeshStandardMaterial({ color : color[1], transparent: true, opacity: 1 });
			var materials = [ material.clone(), material.clone(), material.clone(), materialTop ];	
		}
		
		
		var geometry = createGeometryWall(d, height, width, offsetZ);	
		var wall = new THREE.Mesh( geometry, materials ); 
		wall.position.copy( p1 );
		
		// --------------
		if(!cdm.id) { cdm.id = countId; countId++; }
		
		wall.userData.tag = 'wall';
		wall.userData.id = cdm.id;
		
		wall.userData.wall = {};				
		wall.userData.wall.p = [];
		wall.userData.wall.p[0] = point1;
		wall.userData.wall.p[1] = point2;	
		wall.userData.wall.width = Math.round(width * 100) / 100;
		wall.userData.wall.height_0 = 0;
		wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
		wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
		wall.userData.wall.arrO = [];
		wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
		wall.userData.wall.area = { top : 0 }; 
		//wall.userData.wall.active = { click: true, hover: true };	
		wall.userData.wall.room = { side : 0, side2 : [null,null,null] };
		wall.userData.wall.html = {};
		//wall.userData.level = myLevels.activeId;
		
		if(infProject.settings.html.fonts.wall.show)
		{
			wall.userData.wall.html.label = createHtmlLabelWall({count: 2, tag: 'elem_wall_size'});
		}
		
		wall.userData.wall.svg = {};
		wall.userData.wall.svg.lineW = null;
		//wall.userData.wall.svg.lineW = [createSvgLine({count: 1})[0], createSvgLine({count: 1, color: '#00ff00'})[0]];
		//showElementSvg(wall.userData.wall.svg.lineW);
		wall.userData.wall.show = true;
		
		var v = wall.geometry.vertices;
		wall.userData.wall.v = [];
		
		for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
		
		wall.userData.material = [];
		wall.userData.material[0] = { index: 0, color: wall.material[0].color, img: null };	// top
		wall.userData.material[1] = { index: 1, color: wall.material[1].color, img: null };	// left
		wall.userData.material[2] = { index: 2, color: wall.material[2].color, img: null };	// right
		wall.userData.material[3] = { index: 3, color: wall.material[3].color, img: null };
		// --------------

		wall.castShadow = true;	
		wall.receiveShadow = true;
		
		upUvs_1( wall );
		
		cdm.material = [];
		cdm.material[0] = { img: "img/load/beton.jpg", index:1 };
		cdm.material[1] = { img: "img/load/beton.jpg", index:2 };
		//console.log('cdm.material', cdm);
		if(cdm.material)
		{  
			for ( var i = 0; i < cdm.material.length; i++ )
			{			
				myTexture.setImage({obj: wall, material: cdm.material[i]});
			}	
		}
		
		//console.log(wall);
		
		var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
		var angleDeg = Math.atan2(dir.x, dir.z);
		wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
		
		
		var n = point1.w.length;		
		point1.w[n] = wall;
		point1.p[n] = point2;
		point1.start[n] = 0;	
		
		var n = point2.w.length;		
		point2.w[n] = wall;
		point2.p[n] = point1;
		point2.start[n] = 1;		
		
		scene.add( wall );
		infProject.scene.array.wall.push(wall);
			
		return wall;
	}

}







