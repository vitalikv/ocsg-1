
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';
import { UIsvgLine } from './wrap-tutorial-svg.js';



export class UItutorial
{
	constructor()
	{
		this.elem = null;
		this.elPop = null;
		this.idContent = -1;
		this.list = [];
		this.elText = null;
		
		this.btnNext = null;
		this.btnSkip = null;		
		
		this.svg = null;
		
		this.init();
	}
	
	init()
	{		
		let cookie = this.cookie();
		
		if(cookie) return;
		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];
		document.querySelector('[nameId="containerScene"]').prepend(this.elem);
		
		this.elPop = this.elem.querySelector('[nameId="div_tut"]');
		this.elText = this.elem.querySelector('[nameId="div_text"]');		
		
		this.initEvent();
		this.listContent();	
		
		this.svg = new UIsvgLine({container: this.elem});
	}
	
	cookie()
	{
		if(this.testCookie()) return false;
		
		let result = getCookie('tut');
		
		if(!result) document.cookie = `tut=true; max-age=${3600 * 100}`;
		
		function getCookie(name) 
		{
			let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
			
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}

		return result;
	}
	
	testCookie()
	{
		let searchParams = new URLSearchParams(document.location.search);	// &tut=true | ?tut=true
		let flag = searchParams.get('tut');
		
		return (flag) ? true : false;			
	}
	
	html()
	{
		let html = 
		`<div nameId="wrap_tutorial" style="display: none; position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.5); overflow: hidden; user-select: none;">
			${this.htmlPop1()}
		</div>`;
		
		return html;
	}

	htmlPop1()
	{
		let style = `display: flex; position: absolute; top: 200px; right: 90px; transform: translateX(-100%) translateY(-50%); background: #fff; width: 220px; border: 2px solid #269CFF; border-radius: 5px;`;
		
		let html = 
		`<div nameId="div_tut" style="${style}">
			<div style="display: flex; flex-direction: column; justify-content: space-between;">
				<div nameId="div_text" style="margin: 15px 15px 20px 15px; font-size: 12px; line-height: 14px; color: #4A4A4A;">
					Check the size, rotation and materials of the 3D model in the preview.				
				</div>
				
				<div style="display: flex; margin-left: 15px; margin-bottom: 15px;">
					<div nameId="btn_next" style="display: flex; align-items: center; justify-content: center; width: 66px; height: 22px; font-size: 12px; color: #fff; background: #269CFF; border-radius: 4px; cursor: pointer;">
						<div>
							${infProject.text.tut.next}
						</div>
					</div>
					
					<div nameId="btn_skip" style="display: flex; align-items: center; justify-content: center; width: 66px; height: 22px; font-size: 12px; color: #269CFF; margin-left: 10px; border-radius: 4px; cursor: pointer;">
						<div>
							${infProject.text.tut.skip}
						</div>
					</div>
				</div>
			</div>
		</div>`;
		
		return html;
	}	
	
	initEvent()
	{
		this.btnNext = this.elem.querySelector('[nameId="btn_next"]');
		this.btnSkip = this.elem.querySelector('[nameId="btn_skip"]');
		
		this.btnNext.onmousedown = (e) => { this.nextContent(); e.stopPropagation(); }
		this.btnSkip.onmousedown = (e) => { this.close(); e.stopPropagation(); }
	}

	listContent()
	{		
		this.list.push(infProject.text.tut.step1);
		this.list.push(infProject.text.tut.step2);
		this.list.push(infProject.text.tut.step3);
		this.list.push(infProject.text.tut.step4);
	}

	nextContent()
	{
		this.idContent += 1;
		
		if(this.idContent > this.list.length - 1) 
		{
			this.close();
			return;
		}
		
		this.elText.innerText = this.list[this.idContent];
		
		if(this.idContent === this.list.length - 1)
		{
			this.btnNext.innerText = infProject.text.tut.got;
			this.btnSkip.style.display = 'none';			
		}
		
		this.svg.setSvg({id: this.idContent});
		this.elPop.style.top = this.svg.coord.y + 'px';
		this.elPop.style.left = this.svg.coord.x + 'px';
	}

	show()
	{
		if(!this.elem) return;
		
		this.elem.style.display = '';		
		
		this.nextContent();
	}
	
	close()
	{
		if(!this.elem) return;
		
		this.elem.style.display = 'none';
	}
}


