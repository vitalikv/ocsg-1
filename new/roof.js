

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
		let elBlock = document.querySelector('[nameId="wrap_plan"]');
		
		let btn1 = elBlock.querySelector('[nameId="cr_btn_roof_1"]');
		btn1.onmousedown = () => { clickInterface({button:'create_roof_1'}); }
		
		let btn2 = elBlock.querySelector('[nameId="cr_btn_roof_2"]');
		btn2.onmousedown = () => { clickInterface({button:'create_roof_2'}); }		
	}
	
	// создаем список с цветом
	initListColor()
	{
		let html = '';
		let arr = ['223594', '942a22', '947b22', '539422', '762294', 'ffffff', '8a8a8a', '292929'];
		
		let container = document.querySelector('[nameId="color_roof_1"]');
		
		for(let i = 0; i < arr.length; i++)
		{
			let div = document.createElement('div');
			div.innerHTML = `<div class="right_panel_1_1_list_item rp_list_item_texture" style="background: #${arr[i]};"></div>`;
			let elem = div.children[0];
			container.append(elem);	
			
			elem.onmousedown = () => { this.setColor({color: '0x'+arr[i]}); }
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
		
		if(cdm.material)
		{
			if(cdm.material.color) this.setColor({obj, color: cdm.material.color});
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
		setTexture({obj: obj.children[0], material: { img: infProject.path+"img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: matClone.color });
		
		if(cdm.cursor) clickO.move = obj; 	// объект был добавлен в сцену из каталога
		
		renderCamera();		
	}

	// активируем объект, ставим pivot/gizmo
	clickRoof(cdm)
	{
		let obj = cdm.obj;
		let rayhit = cdm.rayhit;
		
		if(clickWall_2D_selectBox( rayhit )) { return; }
		
		obj.updateMatrixWorld();
		let pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			 
		
		let qt = obj.quaternion.clone();		
		
	 
		// объект уже выбран
		if(infProject.tools.pivot.userData.pivot.obj == obj)
		{
			clickO.move = obj;		
			clickO.offset = new THREE.Vector3().subVectors( obj.position, rayhit.point );
		
			planeMath.position.copy( rayhit.point );
			planeMath.rotation.set( Math.PI/2, 0, 0 );
		}
		
		let pivot = infProject.tools.pivot;	
		pivot.visible = true;	
		pivot.userData.pivot.obj = obj;
		pivot.position.copy(pos);
		pivot.quaternion.copy(qt);
		
		if(camera == cameraTop) pivot.visible = false;
		else pivot.userData.pivot.axs.y.visible = true;	
		
		let gizmo = infProject.tools.gizmo;					
		gizmo.position.copy( pos );		
		gizmo.visible = true;
		gizmo.userData.gizmo.obj = obj;
		gizmo.quaternion.copy( qt );			
		
		setScalePivotGizmo();
		
		if(camera == cameraTop) { outlineRemoveObj(); }
		if(camera == camera3D) { outlineAddObj({arr: [obj]}); }
		
		activeObjRightPanelUI_1({obj: obj});	// показываем меню UI

		showSvgSizeObj({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
		
		uiInfoObj({obj});
	}

	// перемещение крыши по мыши
	moveRoof( event )
	{	
		let intersects = rayIntersect( event, planeMath, 'one' ); 
		
		if(intersects.length == 0) return;
		
		let obj = clickO.move;
		
		if(!clickO.actMove) clickO.actMove = true;		
		
		let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, clickO.offset );	
		
		let pos2 = new THREE.Vector3().subVectors( pos, obj.position );
		obj.position.add( pos2 );

		infProject.tools.pivot.position.add( pos2 );
		infProject.tools.gizmo.position.add( pos2 );

		setScalePivotGizmo();
		
		showSvgSizeObj({obj: obj, boxCircle: true, setPos: { pos2D: new THREE.Vector2(event.clientX, event.clientY), pos3D: intersects[ 0 ].point }});
	}

	clickUpRoof(obj)
	{ 
		if(!clickO.actMove) return;
		if(camera !== cameraTop) return;
				
		// offsetLine
		upSvgLinePosScene({el: infProject.svg.furn.offset.elem});
		upSvgLinePosScene({el: infProject.svg.furn.size.elem});
	}
	
	cutWalls()
	{		
		let roofs = infProject.scene.array.roof;
		
		for (let i = 0; i < roofs.length; i++)
		{
			let roofMod = this.crRoofMod( roofs[i] );		
			
			this.meshBSP(roofMod);			
		}		
		
		renderCamera();			
	}

	// режем стены активного этажа
	meshBSP(obj)
	{  
		let w = infProject.scene.array.wall;
		var wdClone = obj;
		wdClone.updateMatrixWorld();
		
		for ( var i = 0; i < w.length; i++ )
		{
			let wall = w[i];
			wall.updateMatrixWorld();
			var wallClone = wall;
 
			//wdClone.position.copy( wd.position );
			var wdBSP = new ThreeBSP( wdClone );
			
			var wallBSP = new ThreeBSP( wallClone ); 			// копируем выбранную стену	
			var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы
			
			
			wallClone.geometry.dispose();
			wall.geometry.dispose();	
			
			wall.geometry = newBSP.toGeometry();
			//wall.geometry.computeVertexNormals();			
			wall.geometry.computeFaceNormals();	

			
			for ( var i2 = 0; i2 < wall.geometry.faces.length; i2++ )
			{
				wall.geometry.faces[i2].normal.normalize();
				if(wall.geometry.faces[i2].normal.z == 1) { wall.geometry.faces[i2].materialIndex = 1; }
				else if(wall.geometry.faces[i2].normal.z == -1) { wall.geometry.faces[i2].materialIndex = 2; }
				else if(wall.geometry.faces[i2].normal.x == 1) { wall.geometry.faces[i2].materialIndex = 0; }
				else if(wall.geometry.faces[i2].normal.x == -1) { wall.geometry.faces[i2].materialIndex = 0; }
				else { wall.geometry.faces[i2].materialIndex = 3; }
			}			
		}
		
		obj.visible = false;
		
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

	copyRoof() 
	{
		let obj = getObjFromPivotGizmo();		
		if(!obj) return;	
		
		let clone = obj.clone();

		clone.userData.id = countId; countId++;
		infProject.scene.array.roof[infProject.scene.array.roof.length] = clone; 
		scene.add( clone );	
	}
	
	setColor({obj, color})
	{
		if(!obj) obj = clickO.last_obj;
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
		clickO = resetPop.clickO(); 
		
		hidePivotGizmo(obj);
		
		deleteValueFromArrya({arr: infProject.scene.array.roof, o: obj});		
		disposeHierchy({obj: obj}); 
		scene.remove(obj); 
		
		outlineRemoveObj();
		
		renderCamera();
	}
	
	// при клике на объект обновляем input-ы
	upInputUI({obj})
	{			
		obj.geometry.computeBoundingBox();
		
		let minX = obj.geometry.boundingBox.min.x;
		let maxX = obj.geometry.boundingBox.max.x;
		let minY = obj.geometry.boundingBox.min.y;
		let maxY = obj.geometry.boundingBox.max.y;	
		let minZ = obj.geometry.boundingBox.min.z;
		let maxZ = obj.geometry.boundingBox.max.z;

		let x = Math.abs( (maxX - minX) * obj.scale.x );
		let y = Math.abs( (maxY - minY) * obj.scale.y );
		let z = Math.abs( (maxZ - minZ) * obj.scale.z );			
		
		$('[nameId="size-roof-length"]').val(Math.round(x * 100) / 100);
		$('[nameId="size-roof-height"]').val(Math.round(y * 100) / 100);
		$('[nameId="size-roof-width"]').val(Math.round(z * 100) / 100);	
	}	
}

let clRoof = new Roof();








