

class MyPanelR
{
	container;
	btnShow;
	btnClose;
	
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		const wrap = document.querySelector('[nameId="wrapP2"]');
		const div = this.crDiv();
		wrap.append(div);
		
		this.container = div.querySelector('[nameId="panelR"]');
		this.btnShow = div.querySelector('[nameId="button_show_panel_catalog"]');
		this.btnClose = this.container.querySelector('[nameId="button_catalog_close"]');
		
		this.initEvent();
	}

	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];	
	}
	
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

	
	initEvent()
	{
		this.btnShow.onmousedown = () => { this.showHidePanelR({show: true}); }
		this.btnClose.onmousedown = () => { this.showHidePanelR({show: false}); }		
	}
	
	// скрываем/показываем правую панель
	showHidePanelR({show})
	{
		if(show) 
		{ 
			this.container.style.display = ''; 
			this.btnShow.style.display = 'none';
		}
		else 
		{ 
			this.container.style.display = 'none'; 
			this.btnShow.style.display = '';
		}
	}
	
}







