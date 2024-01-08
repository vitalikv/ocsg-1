

class MyPanelPlan
{
	container;
	divPanel;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="panelR"]');
		this.divPanel = this.crPanel();
		this.container.append(this.divPanel);
		
		this.initEvent();
	}


	crPanel()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];	
	}	
	
	initEvent()
	{
		//this.btnShow.onmousedown = () => { this.showHidePanelR({show: true}); }
				
	}
	
	html_1()
	{  		
		const html = 
		`<div class="flex_column_1 right_panel_1_1" nameId="panelPlan">
			<div nameId="wrapTabsR"></div>
		
			<div nameId="contLevelR"></div>
			
			<div class="flex_column_1" nameId="wrap_plan_3d" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Дом</div>
				<div class="right_panel_1_1_h">Работает только в 2D</div>
			</div>
			
			<div class="flex_column_1" nameId="wrap_plan" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Дом</div>
				
				
				<div class="flex_column_1 rp_item_plane">			
					<div class="flex_1">
						<div class="flex_column_1">
							<div nameId="wall" class="button2 button_gradient_1" style="font-size: 14px; font-weight: normal;"><div>стена</div></div>
						</div>		
						
						<div class="flex_1 align_items">
							<div class="rp_label_plane">
								толщина
							</div>
						</div>
						<div class="flex_1 align_items" style="width: auto;">
							<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wall_width_1" value="0">
						</div>
					</div>							
				</div>				
				
				<div class="flex_column_1 rp_item_plane">
					<div class="flex_1">
						<div class="flex_column_1">
							<div nameId="list_btn_door" style="width: 80px; margin: auto;">
							
							</div>							
						</div>	

						<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										ширина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_length_1" value="0">
								</div>
							</div>
							
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										высота
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_height_1" value="0">
								</div>
							</div>				
						</div>			
					</div>

				</div>

				<div class="flex_column_1 rp_item_plane">
					<div class="flex_1">
						<div class="flex_column_1">						
							<div nameId="list_btn_wind" style="width: 80px; margin: auto;">
							
							</div>						
						</div>

						<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										ширина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_length_1" value="0">
								</div>
							</div>
							
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										высота
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_height_1" value="0">
								</div>
							</div>	

							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										над полом
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_above_floor_1" value="0">
								</div>
							</div>
						</div>
						
					</div>			
				</div>	

				<div class="flex_column_1 rp_item_plane">
					<div class="flex_1">
						<div class="flex_column_1">
							<div nameId='create_gate_1' class="button2 button_gradient_1" style="font-size: 14px; font-weight: normal;">ворота</div>
						</div>
					
						<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										ширина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_gate_length_1" value="0">
								</div>
							</div>
							
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										высота
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_gate_height_1" value="0">
								</div>
							</div>									
						</div>
					</div>
				</div>
				


				<div class="flex_column_1 rp_item_plane">
					<div class="flex_1">
						<div class="flex_column_1">
							<div nameId="list_btn_roof" style="width: 80px; margin: auto;">
							
							</div>						
						</div>
						
						<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										ширина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_roof_width_1" value="0">
								</div>
							</div>
							
							<div class="flex_1">
								<div class="flex_1 align_items">
									<div class="rp_label_plane">
										длина
									</div>
								</div>
								<div class="flex_1 align_items" style="width: auto;">
									<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_roof_length_1" value="0">
								</div>
							</div>									
						</div>
					</div>
				</div>			
							
			</div>
			
			
			<div nameId="wrap_object">
			
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
			</div>

			
			
			<div class="flex_column_1 relative_1 height100" nameId="wrap_catalog" style="display: none;">
				<div class="right_panel_1_1_h">Каталог</div>
				
				<div class="right_panel_2_1_list" list_ui="catalog">
					
				</div>
			</div>
			
		</div>`;


		return html;
	}	
	
	// скрываем/показываем панель
	showHidePanel({show})
	{
		if(show) 
		{ 
			this.divPanel.style.display = ''; 
		}
		else 
		{ 
			this.divPanel.style.display = 'none'; 
		}
	}
	
}







