

class MyTabObjRoom 
{
	inputDepthFloor;
	
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		const container = myPanelR.myContentObj.divContentInfo;
		
		const div = this.crDiv();
		container.append(div);
		
		this.inputDepthFloor = div.querySelector('[nameId="inputDepthFloor"]');
		
		this.initEvent();
	}
	
	initEvent()
	{
		this.inputDepthFloor.onkeydown = (e) => 
		{
			if (e.code === 'Enter') 
			{ 
				this.changeInputDepthFloor({depth: Number(e.target.value)});
			}
		};
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
				<div class="flex_1">
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							толщина
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 100px; margin:5px 5px;" nameId="inputDepthFloor" value="0">
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<div style="margin: 5px; font-size: 16px; color: #666;">м</div>
					</div>					
				</div>										
			</div>
			
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



	// в input поменяли толщену пола
	changeInputDepthFloor({depth})
	{
		const obj = myComposerRenderer.getOutlineObj();		
		if(!obj) return;
		if(obj.userData.tag !== 'room') return;
		
		// проверка на правильный ввод числа
		const result = checkNumberInput({ value: depth, abs: true, limit: {min: 0.01, max: 0.5} });
		
		if(!result)
		{
			depth = myHouse.myFloor.getDepthFloor({floor: obj});	
			depth = Math.round(depth * 100)/100;			
		}
		else
		{
			depth = result.num;
		}

		myHouse.myFloor.changeDepthFloorsOnLevel({depth});
		
		this.setInputDepthFloor({depth});
	}


	// ставим в input толщину пола
	setInputDepthFloor({depth})
	{		
		this.inputDepthFloor.value = depth;
	}	
}







