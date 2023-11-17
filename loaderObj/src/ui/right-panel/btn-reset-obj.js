
import * as Build from '../../index.js';
import * as Lobj from '../../loaderObj.js';


export class UIbtnResetObj
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
		document.querySelector('[nameId="containerScene"]').prepend(this.elem);
		
		this.initEvent();
	}
	
	html()
	{
		let html = 
		`<div nameId="reset_obj" style="position: absolute; top: 10px; right: 10px; cursor: pointer;">
			<img src="img/reset_obj.png">
		</div>`;			
		
		return html;
	}
	
	initEvent()
	{
		this.elem.onmousedown = (e) => { this.resetObj(); }
	}
	
	
	resetObj() 
	{ 
		if(!Lobj.dataObj) return;
		
		Lobj.parseObj_1({data: Lobj.dataObj});
	}	
	
}



