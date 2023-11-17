
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';
import { updateSettingTexture } from '../../../loaderTexture.js';



export class ModalSettingMap
{
	constructor()
	{
		this.elem = null;
		
		this.material = null;
		
		this.inputs = {};
		this.inputs.scalex = null;
		this.inputs.scaley = null;
		this.inputs.offsetx = null;
		this.inputs.offsety = null;		
		this.inputs.rotate = null;
		
		this.svg_arroe_up = null;
		this.svg_arroe_down = null;
		
		this.svg();
		this.init();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.children[0];			
		document.body.querySelector('[nameId="containerScene"]').prepend(this.elem);
		
		this.inputs.scalex = this.elem.querySelector('[nameId="scaleX"]');
		this.inputs.scaley = this.elem.querySelector('[nameId="scaleY"]');
		this.inputs.offsetx = this.elem.querySelector('[nameId="offsetX"]');
		this.inputs.offsety = this.elem.querySelector('[nameId="offsetY"]');		
		this.inputs.rotate = this.elem.querySelector('[nameId="rotateT"]');		
		
		this.initEvent();
	}


	svg()
	{
		this.svg_arroe_up =
		`<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5 5.28493e-06L10 6.66667L9.53674e-07 6.66667L5 5.28493e-06Z" fill="#D1D1D1"/>
		</svg>`;

		this.svg_arroe_down =
		`<svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5 7L0 0.333336H10L5 7Z" fill="#D1D1D1"/>
		</svg>`;		
	}
	
	
	html()
	{
		let style = `position: absolute; top: 50%; left: 50%; width: 194px; height: 205px; z-index: 1; text-align: center; font-size: 14px; color: #4A4A4A; background: #fff; border: 1px solid #D1D1D1;`;	
		
		let html = 
		`<div style="display: none; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: 1; background-color: rgba(0, 0, 0, 0.0);">
			<div nameId="popSettMap" style="${style}">
				${this.htmlHeader()}
				${this.htmlBody()}
			</div>			
		</div>`;
		
		
		return html;
	}
	
	htmlHeader()
	{
		let style = `style="display: flex; justify-content: space-between; align-items: center; height: 36px; z-index: 1; font-size: 14px; border-bottom: 1px solid #D1D1D1; user-select: none;"`;	
		
		let html = 
		`<div ${style}>
			<div style="margin-left: 16px;">
				Advanced settings
			</div>
			<div style="display: flex; justify-content: center; align-items: center; margin-right: 11px; cursor: pointer;">
				<img nameId="close" src="img/svg/i_x.svg" style="width: 14px; height: 14px;">
			</div>
		</div>`;			
		
		return html;
	}

	htmlBody()
	{		
		let html = 
		`<div>
			${this.htmlScale()}
			${this.htmlOffset()}
			${this.htmlRotate()}
		</div>`;			
		
		return html;
	}


	htmlScale()
	{
		let style_text = `font-size: 12px; text-align: left;`;
		
		let style_1 = `width: 100%; margin-left: 6px; background: #F0F0F0; border: 0px solid #ccc; outline: 0;`;
		
		let style_4 = `display: flex; margin: auto;`;
		
		let html = 
		`<div>
			<div style="display: flex; justify-content: space-between; margin: 8px 16px 0 16px; font-size: 14px; color: #4A4A4A;">
			
				<div>
					<div style="${style_text}">
						Scale X
					</div>
					<div class="arrow-tx-1">
						<input type="text" nameId="scaleX" value="0" style="${style_1}">
						<div class="arrow-tx-2">
							<div class="arrow-li-1">%</div>
							<div class="arrow-li-2">
								<div nameId="arrowUpScaleX" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_up}
								</div>
								
								<div nameId="arrowDownScaleX" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_down}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div style="${style_text}">
						Scale Y
					</div>			
					<div class="arrow-tx-1">
						<input type="text" nameId="scaleY" value="0" style="${style_1}">
						<div class="arrow-tx-2">
							<div class="arrow-li-1">%</div>
							<div class="arrow-li-2">
								<div nameId="arrowUpScaleY" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_up}
								</div>
								
								<div nameId="arrowDownScaleY" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_down}
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>`;			
		
		return html;
	}
	
	
	htmlOffset()
	{
		let style_text = `font-size: 12px; text-align: left;`;
		
		let style_1 = `width: 100%; margin-left: 6px; background: #F0F0F0; border: 0px solid #ccc; outline: 0;`;
		
		let style_4 = `display: flex; margin: auto;`;
		
		let html = 
		`<div>
			<div style="display: flex; justify-content: space-between; margin: 8px 16px 0 16px; font-size: 14px; color: #4A4A4A;">
			
				<div>
					<div style="${style_text}">
						Offset X
					</div>
					<div class="arrow-tx-1">
						<input type="text" nameId="offsetX" value="0" style="${style_1}">
						<div class="arrow-tx-2">
							<div class="arrow-li-1">%</div> 
							<div class="arrow-li-2">
								<div nameId="arrowUpOffsetX" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_up}
								</div>
								
								<div nameId="arrowDownOffsetX" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_down}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div style="${style_text}">
						Offset Y
					</div>			
					<div class="arrow-tx-1">
						<input type="text" nameId="offsetY" value="0" style="${style_1}">
						<div class="arrow-tx-2">
							<div class="arrow-li-1">%</div>
							<div class="arrow-li-2">
								<div nameId="arrowUpOffsetY" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_up}
								</div>
								
								<div nameId="arrowDownOffsetY" class="texture_arroe" style="${style_4}">
									${this.svg_arroe_down}
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>`;			
		
		return html;
	}
	

