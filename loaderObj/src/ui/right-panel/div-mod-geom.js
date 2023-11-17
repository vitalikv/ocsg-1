
import * as Build from '../../index.js';
import * as MGeom from '../../modifierGeometry.js'


export class UIdivModGeom
{
	constructor()
	{
		this.elem = null;
		this.slider = null;
		this.divTr_2 = null;
		this.butt = null;
		
		this.init();
		this.initEvent();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.firstChild;	
		
		let wrap = document.body.querySelector('[nameId="blockDivUpdateGeom"]');
		wrap.style.cssText = 'width: 100%; margin: 0 auto;';
		wrap.prepend(this.elem);
	}
	
	html()
	{
		let html = 
		`<div style="box-sizing: border-box;">
			<input type="range" nameId="input_geom" min="0.1" max="1" value="1" step="0.1" style="display: none; width: 250px; margin: 0 0 0 16px; cursor: pointer;">
			
			<div class="flex_1">
				<div nameId="updateGeom" class="btMg" style="font-size: 12px;">${infProject.text.pp.mod_geom}</div>
				
				<div style="width: 16px; height: 16px; margin: auto auto 4px auto; cursor: pointer;">
					<img nameId="resetModGeom" src="img/svg/butt_reset_2.svg" style="width: 100%; height: 100%;">
				</div>			
			</div>
		</div>`;					
					
		return html;
	}
	
	
	initEvent()
	{
		this.butt = this.elem.querySelector('[nameId="updateGeom"]');
		this.butt.onmousedown = function(e){ MGeom.optimizeGeomModel(); }
		
		let btnReset = this.elem.querySelector('[nameId="resetModGeom"]');
		btnReset.onmousedown = (e) => { this.resetModGeom(); }
	}
	
	
	resetModGeom()
	{
		Build.infProg.class.listMesh.resetListModGeom();	
	}

	actBtn()
	{
		this.butt.classList.remove("btMg");
		this.butt.classList.add("btAxisYZ");
	}
	
	reset()
	{
		this.butt.classList.remove("btMg");
		this.butt.classList.remove("btAxisYZ");
		this.butt.classList.add("btMg");
	}
}





