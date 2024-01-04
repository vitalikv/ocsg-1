

class MyPanelR
{
	container;
	btnShow;
	btnClose;
	
	
	init()
	{
		this.container = document.querySelector('[nameId="panelR"]');
		this.btnShow = document.querySelector('[nameId="button_show_panel_catalog"]');
		this.btnClose = this.container.querySelector('[nameId="button_catalog_close"]');
		
		this.initEvent();
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







