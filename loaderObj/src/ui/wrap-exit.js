
import { isCheckExsistFunction } from '../sendData.js';


export class UIwrapExit
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
		this.elem = div.children[0];
		document.body.prepend(this.elem);	// or append

		this.initEvent();
	}
		

	html()
	{
		let html = 
		`<div class="modal_1" nameId="wrap_exit_w" style="display: none;">
			<div class="err_inf">		
				
				<div class="popup_1">
				
					<div style="margin: 38px 0 0 38px; font-size: 24px; color: #666; font-weight: bold;">
						${infProject.text.pp.closet}
					</div>
					
					<div style="width: 90px; height: 90px; margin: 26px 0 0 38px;">
						<img src="img/svg/err_inf_triangles.svg" style="width: 100%; height: 100%;">
					</div>
					
					<div style="width: 344px; height: 80px; margin: 26px 0 0 38px; font-size: 16px; color: #666;">
						${infProject.text.pp.closetxt}
					</div>				

					<div nameId="exit_false" style="display: flex; width: 344px; height: 48px; margin: 47px auto 0 auto; align-items: center; background: #F0FCFE; border: 1px solid #269CFF; border-radius: 4px; cursor: pointer;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #4A4A4A;">
							${infProject.text.pp.cancel}
						</div>
					</div>
					
					<div nameId="exit_true" class="butt_blue_1" style="width: 344px; height: 48px; margin: 10px auto 0 auto;">
						<div style="margin: auto; font-size: 18px; text-align: center; color: #FFFFFF;">
							${infProject.text.pp.closeu}
						</div>
					</div>					
				</div>
				
			</div>
		</div>`;		
		
		return html;
	}
	
	
	initEvent()
	{
		this.elem.querySelector('[nameId="exit_false"]').onmousedown = () => { this.sendExit({exit: false}); }
		this.elem.querySelector('[nameId="exit_true"]').onmousedown = () => { this.sendExit({exit: true}); }		
	}
		
	show()
	{
		this.elem.style.display = '';
	}
	
	hide()
	{
		this.elem.style.display = 'none';
	}
	
	sendExit({exit})
	{
		this.hide();
		
		if(exit && isCheckExsistFunction(window.parent['UIInvokeFunction'])) { window.parent.UIInvokeFunction('LoaderClose', {}); }
	}	
}



window.testPromise_1 = testPromise_1;

function testPromise_1()
{
	let p = new Promise((resolve, reject) => {
		let r = testPromise_2();
		resolve(r);
	});
	
	p.then(data=> { console.log(data); })
}

function testPromise_2()
{
	let el1 = document.body.querySelector('[nameId="wrap_exit_w"]');		
	el1.style.display = '';
	
	let el2 = document.querySelector('[nameId="exit_false"]');
	let el3 = document.querySelector('[nameId="exit_true"]');
	
	return new Promise((resolve, reject) => 
	{
		el2.onmousedown = function(){ el1.style.display = 'none'; resolve(false); }
		el3.onmousedown = function(){ el1.style.display = 'none'; resolve(true); }
	});
}


