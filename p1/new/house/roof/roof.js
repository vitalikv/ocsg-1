

class Roof 
{
	constructor()
	{
		this.obj = [];
		this.material = new THREE.MeshStandardMaterial( { color : 0xff0000 } );	//side: THREE.DoubleSide
		this.material2 = new THREE.MeshStandardMaterial( { color : 0x0000ff } );
		this.initBtn();
		this.initListColor();
	}
	
	// назначаем кнопкам событие 
	initBtn()
	{
		const data = 
		[
			{name: 'односкатная', src: 'img/icon/roof/1.png', func: () => { clickInterface({button:'add_roof', lotid: 17}) } },
			{name: 'двухскатная', src: 'img/icon/roof/2.png', func: () => { clickInterface({button:'add_roof', lotid: 18}) } },
			{name: 'четырехскатная', src: 'img/icon/roof/3.png', func: () => { clickInterface({button:'add_roof', lotid: 19}) } },
		];
		
		// создаем модальное окно, со списком объектов
		const btnDropList = new BtnDropList({containerId: 'list_btn_roof', name: 'крыша', data});		
	}
	
	// создаем список с цветом
	initListColor()
	{
		let html = '';
		let arr = ['223594', '942a22', '947b22', '539422', '706758', 'ffffff', '8a8a8a', '292929'];
		
		let container = document.querySelector('[nameId="color_roof_1"]');
		
		for(let i = 0; i < arr.length; i++)
		{
			let div = document.createElement('div');
			div.innerHTML = `<div class="right_panel_1_1_list_item rp_list_item_texture" style="background: #${arr[i]};"></div>`;
			let elem = div.children[0];
			container.append(elem);	
			
			elem.onmousedown = () => { this.setColorRoof({color: '0x'+arr[i]}); }
		}		
	}
	
	initRoof(inf, cdm)
	{
		let obj = inf.obj; 
		
		if(cdm.pos){ obj.position.copy(cdm.pos); }
		else
		{
			obj.position.y = 0;
			planeMath.position.y = 0; 
			planeMath.rotation.set(-Math.PI/2, 0, 0);
			planeMath.updateMatrixWorld();			
		}
		
		if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
		
		if(cdm.id){ obj.userData.id = cdm.id; }
		else { obj.userData.id = countId; countId++; }
		
		obj.userData.tag = 'roof';
		obj.userData.roof = {};
		obj.userData.roof.lotid = cdm.lotid;
		obj.userData.roof.nameRus = (inf.name) ? inf.name : 'крыша 1';
		obj.userData.roof.typeGroup = '';
		obj.userData.roof.helper = null;
		obj.userData.roof.box = new THREE.Vector3();
		
		// получаем начальные размеры объекта, что потом можно было масштабировать от начальных размеров
		obj.geometry.computeBoundingBox();
		let x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		let y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		let z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.roof.box = new THREE.Vector3(x, y, z);

		if(cdm.scale){ obj.scale.set(cdm.scale.x, cdm.scale.y, cdm.scale.z); }
		else if(!cdm.id)
		{
			let x = infProject.settings.roof.length;
			let z = infProject.settings.roof.width;
			
			obj.scale.set(x/obj.userData.roof.box.x, obj.scale.y, z/obj.userData.roof.box.z);
		}
		
		if(cdm.material)
		{
			if(cdm.material.color) this.setColorRoof({obj, color: cdm.material.color});
		}
		
		obj.material.visible = false;
		
		infProject.scene.array.roof.push(obj);

		scene.add( obj );	
		
		// отдельный материал, иначе при изменении в материале у всех других крыш, также примутся изменения
		let matClone = obj.children[0].material.clone();		
		obj.traverse(function(child) 
		{
			if(child.isMesh && child.userData.tag !== 'roof') 
			{ 
				child.material = matClone; 
			}
		});			
		setTexture({obj: obj.children[0], material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: matClone.color });
		
		//if(cdm.cursor) clickO.move = obj; 	// объект был добавлен в сцену из каталога
		
		renderCamera();	

		return obj;
	}


	// получаем модифицированную клон-крышу, с высокими откасами, чтобы резать стены
	crRoofMod( obj )
	{ 		
		obj.updateMatrixWorld(true);
		let g = obj.children[0].children[0].geometry;
		
		let geometry = new THREE.Geometry().fromBufferGeometry(g);
		
		geometry.computeFaceNormals();		
		
		var faces = geometry.faces;		
		
		let arrV = [];
		for (var i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.z < 0.8) continue;

			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
		}
		
		let n = arrV.length;
		
		for (var i = 0; i < geometry.vertices.length; i++)
		{
			for (var i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (var i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].z += 5; 		
		}
		
		//geometry.vertices = v;
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	

		let obj2 = new THREE.Mesh( geometry, this.material2 );
		obj2.position.copy(obj.position);
		obj2.rotation.copy(obj.children[0].children[0].rotation);
		//obj2.position.y = +0;
		obj2.scale.set(obj.scale.x, obj.scale.z, obj.scale.y);	// объект из 3ds , поэтому оси не равны y z
		scene.add( obj2 );

		return obj2;
	}	

	
	setColorRoof({obj, color})
	{
		if(!obj) obj = myComposerRenderer.getOutlineObj();
		if(obj.userData.tag !== 'roof') return;
		
		for(let i = 0; i < obj.children.length; i++)
		{
			obj.children[i].material.color = new THREE.Color( Number(color) );
			obj.children[i].material.needsUpdate = true;			
		}
	}

	// удаление объекта
	deleteRoof(obj)
	{ 		
		myToolPG.hide();
		
		deleteValueFromArrya({arr: infProject.scene.array.roof, o: obj});		
		disposeHierchy({obj: obj}); 
		scene.remove(obj); 
		
		myLevels.updateArrLevel();
	
		myComposerRenderer.outlineRemoveObj();

		myHouse.myRoofCSG.updateCgsRoof()
	
		renderCamera();
	}


	
	// camera3D - не прозрачная крыша, camera2D - прозрачная крыша
	changeMaterialTransparent()
	{
		let opacity = (myCameraOrbit.activeCam.userData.isCam2D) ? 0.3 : 1;
		
		let levels = myLevels.levels;
				
		for (let i = 0; i < levels.length; i++)
		{
			let roofs = levels[i].roof;
			
			for (let i2 = 0; i2 < roofs.length; i2++)
			{
				for (let i3 = 0; i3 < roofs[i2].children.length; i3++)
				{
					roofs[i2].children[i3].material.opacity = opacity;
				}			
			}					
		}
	}
}

let clRoof = new Roof();








