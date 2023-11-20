
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as SendD from '../sendData.js';




export class UIwrapPreview
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

		this.initEvent();
	}
	
	html()
	{
		let html = 
		`<div class="modal_1" nameId="wrap_preview" style="display: none;">
			<div class="err_inf">		
				
				<div nameId="window_preview" class="popup_1">
				
					<div style="margin: 38px 0 0 38px; font-size: 24px; color: #666; font-weight: bold;">
						${infProject.text.pp.prev}
					</div>
					
					<div style="width: 220px; height: 220px; margin: 26px auto 0 auto; border: 1px solid #269CFF;">
						<img nameId="screenImg_1" src="" style="display: block; height: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;">
					</div>
								

					<div nameId="pr_cancel" style="display: flex; width: 344px; height: 48px; margin: 47px auto 0 auto; align-items: center; background: #F0FCFE; border: 1px solid #269CFF; border-radius: 4px; cursor: pointer;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #4A4A4A;">
							${infProject.text.pp.cancel}
						</div>
					</div>

					<div nameId="pr_import_1" class="butt_blue_1" style="width: 344px; height: 48px; margin: 10px auto 0 auto;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #FFFFFF;">
							${infProject.text.pp.import}
						</div>
					</div>					
				</div>
				
			</div>
		</div>`;
		
		return html;
	}
	
	
	initEvent()
	{
		this.elem.onmousedown = (e) => { this.elem.style.display = 'none'; e.stopPropagation(); }
		this.elem.querySelector('[nameId="window_preview"]').onmousedown = (e) => { e.stopPropagation(); }
		
		this.elem.querySelector('[nameId="pr_cancel"]').onmousedown = (e) => { this.elem.style.display = 'none'; e.stopPropagation(); }
		this.elem.querySelector('[nameId="pr_import_1"]').onmousedown = (e) => { this.elem.style.display = 'none'; SendD.sendData(); }		
	}

	
}


