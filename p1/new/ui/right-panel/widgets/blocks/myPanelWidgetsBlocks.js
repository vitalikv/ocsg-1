

class MyPanelWidgetsBlocks
{
	container;
	divPanel;
	
	content1;
	content2;
	
	itemsLevel = [];
	
	checkBox1;
	checkBox2;
	
	inputSizeX;
	inputSizeY;
	inputSizeZ;
	inputOffset;
	
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
		const css =
		`display: none;`;
		
		const html = 
		`<div nameId="panelWF" class="flex_column_1 right_panel_1_1" style="${css}">			
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


	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_2();
		return div.children[0];	
	}
	
	html_2()
	{  
		const cssBtn = 
		`margin: 10px;
		padding: 5px;
		font-size: 15px;
		color: #666;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #fff;
		cursor: pointer;
		user-select: none;`;

		const css1 = `display: flex; align-items: center;`;
		const css2 = `width: 20px; height: 20px; margin-right: 15px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;`;
		const css3 = `width: 16px; height: 16px; margin: 2px; border-radius: 4px; background: rgb(213, 213, 213);`;
		
		const htmlLevels = this.htmlLevels();
		const htmlInputSize = this.htmlInputSize();
		const htmlOffset = this.htmlOffset();
		
		const html = 
		`<div>
			<div class="flex_1 bottom_line_1">
				<div class="flex_1 relative_1 right_panel_1_item">	
					<div class="right_panel_1_item_block" nameId="tab_level">
						<div class="right_panel_1_item_block_text">
							этажи
						</div>	
					</div>			
					<div class="right_panel_1_item_block" nameId="tabCalc3D">
						<div class="right_panel_1_item_block_text">
							расчет
						</div>	
					</div>			
				</div>
			</div>
			
			<div class="flex_column_1" nameId="wrapLevels" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Этажи</div>
				${htmlLevels}
			</div>
			
			<div class="flex_column_1" nameId="wrapCalc3D" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Расчет блоков</div>
				
				<div nameId="btnCalc3D" style="${cssBtn}">рассчитать</div>
				<div nameId="btnClearCalc" style="${cssBtn}">очистить</div>
				
				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div nameId="item_1" style="${css2}">
							<div style="${css3}"></div>
						</div>
						<div>Все этажи</div>
					</div>			
				</div>				

				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div nameId="userSize" style="${css2}">
							<div style="${css3}"></div>
						</div>
						<div>Свой размер блока (мм)</div>						
					</div>	
					<div>${htmlInputSize}</div>
				</div>
				
				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div>Толщина слоя<br>раствора (мм)</div>
						${htmlOffset}
					</div>	
					
				</div>				
				
			</div>
		</div>`;
		

		return html;
	}
	
	
	htmlLevels()
	{
		let html = ``;
		const css1 = `width: 90%; margin:5px 5px; pointer-events: none; user-select: none; cursor: default; background-color: #f0f0f0;`;
		
		for ( let i = 0; i < 4; i++ )
		{
			html +=
			`<div nameId="divLevel_${i+1}" class="flex_column_1 rp_item_plane">							
				<div class="flex_1">
					<div nameId="btnLevel_${i+1}" class="button1 button_gradient_1">${i+1}</div>
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							высота
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="${css1}" nameId="inputLevelH2_${i+1}" disabled value="0">
					</div>
				</div>
			</div>`;			
		}
		
