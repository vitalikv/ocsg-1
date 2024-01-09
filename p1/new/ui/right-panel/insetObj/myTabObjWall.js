

class MyTabObjWall 
{
	constructor()
	{
		this.init();
	}
	
	init()
	{
		const container = myPanelR.myContentObj.divContentInfo;
		
		const div = this.crDiv();
		container.append(div);
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
		`<div nameId="rp_menu_wall" style="display: none;"> 
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
			
		</div>`;
		

		return html;
	}
		
}







