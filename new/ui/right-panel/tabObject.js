

class TabObject
{
	container;
	inputName;
	divs = {};
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="wrap_object_1"]');
		
		this.divs.wall = this.container.querySelector('[nameId="rp_menu_wall"]');
		this.divs.wd = this.container.querySelector('[nameId="rp_menu_wd"]');
		this.divs.floor = this.container.querySelector('[nameId="rp_menu_room"]');
		this.divs.roof = this.container.querySelector('[nameId="bl_roof_3d"]');
		this.divs.obj = this.container.querySelector('[nameId="bl_object_3d"]');

		this.inputName = this.container.querySelector('[nameId="rp_obj_name"]');
	}
	
	initEvent()
	{
				
	}

	// кликнули на obj, wd (показываем нужное меню и заполняем input)
	activeObjRightPanelUI_1({obj, side} = {}) 
	{
		this.container.style.display = 'none'; 
		
		this.inputName.value = '';
		
		this.divs.wall.style.display = 'none';
		this.divs.wd.style.display = 'none';
		this.divs.floor.style.display = 'none';
		this.divs.roof.style.display = 'none';
		this.divs.obj.style.display = 'none';
		
		
		if(!obj) return;
		
		let txtName = '';
		
		if(obj.userData.tag === 'point')
		{
			txtName = 'точка';
		}	
		else if(obj.userData.tag === 'wall')
		{
			txtName = 'стена';
			
			this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = 'none';
			
			if(side)
			{
				this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = '';
			}
			else
			{
				this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = '';
				this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = '';
				
				showHideMenuTexture_1({type: 1});
				
				changeTextureWall_UI_1({obj: obj});			

				if(obj.userData.wall.html.label)
				{
					obj.userData.wall.html.label[0].textContent = 'A';
					obj.userData.wall.html.label[1].textContent = 'B';
								
					upPosLabels_2({elem: obj.userData.wall.html.label[0]});
					upPosLabels_2({elem: obj.userData.wall.html.label[1]});
				}			
			}
			
			this.divs.wall.style.display = '';
			this.divs.wall.querySelector('[nameId="size_wall_width_1"]').value = obj.userData.wall.width;			
		}
		else if(obj.userData.tag === 'door')
		{
			txtName = obj.userData.door.nameRus;
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'window')
		{
			txtName = obj.userData.door.nameRus;
			this.divs.wd.style.display = '';
		}	
		else if(obj.userData.tag === 'room')
		{
			txtName = 'пол';
			this.divs.floor.style.display = '';
		}
		else if(obj.userData.tag === 'roof')
		{		
			txtName = obj.userData.roof.nameRus;		
			this.divs.roof.style.display = '';
		}		
		else if(obj.userData.tag === 'obj')
		{			
			txtName = obj.userData.obj3D.nameRus;		
			this.divs.obj.style.display = '';
			
			if( isCheckExsistFunction(window['getInfObjFromBD']) ) { getInfObjFromBD({obj: obj}); };
		}

		this.inputName.value = txtName;
		
		this.container.style.display = ''; 			
	}
}