		return html;
	}
	
	htmlInputSize()
	{
		let html = 
		`<div style="display: -webkit-box; display: flex; margin-top: 20px; font-size: 12px;">
			<div style="display: -webkit-box; display: flex;">
				<div>
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Длина</div>
					<div class="wr_input_1" nameId="wrInputSizeObjX">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjX" value="600">
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Высота</div>
					<div class="wr_input_1" nameId="wrInputSizeObjY">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjY" value="300">
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">							
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Ширина</div>
					<div class="wr_input_1" nameId="wrInputSizeObjZ">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjZ" value="400">
						</div>
					</div>
				</div>					
			</div>						
		</div>`;					

		return html;
	}	
	
	
	htmlOffset()
	{
		let html = 
		`<div style="display: -webkit-box; display: flex; margin: auto; font-size: 12px;">
			<div style="display: -webkit-box; display: flex;">
				<div class="wr_input_1">
					<div class="flex_1">
						<input type="text" class="input_1" style="margin: auto; width: 120px;" nameId="inputOffset" value="10">
					</div>
				</div>
			</div>						
		</div>`;					

		return html;
	}
	
	
	addPaidContent()
	{
		const div = this.crDiv();
		
		this.divPanel.append(div);
		
		const tab1 = div.querySelector('[nameId="tab_level"]');
		const tab2 = div.querySelector('[nameId="tabCalc3D"]');
		
		this.content1 = div.querySelector('[nameId="wrapLevels"]');
		this.content2 = div.querySelector('[nameId="wrapCalc3D"]');
		
		tab1.onmousedown = () => { this.content2.style.display = 'none'; this.content1.style.display = ''; }
		tab2.onmousedown = () => { this.showTab(); }
		
		const btnCalc3D = div.querySelector('[nameId="btnCalc3D"]');		
		btnCalc3D.onmousedown = () => 
		{ 
			if(this.getStateCheckBox2()) myCalcBlocks.setParamsUserSize(this.getInputSize());

			myCalcBlocks.init();
			myCalcBlocks.myBlocksCamera.activate();
		}	

		const btnClearCalc = div.querySelector('[nameId="btnClearCalc"]');		
		btnClearCalc.onmousedown = () => 
		{ 
			myCalcBlocks.myBlocksCamera.deActivate();
			myCalcBlocks.clearResultBlocks(); 
		}

		this.checkBox1 = div.querySelector('[nameId="item_1"]');
		this.checkBox1.onmousedown = () => 
		{  
			this.changeStateCheckBox1({});
			const value = this.getStateCheckBox1();
			
			myBlocksMode.setCalcAllLevel({value});
			
			myPanelR.myLevelVisible.switchShowAllLevel({value});
		}
		
		this.checkBox2 = div.querySelector('[nameId="userSize"]');				
		this.checkBox2.onmousedown = () => 
		{  
			this.changeStateCheckBox2({});
			const value = this.getStateCheckBox2();
			
			myBlocksMode.setUserSize({value});		
		}

		this.inputSizeX = div.querySelector('[nameId="inputSizeObjX"]');
		this.inputSizeY = div.querySelector('[nameId="inputSizeObjY"]');
		this.inputSizeZ = div.querySelector('[nameId="inputSizeObjZ"]');
		this.inputOffset = div.querySelector('[nameId="inputOffset"]');
		
		this.appointDivLevels({container: this.content1});
	}
	
	
	// получаем divs кнопок смены этажей
	appointDivLevels({container})
	{
		const elBlock = container;

		// div где находится кнопка и input
		const div1 = elBlock.querySelector('[nameId="divLevel_1"]');
		const div2 = elBlock.querySelector('[nameId="divLevel_2"]');
		const div3 = elBlock.querySelector('[nameId="divLevel_3"]');
		const div4 = elBlock.querySelector('[nameId="divLevel_4"]');
		
		// кнопки переключения этажей
		const btn1 = elBlock.querySelector('[nameId="btnLevel_1"]');
		const btn2 = elBlock.querySelector('[nameId="btnLevel_2"]');
		const btn3 = elBlock.querySelector('[nameId="btnLevel_3"]');
		const btn4 = elBlock.querySelector('[nameId="btnLevel_4"]');	

		// input изменения высоты этажа
		const input1 = elBlock.querySelector('[nameId="inputLevelH2_1"]');
		const input2 = elBlock.querySelector('[nameId="inputLevelH2_2"]');
		const input3 = elBlock.querySelector('[nameId="inputLevelH2_3"]');
		const input4 = elBlock.querySelector('[nameId="inputLevelH2_4"]');
		
		this.itemsLevel[0] = { div: div1, btn: btn1, input: input1 };
		this.itemsLevel[1] = { div: div2, btn: btn2, input: input2 };
		this.itemsLevel[2] = { div: div3, btn: btn3, input: input3 };
		this.itemsLevel[3] = { div: div4, btn: btn4, input: input4 };
				
		this.initElemsEvent();
	}

	// при включении режима расчета блоков показать в меню, какой этаж активирован
	setStartBtnLevel()
	{
		const id = myLevels.getIdActLevel();
		this.levelBackground_UI({id});		
	}

	// при включении режима расчета блоков установить в input значения по дефолту/из файла
	setStartInputValue()
	{
		const level = myLevels.levels;		

		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].input.value = level[i].height;
		}
	}

	initElemsEvent()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => 
			{ 
				const idActive = myLevels.getIdActLevel();
				const posY = myLevels.getLevelPos0({lastId: idActive, newId: i});
		
				myMouse.clearClick();
				myLevels.switchLevel(i);
				
				if(myCalcBlocks.getActive())
				{
					myCalcBlocks.myBlocksCamera.switchLevel({id: idActive, posY});
				}							 
				 
				this.levelBackground_UI({id: i});				
			}
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

	// получаем состояние вкл/выкл (расчет блоков для всех этажей)
	getStateCheckBox1()
	{
		const check = this.checkBox1.children[0].style.background;
		const value = (check === 'none') ? false : true;

		return value;
	}
	
	// получаем состояние вкл/выкл (свой размер блока)
	getStateCheckBox2()
	{
		const check = this.checkBox2.children[0].style.background;
		const value = (check === 'none') ? false : true;

		return value;
	}
	
	// получаем размеры блока
	getInputSize()
	{
		return {length: this.inputSizeX.value, height: this.inputSizeY.value, width: this.inputSizeZ.value};
	}

	// получаем толщину раствора
	getInputOffset()
	{
		return this.inputOffset;
	}

	// меняем состояние для CheckBox вкл/выкл (расчет для всех этажей) только для css, без дальнейшей логики
	changeStateCheckBox1({value = undefined})
	{
		if(value === undefined) value = !this.getStateCheckBox1();
		this.checkBox1.children[0].style.background = (value) ? 'rgb(213, 213, 213)' : 'none';		
	}
	
	// меняем состояние для CheckBox вкл/выкл (свой размер блока) только для css, без дальнейшей логики
	changeStateCheckBox2({value = undefined})
	{
		if(value === undefined) value = !this.getStateCheckBox2();
		this.checkBox2.children[0].style.background = (value) ? 'rgb(213, 213, 213)' : 'none';		
	}
	
	// показываем в правой панели вкладку
	showTab()
	{
		this.content1.style.display = 'none'; 
		this.content2.style.display = '';
	}
}







