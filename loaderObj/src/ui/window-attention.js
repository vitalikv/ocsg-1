
import * as SendD from '../sendData.js';


export class UIwindowAttention
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
	
	html()
	{		
		let html = 
		`<div class="modal_1" nameId="wrap_inf_sizes_1" style="display: none;">
			<div class="err_inf">		
				
				<div class="popup_1" style="position: relative;">
				
					<div style="margin: 38px 0 0 38px; font-size: 24px; color: #666; font-weight: bold;">
						${infProject.text.pp.attention} 
					</div>
					
					<div style="width: 90px; height: 90px; margin: 26px 0 0 38px;">
						<img src="img/svg/err_inf_triangles.svg" style="width: 100%; height: 100%;">
					</div>
					
					<div nameId="info_text" style="width: 344px; margin: 40px 0 0 38px; text-align: left; font-size: 16px; color: #666;">

					</div>					


					<div nameId="exit_sizes_1" style="display: flex; position: absolute; left: 0; right: 0; bottom: 40px; width: 344px; height: 48px; margin: auto; align-items: center; background: #F0FCFE; border: 1px solid #269CFF; border-radius: 4px; cursor: pointer;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #4A4A4A;">
							${infProject.text.pp.editsize}
						</div>
					</div>
				
					
				</div>
				
			</div>
		</div>`;

		
		return html;
	}	

	
	showAttention({size, triangles})
	{
		let elemWrap = this.elem.querySelector('[nameId="info_text"]');
		elemWrap.innerHTML = '';
		
		let htmlTrg = '';
		let htmlSize = '';		

		if(triangles)
		{
			htmlTrg = 
			`<div style="margin: 20px 0 0 0;">
				${infProject.text.pp.o_triang_1}. ${infProject.text.pp.o_triang_2}.				
			</div>`;

			addElem({html: htmlTrg});
		}
		
		if(size)
		{
			htmlSize = 
			`<div style="margin: 20px 0 0 0;">
				${infProject.text.pp.o_size_1}.
			</div>`;

			addElem({html: htmlSize});
		}

		function addElem({html})
		{
			let div = document.createElement('div');
			div.innerHTML = html;
			elemWrap.appendChild(div.firstChild);			
		}
				
		
		this.elem.style.display = '';
		
		this.initEvent({size, triangles});
	}
	
	
	initEvent({size, triangles})
	{
		this.elem.querySelector('[nameId="exit_sizes_1"]').onmousedown = (e) => 
		{ 
			this.elem.style.display = 'none';
			if(size) this.addClassInputSize({event: e});
			if(triangles) this.addClassInputTriangles({event: e});
			e.stopPropagation(); 
		}		
	}
	

	addClassInputSize({event})
	{
		this.removeClassInputSize = this.removeClassInputSize.bind(this);
		
		document.body.querySelector('[nameId="list_units"]').classList.add("blink");
		document.body.querySelector('[nameId="wrInputSizeObjX"]').classList.add("blink");
		document.body.querySelector('[nameId="wrInputSizeObjY"]').classList.add("blink");
		document.body.querySelector('[nameId="wrInputSizeObjZ"]').classList.add("blink");
		
		//event.stopPropagation();
		document.body.addEventListener('mousedown', this.removeClassInputSize);

	}
	
	removeClassInputSize()
	{
		document.body.querySelector('[nameId="list_units"]').classList.remove("blink");
		document.body.querySelector('[nameId="wrInputSizeObjX"]').classList.remove("blink");
		document.body.querySelector('[nameId="wrInputSizeObjY"]').classList.remove("blink");
		document.body.querySelector('[nameId="wrInputSizeObjZ"]').classList.remove("blink");

		document.body.removeEventListener('mousedown', this.removeClassInputSize);
	}


	addClassInputTriangles({event})
	{
		this.removeClassInputTriangles = this.removeClassInputTriangles.bind(this);
		
		document.body.querySelector('[nameId="wrap_slider_geom"]').classList.add("blink");
		document.body.addEventListener('mousedown', this.removeClassInputTriangles);
	}
	
	removeClassInputTriangles()
	{
		document.body.querySelector('[nameId="wrap_slider_geom"]').classList.remove("blink");
		document.body.removeEventListener('mousedown', this.removeClassInputTriangles);
	}	
}


