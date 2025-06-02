

class MyUiBlocksMain
{
	container;
	divPanel;
	
	content1;
	content2;
	content3;
	
	itemsLevel = [];
	
	checkBox1;
	
	inputOffset;
	
	myUiBlocksSize;
	myUiBlocksCount;

	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="panelR"]');
		this.divPanel = this.crPanel();
		this.container.append(this.divPanel);
		
		this.myUiBlocksSize = new MyUiBlocksSize();
		this.myUiBlocksCount = new MyUiBlocksCount();		
	}


	crPanel()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];	
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
					<div class="right_panel_1_item_block" nameId="tabSetting">
						<div class="right_panel_1_item_block_text">
							настройки
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
				
				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div nameId="item_1" style="${css2}">
							<div style="${css3}"></div>
						</div>
						<div>Показать все этажи</div>
					</div>			
				</div>				
			</div>
			
			<div class="flex_column_1" nameId="wrapSetting" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Настройки</div>	

				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div>Толщина слоя<br>раствора (мм)</div>
						${htmlOffset}
					</div>					
				</div>

				<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
					<div style="${css1}">
						<div>Размер блока (мм)</div>						
					</div>
					<div nameId="wrapInputSize"></div>
				</div>				
			</div>			
			
			<div class="flex_column_1" nameId="wrapCalc3D" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Расчет блоков</div>
				
				<div nameId="btnCalc3D" style="${cssBtn}">рассчитать</div>
				<div nameId="btnClearCalc" style="${cssBtn}">очистить</div>
				
				<div nameId="wrapDivSum"></div>
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
	
	

	// заполняем при старте панель (до этого она пустая)
	addPaidContent()
	{
		const div = this.crDiv();
		
		this.divPanel.append(div);
		
		const tab1 = div.querySelector('[nameId="tab_level"]');
		const tab2 = div.querySelector('[nameId="tabSetting"]');
		const tab3 = div.querySelector('[nameId="tabCalc3D"]');
		
		this.content1 = div.querySelector('[nameId="wrapLevels"]');
		this.content2 = div.querySelector('[nameId="wrapSetting"]');
		this.content3 = div.querySelector('[nameId="wrapCalc3D"]');
		
		tab1.onmousedown = () => { this.showWrapContent({tabName: 'level'}); }
		tab2.onmousedown = () => { this.showWrapContent({tabName: 'setting'}); }
		tab3.onmousedown = () => { this.showWrapContent({tabName: 'calc3D'}); }
		
		const btnCalc3D = div.querySelector('[nameId="btnCalc3D"]');		
		btnCalc3D.onmousedown = () => 
		{ 
			myCalcBlocks.myBlocksMode.enableBlocks();
			this.myUiBlocksCount.upInfoCountBlocks({});
		}	

		const btnClearCalc = div.querySelector('[nameId="btnClearCalc"]');		
		btnClearCalc.onmousedown = () => 
		{ 
			myCalcBlocks.myBlocksMode.disableBlocks();
			this.myUiBlocksCount.clearInfoCountBlocks();
		}

		this.checkBox1 = div.querySelector('[nameId="item_1"]');
		this.checkBox1.onmousedown = () => 
		{  
			this.changeStateCheckBox1({});
			const value = this.getStateCheckBox1();
			
			myCalcBlocks.myBlocksMode.setCalcAllLevel({value});
			
			//myPanelR.myLevelVisible.switchShowAllLevel({value});
			
			myCalcBlocks.myBlocksCamera.changeCamera();
		}
		


		this.inputOffset = div.querySelector('[nameId="inputOffset"]');
		
		
		this.appointDivLevels({container: this.content1});
		
				
		this.myUiBlocksSize.init({container: this.divPanel.querySelector('[nameId="wrapInputSize"]')});
		this.myUiBlocksCount.init({container: this.divPanel.querySelector('[nameId="wrapDivSum"]')});
		
		this.initEvents();
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
	}

	

	
	
	initEvents()
	{
		this.initEventLevel();
		this.initEventOffsetBlock();
	}
	
	
	// события при нажатии кнопок этажей
	initEventLevel()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => 
			{ 
				const idActive = myLevels.getIdActLevel();
				const posY = myLevels.getLevelPos0({lastId: idActive, newId: i});
		
				myMouse.clearClick();
				myLevels.switchLevel(i);
				
				if(myCalcBlocks.myBlocksMode.getActiveMode())
				{
					myCalcBlocks.myBlocksCamera.switchLevel({id: idActive, posY});
				}							 
				 
				this.levelBackground_UI({id: i});				
			}
		}		
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
	
	

	// меняем в input толщину клея (+ передаем толщину клея в основной класс для расчета блоков)
	setInputOffsetBlock({value, type = 'm'})
	{
		const kof = (type === 'm') ? 1000 : 1;
		
		this.inputOffset.value = value * kof;
		
		myCalcBlocks.myBlocksObjs.setOffsetBlock({value, type});
	}


	// события при вводе в input толщины клея
	initEventOffsetBlock()
	{		
		// проверка на валидность после ввода в input
		const processInput = ({input, limit}) =>
		{
			let value = input.value.trim();

			// Заменяем запятую на точку (для корректного парсинга)
			value = value.replace(',', '.');

			// Пытаемся преобразовать в число
			const numberValue = parseFloat(value);

			// Проверяем валидность
			if (isNaN(numberValue)) return {success: false, message: 'Введите число!'};

			// Округляем до целого
			const roundedValue = Math.round(numberValue);

			// Проверяем диапазон (Число должно быть от limit[0] до limit[1])
			if (roundedValue < limit[0] || roundedValue > limit[1]) return {success: false, message: `Число должно быть от ${limit[0]} до ${limit[1]}`};

			// Если всё ок — выводим результат
			console.log("Валидное число:", roundedValue);
			input.value = roundedValue; // Заменяем ввод на округлённое значение
			
			return {success: true, value: input.value};
		}

		// если значение не валидное то сбрасываем значение до оригинального
		const resetInput = ({result, input, originalValue}) =>
		{
			input.value = originalValue; 	// сбрасываем значение в input до оригинального
			console.log(result);
		}		
		
		const addEvent = ({input, limit}) =>
		{
			let originalValue = '';
			
			input.onfocus = (e) => 
			{
				originalValue = input.value;
			}
			
			input.onkeydown = (e) => 
			{								
				if (e.code === 'Enter') 
				{
					const result = processInput({input, limit});
					if(!result.success) resetInput({result, input, originalValue});
					if(result.success) this.setInputOffsetBlock({value: result.value, type: 'mm'});
				}
			}

			input.onblur = (e) => 
			{
				const result = processInput({input, limit});
				if(!result.success) resetInput({result, input, originalValue});
				if(result.success) this.setInputOffsetBlock({value: result.value, type: 'mm'});
			}			
		}

		addEvent({input: this.inputOffset, limit: [1, 50]});			
	}


	// меняем состояние для CheckBox вкл/выкл (расчет для всех этажей) только для css, без дальнейшей логики
	changeStateCheckBox1({value = undefined})
	{
		if(value === undefined) value = !this.getStateCheckBox1();
		this.checkBox1.children[0].style.background = (value) ? 'rgb(213, 213, 213)' : 'none';		
	}
	
	
	// показываем контент выбранной вкладки
	showWrapContent({tabName = 'level'})
	{
		this.hideWrapContent();
		
		if(tabName === 'level') this.content1.style.display = '';
		if(tabName === 'setting') this.content2.style.display = '';
		if(tabName === 'calc3D') this.content3.style.display = '';
		
		myCalcBlocks.myBlocksMode.changeTab({type: tabName});
	}	
	
	// скрываем все вкладки с контентом
	hideWrapContent()
	{
		this.content1.style.display = 'none';
		this.content2.style.display = 'none';		
		this.content3.style.display = 'none';		
	}
}







