
//import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';


export class BtnChildSettingMap
{
	constructor({elem, material})
	{
		this.elem = null;
		this.material = material;
		this.init({elem});
	}
	
	
	init({elem})
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		elem.querySelector('[nameId="item_1"]').prepend(this.elem);
		
		this.initEvent();
	}
	
	html()
	{
		let style = `style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; border-radius: 4px; box-sizing: border-box;  cursor: pointer; user-select: none;"`;	
		
		let html = 
		`<div nameId="delTexture" ${style} class="backgHoverD1D1D1">
			<img nameid="resetRot" src="img/svg/i_settings.svg" style="width: 16px; height: 16px;">
		</div>`;			
		
		return html;
	}
	
	initEvent()
	{		
		this.elem.onmousedown = (e) => 
		{ 
			Build.infProg.class.rPanel.settMap.openModal({el: this.elem, material: this.material});
			e.stopPropagation();
		}
	}

}


