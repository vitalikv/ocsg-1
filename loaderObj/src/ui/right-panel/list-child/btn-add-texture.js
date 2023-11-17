
import { loadTexture } from '../../../loaderTexture.js';


let input = crInputLoader();
let data = null;

function crInputLoader()
{
	if(1===2)
	{
		let accept = `accept="(.png,.jpeg,.jpg)"`;	//let accept = `accept=".png, .jpeg, .jpg"`;	let accept = `accept="image/png, image/jpeg"`;
		let style = `style="position: absolute; display: none;"`;
		
		let html = `<input name="file" type="file" ${accept} ${style}>`;
		let elem = document.createElement('div');			
		elem.innerHTML = html;
		document.body.append(elem);
		
		let input = elem.children[0];		
	}
	
	let input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';	
	input.style.cssText = "position: absolute; display: none;"
	
	input.onchange =(e)=> 
	{ 
		if(e.target.files.length > 0) 
		{					
			getSrcBase64(e.target.files[0]);
			input.value = '';
		}
	}
	
	function getSrcBase64(file)
	{
		if(file.type.indexOf( 'image' ) === -1) return;

		const reader = new FileReader();
		
		reader.onload =()=> 
		{
			data.addTexture({src: reader.result});
		}
		
		reader.readAsDataURL(file);			
	}
	
	return input;
}


export class BtnAddTexture
{
	constructor({elem, material, clDelT})
	{
		this.elem = null;
		this.material = material;
		this.clDelT = clDelT;
		this.init({elem});
	}
	
	
	init({elem})
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		elem.querySelector('[nameId="itemTexture"]').append(this.elem);
		
		this.initEvent();
		
		if(this.material.map && this.material.map.image) 
		{
			this.addDivImg({src: this.material.map.image.src});
		}			
	}
	
	html()
	{
		let style = `style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 66px; height: 66px; margin-left: 10px; border: 1px solid #4A4A4A; border-radius: 4px; box-sizing: border-box; font-size: 12px; color: #4A4A4A; cursor: pointer; user-select: none; overflow: hidden;"`;	
		
		let html = 
		`<div nameId="addTexture" ${style} class="backgFFFFFF backgHoverD1D1D1">
			<div style="display: none; width: 100%; height: 100%;">
				<img src="" style="width: 66px; height: 66px;">
			</div>
			
			<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
				<img src="img/svg/i_upload-cloud.svg" style="width: 16px; height: 16px; margin-bottom: 6px;">
				<div>
					texture
				</div>
			</div>		
		</div>`;			
		
		return html;
	}
	
	initEvent()
	{		
		this.elem.onmousedown = (e) => 
		{ 
			input.click();
			data = this;
		}
	}

	addTexture({src})
	{
		this.addDivImg({src});

		loadTexture({material: this.material, src});
		this.clDelT.show();
	}

	addDivImg({src})
	{
		this.elem.children[0].children[0].src = src;
		this.elem.children[0].style.display = '';
		this.elem.children[1].style.display = 'none';
	}
	
	resetDivImg()
	{
		this.elem.children[0].style.display = 'none';
		this.elem.children[0].children[0].src = '';		
		this.elem.children[1].style.display = 'flex';		
	}
}

















