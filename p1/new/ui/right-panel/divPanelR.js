

class DivPanelR
{
	divPanel;
	btnShow;
	btnClose;
	
	
	init()
	{
		this.divPanel = document.querySelector('[nameId="panel_catalog_1"]');
		this.btnShow = document.querySelector('[nameId="button_show_panel_catalog"]');
		this.btnClose = document.querySelector('[nameId="button_catalog_close"]');
		
		this.initEvent();
	}
	
	// кликнули на checkBox
	initEvent()
	{
		this.btnShow.onmousedown = () => { this.showHidePanelR({show: true}); }
		this.btnClose.onmousedown = () => { this.showHidePanelR({show: false}); }		
	}
	
	// скрываем/показываем правое меню UI
	showHidePanelR({show})
	{
		if(show) 
		{ 
			this.divPanel.style.display = ''; 
			this.btnShow.style.display = 'none';
		}
		else 
		{ 
			this.divPanel.style.display = 'none'; 
			this.btnShow.style.display = '';
		}
	}
	
}







