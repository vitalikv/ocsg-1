
// контент этажи в правой панели
class MyContentLevel 
{
	itemsLevel = [];
	
	constructor()
	{
		const wrapDiv = myPanelR.divPanelR.querySelector('[nameId="contLevelR"]');		
		
		const elBlock = this.crDiv();
		wrapDiv.append(elBlock);

		// div где находится кнопка и input
		const div1 = elBlock.querySelector('[nameId="div_level_1"]');
		const div2 = elBlock.querySelector('[nameId="div_level_2"]');
		const div3 = elBlock.querySelector('[nameId="div_level_3"]');
		const div4 = elBlock.querySelector('[nameId="div_level_4"]');
		
		// кнопки переключения этажей
		const btn1 = elBlock.querySelector('[nameId="btn_level_1"]');
		const btn2 = elBlock.querySelector('[nameId="btn_level_2"]');
		const btn3 = elBlock.querySelector('[nameId="btn_level_3"]');
		const btn4 = elBlock.querySelector('[nameId="btn_level_4"]');

		// input изменения высоты этажа
		const input1 = elBlock.querySelector('[nameId="rp_level_1_h2"]');
		const input2 = elBlock.querySelector('[nameId="rp_level_2_h2"]');
		const input3 = elBlock.querySelector('[nameId="rp_level_3_h2"]');
		const input4 = elBlock.querySelector('[nameId="rp_level_4_h2"]');	
	
		this.itemsLevel[0] = { div: div1, btn: btn1, input: input1 };
		this.itemsLevel[1] = { div: div2, btn: btn2, input: input2 };
		this.itemsLevel[2] = { div: div3, btn: btn3, input: input3 };
		this.itemsLevel[3] = { div: div4, btn: btn4, input: input4 };
		
		this.setStartInputValue();
		this.initElemsEvent();
	}
	
	initElemsEvent()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => { myMouse.clearClick(); myLevels.switchLevel(i); }
			this.itemsLevel[i].input.onkeyup = (event) => this.changeInputHeight(event, i);
		}		
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
		`<div class="flex_column_1" nameId="wrap_level" style="display: none; overflow: auto;">
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

			<div nameId="wrapVisHs"></div>
		</div>`;
		
		return html;
	}
	
	
	// при старте/загрузке установить в input значения по дефолту/из файла
	setStartInputValue()
	{
		const level = myLevels.levels;		

		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].input.value = level[i].height;
		}
	}
	
	// меняем фон item/блока этажа
	levelBackground_UI({id}) 
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].div.style.background = 'none';
			if(i === id) this.itemsLevel[i].div.style.background = '#d5d5d5';
		}
	}
	
	// меняем высоту этажа и сдвигаем все остальные этажы
	changeInputHeight(event, id) 
	{
		if (event.keyCode !== 13) return;
		
		const level = myLevels.levels[id];
		
		const value = checkNumberInput({ value: event.target.value, unit: 1, limit: {min: 0.1, max: 5} });

		if(!value) 
		{
			event.target.value = Math.round(level.height * 100) / 100;
			return;
		}	
		
		event.target.value = value.num; 
		
		myLevels.setHeightWallLevel({value: value.num, id}); 

		if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			myHouse.myRoofCSG.cgs();
			this.render();
		}		
	}

	render()
	{
		renderCamera();
	}	
}







