
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';
import { getLogo } from './svg/logo.js';



export class UIwrapModGeom
{
	constructor()
	{
		this.elem = null;
		this.infoTxt = null;
		this.stopModGeom = false;
		this.init();
		
		this.infoTxt = this.elem.querySelector('[nameId="info_txt"]');
		
		this.initEvent();
	}
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.firstChild;
		document.body.prepend(this.elem);		
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
				
				<div style="position: absolute; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); width: auto; height: auto;">
					${this.svg()}
				</div>

				<div style="position: absolute; left: 50%; top: calc(50% + 50px); transform: translateX(-50%) translateY(-0%);">
					${this.htmlBtnCancel()}
				</div>
				
				<div nameId="info_txt" style="position: absolute; left: 50%; top: calc(50% + 100px); transform: translateX(-50%) translateY(-0%); width: 300px;  max-height: 350px; overflow-y: auto; background-color: rgba(255, 255, 255, 0.5); padding: 15px; font-size: 16px; color: #4A4A4A; border-radius: 4px;">
				
				</div>
			</div>
		</div>`;
		
		return html;
	}

	htmlBtnCancel()
	{
		let html = 
		`<div nameId="cancel" style="display: flex; justify-content: center; align-items: center; width: 120px; height: 24px; background: #FFFFFF; border: 1px solid #4A4A4A; border-radius: 4px; color: #4A4A4A; cursor: pointer; user-select: none;">
			${infProject.text.pp.cancel}
		</div>`;
		
		return html;		
	}
	
	
	initEvent()
	{ 
		let elem = this.elem.querySelector('[nameId="cancel"]');
		elem.onmousedown = (e) => { this.stopModGeom = true; e.stopPropagation(); } 
	}
	
	
	show()
	{
		this.elem.style.display = '';
	}
	
	
	hide()
	{
		this.elem.style.display = 'none';
	}	
	
	setListMesh({list})
	{
		this.infoTxt.innerHTML = '';
		
		let txt = '';
		
		for(let i = 0; i < list.length; i++)
		{
			txt += `
			<div style="display: flex; margin: 5px 0;">
				<div style="width: 240px; overflow: hidden;">${list[i]}</div>
				<div style="flex: auto; margin-left: 10px; text-align: right;">0%</div>
			</div>`;
		} 
	
	
		this.infoTxt.innerHTML = txt;
	}
}


