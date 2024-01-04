

class MyPanelTop
{
	container;
	divP1;
	divP2;
	
	init()
	{
		this.container = document.querySelector('[nameId="wrapP1"]');
		
		this.divP1 = this.crDivP1();
		this.container.append(this.divP1);
		
		const btnScreen = this.divP1.querySelector('[nameId="screenshot"]');
		btnScreen.onmousedown = () => { createImageSvg(); createImageScene(); }
		
		//this.initEvent();
	}

	
	// верхняя панель с названием и кнопками (2D 3D скрин и т.д.)
	crDivP1()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];	
	}

	// верхняя панель с режимами (теплый пол, отопление и т.д.)
	crDivP2()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_2();
		return div.children[0];	
	}		
	
	initEvent()
	{
		//this.btnShow.onmousedown = () => { this.showHidePanelR({show: true}); }
				
	}
	
	html_1()
	{
		const cssHeader = 
		`display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;`;
		
		let h1 = '';
		if(infProject.h1 !== '')
		{
			h1 = `<h1 style="font: 18px Arial, Helvetica, sans-serif;">${infProject.h1}<h1>`;
		}
		
		const html = 
		`<div class="flex_1 top_panel_2" ui_1="" style="height: 41px; margin: 0; border: 1px solid #b3b3b3; background-color: #f1f1f1;">	
			
			<div class="button1-wrap-1" nameId="btn_menu" style="margin-left: 15px;">
				<div class="button1 button_gradient_1" style="padding: 7px; font-weight: normal; border-radius: 0;"> 
					меню
				</div>	
			</div>
			
			<div class="toolbar" data-action ='top_panel_1'>
				<div class="button1-wrap-1" style="color: #737373; align-items: center; padding: 0 10px;">
					${h1}
				</div>
				
				<div class="button1-wrap-1">
					<div nameId="screenshot" class="button1 button_gradient_1" style="padding: 7px; font-weight: normal; border-radius: 0;"><img src="${infProject.path}img/screenshot.png"></div>
				</div>		
			</div> 
			
			
			<div class="button1-wrap-1" nameId='butt_cam_walk' style="display: none;">
				<div class="button1 button_gradient_1" style="padding: 7px; font-weight: normal; border-radius: 0;"> 
					<img src="${infProject.path}img/walk_2.png">
				</div>	
			</div>		
			
			<div class="tp_right_1" style="display: flex;">	
				<div class="button1-wrap-1" nameId='butt_camera_2D' style="display: none;">
					<div class="button1 button_gradient_1" style="width: 39px; padding: 7px; font-weight: normal; border-radius: 0;"> 
						2D
					</div>	
				</div>		
				<div class="button1-wrap-1" nameId='butt_camera_3D'>
					<div class="button1 button_gradient_1" style="width: 39px; padding: 7px; font-weight: normal; border-radius: 0;"> 
						3D
					</div>	
				</div>			
			</div>	
			
		</div>`;		

		return html;
	}

	html_2()
	{
		const css1 = 
		`position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 41px;
		margin: 0;
		border: 1px solid #b3b3b3;
		border-top: none;
		background: #f1f1f1;`;

		const cssTab = 
		`margin: auto 10px;
		padding: 5px;
		font-size: 15px;
		color: #666;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #fff;
		cursor: pointer;
		user-select: none;`;		
		
		const html = 
		`<div ui_1="" style="${css1}">			
			<div nameId="plan" style="${cssTab}">планировка</div>
			<div nameId="otop" style="${cssTab}">отопление</div>
			<div nameId="wf" style="${cssTab}">теплый пол</div>
		</div>`;

		return html;
	}


	// панель для платных пользователей
	addPaidPanel()
	{
		this.divP2 = this.crDivP2();
		this.container.append(this.divP2);
		
		myPanelWF.init();
		
		const divPanelPlan = document.querySelector('[nameId="panelPlan"]');
		
		const btnPl = this.divP2.querySelector('[nameId="plan"]');
		const btnOt = this.divP2.querySelector('[nameId="otop"]');
		const btnWF = this.divP2.querySelector('[nameId="wf"]');
		//btn.onmousedown = () => { clickInterface({button: 'add_pointWf'}); }
		btnPl.onmousedown = () => { myPanelWF.showHidePanel({show: false}); divPanelPlan.style.display = ''; }
		btnWF.onmousedown = () => { divPanelPlan.style.display = 'none'; myPanelWF.showHidePanel({show: true}); }
	}
}







