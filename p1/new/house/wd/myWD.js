

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
		this.initEventHtml();
	}
	
	initEventHtml()
	{
		document.querySelector('[nameId="sw_dw_1"]').onmousedown = () => { this.swSetDW_1({obj: myComposerRenderer.getOutlineObj(), type: 'r-l'}); }; 
		document.querySelector('[nameId="sw_dw_2"]').onmousedown = () => { this.swSetDW_1({obj: myComposerRenderer.getOutlineObj(), type: 't-b'}); };		
	}

	// создаем форму окна/двери/балкона (free_dw)
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
			this.addWD({ obj });
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


	// добавляем на выбранную стену окно/дверь (вырезаем форму в стене), добавляем в форму окна/двери 3D объект
	// obj 		готовая дверь/окно
	// wall		стену на которую кликнули
	async addWD({ obj })
	{	
		var wall = obj.userData.door.wall;
		var pos = obj.position;
		obj.userData.tag = obj.userData.door.type;
		
		//pos.y -= 0.001;		// делаем чуть ниже уровня пола
		obj.position.copy( pos );
		obj.rotation.copy( wall.rotation ); 
		obj.material.transparent = false;
		
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{ 
			obj.material.depthTest = false;
			obj.material.transparent = true;
			obj.material.opacity = 1.0; 		 	
		}
		else
		{ 		
			obj.material.depthTest = true;
			obj.material.transparent = true;
			obj.material.opacity = 0;					
		}	
		
		//changeWidthWD(obj, wall);		// выставляем ширину окна/двери равную ширине стены
		
		// обновляем(пересчитываем) размеры двери/окна/двери (если измениалась ширина)
		obj.geometry.computeBoundingBox(); 	
		obj.geometry.computeBoundingSphere();
	  
		
		if(!obj.userData.id) { obj.userData.id = countId; countId++; }  
		
		if(obj.userData.tag == 'window') { infProject.scene.array.window[infProject.scene.array.window.length] = obj; }
		else if(obj.userData.tag == 'door') { infProject.scene.array.door[infProject.scene.array.door.length] = obj; }

		
		//--------
		
		obj.updateMatrixWorld();
		
		wall.userData.wall.arrO[wall.userData.wall.arrO.length] = obj;
		
		obj.geometry.computeBoundingBox();
		obj.geometry.computeBoundingSphere();
		
		
		if(obj.userData.door.lotid > 0)
		{
			await loadObjServer({type: 'wd', wd: obj, lotid: obj.userData.door.lotid});
		}
		else if(obj.userData.door.lotid === -2)
		{
			obj.userData.door.nameRus = 'гаражные ворота';
			let mat2 = new THREE.MeshStandardMaterial({ color: 0x000000, lightMap : lightMap_1 });
			let obj2 = new THREE.Mesh( obj.geometry.clone(), mat2 );
			
			for ( let i = 0; i < obj2.geometry.vertices.length; i++ )
			{
				let z = obj2.geometry.vertices[i].z;
				obj2.geometry.vertices[i].z = (z < 0) ? -0.01 : 0.01;
			}
			obj2.geometry.verticesNeedUpdate = true;
			setTexture({obj: obj2, material: { img: "img/load/proflist_1.jpg" } });
			
			setObjInWD({obj: obj2}, {wd: obj});
			mat2.visible = true;	// не прячем текстуру ,т.к. это самопальный объект и в нем нету пустого box(обертки), поэтому его не прячем		
		}
		else
		{
			obj.userData.door.nameRus = 'проем';
		}
		
		//обновляем svg форму
		calcSvgFormWD({obj: obj});	
		
		
		// создаем клон двери/окна, чтобы вырезать в стене нужную форму
		let objsBSP = { wall: wall, wd: createCloneWD_BSP( obj ) };		
		MeshBSP( obj, objsBSP ); 
	
		
		this.render();
	}


	// измененяем ширину и высоту окна/двери, высоту над полом
	inputWidthHeightWD()
	{  
		const obj = myComposerRenderer.getOutlineObj();
		
		if(!obj) return;
		if(obj.userData.tag === 'window' || obj.userData.tag === 'door'){}
		else { return; }
		
		const wd = obj;
		
		const wall = wd.userData.door.wall;
		
		
		let x = document.querySelector('[nameId="size-wd-length"]').value;		// ширина окна	
		let y = document.querySelector('[nameId="size-wd-height"]').value;		// высота окна
		let h = document.querySelector('[nameId="rp_wd_h1"]').value;			// высота над полом	
		
		
		
		wd.geometry.computeBoundingBox();
		let x2 = (Math.abs(wd.geometry.boundingBox.max.x) + Math.abs(wd.geometry.boundingBox.min.x));
		let y2 = (Math.abs(wd.geometry.boundingBox.max.y) + Math.abs(wd.geometry.boundingBox.min.y));
		let h2 = wd.userData.door.h1 + wd.geometry.boundingBox.min.y;	
			
		let resX = checkNumberInput({ value: x, unit: 1, limit: {min: 0.1, max: 5} });
		let resY = checkNumberInput({ value: y, unit: 1, limit: {min: 0.1, max: 5} });
		let resH = checkNumberInput({ value: h, unit: 1, limit: {min: 0, max: 5} });
		
		x = (!resX) ? x2 : resX.num;
		y = (!resY) ? y2 : resY.num;	 
		h = (!resH) ? h2 : resH.num;
		
		
		wd.userData.door.h1 = h - wd.geometry.boundingBox.min.y - (y2 - y)/2;    // вычитаем изменение высоты окна/двери  
		
		let pos = wd.position.clone(); 
		pos.y = wd.userData.door.h1; 
		
		сhangeSizePosWD( wd, pos, x, y );	// изменяем размер окна/двери, а также перемещаем
		
		const wallClone = new THREE.Mesh();
		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wd.userData.door.wall.position ); 
		wallClone.rotation.copy( wd.userData.door.wall.rotation );	 	

		MeshBSP( wd, { wall: wallClone, wd: createCloneWD_BSP( wd ) } ); 	
		
		wd.updateMatrixWorld();
		
		showRulerWD(wd);	// показываем линейки и контроллеры для окна/двери	
		showTableWD(wd);	// обновляем меню
		
		calcSvgFormWD({obj: wd});
		
		this.render();
	}


	// переключаем положение(вращаем) wd 
	swSetDW_1({obj, type})
	{
		if(!obj) return;
		if(!obj.userData.door) return;
		
		if(type == 'r-l')
		{		
			if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
			{
				obj.userData.door.openId = (obj.userData.door.openId == 0) ? 1 : 0;
			}
			else if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
			{
				obj.userData.door.openId = (obj.userData.door.openId == 3) ? 2 : 3;
			}		
		}
		
		if(type == 't-b')
		{
			if(obj.userData.door.openId == 2 || obj.userData.door.openId == 3)
			{
				obj.userData.door.openId = (obj.userData.door.openId == 2) ? 0 : 1;
			}
			else if(obj.userData.door.openId == 0 || obj.userData.door.openId == 1)
			{
				obj.userData.door.openId = (obj.userData.door.openId == 0) ? 2 : 3;
			}		
		}
		
		calcSvgFormWD({obj: obj});
		setPosWD_Obj3D({wd: obj});
		
		// парметрическое окно
		if(obj.children.length > 0 && obj.children[0].userData.contour && obj.children[0].userData.contour.length > 0)
		{	
			const wallClone = new THREE.Mesh();
			wallClone.geometry = clickMoveWD_BSP( obj ).geometry.clone(); 
			wallClone.position.copy( obj.userData.door.wall.position ); 
			wallClone.rotation.copy( obj.userData.door.wall.rotation );
			
			MeshBSP( obj, { wall: wallClone, wd: createCloneWD_BSP( obj ) } ); 
		}
		
		this.render();
	}

	
	render()
	{
		renderCamera();
	}
}






