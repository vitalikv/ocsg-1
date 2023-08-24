


class MyTexture
{
	constructor()
	{
		this.addTextureInCatalogUI_1();
		this.addTextureInCatalogUI_2();
		this.addTextureInCatalogUI_3();
	}
	
	// добавляем текстыры в каталог UI 
	addTextureInCatalogUI_1()
	{
		
		for(var i = 0; i < infProject.catalog.texture.length; i++)
		{
			var o = infProject.catalog.texture[i];
			o.name = 'img';
			var str = 
			'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
				<img src="'+infProject.path + 'catalog/' + o.url+'" nameId="">\
			</div>';
			 
			$('[list_ui="catalog_texture_1"]').append(str);
		}	
	}

	addTextureInCatalogUI_2()
	{
		
		for(var i = 0; i < infProject.catalog.texture.length; i++)
		{
			var o = infProject.catalog.texture[i];
			o.name = 'img';
			var str = 
			'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="'+o.url+'">\
				<img src="'+infProject.path + 'catalog/' + o.url+'" nameId="">\
			</div>';
			 
			$('[list_ui="catalog_texture_2"]').append(str);
		}	
	}

	// текстуры для объектов
	addTextureInCatalogUI_3()
	{
		let html = '';
		let arr = infProject.catalog.texture;
		
		let container = document.querySelector('[nameId="catalog_texture_obj"]');
		
		for(let i = 0; i < arr.length; i++)
		{
			let div = document.createElement('div');
			div.innerHTML = 
			`<div class="right_panel_1_1_list_item rp_list_item_texture">
				<img src="${infProject.path+'catalog/'+arr[i].url}">
			</div>`;
			let elem = div.children[0];
			container.append(elem);	
			
			elem.onmousedown = () => { myHouse.myObjPrimitives.clickBtnChangeTextureObj3D({url: arr[i].url}) }
		}		
	}


	// показываем текстыру у стены в правой панели
	changeTextureWall_UI_1(cdm) 
	{
		document.querySelector('[nameId="wall_texture_1img"]').src = infProject.path+'catalog/'+cdm.obj.userData.material[1].img;
		document.querySelector('[nameId="wall_texture_2img"]').src = infProject.path+'catalog/'+cdm.obj.userData.material[2].img; 		
	}	
	
	setImage(cdm)
	{
		var img = cdm.material.img;
		
		if(!img) return;
		
		var material = (cdm.obj.userData.tag == "wall") ? cdm.obj.material[cdm.material.index] : cdm.obj.material;
		
		new THREE.TextureLoader().load(infProject.path+'catalog/'+img, ( image ) =>  
		{
			material.color = new THREE.Color( 0xffffff );
			var texture = image;			
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
			
			if(cdm.repeat)
			{
				texture.repeat.x = cdm.repeat.x;
				texture.repeat.y = cdm.repeat.y;			
			}
			else
			{
				texture.repeat.x = 1.0;
				texture.repeat.y = 1.0;	
			}
			
			if(cdm.offset)
			{
				texture.offset.x = cdm.offset.x;
				texture.offset.y = cdm.offset.y;				
			}
			
			if(cdm.rotation)
			{
				texture.rotation = cdm.rotation;				
			}

			if(cdm.color)
			{
				material.color = new THREE.Color( cdm.color );
			}
			
			texture.needsUpdate = true;
			
			material.map = texture; 
			//material.lightMap = null;
			material.needsUpdate = true; 


			if(cdm.obj.userData.tag == "wall")
			{
				cdm.obj.userData.material[cdm.material.index].img = img;
				
				if(cdm.ui)
				{
					myTexture.changeTextureWall_UI_1({obj: cdm.obj});
				}
			}
			
			if(cdm.obj.userData.tag === "room" || cdm.obj.userData.tag === "ceiling")
			{
				cdm.obj.userData.material.img = img;
			}		

			if(cdm.obj.parent.userData.tag === "obj")
			{ 						
				upDateTextureObj3D({obj: cdm.obj.parent});
				cdm.obj.parent.userData.material.img = img;
			}
			
			if(cdm.obj.parent.userData.tag === "roof")
			{ 			
				myHouse.myRoofAction.upDateTextureRoof({obj: cdm.obj.parent})
			}
			//material.map.image.onload = () => { material.needsUpdate = true; renderCamera();};
			
			this.render();
		});			
	}


	render()
	{
		renderCamera();
	}
}














