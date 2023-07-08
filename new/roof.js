

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
		else if(!cdm.id)
		{
			let x = infProject.settings.roof.length;
			let z = infProject.settings.roof.width;
			
			obj.scale.set(x/obj.userData.roof.box.x, obj.scale.y, z/obj.userData.roof.box.z);
		}
		
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
		setTexture({obj: obj.children[0], material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: matClone.color });
		
		//if(cdm.cursor) clickO.move = obj; 	// объект был добавлен в сцену из каталога
		
		renderCamera();	

		return obj;
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
		
		if(myCameraOrbit.activeCam.userData.isCam2D) pivot.visible = false;
		else pivot.userData.pivot.axs.y.visible = true;	
		
		let gizmo = infProject.tools.gizmo;					
		gizmo.position.copy( pos );		
		gizmo.visible = true;
		gizmo.userData.gizmo.obj = obj;
		gizmo.quaternion.copy( qt );			
		
		setScalePivotGizmo();
		
		if(myCameraOrbit.activeCam.userData.isCam2D) { myComposerRenderer.outlineRemoveObj(); }
		if(myCameraOrbit.activeCam.userData.isCam3D) { myComposerRenderer.outlineAddObj({arr: [obj]}); }
		
		tabObject.activeObjRightPanelUI_1({obj: obj});	// показываем меню UI

		showSvgSizeObj({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
		
		uiInfoObj({obj});
	}

	// перемещение крыши по мыши
	moveRoof( event )
	{	
		let intersects = rayIntersect( event, planeMath, 'one' ); 		
		if(intersects.length === 0) return;
		
		let obj = clickO.move;	
		
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
		if(myCameraOrbit.activeCam.userData.isCam3D) 
		{
			this.updateCgsRoof();			
		}				
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
		
		myLevels.updateArrLevel();
	
		myComposerRenderer.outlineRemoveObj();

		this.updateCgsRoof()
	
		renderCamera();
	}

	// при клике, определяем попали в крышу или нет
	getRayIntersect()
	{
		let ray = rayIntersect( event, infProject.scene.array.roof, 'arr', true );	

		let rayhit = null;
		
		if(ray.length > 0)
		{   	
			for (let i = 0; i < ray.length; i++)
			{
				if(ray[i].object.userData.roof) continue;
				
				rayhit = ray[i];
				break;
			}
			
			let object = null; 
			
			if(rayhit) { object = getParentObj({obj: rayhit.object}); }
			
			if(!object) { rayhit = null; }
			else { rayhit.object = object;  }
		}

		return rayhit;
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
	
	
	// обновление обрезаных стен
	updateCgsRoof()
	{
		if(!myCameraOrbit.activeCam.userData.isCam3D) return;
		
		clRoof.resetWall({force: true});
		clRoof.cgs();
	}
	
	// старт обрезание стен крышами
	cgs()
	{
		let level = myLevels.levels;
		let arr = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				this.cgs_2(level[i].roof[i2]);
			}
		}
	}
	
	cgs_2(roof)
	{		
		console.log('обрезаем стены крышами');
		
		let group = [];
		for(let i = 0; i < roof.children.length; i++)
		{
			let child = roof.children[i];
			
			let posW = child.getWorldPosition(new THREE.Vector3());
			let quaW = child.getWorldQuaternion(new THREE.Quaternion());							
			let scaW = child.getWorldScale(new THREE.Vector3());
			
			let roofClone = new THREE.Mesh(child.geometry.clone(), child.material);
			
			roofClone.position.copy( posW );
			roofClone.quaternion.copy( quaW );
			roofClone.scale.copy( scaW );
			
			this.crRoofMod_2( roofClone );
			
			group.push(roofClone);
		}
		
		for(let i = 0; i < group.length; i++)
		{
			//group[i].position.y += 1;
			//scene.add(group[i]);
			this.cutMeshBSP(group[i]);
			group[i].geometry.dispose();
		}		
	}

	
	// получаем модифицированную клон-крышу, с высокими откасами, чтобы резать стены
	crRoofMod_2( obj )
	{ 		
		obj.updateMatrixWorld();
		
		let geometry = obj.geometry;
		
		//geometry.computeFaceNormals();	не правильно (подсчитать нормали)		
		geometry.computeVertexNormals();	//правильно (подсчитать нормали)
		
		let faces = geometry.faces;		
		
		let arrV = [];
		for (let i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.y < 0.8) continue;

			let v1 = geometry.vertices[faces[i].a];
			let v2 = geometry.vertices[faces[i].b];
			let v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
			
			let helperDir = false;
			if(helperDir)
			{
				let origin = v1.clone().applyMatrix4( obj.matrixWorld );
				let helper = new THREE.ArrowHelper(faces[i].normal, origin, 2, 0xff0000);
				helper.position.copy(origin);
				scene.add(helper);							
			}
		}
		

		for (let i = 0; i < geometry.vertices.length; i++)
		{
			for (let i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (let i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].y += 15; 		
		}
		
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	
	}	


	// обрезаем стены всех этажей и полы
	cutMeshBSP(obj)
	{  
		const level = myLevels.levels;
		const w = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				w.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}		
		
		obj.updateMatrixWorld();
		let objBSP = new ThreeBSP( obj );
		
		for ( let i = 0; i < w.length; i++ )
		{
			if(w[i].geometry.vertices.length === 0) continue;
			
			w[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( w[i] );
			
			let newBSP = wBSP.subtract( objBSP );		// вычитаем из стены объект нужной формы
			
			w[i].geometry.dispose();				
			w[i].geometry = newBSP.toGeometry();
			
			//wall.geometry.computeVertexNormals();	
			w[i].geometry.computeFaceNormals();	
			boxUnwrapUVs(w[i].geometry);
			for ( let i2 = 0; i2 < w[i].geometry.faces.length; i2++ )
			{
				w[i].geometry.faces[i2].normal.normalize();
				if(w[i].geometry.faces[i2].normal.z == 1) { w[i].geometry.faces[i2].materialIndex = 1; }
				else if(w[i].geometry.faces[i2].normal.z == -1) { w[i].geometry.faces[i2].materialIndex = 2; }
				else if(w[i].geometry.faces[i2].normal.x == 1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else if(w[i].geometry.faces[i2].normal.x == -1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else { w[i].geometry.faces[i2].materialIndex = 3; }
			}
		}
		
		for ( let i = 0; i < f.length; i++ )
		{
			if(f[i].geometry.vertices.length === 0) continue;
			
			f[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( f[i] );
			
			let newBSP = wBSP.subtract( objBSP );	
			
			f[i].geometry.dispose();				
			f[i].geometry = newBSP.toGeometry();

			/*if(infProject.tools.floorPl.userData.floorId && f[i].userData.id === infProject.tools.floorPl.userData.floorId)
			{
				infProject.tools.floorPl.geometry.dispose();				
				infProject.tools.floorPl.geometry = f[i].geometry.clone();				
			}*/			
		}
	}


	// восстанавливаем все стены и пол
	resetWall({force = false} = {})   
	{
		const level = myLevels.levels;
		let count = 0;
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				count++;
			}
		}	

		if(!force && count === 0) return;
		
		console.log('восстанавливаем все стены после крыш');

		
		const arrW = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				arrW.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}
		
		for (let i = 0; i < arrW.length; i++)
		{
			var wall = arrW[i]; 
			
			//if(wall.userData.wall.arrO.length == 0) continue;
			
			var p1 = wall.userData.wall.p[0].position;
			var p2 = wall.userData.wall.p[1].position;	
			var d = p1.distanceTo( p2 );		
			
			wall.geometry.dispose();
			wall.geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены		
			 
			// добавляем откосы
			var v = wall.geometry.vertices;
			for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
			wall.geometry.verticesNeedUpdate = true;
			wall.geometry.elementsNeedUpdate = true;	
			wall.geometry.computeBoundingSphere();
			upUvs_1( wall ); 	// без этого не работает boxUnwrapUVs(wall.geometry)
		}
	
		for ( var i = 0; i < arrW.length; i++ )
		{
			var wall = arrW[i];
			
			for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
			{
				var wd = wall.userData.wall.arrO[i2];
				
				var wdClone = createCloneWD_BSP( wd );
				
				objsBSP = { wall : wall, wd : wdClone };		
				
				MeshBSP( wd, objsBSP );					
			}
			
			boxUnwrapUVs(wall.geometry);
		}
		
		for ( let i = 0; i < f.length; i++ )
		{
			const p2 = [];
			for ( let i2 = 0; i2 < f[i].userData.room.p.length - 1; i2++ ) 
			{  
				const p = f[i].userData.room.p[i2];
				p2.push(new THREE.Vector2( p.position.x, p.position.z ));		
			}	 
			
			const shape = new THREE.Shape( p2 );
			const geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: f[i].userData.room.height } );
			
			f[i].geometry.dispose();				
			f[i].geometry = geometry;	
		}		
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








