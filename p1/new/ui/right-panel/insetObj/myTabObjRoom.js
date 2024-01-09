

class MyTabObjRoom 
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
		`<div nameId="rp_menu_room" style="display: none;"> 
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
		</div>`;
		

		return html;
	}
		
}







