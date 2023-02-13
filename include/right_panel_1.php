





<div class="right_panel_1" data-action ='right_panel_1' ui_1="">


	<div class="flex_column_1 right_panel_1_1" nameId="panel_catalog_1">
		<div class="flex_1 bottom_line_1">
			<div class="flex_1 relative_1 right_panel_1_item">	
				<div class="right_panel_1_item_block" nameId="button_wrap_level">
					<div class="right_panel_1_item_block_text">
						этажи
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_plan">
					<div class="right_panel_1_item_block_text">
						дом
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_object">
					<div class="right_panel_1_item_block_text">
						объект
					</div>	
				</div>			
				<div class="right_panel_1_item_block" nameId="button_wrap_catalog">
					<div class="right_panel_1_item_block_text">
						каталог
					</div>	
				</div>			
			</div>
			<div class="button_catalog_close x_close" nameId="button_catalog_close">
				+
			</div>
		</div>
	
	
		<div class="flex_column_1" nameId="wrap_level" style="display: none; overflow: auto;">
			<div class="right_panel_1_1_h">Этажи</div>

			<div nameId="div_level_1" class="flex_column_1 rp_item_plane">							
				<div class="flex_1">
					<div nameId="btn_level_1" class="button1 button_gradient_1">1</div>
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_level_1_h2" value="0">
					</div>
				</div>
			</div>
			
			<div nameId="div_level_2" class="flex_column_1 rp_item_plane">							
				<div class="flex_1">
					<div nameId="btn_level_2" class="button1 button_gradient_1">2</div>
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_level_2_h2" value="0">
					</div>
				</div>
			</div>

			<div nameId="div_level_3" class="flex_column_1 rp_item_plane">							
				<div class="flex_1">
					<div nameId="btn_level_3" class="button1 button_gradient_1">3</div>
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_level_3_h2" value="0">
					</div>
				</div>
			</div>

			<div nameId="div_level_4" class="flex_column_1 rp_item_plane">							
				<div class="flex_1">
					<div nameId="btn_level_4" class="button1 button_gradient_1">4</div>
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_level_4_h2" value="0">
					</div>
				</div>
			</div>

			<div nameId="div_type_cam_vis" class="flex_column_1 rp_item_plane" style="display: none; padding: 10px; font-size: 16px; color: #666; font-family: arial,sans-serif;">
				<div style="display: flex; align-items: center; margin:5px 0;">
					<div nameId="type_cam_vis_1" style="width: 20px; height: 20px; margin-right: 15px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">
						<div style="width: 16px; height: 16px; margin: 2px; border-radius: 4px; background: rgb(213, 213, 213);">
						</div>
					</div>
					<div>Показать все этажи</div>
				</div>
				<div style="display: flex; align-items: center; margin:5px 0;">
					<div nameId="type_cam_vis_2" style="width: 20px; height: 20px; margin-right: 15px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">
						<div style="width: 16px; height: 16px; margin: 2px; border-radius: 4px; background: rgb(213, 213, 213);">
						</div>
					</div>
					<div>Прозрачные внешние стены</div>
				</div>				
			</div>
		</div>
			
		<div class="flex_column_1" nameId="wrap_plan" style="display: none; overflow: auto;">
			<div class="right_panel_1_1_h">Дом</div>
			
			
			<div class="flex_column_1 rp_item_plane">			
				<div class="flex_1">
					<div class="flex_column_1">
						<div data-action ='wall' class="button2 button_gradient_1"><div>стена</div></div>
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
						<div data-action ='create_wd_1' class="button2 button_gradient_1"><div>проем</div></div>
						<div data-action ='create_wd_2' class="button2 button_gradient_1"><div>дверь</div></div>
					</div>	

					<div>
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
						<div data-action ='create_wd_3' class="button2 button_gradient_1">
							<div>окно</div>
						</div>
					</div>

					<div>
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
						<div data-action ='create_gate_1' class="button2 button_gradient_1">ворота</div>
					</div>
				
					<div>
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
						<div nameId="cr_btn_roof_1" class="button2 button_gradient_1">крыша 1</div>
						<div nameId="cr_btn_roof_2" class="button2 button_gradient_1">крыша 2</div>
					</div>
				
					<div>
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
				
				
				<div nameId="rp_menu_point" style="display: none;"> 
					<div class="flex_column_1">															
						<div>
							<div class="button1 button_gradient_1" data-action="deleteObj">Удалить</div>
						</div>						
					</div>	
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
								<img src="<?=$path?>img/load/kirpich.jpg" nameId="wall_texture_1img">	
							</div>
							<div class="button1 button_gradient_1 texture_wall_2" nameId="rp_button_wall_texture_2">
								<div class="texture_wall_2_text">B</div>
								<img src="<?=$path?>img/load/kirpich.jpg" nameId="wall_texture_2img">	
							</div>							
						</div>
					</div>

					<div style="display: none;" nameId="rp_catalog_texture_1">
						<div class="button1 button_gradient_1" style="margin-top: 20px;" nameId="but_back_catalog_texture_1" style="display: none;">Закрыть</div>
						<div class="rp_1_1_list">
							<div class="rp_1_2_list" list_ui="catalog_texture_1">
								
							</div>				 							
						</div>						
					</div>
					
					<div>
						<div class="button1 button_gradient_1" style="margin-top: 20px;" data-action="deleteObj">Удалить</div>
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

					<div class="flex_1" nameId="rp_item_wd_h1" style="display: none;">
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
						<div class="button1 button_gradient_1" nameId="sw_dw_1" style="height: 55px;">
							<svg width="55" height="55" xmlns="http://www.w3.org/2000/svg">
							 <g>
							  <path id="svg_25" d="m8.636221,26.014259l18.863752,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#595959"/>
							  <path transform="rotate(-180, 27.4995, 41.2721)" id="svg_23" d="m8.635712,53.719929l18.863752,-24.89781l18.863752,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#595959"/>
							 </g>
							</svg>	
						</div>	
						<div class="button1 button_gradient_1" nameId="sw_dw_2" style="height: 55px;">
							<svg width="55" height="55" xmlns="http://www.w3.org/2000/svg">
							 <g>
							  <path transform="rotate(90, 41.4493, 27.5012)" id="svg_25" d="m22.585522,39.94907l18.86375,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#595959"/>
							  <path transform="rotate(-90, 13.6147, 27.4983)" id="svg_23" d="m-5.249556,39.948669l18.863752,-24.897808l18.863754,24.897808z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#000" fill="#595959"/>
							 </g>
							</svg>	
						</div>							
					</div>					
				</div>				
				
				
	
				<div nameId="bl_object_3d" style="display: none;">  
				
					<div class="bl_fd30" nameId="rp_bl_light" style="display: none;">
						<div class="bl_light_t1">
							Интенсивность света: <span class="bl_light_t2" nameId="sun_intensity_div">0.0</span>
						</div>
					
						<div class="bl_fd31">
							<div class="bl_circle_handle" nameId="sun_intensity_handle"></div>
						</div>	 	
					</div>

					
					<div class="flex_column_1" nameId="rp_bl_set_obj_xyz" style="display: block; margin-bottom: 40px;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									длина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-obj-length" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-obj-width" value="0">
							</div>
						</div>

						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-obj-height" value="0">
							</div>
						</div>						
						
						<div>
							<div class="button1 button_gradient_1" nameId="rp_button_apply">Применить</div>
						</div>
					</div>						
					
				
					<div class="button1 button_gradient_1" nameId="obj_rotate_reset" style="display: none;">
						reset	
					</div>
					
					<div class="button1 button_gradient_1" nameId="button_copy_obj">
						копировать	
					</div>								

					<div class="button1 button_gradient_1" nameId="button_delete_obj">
						удалить	
					</div>									
					
								
					<div nameId="sp_block_drt" style="display:none">

					</div> 
				</div> 
			
				<div nameId="bl_roof_3d" style="display: none;">  
					
					<div class="flex_column_1" style="display: block; margin-bottom: 40px;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									длина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-roof-length" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-roof-width" value="0">
							</div>
						</div>

						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-roof-height" value="0">
							</div>
						</div>						
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
		
	</div>
	
	
	<div class="button_show_panel_catalog" nameId="button_show_panel_catalog" style="display: none;">
		<div class="button_show_panel_catalog_1">		
		</div>	
	</div>

	
</div>
