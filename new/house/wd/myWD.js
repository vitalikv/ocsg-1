

class MyWD 
{
	matW;	// материал для окон 
	matD;	// материал для дверей
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.matW = new THREE.MeshStandardMaterial({ color: 0xe3e3e3, transparent: true, opacity: 1.0, depthTest: false });
		this.matD = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 1.0, depthTest: false });		
	}

	createWD(cdm = {})
	{
		const type = (cdm.type) ? cdm.type : 'door';	
			
		const obj = this.createShape({type: (cdm.lotid === -2) ? 'gate' : type, size: cdm.size})

		const v = obj.geometry.vertices;
		
		const minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
		
		for ( let i = 0; i < v.length; i++ )
		{
			v[i].z = Math.round(v[i].z * 100) / 100;
			if(v[i].z === 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
			if(v[i].z === 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
		}
		
		obj.geometry.computeBoundingBox();	
		
		for ( let i = 0; i < v.length; i++ )
		{
			if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
			if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
			if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
			if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
		}		
		
		const form = { type: '' , v: { minX, maxX, minY, maxY, minZ, maxZ }, v2: [], size: new THREE.Vector3() };	
		
		obj.userData.tag = 'free_dw';
		obj.userData.door = {};
		obj.userData.door.type = type;
		obj.userData.door.size = new THREE.Vector3();
		obj.userData.door.form = form;
		obj.userData.door.bound = {}; 
		obj.userData.door.width = 0.2;
		obj.userData.door.h1 = 0;		// высота над полом
		//obj.userData.door.color = obj.material.color; 
		obj.userData.door.wall = null;
		obj.userData.door.controll = {};
		obj.userData.door.ruler = {};
		obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
		obj.userData.door.topMenu = true;
		obj.userData.door.lotid = (cdm.lotid)? cdm.lotid : null;
		obj.userData.door.obj3D = null;
		obj.userData.door.openId = (cdm.openId !== undefined) ? cdm.openId : 0;
		obj.userData.door.svg = {el: null, path: null, arc: null};
		obj.userData.door.nameRus = (type === 'door') ? 'дверь' : 'окно';
		

		
		this.createSvg({obj});
		
		
		//default размеры
		if(1==1)
		{
			obj.geometry.computeBoundingBox();		
			var dX = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
			var dY = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;			
			
			obj.userData.door.form.size = new THREE.Vector3(dX, dY, 1);
			
			var h1 = (type == 'window') ? infProject.settings.wind.h1 : 0;
			 
			obj.userData.door.h1 = h1 - obj.geometry.boundingBox.min.y; 

			//if(cdm.pos) { obj.userData.door.h1 = cdm.pos.y - obj.geometry.boundingBox.min.y; }
		}
			
		//default vertices
		if(1==1)
		{
			const v2 = [];
			for ( let i = 0; i < obj.geometry.vertices.length; i++ ) { v2[i] = obj.geometry.vertices[i].clone(); }
			obj.userData.door.form.v2 = v2;		
		}
		
		upUvs_4( obj );
		
		scene.add( obj );
		
		
		if(cdm.status)
		{
			obj.userData.id = cdm.id;
			obj.position.copy(cdm.pos);
			
			obj.position.y += (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2; 	
			
			changeWidthWD(obj, cdm.wall);		// выставляем ширину окна/двери равную ширине стены
			addWD({ obj: obj });
		}

		return obj;
	}		

	
	// создаем форму под окно, чтобы можно было врезать в стены
	createShape({type, size})
	{
		let x = 0;
		let y = 0;
			
		if(size)
		{
			x = size.x/2;
			y = size.y/2;		
		}
		else if(type === 'window')
		{
			x = infProject.settings.wind.width / 2;
			y = infProject.settings.wind.height / 2;			
		}
		else if(type === 'door')
		{
			x = infProject.settings.door.width / 2;
			y = infProject.settings.door.height / 2;			
		}
		else if(type === 'gate')
		{
			x = infProject.settings.gate.width / 2;
			y = infProject.settings.gate.height / 2;			
		}			
		
		const spline = [];
		spline[0] = new THREE.Vector2( -x, -y );	
		spline[1] = new THREE.Vector2( x, -y );
		spline[2] = new THREE.Vector2( x, y );
		spline[3] = new THREE.Vector2( -x, y );		
		
		
		const material = (type === 'window') ? this.matW : this.matD;
		const shape = new THREE.Shape( spline );
		// material.clone() нужно клонировать, чтобы была возможность скрывать у стен окна/двери
		const obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material.clone() );

		return obj;
	}


	// создаем svg объект для 2D
	createSvg({obj})
	{
		const count = 1;
		const color = infProject.settings.svg.scaleBox.color;
		const fillColor = (obj.userData.tag === 'door') ? '#e0e0e0' : '#ffffff';
		
		obj.userData.door.svg.el = createSvgPath({count, color, fill: '#ffffff', stroke_width: "1px"})[0];
				
		if(obj.userData.door.lotid > 0) obj.userData.door.svg.path = createSvgPath({count, color, fill: fillColor, stroke_width: "1px"})[0];
		
		if(obj.userData.tag === 'door' && obj.userData.door.lotid > 0)
		{
			obj.userData.door.svg.arc = createSvgArc({count, color})[0];
		}		
		
		//обновляем svg форму
		calcSvgFormWD({obj});		
	}
}






