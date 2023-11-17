
import * as Build from '../../index.js';
import * as Lobj from '../../loaderObj.js';


export class UIdivSize
{
	constructor()
	{
		this.elem = null;
		this.el = {};
		
		this.init();
		this.initEvent();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.htmlDiv();
		let elDiv = div.firstChild;	

		div = document.createElement('div');
		div.innerHTML = this.htmlInput();
		let elInput = div.firstChild;			
		
		this.elem = document.body.querySelector('[nameId="divSize"]');
		
		this.elem.append(elDiv);
		this.elem.append(elInput);
	}
	
	htmlDiv()
	{
		let html = 
		`<div class="flex_1" style="margin: 0 0 0 16px; font-size: 12px;">
		
			<div>
				<div style="margin-left: 2px; color: #4A4A4A;">
					${infProject.text.rp.orsize}
				</div>
				<div class="div_swSizeObj">
					<div class="flex_1" style="width: 52.5px; border-right: 1px solid #D1D1D1; overflow: hidden;">
						<div style="color: #FF8C87; margin-left: 3px;">X</div>
						<div style="color: #9E9E9E; margin-left: 3px;" nameId="divSizeObjX">0</div>
					</div>
					<div class="flex_1" style="width: 52.5px; border-right: 1px solid #D1D1D1; overflow: hidden;">
						<div style="color: #81C4FD; margin-left: 3px;">Y</div>
						<div style="color: #9E9E9E; margin-left: 3px;" nameId="divSizeObjY">0</div>
					</div>
					<div class="flex_1"  style="width: 52.5px; overflow: hidden;">
						<div style="color: #B6E481; margin-left: 3px;">Z</div>
						<div style="color: #9E9E9E; margin-left: 3px;" nameId="divSizeObjZ">0</div>
					</div>								
				</div>	
			</div>

			<div style="margin-left: 10px; color: #4A4A4A;">
				<div>
					${infProject.text.rp.units}
				</div>
				<div>
					<select nameId="list_units" class="list_units">											
						<option value="m" selected>m</option>
						<option value="mm">mm</option>
						<option value="cm">cm</option>
						<option value="in">in(‘)</option>
						<option value="ft">ft(“)</option>
						<option value="yd">yd(“‘)</option>
					</select>										
				</div>															
			</div>
			
			<div style="width: 16px; height: 16px; margin: auto auto 4px auto; cursor: pointer;">
				<img nameId="resetSize" src="img/svg/butt_reset_1.svg" style="width: 100%; height: 100%;">
			</div>						
			
		</div>`;					

		return html;
	}


	htmlInput()
	{
		let html = 
		`<div style="display: -webkit-box; display: flex; margin-top: 10px; margin-left: 16px; font-size: 12px;">
			<div style="display: -webkit-box; display: flex;">
				<div>
					<div style="margin: 0 0 2px 2px; color: #4A4A4A;">${infProject.text.rp.length}</div>
					<div class="wr_input_1" nameId="wrInputSizeObjX">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjX" value="0">
							<div class="input_lb" style="color: #FF8C87;">m</div>
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">
					<div style="margin: 0 0 2px 2px; color: #4A4A4A;">${infProject.text.rp.height}</div>
					<div class="wr_input_1" nameId="wrInputSizeObjY">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjY" value="0">
							<div class="input_lb" style="color: #81C4FD;">m</div>
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">							
					<div style="margin: 0 0 2px 2px; color: #4A4A4A;">${infProject.text.rp.width}</div>
					<div class="wr_input_1" nameId="wrInputSizeObjZ">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjZ" value="0">
							<div class="input_lb" style="color: #B6E481;">m</div>
						</div>
					</div>
				</div>					
			</div>

			<div style="width: 16px; height: 16px; margin: auto auto 7px auto;">
				<img src="img/svg/butt_1.svg" style="width: 100%; height: 100%;">
			</div>						
		</div>`;					

		return html;
	}	
		
	
	initEvent()
	{
		//this.elem.onmousedown = (e) => { this.buttonClick(); e.stopPropagation(); } 	

		this.el.listUnits = this.elem.querySelector('[nameId="list_units"]');		
		this.el.orignX = this.elem.querySelector('[nameId="divSizeObjX"]');
		this.el.orignY = this.elem.querySelector('[nameId="divSizeObjY"]');
		this.el.orignZ = this.elem.querySelector('[nameId="divSizeObjZ"]');
		this.el.inputX = this.elem.querySelector('[nameId="inputSizeObjX"]');
		this.el.inputY = this.elem.querySelector('[nameId="inputSizeObjY"]');
		this.el.inputZ = this.elem.querySelector('[nameId="inputSizeObjZ"]');


		this.el.listUnits[0].selected = true;	
		this.el.listUnits.onchange = (e) => { this.changeUnits({e: e}); }

		this.el.inputX.onchange = (e) => { this.changeInputSizeObj({el: this.el.inputX}); }
		this.el.inputY.onchange = (e) => { this.changeInputSizeObj({el: this.el.inputY}); }
		this.el.inputZ.onchange = (e) => { this.changeInputSizeObj({el: this.el.inputZ}); }

		let elResetSize = this.elem.querySelector('[nameId="resetSize"]');			
		elResetSize.src = "img/svg/butt_reset_2.svg";	
		elResetSize.onmousedown = (e) => { this.resetSize(); }		
	}
	
