

class MyPanelWF
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
		
		const html = 
		`<div>
			<div class="flex_1 bottom_line_1">
				<div class="flex_1 relative_1 right_panel_1_item">	
					<div class="right_panel_1_item_block" nameId="tab_level">
						<div class="right_panel_1_item_block_text">
							этажи
						</div>	
					</div>			
					<div class="right_panel_1_item_block" nameId="tab_wf">
						<div class="right_panel_1_item_block_text">
							теп.пол
						</div>	
					</div>			
					<div class="right_panel_1_item_block" nameId="tab_object">
						<div class="right_panel_1_item_block_text">
							объект
						</div>	
					</div>			
					<div class="right_panel_1_item_block" nameId="tab_catalog">
						<div class="right_panel_1_item_block_text">
							каталог
						</div>	
					</div>			
				</div>
			</div>
			
			<div class="flex_column_1" nameId="wrap_level_1" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Этажи</div>
			</div>
			
			<div class="flex_column_1" nameId="wrap_wf_1" style="display: none; overflow: auto;">
				<div class="right_panel_1_1_h">Теплый пол</div>
				
				<div nameId="tube" style="${cssBtn}">труба</div>
				<div nameId="grid" style="${cssBtn}">сетка</div>
			</div>			
			
			
		</div>`;

		return html;
	}
	
	addPaidContent()
	{
		const div = this.crDiv();
		
		this.divPanel.append(div);
		
		const tab1 = div.querySelector('[nameId="tab_level"]');
		const tab2 = div.querySelector('[nameId="tab_wf"]');
		
		const content1 = div.querySelector('[nameId="wrap_level_1"]');
		const content2 = div.querySelector('[nameId="wrap_wf_1"]');
		
		tab1.onmousedown = () => { content2.style.display = 'none'; content1.style.display = ''; }
		tab2.onmousedown = () => { content1.style.display = 'none'; content2.style.display = ''; }
		
		const btnTube = div.querySelector('[nameId="tube"]');		
		btnTube.onmousedown = () => { clickInterface({button: 'add_pointWf'}); }
	}
}






