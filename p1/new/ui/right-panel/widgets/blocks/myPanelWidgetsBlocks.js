

class MyPanelWidgetsBlocks
{
	container;
	divPanel;
	
	content1;
	content2;
	
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
			
			<div class="flex_column_1" nameId="wrap_level_1" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Этажи</div>
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
		
		this.content1 = div.querySelector('[nameId="wrap_level_1"]');
		this.content2 = div.querySelector('[nameId="wrapCalc3D"]');
		
		tab1.onmousedown = () => { this.content2.style.display = 'none'; this.content1.style.display = ''; }
		tab2.onmousedown = () => { this.showTab(); }
		
		const btnCalc3D = div.querySelector('[nameId="btnCalc3D"]');		
		btnCalc3D.onmousedown = () => 
		{ 
			if(this.getStateCheckBox2()) myCalcBlocks.setParamsUserSize(this.getInputSize());

			myCalcBlocks.init();
			myCalcBlocks.showHideWalls(false);
		}	

		const btnClearCalc = div.querySelector('[nameId="btnClearCalc"]');		
		btnClearCalc.onmousedown = () => 
		{ 
			myCalcBlocks.showHideWalls(true);
			myCalcBlocks.clearResult(); 
		}

		const checkBox1 = div.querySelector('[nameId="item_1"]');
		checkBox1.onmousedown = () => 
		{  
			const check = checkBox1.children[0].style.background;
			const value = (check === 'none') ? true : false;
			checkBox1.children[0].style.background = (value) ? 'rgb(213, 213, 213)' : 'none';
			
			myCalcBlocks.setCalcAllLevel({value});		
		}
		
		this.checkBox2 = div.querySelector('[nameId="userSize"]');				
		this.checkBox2.onmousedown = () => 
		{  
			const value = !this.getStateCheckBox2();
			this.checkBox2.children[0].style.background = (value) ? 'rgb(213, 213, 213)' : 'none';
			
			myCalcBlocks.setUserSize({value});		
		}

		this.inputSizeX = div.querySelector('[nameId="inputSizeObjX"]');
		this.inputSizeY = div.querySelector('[nameId="inputSizeObjY"]');
		this.inputSizeZ = div.querySelector('[nameId="inputSizeObjZ"]');
		this.inputOffset = div.querySelector('[nameId="inputOffset"]');
	}
	
	
	getStateCheckBox2()
	{
		const check = this.checkBox2.children[0].style.background;
		const value = (check === 'none') ? false : true;

		return value;
	}
	
	getInputSize()
	{
		return {length: this.inputSizeX.value, height: this.inputSizeY.value, width: this.inputSizeZ.value};
	}

	getInputOffset()
	{
		return this.inputOffset;
	}
	
	// показываем в правой панели вкладку
	showTab()
	{
		this.content1.style.display = 'none'; 
		this.content2.style.display = '';
	}
}







