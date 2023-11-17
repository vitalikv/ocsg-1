
import * as Build from '../../../index.js';
import { simplifyMesh } from "../../../m/simplifyModifier.js";


export class ListChildTrnGeom
{
	constructor()
	{
		this.elem = null;
		
		this.obj = null;
		this.fGeom = null;
		this.fCountTrn = null;
		
		this.original = null;
		this.elLow = null;
		this.elMedium = null;
		this.elHigh = null;
		
		this.init();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		document.body.querySelector('[nameId="containerScene"]').prepend(this.elem);
		
		this.original = this.elem.querySelector('[nameId="original"]');
		this.elLow = this.elem.querySelector('[nameId="low"]');
		this.elMedium = this.elem.querySelector('[nameId="medium"]');
		this.elHigh = this.elem.querySelector('[nameId="high"]');		
		
		this.initEvent();
	}
	
	html()
	{
		let style = `position: absolute; top: 50%; left: 50%; width: 115px; height: 178px; z-index: 1; text-align: center; font-size: 14px; color: #4A4A4A; background: #fff; border: 1px solid #D1D1D1;`;	

		let html = 
		`<div style="display: none; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1; background-color: rgba(0, 0, 0, 0.0);">
			<div nameId="listChildModGeom" style="${style}">
				${this.htmlHeader()}
				${this.htmlBody()}
			</div>			
		</div>`;
		
		return html;
	}
	
	htmlHeader()
	{
		let style = `display: flex; justify-content: space-between; align-items: center; height: 22px; z-index: 1; border-bottom: 1px solid #D1D1D1; user-select: none;`;	
		
		let html = 
		`<div style="${style}">
			<div style="margin-left: 16px; font-size: 10px; color: #9E9E9E;">
				Optimise
			</div>
		</div>`;			
		
		return html;
	}


	htmlBody()
	{
		let style1 = `height: 39px; box-sizing: border-box; border-bottom: 1px solid #D1D1D1; user-select: none;`;
		let style2 = `display: flex; align-items: center; box-sizing: border-box;`;
		
		let html = 
		`<div style="font-size: 14px; color: #4A4A4A; cursor: pointer;">
			<div nameId="original" style="${style1}">
				<div style="${style2} width: 100%; height: 100%;" class="borderFFFFFF borderHover269CFF">
					<div style="margin-left: 12px;">
						Original
					</div>
				</div>
			</div>		
			<div nameId="low" style="${style1}">
				<div style="${style2} width: 100%; height: 100%;" class="borderFFFFFF borderHover269CFF">
					<div style="margin-left: 12px;">
						Low
					</div>
				</div>
			</div>
			<div nameId="medium" style="${style1}">
				<div style="${style2} width: 100%; height: 100%;" class="borderFFFFFF borderHover269CFF">
					<div style="margin-left: 12px;">
						Medium
					</div>
				</div>
			</div>		
			<div nameId="high" style="${style1}">
				<div style="${style2} width: 100%; height: 100%;" class="borderFFFFFF borderHover269CFF">
					<div style="margin-left: 12px;">
						High
					</div>
				</div>
			</div>
		</div>`;			
		
		return html;
	}
	
	
	initEvent()
	{		
		this.elem.onmousedown = (e) => { this.elem.style.display = 'none'; e.stopPropagation(); }
		this.elem.querySelector('[nameId="listChildModGeom"]').onmousedown = (e) => { e.stopPropagation(); }
		
		this.original.onmousedown = (e) => { this.clickDefaultGeom(); }
		this.elLow.onmousedown = (e) => { this.clickItem({ratio: 0.2}); }
		this.elMedium.onmousedown = (e) => { this.clickItem({ratio: 0.5}); }
		this.elHigh.onmousedown = (e) => { this.clickItem({ratio: 0.8}); }		
	}

	show({el, obj, fGeom, fCountTrn})
	{
		this.obj = obj;
		this.fGeom = fGeom;
		this.fCountTrn = fCountTrn;
		this.elem.style.display = '';
		
		let rect = el.getBoundingClientRect();
		
		let elem = this.elem.children[0];
		
		let top = (rect.top + rect.height);				
		if(top + elem.clientHeight > document.body.clientHeight) { top = rect.top - elem.clientHeight; }
		elem.style.top = top+'px';
		elem.style.left = rect.left+'px';		
	}
	
	hide()
	{
		this.obj = null;
		this.fGeom = null;
		this.fCountTrn = null;
		this.elem.style.display = 'none';
	}


	clickItem({ratio})
	{
		if(this.obj.geometry.userData.typeMod === ratio)
		{
			this.hide();
			return;
		}			
		
		Build.infProg.class.modalW.elem.modgeom.show();
		Build.infProg.class.modalW.elem.modgeom.setListMesh({list: [this.obj.name]});
		
		this.fGeom();
		let fcaclCountTrn = this.caclCountTrn.bind(this);
		
		setTimeout(()=>
		{ 
			simplifyMesh({childs: [this.obj], childId: 0, ratio, callback: fcaclCountTrn });
			this.hide();			
		}, 10);					
	}
	
	clickDefaultGeom()
	{
		if(this.obj.geometry.userData.typeMod === 0) 
		{
			this.hide();
			return;
		}
		
		this.fGeom(); 
		this.fCountTrn();
		this.hide();
		Build.infProg.class.rPanel.elem.trnInput.getCountTr_2();
	}
	
	caclCountTrn()
	{
		Build.infProg.class.listMesh.updateListCountTrn();
	}
}



