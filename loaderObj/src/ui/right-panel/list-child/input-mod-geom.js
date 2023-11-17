
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';



export class DivChildTrnGeom
{
	constructor({elem, obj, gclone})
	{
		this.elem = null;
		
		this.obj = obj;
		this.gclone = gclone;
		
		this.elNumberTrn = null;
		
		this.init({elem});
	}
	
	
	init({elem})
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		elem.querySelector('[nameId="item_trn"]').prepend(this.elem);  // or append
		
		this.elNumberTrn = this.elem.querySelector('[nameId="numberTrn"]');
		
		this.initEvent();
	}
	
	html()
	{
		let style = `style="display: flex; justify-content: space-between; align-items: center; width: 100%; height: 24px; margin: 0 0 2px 0; font-size: 12px; color: #4A4A4A; border: 1px solid #D1D1D1; border-radius: 4px; box-sizing: border-box; background: #F0F0F0; user-select: none;"`;	

		let style1 = `style="display: flex; align-items: center; width: 74px; height: 100%; border-right: 1px solid #D1D1D1; box-sizing: border-box; overflow: hidden;"`;
		
		let style2 = `style="display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; margin: 3px;"`;

		let style3 = `style="display: flex; justify-content: center; align-items: center; cursor: pointer;"`;
		
		let style4 = `style="display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; margin: 3px 0 3px 3px;"`;
		let style5 = `style="display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; margin: 3px 3px 3px 0;"`;
		
		let html = 
		`<div nameId="divTrn" ${style}>
			<div ${style1}>
				<div ${style2}>
					<img src="img/svg/i_triangle.svg" style="width: 16px; height: 16px;">
				</div>
				<div nameId="numberTrn">${this.getCountTrn()}</div>
			</div>
			
			<div nameId="btnInputTrn" ${style3} class="backgHoverD1D1D1">
				<div ${style4}>
					<img src="img/svg/input_arrows.svg" style="width: 16px; height: 16px;">
				</div>
				<div ${style5}>
					<img src="img/svg/input_dropdown.svg" style="width: 16px; height: 16px;">
				</div>				
			</div>
		</div>`;			
		
		return html;
	}
	
	initEvent()
	{
		this.elem.onmousedown = (e) => { this.openList(); }
	}

	getCountTrn()
	{
		let count = 0;
		
		if(this.obj.geometry.attributes.position) count = this.obj.geometry.attributes.position.count/3;
		
		return count;
	}
	
	updateCountTrn()
	{
		this.elNumberTrn.innerText = this.getCountTrn();
		console.log(this.elNumberTrn.innerText);
	}
	
	openList()
	{
		let fCountTrn = this.updateCountTrn.bind(this);
		let fGeom = this.defaultGeom.bind(this);
		
		Build.infProg.class.rPanel.listModG.show({el: this.elem, obj: this.obj, fGeom, fCountTrn});
	}
	
	defaultGeom()
	{
		this.obj.geometry.dispose();
		this.obj.geometry = this.gclone.clone(); 
		this.obj.geometry.userData.empty = false;
		this.obj.geometry.userData.typeMod = 0;
		
		Build.render();
	}
}






