
import * as Build from '../../index.js';
import * as Screen from '../../screenshot.js';
import * as Lobj from '../../loaderObj.js';
import * as SendD from '../../sendData.js';


export class UIbuttonImportCatalog
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
		document.body.querySelector('[nameId="wrap_btn_import_cat"]').prepend(this.elem);
		
		this.initEvent();
	}
	
	html()
	{
		let html = 
		`<div nameId="postM_1" class="butt_imp_1" style="height: 36px; margin: 12px 10px;">
			<div style="margin: auto; text-align: center; font-size: 12px;">
				${infProject.text.rp.importcat}
			</div>
		</div>`;			
		
		return html;
	}
	

	
	initEvent()
	{
		this.elem.onmousedown = (e) => { this.buttonClick(); e.stopPropagation(); } 					
	}


	buttonClick()
	{
		if(!Build.infProg.scene) return;
		
		let atten = {size: false, triangles: false};
		
		if(Build.dataFbx.modelSize.x > 10) { atten.size = true; }
		if(Build.dataFbx.modelSize.y > 10) { atten.size = true; }
		if(Build.dataFbx.modelSize.z > 10) { atten.size = true; }
		
		
		function getTr()
		{
			let obj = Build.infProg.scene;
			let triangles = 0;
			
			obj.traverse(function(child) 
			{
				if (child.isMesh && child.geometry && child.geometry.attributes  && child.geometry.attributes.position) 
				{ 
					triangles += child.geometry.attributes.position.count/3; 
				}
			});
			return triangles;
		}
		if(getTr() > Build.infProg.limitTr) { atten.triangles = true; }
		
		
		if(atten.size || atten.triangles) 
		{ 
			Build.infProg.class.modalW.elem.atten.showAttention({size: atten.size, triangles: atten.triangles});
		}			
		else
		{
			Screen.saveAsImage({src: true, nameid: 'screenImg_1'});		
			document.querySelector('[nameId="wrap_preview"]').style.display = 'block'; 
		}		
		
	}


	actBtn()
	{
		this.elem.classList.remove("butt_imp_1");
		this.elem.classList.add("butt_imp_2");
	}
	
	reset()
	{
		this.elem.classList.remove("butt_imp_1");
		this.elem.classList.remove("butt_imp_2");
		this.elem.classList.add("butt_imp_1");
	}
}





