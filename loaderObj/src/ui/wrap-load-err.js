
import { isCheckExsistFunction } from '../sendData.js';


export class UIwrapLoadErr
{
	constructor()
	{
		this.elem = null;
		this.test = true;	// this.test = this.testServer();
		this.init();
	}

	testServer()
	{
		let hostname = document.location.hostname;
		let test = (hostname == 'test-webgl') ? true : false;

		return test;
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.firstChild;
		document.body.prepend(this.elem);

		this.initEvent();
	}
	
	html()
	{
		let htmlButton = this.htmlButton();
		
		let html = 
		`<div class="modal_1" nameId="wrap_err_inf" style="display: none;">
			<div class="err_inf">		
				
				<div class="popup_1" style="position: relative;">
				
					<div style="margin: 38px 0 0 38px; font-size: 24px; color: #666; font-weight: bold;">
						${infProject.text.pp.swrong}
					</div>
					
					<div style="width: 90px; height: 90px; margin: 26px 0 0 38px;">
						<img src="img/svg/err_logo_1.svg" style="width: 100%; height: 100%;">
					</div>
					
					<div style="width: 344px; height: 80px; margin: 26px 0 0 38px; font-size: 16px; color: #666;" nameId="txt_err_inf">
						${infProject.text.pp.loadnewm}			
					</div>				
					
					${htmlButton}					
				</div>
				
			</div>
		</div>`;
		
		return html;
	}
	
	htmlButton()
	{
		let html = '';
		
		if(this.test)
		{
			html = 
			`<label for="load_obj_1" class="butt_blue_1" style="position: absolute; left: 0; right: 0; bottom: 40px; width: 344px; height: 48px; margin: auto; align-items: center;">
				<div style="margin: auto; font-size: 18px; text-align: center; color: #FFFFFF;">
					${infProject.text.pp.uploadm}
				</div>
			</label>`;			
		}
		else
		{
			html = 
			`<div nameId="butt_another_model_1" class="butt_blue_1" style="position: absolute; left: 0; right: 0; bottom: 40px; width: 344px; height: 48px; margin: auto;">
				<div style="margin: auto; font-size: 18px; text-align: center; color: #FFFFFF;">
					${infProject.text.pp.uploadm}
				</div>
			</div>`;			
		}	
		
		return html;
	}
	
	
	initEvent()
	{
		if(this.test)
		{
			
		}
		else
		{
			let button = this.elem.querySelector('[nameId="butt_another_model_1"]');
			if(button) 
			{ 
				button.onmousedown = (e) => 
				{ 
					if(isCheckExsistFunction(window.parent['EditorInvokeFunction'])) { window.parent.EditorInvokeFunction('SelectModelFile'); } 
				} 	
			}					
		}
	}

		
	show()
	{
		this.elem.style.display = '';
	}
	
	hide()
	{
		this.elem.style.display = 'none';
	}
}