	setSize()
	{
		this.el.orignX.style.color = '#4A4A4A';
		this.el.orignY.style.color = '#4A4A4A';
		this.el.orignZ.style.color = '#4A4A4A';	
		this.el.inputX.style.color = '#4A4A4A';
		this.el.inputY.style.color = '#4A4A4A';
		this.el.inputZ.style.color = '#4A4A4A';		
			
		this.el.orignX.innerText = Build.dataFbx.modelSize.x;
		this.el.orignY.innerText = Build.dataFbx.modelSize.y;
		this.el.orignZ.innerText = Build.dataFbx.modelSize.z;
		this.el.inputX.value = Build.dataFbx.modelSize.x;
		this.el.inputY.value = Build.dataFbx.modelSize.y;
		this.el.inputZ.value = Build.dataFbx.modelSize.z;		
	}

	clearInput()
	{
		this.el.listUnits[0].selected = true;		
		this.el.orignX.innerText = 0;
		this.el.orignY.innerText = 0;
		this.el.orignZ.innerText = 0;
		this.el.inputX.value = 0;
		this.el.inputY.value = 0;
		this.el.inputZ.value = 0;			
	}
	
	changeInputSizeObj({el})
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;
		let modelSize = Build.dataFbx.modelSize;
		let originalSize = Build.infProg.originalSize;

		let value = el.value;
		
		value = Build.checkNumberInput({ value: value, unit: 1, limit: {min: 0.0001, max: 1000000}, abs: true });
		
		if(!value) 
		{
			this.el.inputX.value = modelSize.x;
			this.el.inputY.value = modelSize.y;
			this.el.inputZ.value = modelSize.z;		
			
			return;
		}

		value = value.num;	
		
		let scale = obj.scale.x;
		if(el == this.el.inputX) { scale = value/(originalSize.x * Build.infProg.unit); }
		if(el == this.el.inputY) { scale = value/(originalSize.y * Build.infProg.unit); }
		if(el == this.el.inputZ) { scale = value/(originalSize.z * Build.infProg.unit); }
		
		Build.infProg.modifScale = scale;
		scale = Build.infProg.modifScale * Build.infProg.unit;	
		obj.scale.set(scale, scale, scale);	
		
		Lobj.getBoundObject_1({obj: obj});
		Lobj.fitCameraToObject({obj: Build.infProg.boundBox});	
		Build.setAxisHelper();
		
		this.el.inputX.value = Build.dataFbx.modelSize.x;
		this.el.inputY.value = Build.dataFbx.modelSize.y;
		this.el.inputZ.value = Build.dataFbx.modelSize.z;	
		
		Build.render();
	}



	changeUnits(params)
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;
		
		let ind = this.el.listUnits.selectedIndex;
		let value = this.el.listUnits[ind].value;
		

		let unit = 1;
		
		if(value == 'm'){ unit = 1; }
		else if(value == 'mm'){ unit = 0.001; }
		else if(value == 'cm'){ unit = 0.01; }
		else if(value == 'in'){ unit = 0.025; }
		else if(value == 'ft'){ unit = 0.3048; }
		else if(value == 'yd'){ unit = 0.91; }
		
		Build.infProg.unit = unit;	
		let scale = Build.infProg.modifScale * Build.infProg.unit;
		obj.scale.set(scale, scale, scale);		
		
		Lobj.getBoundObject_1({obj: obj});
		Lobj.fitCameraToObject({obj: Build.infProg.boundBox});	
		Build.setAxisHelper();
		
		this.el.inputX.value = Build.dataFbx.modelSize.x;
		this.el.inputY.value = Build.dataFbx.modelSize.y;
		this.el.inputZ.value = Build.dataFbx.modelSize.z;			
		
		Build.render();	
	}



	resetSize()
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;
		
		this.el.listUnits.selectedIndex = 0;
		Build.infProg.unit = 1;
		Build.infProg.modifScale = 1;
		
		Build.dataFbx.modelSize.x = Build.infProg.originalSize.x;
		Build.dataFbx.modelSize.y = Build.infProg.originalSize.y;
		Build.dataFbx.modelSize.z = Build.infProg.originalSize.z;

		this.el.inputX.value = Build.dataFbx.modelSize.x;
		this.el.inputY.value = Build.dataFbx.modelSize.y;
		this.el.inputZ.value = Build.dataFbx.modelSize.z;		
		
		obj.scale.set(1, 1, 1);
		
		Lobj.getBoundObject_1({obj: obj});
		Lobj.fitCameraToObject({obj: Build.infProg.boundBox});	
		Build.setAxisHelper();	
		
		
		Build.render();
	}
	
}





