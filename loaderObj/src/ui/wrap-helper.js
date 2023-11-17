
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';




export class UIwrapHelper
{
	constructor()
	{
		this.elem = null;
		this.init();
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
		let html = 
		`<div class="modal_1" nameId="wrap_help" style="display: none;">
			<div class="err_inf">		
				
				<div class="popup_1">
				
					<div style="margin: 38px 0 0 38px; font-size: 24px; color: #666; font-weight: bold;">
						${infProject.text.pp.howw}
					</div>
					
					<div nameId="src_youtube" style="display: flex; width: 344px; height: 194px; margin: 26px 0 0 38px; align-items: center; background: #FF8C87;">
						
					</div>
					
					<div style="width: 344px; height: 80px; margin: 26px 0 0 38px; font-size: 16px; color: #666;">
						${infProject.text.pp.howt}				
					</div>				

					<div nameId="help_close" class="butt_blue_1" style="width: 344px; height: 48px; margin: 10px auto 0 auto;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #FFFFFF;">
							${infProject.text.pp.ok}
						</div>
					</div>					
				</div>
				
			</div>
		</div>`;
		
		return html;
	}
	
	
	initEvent()
	{
		
	}


	showHelpTab()
	{
		let html = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/vB9Jgdo-600" frameborder="0" allowfullscreen></iframe>`;

		let elSrcYoutube = this.elem.querySelector('[nameId="src_youtube"]');
		let elClose = this.elem.querySelector('[nameId="help_close"]');
		
		elClose.onmousedown = (e) => { this.elem.style.display = 'none'; elSrcYoutube.innerHTML = ''; e.stopPropagation(); }
		
		elSrcYoutube.innerHTML = html;
		this.elem.style.display = '';
	}	
}


