
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';
import { setNewMaterial } from '../../../settMat.js';



export class ListTypeMaterial
{
	constructor()
	{
		this.elem = null;
		this.list = null;
		this.init();
	}
		
	init()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];
		document.body.prepend(this.elem);	// or append

		this.list = this.getListSvgMaterial();
	}
	
	html()
	{
		let html = 
		`<div nameId="modal_materials" class="modal_materials" style="display: none;">

		</div>`;		
		
		return html;
	}

	getListSvgMaterial()
	{
		let arrM = [];
		arrM[0] = {old: 'matte', new: 'matt', name: 'Matt', img: 'img/svg/matt.svg'};
		arrM[1] = {old: 'satin', new: 'semimatt', name: 'Semi-matt', img: 'img/svg/semi-matt.svg'};
		arrM[2] = {old: 'semigloss', new: 'semiglossy', name: 'Semigloss', img: 'img/svg/semigloss.svg'};
		arrM[3] = {old: 'glossy', new: 'glossy', name: 'Glossy', img: 'img/svg/glossy.svg'};
		arrM[4] = {old: 'reflective', new: 'reflective', name: 'Reflective', img: 'img/svg/reflective.svg'};
		arrM[5] = {old: 'brushed', new: 'brushed', name: 'Brushed', img: 'img/svg/brushed.svg'};
		arrM[6] = {old: 'polished', new: 'polished', name: 'Polished', img: 'img/svg/polished.svg'};
		arrM[7] = {old: 'chrome', new: 'chrome', name: 'Chrome', img: 'img/svg/chrome.svg'};
		arrM[8] = {old: 'mirror', new: 'mirror', name: 'Mirror', img: 'img/svg/mirror.svg'};
		arrM[9] = {old: 'glass', new: 'glass', name: 'Glass', img: 'img/svg/glass.svg'};
		arrM[10] = {old: 'steklo_blur', new: 'frostedglass', name: 'Frosted glass', img: 'img/svg/frosted_glass.svg'};
		arrM[11] = {old: 'mattet', new: 'tulle', name: 'Tulle', img: 'img/svg/tulle.svg'};
		arrM[12] = {old: 'selfluminous', new: 'Self-luminous', name: 'selfluminous', img: 'img/svg/selfluminous.svg'};
		
		
		for(let i = 0; i < arrM.length; i++)
		{
			let html = 
			`<div style="margin: 12px auto 0 auto; cursor: pointer;">
				<img src="${arrM[i].img}">
				<div>${arrM[i].name}</div>
			</div>`;		
			
			let div = document.createElement('div');			
			div.innerHTML = html;
			let elem = div.children[0];
			
			this.elem.append(elem);

			arrM[i].el = elem;
		}	

		return arrM;
	}
	
	
	getSrcTypeMaterial({type, el})
	{
		let item = this.list.find((item) => item.old === type);	
		el.src = item.img;		
	}
	
	
	openModal({material, el})
	{
		this.show({el});
		this.initEventModal();
		this.initEventItem({material, el});		
	}
	
	
	show({el})
	{
		let rect = el.getBoundingClientRect();
		
		this.elem.style.display = 'grid';
		
		let top = (rect.top + rect.height/2 - this.elem.clientHeight);		
		if(top < 10) { top = 10; }
		this.elem.style.top = top+'px';
		this.elem.style.left = (rect.left + rect.width/2 - this.elem.clientWidth)+'px';		
	}
	
	
	initEventModal()
	{
		let closeB = (event) =>
		{ 
			if (!this.elem.contains(event.target)) 
			{ 			 
				document.removeEventListener('mousedown', closeB);
				this.elem.style.display = 'none';
			}
		}
		
		document.addEventListener('mousedown', closeB);		
	}
	
	
	initEventItem({material, el})
	{
		for ( let i = 0; i < this.list.length; i++ )
		{
			this.list[i].el.onmousedown = (e) =>
			{ 
				setNewMaterial({material, name: this.list[i].old});
				
				this.elem.style.display = 'none';
				el.src = this.list[i].img;
			}
		}
	}

}






