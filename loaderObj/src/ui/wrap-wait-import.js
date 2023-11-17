
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';
import { getLogo } from './svg/logo.js';



export class UIwrapImportModel
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
		`<div class="modal_1" nameId="wrap_import" style="display: none;">
			<div class="err_inf">		
				
				<div style="width: 90px; height: 90px; margin: auto;">
					${this.svg()}
				</div>	
			</div>
		</div>`;
		
		return html;
	}
}


