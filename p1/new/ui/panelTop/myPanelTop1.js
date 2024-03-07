
// верхняя панель с кнопками камеры, меню, скриншота
class MyPanelTop1
{
	container;
	divP1;
	
	init()
	{
		this.container = document.querySelector('[nameId="wrapP1"]');
		
		this.divP1 = this.crDivP1();
		this.container.append(this.divP1);
		
		const btnScreen = this.divP1.querySelector('[nameId="screenshot"]');
		btnScreen.onmousedown = () => { createImageSvg(); createImageScene(); }
	}

	
	// верхняя панель с названием и кнопками (2D 3D скрин и т.д.)
	crDivP1()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];	
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

}







