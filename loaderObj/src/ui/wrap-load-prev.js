
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';
import { getLogo } from './svg/logo.js';



export class UIwrapLoadPrev
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
	}
	
	show()
	{
		this.elem.style.display = '';
	}
	
	
	hide()
	{
		this.elem.style.display = 'none';
	}

	svg()
	{
		return getLogo();
	}
	
	html()
	{
		let html = 
		`<div class="modal_1" nameId="wrap_loading" style="display: none;">
			<div class="err_inf">		
				
				<div style="width: 90px; height: 90px; margin: auto;">
					${this.svg()}
				</div>	
			</div>
		</div>`;
		
		return html;
	}
	
	html_2()
	{
		//<img src="img/loading.gif" style="width: 100%; height: 100%;">
		
		let html = 
		`<div class="modal_1" nameId="wrap_loading" style="display: none;">
			<div class="err_inf">		
				
				<div style="display: flex; width: 220px; height: 120px; margin: auto; align-items: center; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);">
				
					<div style="display: flex; margin: auto; font-size: 24px; color: #666; text-align: center; font-weight: bold;">						
						<div nameId="wrap_load_text1">${infProject.text.rp.loading}</div>
						<div nameId="wrap_load_text2" style="margin-left: 0px;">...</div>
					</div>
														
				</div>
				
			</div>
		</div>`;
		
		return html;
	}
}


