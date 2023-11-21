
import { deleteTexture } from '../../../loaderTexture.js';



export class BtnDelTexture
{
	elWrap;
	elem;
	material;
	clAddT;
	
	constructor({elem, material})
	{
		this.elWrap = elem;
		this.material = material;
		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		this.elWrap.querySelector('[nameId="itemTexture"]').append(this.elem);		
	}
	
	
	init({clAddT})
	{	
		this.clAddT = clAddT;
		
		this.initEvent();
	}
	
	html()
	{
		let style = `position: absolute; top: -4px; right: -4px; display: none; justify-content: center; align-items: center; width: 24px; height: 24px; border-radius: 4px; box-sizing: border-box; cursor: pointer; user-select: none; background: #fff;`;	
		
		let html = 
		`<div nameId="delTexture" style="${style}" class="backgHoverD1D1D1">
			<img nameId="resetRot" src="img/svg/bin.svg" style="width: 13px; height: 13px;">
		</div>`;			
		
		return html;
	}
	
	initEvent()
	{		
		this.elem.onmousedown = (e) => 
		{ 
			this.clAddT.resetDivImg();
			deleteTexture({material: this.material});
			this.hide();
			e.stopPropagation();			
		}
	}

	show()
	{
		this.elem.style.display = 'flex';
	}
	
	hide()
	{
		this.elem.style.display = 'none';
	}	
}

