	htmlRotate()
	{
		let style_text = `font-size: 12px; text-align: left;`;	
		
		let style_1 = `width: 100%; margin-left: 6px; background: #F0F0F0; border: 0px solid #ccc; outline: 0;`;
		
		let style_4 = `display: flex; cursor: default;  font-size: 12px;`;
		
		let html = 
		`<div>
			<div style="display: flex; justify-content: space-between; margin: 8px 16px 0 16px; font-size: 14px; color: #4A4A4A;">
			
				<div>
					<div style="${style_text}">
						Rotation
					</div>
					<div class="arrow-tx-1">
						<input type="text" nameId="rotateT" value="0" style="${style_1}">
						
						<div class="arrow-tx-2">
							<div class="arrow-li-1">°</div>
							<div class="arrow-li-2" style="flex-direction: row;">
								<div nameId="arrowRot45" class="texture_arroe" style="${style_4} margin: auto 5px auto auto;">
									45
								</div>
								
								<div nameId="arrowRot90" class="texture_arroe" style="${style_4} margin: auto;">
									90
								</div>
							</div>
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
		this.elem.querySelector('[nameId="popSettMap"]').onmousedown = (e) => { e.stopPropagation(); }
		
		let btnClose = this.elem.querySelector('[nameId="close"]');
		btnClose.onmousedown = (e) => { this.elem.style.display = 'none'; e.stopPropagation(); }
		
		this.initEventInput();
		this.initEventArrow();
	}

	initEventInput()
	{
		this.inputs.scalex.onchange = (e) => { this.changeInput(e); }
		this.inputs.scaley.onchange = (e) => { this.changeInput(e); }
		this.inputs.offsetx.onchange = (e) => { this.changeInput(e); }
		this.inputs.offsety.onchange = (e) => { this.changeInput(e); }		
		this.inputs.rotate.onchange = (e) => { this.changeInput(e); }		
	}

	initEventArrow()
	{
		this.elem.querySelector('[nameId="arrowUpScaleX"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.scalex, value: 1}); }
		this.elem.querySelector('[nameId="arrowDownScaleX"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.scalex, value: -1}); }
		this.elem.querySelector('[nameId="arrowUpScaleY"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.scaley, value: 1}); }
		this.elem.querySelector('[nameId="arrowDownScaleY"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.scaley, value: -1}); }			
		
		this.elem.querySelector('[nameId="arrowUpOffsetX"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.offsetx, value: 1}); }
		this.elem.querySelector('[nameId="arrowDownOffsetX"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.offsetx, value: -1}); }
		this.elem.querySelector('[nameId="arrowUpOffsetY"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.offsety, value: 1}); }
		this.elem.querySelector('[nameId="arrowDownOffsetY"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.offsety, value: -1}); }

		this.elem.querySelector('[nameId="arrowRot45"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.rotate, value: 45}); }
		this.elem.querySelector('[nameId="arrowRot90"]').onmousedown = (e) => { this.clickArrow({e: e, input: this.inputs.rotate, value: 90}); }
	}
	
	openModal({el, material})
	{
		this.material = null;
		
		if(!material.map) return;		
		
		this.material = material;
		
		this.elem.style.display = '';
		
		let rect = el.getBoundingClientRect();
		
		let elem = this.elem.children[0];
		
		let top = (rect.top + rect.height/2);
		
		
		if(top + elem.clientHeight > document.body.clientHeight + 10) { top = top - elem.clientHeight; }
		elem.style.top = top+'px';
		elem.style.left = (rect.left + rect.width/2 - elem.clientWidth)+'px';	

		this.setInput({material});
	}
	
	setInput()
	{
		this.inputs.scalex.value = this.material.map.repeat.x * 100;
		this.inputs.scaley.value = this.material.map.repeat.y * 100;		
		this.inputs.offsetx.value = this.material.map.offset.x * 100;
		this.inputs.offsety.value = this.material.map.offset.y * 100;
		this.inputs.rotate.value = THREE.MathUtils.radToDeg(this.material.map.rotation);
	}
	
	
	changeInput(event)
	{
		let type = event.target.attributes.nameid.value;
		let value = event.target.value;
		
		value = checkValue({type, value});
		
		if(value === null) 
		{
			this.setInput();
			return;
		}
		
		event.target.value = value;
		
		function checkValue({type, value})
		{
			let result = null;
			
			if(type === 'rotateT'){ result = Build.checkNumberInput({ value: value, unit: 1, limit: {min: -360, max: 360}, int: true }); }
			else { result = Build.checkNumberInput({ value: value, unit: 1, limit: {min: -10000, max: 10000}, int: true }); }
			
			return (result !== null) ? result.num : null;
		}
		
		this.updateTexture({type, value});			
	}


	clickArrow({e, input, value})
	{
		let type = '';
		if(input === this.inputs.scalex) type = 'scaleX';
		if(input === this.inputs.scaley) type = 'scaleY';
		if(input === this.inputs.offsetx) type = 'offsetX';
		if(input === this.inputs.offsety) type = 'offsetY';
		if(input === this.inputs.rotate) type = 'rotateT';	
			
		input.value = Number(Number(input.value) + value);
		
		this.updateTexture({type, value: input.value});
		
		event.stopPropagation();
	}
	
	updateTexture({type, value})
	{
		if(!this.material || !this.material.map) return;

		if(type === 'scaleX') value = Number(value) / 100;
		if(type === 'scaleY') value = Number(value) / 100;
		if(type === 'offsetX') value = Number(value) / 100;
		if(type === 'offsetY') value = Number(value) / 100;
		if(type === 'rotateT') value = THREE.MathUtils.degToRad(Number(value));			
		
		updateSettingTexture({type, value, material: this.material});		
	}
}



	
