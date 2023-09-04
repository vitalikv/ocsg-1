


class MyTexture
{
	constructor()
	{
		this.addTextureInCatalogUI_1();
		this.addTextureInCatalogUI_2();
		this.addTextureInCatalogUI_3();
	}
	
	// текстуры для стен 
	addTextureInCatalogUI_1()
	{
		const container = document.querySelector('[list_ui="catalog_texture_1"]');
		const count = 23;
		
		for(let i = 0; i < count; i++)
		{			
			const html = 
			'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="img/wall/w' + (i+1)+'.jpg">\
				<img src="'+infProject.path + 'catalog/img/wall/w' + (i+1)+'-m.jpg" nameId="">\
			</div>';
			
			const div = document.createElement('div');
			div.innerHTML = html;
			const elem = div.children[0];
			container.append(elem);
		}
	}

	// текстуры для пола
	addTextureInCatalogUI_2()
	{
		const container = document.querySelector('[list_ui="catalog_texture_2"]');
		const count = 19;
		
		for(let i = 0; i < count; i++)
		{			
			const html = 
			'<div class="right_panel_1_1_list_item rp_list_item_texture" add_texture="img/floor/f' + (i+1)+'.jpg">\
				<img src="'+infProject.path + 'catalog/img/floor/f' + (i+1)+'-m.jpg" nameId="">\
			</div>';
			
			const div = document.createElement('div');
			div.innerHTML = html;
			const elem = div.children[0];
			container.append(elem);
		}	
	}

	// текстуры для объектов
	addTextureInCatalogUI_3()
	{
		const arr = [];
		
		const container = document.querySelector('[nameId="catalog_texture_obj"]');

		// текстуры пола
		let count = 19;		
		for(let i = 0; i < count; i++) arr.push({min: 'img/floor/f' + (i+1)+'-m.jpg', max: 'img/floor/f' + (i+1)+'.jpg'});	

		// текстуры стен
		count = 21;		
		for(let i = 0; i < count; i++) arr.push({min: 'img/wall/w' + (i+1)+'-m.jpg', max: 'img/wall/w' + (i+1)+'.jpg'});		
		
		
		for(let i = 0; i < arr.length; i++)
		{
			const div = document.createElement('div');
			div.innerHTML = 
			`<div class="right_panel_1_1_list_item rp_list_item_texture">
				<img src="${infProject.path+'catalog/'+arr[i].min}">
			</div>`;
			const elem = div.children[0];
			container.append(elem);	
			
			elem.onmousedown = () => { myHouse.myObjPrimitives.clickBtnChangeTextureObj3D({url: arr[i].max}) }
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














