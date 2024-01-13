

class MyPanelR
{
	container;
	divPanelR;
	divPanel_1;
	btnShow;
	myContentLevel;
	myContentPlan;
	myContentObj;
	myTabsR;
	myLevelVisible;
	myColorPicker;
	
	
	constructor()
	{
		const wrap = document.querySelector('[nameId="wrapP2"]');
		const div = this.crDiv({type: 1});
		wrap.append(div);
		
		this.divPanelR = div.querySelector('[nameId="panelR"]');
		
		this.divPanel_1 = this.crDiv({type: 2});
		this.divPanelR.append(this.divPanel_1);	
				
		this.btnShow = div.querySelector('[nameId="button_show_panel_catalog"]');		
	}
	
	init()
	{
		this.myContentLevel = new MyContentLevel();
		this.myLevelVisible = new MyLevelVisible({showAllLevel: true, wallTransparent: false});	
		this.myContentPlan = new MyContentPlan();
		this.myContentObj = new MyContentObj();							
		
		this.myContentObj.init();
		
		this.myColorPicker = new MyColorPicker();
		
		this.myTabsR = new MyTabsR();
		
		this.initEvent();
	}

	crDiv({type})
	{
		const div = document.createElement('div');
		
		let html = '';
		
		if(type === 1) html = this.html_1();
		if(type === 2) html = this.html_2();
		
		div.innerHTML = html;
		
		return div.children[0];	
	}
	
	// пустая панель с кнопкой закрытия и открытия панели
	html_1()
	{
		const html = 
		`<div style="display: flex; height: 100%;">
			<div class="right_panel_1" nameId="panelR" ui_1="">
				<div nameId="button_catalog_close" class="button_catalog_close x_close" style="z-index: 2;">+</div>
			</div>

			<div nameId="button_show_panel_catalog" class="button_show_panel_catalog" style="display: none; z-index: 2;">
				<div class="button_show_panel_catalog_1"></div>	
			</div>
		</div>`;

		return html;
	}


	// заполняем панель
	html_2()
	{  		
		const html = 
		`<div class="flex_column_1 right_panel_1_1" nameId="panelPlan">
			<div nameId="wrapTabsR"></div>
		
			<div nameId="contLevelR"></div>
			
			<div nameId="contPlanR"></div>
			
			<div nameId="contObjR"></div>			
			
			<div class="flex_column_1 relative_1 height100" nameId="wrap_catalog" style="display: none;">
				<div class="right_panel_1_1_h">Каталог</div>
				
				<div class="right_panel_2_1_list" list_ui="catalog">
					
				</div>
			</div>
			
		</div>`;


		return html;
	}

	
	initEvent()
	{
		const btnClose = this.divPanelR.querySelector('[nameId="button_catalog_close"]');
		btnClose.onmousedown = () => { this.showHidePanelR({show: false}); }
		
		this.btnShow.onmousedown = () => { this.showHidePanelR({show: true}); }				
	}
	
	// скрываем/показываем правую панель
	showHidePanelR({show})
	{
		if(show) 
		{ 
			this.divPanelR.style.display = ''; 
			this.btnShow.style.display = 'none';
		}
		else 
		{ 
			this.divPanelR.style.display = 'none'; 
			this.btnShow.style.display = '';
		}
	}
	
}







