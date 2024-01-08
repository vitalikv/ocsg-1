

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







