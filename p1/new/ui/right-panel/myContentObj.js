

class MyContentObj
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
		const wrapDiv = myPanelR.divPanelR.querySelector('[nameId="contObjR"]');		
		
		const div = this.crDiv();
		wrapDiv.append(div);
		
		this.container = div.querySelector('[nameId="wrap_object_1"]');
		
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


	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];	
	}

	
	html()
	{
		const html =
		`<div nameId="wrap_object">
		
			<div class="right_panel_1_1_h">Объект</div>
			<div class="flex_column_1" nameId="wrap_object_1" style="display: none;">
				
				
				<div class="rp_obj_name">
					<input type="text" nameId="rp_obj_name" value="Название">					
				</div>								
				
				
				<div nameId="rp_menu_wall" style="display: none;"> 
					<div class="flex_column_1">			
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									толщина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size_wall_width_1" value="0">
							</div>
						</div>										
					</div>

					<div class="flex_column_1" nameId="rp_button_side_texture_1" style="display: none;">
						<div class="right_panel_1_1_h">
							Текстура
						</div>
						<div class="flex_1 texture_wall" nameId="rp_block_wall_texture_1">
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_wall_texture_1">
								<div class="texture_wall_2_text">A</div>							
								<img src="" nameId="wall_texture_1img">	
							</div>
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_wall_texture_2">
								<div class="texture_wall_2_text">B</div>
								<img src="" nameId="wall_texture_2img">	
							</div>							
						</div>
					</div>

					<div style="display: none;" nameId="rp_catalog_texture_1">
						<div class="button1 button_gradient_1" style="display: none; margin-top: 20px; padding: 5px; font-size: 14px;" nameId="but_back_catalog_texture_1">Закрыть</div>
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" list_ui="catalog_texture_1">
								
							</div>				 							
						</div>						
					</div>			 	
					
				</div>
				
				
				
				<div nameId="rp_menu_room" style="display: none;"> 
					<div class="flex_column_1">
						<div class="right_panel_1_1_h">
							Текстура
						</div>
					</div>

					<div nameId="rp_catalog_texture_2">
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" list_ui="catalog_texture_2">
								
							</div>				 							
						</div>
					</div>
					
					<div class="flex_column_1" style="display: none;">
						<div class="right_panel_1_1_h">
							Помещения
						</div>					
						<div class="right_panel_1_1_list" list_ui="room_type">
						
						</div>	
					</div>					
				</div>					
				

				<div class="flex_column_1" nameId="rp_menu_wd" style="display: none;">
					<div class="flex_1">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								длина
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-length" value="0">
						</div>
					</div>
					
					<div class="flex_1">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								высота
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-height" value="0">
						</div>
					</div>	

					<div class="flex_1" nameId="rp_item_wd_h1">
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								над полом
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wd_h1" value="0">
						</div>
					</div>					
					
					<div class="flex_1" style="margin: 15px auto;">						
						<div class="button1 button_gradient_1" nameId="sw_dw_1" style="width: 30px; height: 30px; margin: 5px; padding: 5px;">
							<svg width="100%" height="100%" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
							 <g>
							  <path id="svg_25" d="m8.636221,26.014259l18.863752,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
							  <path transform="rotate(-180, 27.4995, 41.2721)" id="svg_23" d="m8.635712,53.719929l18.863752,-24.89781l18.863752,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
							 </g>
							</svg>	
						</div>	
						<div class="button1 button_gradient_1" nameId="sw_dw_2" style="width: 30px; height: 30px; margin: 5px; padding: 5px;">
							<svg width="100%" height="100%" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
							 <g>
							  <path transform="rotate(90, 41.4493, 27.5012)" id="svg_25" d="m22.585522,39.94907l18.86375,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
							  <path transform="rotate(-90, 13.6147, 27.4983)" id="svg_23" d="m-5.249556,39.948669l18.863752,-24.897808l18.863754,24.897808z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
							 </g>
							</svg>	
						</div>							
					</div>					
				</div>				
				
				
	
				<div nameId="bl_object_3d" style="display: none;">							
					
					<div class="button1 button_gradient_1" nameId="button_copy_obj" style="font-size: 14px; font-weight: normal; width: 140px; height: auto; padding: 5px; margin: 10px auto;">
						копировать объект	
					</div>																
					

					<div>
						<div class="rp_1_1_list" style="max-height: 550px;">
							<div class="rp_1_2_list" nameId="catalog_texture_obj">

							</div>				 							
						</div>						
					</div>	
					
					<div nameId="sp_block_drt" style="display:none">

					</div> 
				</div> 
			
				<div nameId="bl_roof_3d" style="display: none;">  
					
					<div class="button1 button_gradient_1" nameId="btn_copy_roof" style="font-size: 14px; font-weight: normal; width: 140px; height: auto; padding: 5px; margin: 10px auto;">
						копировать крышу	
					</div>
					
					<div>
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" nameId="color_roof_1">

							</div>				 							
						</div>						
					</div>					
				</div> 
						
			
			</div>	
		</div>`;

		
		return html;
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
				
				myTexture.changeTextureWall_UI_1({obj: obj});			

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
			showTableWD( obj );
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'window')
		{
			txtName = obj.userData.door.nameRus;
			showTableWD( obj );
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'controll_wd')
		{
			const wd = obj.userData.controll_wd.obj;
			txtName = wd.userData.door.nameRus;
			showTableWD( wd );
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
			
			const display = (obj.userData.obj3D.lotid < 4) ? '' : 'none';
			this.divs.obj.children[1].style.display = display;
			
			if( isCheckExsistFunction(window['getInfObjFromBD']) ) { getInfObjFromBD({obj: obj}); };
		}

		this.inputName.value = txtName;
		
		this.container.style.display = ''; 			
	}
}







