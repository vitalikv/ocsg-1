import * as THREE from '../../../node_modules/three/build/three.module.js';
import * as Build from '../../index.js';
import * as Lobj from '../../loaderObj.js';


export class UIdivRot
{
	constructor()
	{
		this.elem = null;
		
		this.elRotObjX = null;
		this.elRotObjY = null;
		this.elRotObjZ = null;	
		
		this.init();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div;	//div.firstChild;		
		document.body.querySelector('[nameId="divRot"]').prepend(this.elem);
		
		this.initEvent();
	}
	
	html()
	{
		let html = 
		`<div style="display: -webkit-box; display: flex; margin-top: 10px; margin-left: 16px;">
			<div style="font-size: 12px;">
				<div style="color: #4A4A4A;">${infProject.text.rp.rotx}</div>
				<div class="wr_input_1">
					<div class="flex_1">
						<input type="text" class="input_1" nameid="rotObjX" value="0" style="color: #4A4A4A;">
						<div class="input_lb" style="color: #FF8C87; justify-content: normal; margin: 6px 6px auto auto;">
							<svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.652344 2.6875C0.652344 2.21354 0.820964 1.79883 1.1582 1.44336C1.5 1.08789 1.91243 0.910156 2.39551 0.910156C2.86947 0.910156 3.27279 1.08789 3.60547 1.44336C3.94271 1.79427 4.11133 2.20898 4.11133 2.6875C4.11133 3.17057 3.94271 3.58301 3.60547 3.9248C3.27279 4.2666 2.86947 4.4375 2.39551 4.4375C1.91699 4.4375 1.50684 4.2666 1.16504 3.9248C0.823242 3.58301 0.652344 3.17057 0.652344 2.6875ZM2.39551 3.5625C2.6416 3.5625 2.84896 3.48275 3.01758 3.32324C3.1862 3.15918 3.27051 2.94727 3.27051 2.6875C3.27051 2.42318 3.1862 2.20671 3.01758 2.03809C2.84896 1.86491 2.6416 1.77832 2.39551 1.77832C2.14486 1.77832 1.93294 1.86947 1.75977 2.05176C1.59115 2.22949 1.50684 2.44141 1.50684 2.6875C1.50684 2.93359 1.59115 3.14095 1.75977 3.30957C1.93294 3.47819 2.14486 3.5625 2.39551 3.5625Z" fill="#FF8C87"/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div style="margin-left: 10px; font-size: 12px;">
				<div style="color: #4A4A4A;">${infProject.text.rp.roty}</div>
				<div class="wr_input_1">
					<div class="flex_1">
						<input type="text" class="input_1" nameid="rotObjY" value="0" style="color: #4A4A4A;">
						<div class="input_lb" style="color: #81C4FD; justify-content: normal; margin: 6px 6px auto auto;">
							<svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.652344 2.6875C0.652344 2.21354 0.820964 1.79883 1.1582 1.44336C1.5 1.08789 1.91243 0.910156 2.39551 0.910156C2.86947 0.910156 3.27279 1.08789 3.60547 1.44336C3.94271 1.79427 4.11133 2.20898 4.11133 2.6875C4.11133 3.17057 3.94271 3.58301 3.60547 3.9248C3.27279 4.2666 2.86947 4.4375 2.39551 4.4375C1.91699 4.4375 1.50684 4.2666 1.16504 3.9248C0.823242 3.58301 0.652344 3.17057 0.652344 2.6875ZM2.39551 3.5625C2.6416 3.5625 2.84896 3.48275 3.01758 3.32324C3.1862 3.15918 3.27051 2.94727 3.27051 2.6875C3.27051 2.42318 3.1862 2.20671 3.01758 2.03809C2.84896 1.86491 2.6416 1.77832 2.39551 1.77832C2.14486 1.77832 1.93294 1.86947 1.75977 2.05176C1.59115 2.22949 1.50684 2.44141 1.50684 2.6875C1.50684 2.93359 1.59115 3.14095 1.75977 3.30957C1.93294 3.47819 2.14486 3.5625 2.39551 3.5625Z" fill="#81C4FD"/>
							</svg>									
						</div>
					</div>
				</div>
			</div>
			<div style="margin-left: 10px; font-size: 12px;">							
				<div style="color: #4A4A4A;">${infProject.text.rp.rotz}</div>
				<div class="wr_input_1">
					<div class="flex_1">
						<input type="text" class="input_1" nameid="rotObjZ" value="0" style="color: #4A4A4A;">
						<div class="input_lb" style="color: #B6E481; justify-content: normal; margin: 6px 6px auto auto;">
							<svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.652344 2.6875C0.652344 2.21354 0.820964 1.79883 1.1582 1.44336C1.5 1.08789 1.91243 0.910156 2.39551 0.910156C2.86947 0.910156 3.27279 1.08789 3.60547 1.44336C3.94271 1.79427 4.11133 2.20898 4.11133 2.6875C4.11133 3.17057 3.94271 3.58301 3.60547 3.9248C3.27279 4.2666 2.86947 4.4375 2.39551 4.4375C1.91699 4.4375 1.50684 4.2666 1.16504 3.9248C0.823242 3.58301 0.652344 3.17057 0.652344 2.6875ZM2.39551 3.5625C2.6416 3.5625 2.84896 3.48275 3.01758 3.32324C3.1862 3.15918 3.27051 2.94727 3.27051 2.6875C3.27051 2.42318 3.1862 2.20671 3.01758 2.03809C2.84896 1.86491 2.6416 1.77832 2.39551 1.77832C2.14486 1.77832 1.93294 1.86947 1.75977 2.05176C1.59115 2.22949 1.50684 2.44141 1.50684 2.6875C1.50684 2.93359 1.59115 3.14095 1.75977 3.30957C1.93294 3.47819 2.14486 3.5625 2.39551 3.5625Z" fill="#B6E481"/>
							</svg>										
						</div>
					</div>
				</div>
			</div>

			<div nameId="butt_help_1" style="width: 16px; height: 16px; margin: auto auto 6px auto; cursor: pointer;">
				<img src="img/svg/butt_help_1.svg" style="width: 100%; height: 100%;">
			</div>						
		</div>	

		<div class="flex_1">
			<div nameId="btAxisYZ" class="btAxisYZ">
				<div class="flex_1" style="align-items: center; font-size: 12px;">
					<div>${infProject.text.rp.axis}</div>      							
					<div class="flex_1" style="align-items: center; margin:0 5px;">
						<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M11.2974 10.292V7.652H3.5694V7.148H11.2974V4.508L14.3934 7.4L11.2974 10.292Z" fill="#4A4A4A"/>
						<path d="M3.70285 10.292V7.652H11.4308V7.148H3.70285V4.508L0.606846 7.4L3.70285 10.292Z" fill="#4A4A4A"/>
						</svg>							
					</div>							
					<div>Z</div>
				</div>
			</div>

			<div style="width: 16px; height: 16px; margin: auto auto 4px auto; cursor: pointer;">
				<img nameId="resetRot" src="img/svg/butt_reset_2.svg" style="width: 100%; height: 100%;">
			</div>
		</div>`;			
		
		return html;
	}
	

	initEvent()
	{
		this.elRotObjX = this.elem.querySelector('[nameId="rotObjX"]');
		this.elRotObjY = this.elem.querySelector('[nameId="rotObjY"]');
		this.elRotObjZ = this.elem.querySelector('[nameId="rotObjZ"]');	

		this.elRotObjX.onchange = (e) => { inputRotateObj({el: this.elRotObjX, elRotObjX: this.elRotObjX, elRotObjY: this.elRotObjY, elRotObjZ: this.elRotObjZ}); }
		this.elRotObjY.onchange = (e) => { inputRotateObj({el: this.elRotObjY, elRotObjX: this.elRotObjX, elRotObjY: this.elRotObjY, elRotObjZ: this.elRotObjZ}); }
		this.elRotObjZ.onchange = (e) => { inputRotateObj({el: this.elRotObjZ, elRotObjX: this.elRotObjX, elRotObjY: this.elRotObjY, elRotObjZ: this.elRotObjZ}); }		
		
		let btAxisYZ = this.elem.querySelector('[nameId="btAxisYZ"]');
		btAxisYZ.onmousedown = (e) => { setAxisYZ({elRotObjX: this.elRotObjX, elRotObjY: this.elRotObjY, elRotObjZ: this.elRotObjZ}); }

		let elResetRot = this.elem.querySelector('[nameId="resetRot"]');
		elResetRot.onmousedown = (e) => { resetRotate({elRotObjX: this.elRotObjX, elRotObjY: this.elRotObjY, elRotObjZ: this.elRotObjZ}); }
		
		this.elem.querySelector('[nameId="butt_help_1"]').onmousedown = (e) => { Build.infProg.class.modalW.elem.helper.showHelpTab(); e.stopPropagation(); }
	}
	
	setRotate()
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;
		this.elRotObjX.value = Math.round(THREE.Math.radToDeg(obj.rotation.x));
		this.elRotObjY.value = Math.round(THREE.Math.radToDeg(obj.rotation.y));
		this.elRotObjZ.value = Math.round(THREE.Math.radToDeg(obj.rotation.z));		
	}
	
	
	reset()
	{
		this.elRotObjX.value = 0;
		this.elRotObjY.value = 0;
		this.elRotObjZ.value = 0;		
	}
}





function setAxisYZ({elRotObjX, elRotObjY, elRotObjZ})
{
	if(!Build.infProg.scene) return;
	
	let obj = Build.infProg.scene;
	
	if(Build.infProg.axisYZ == 0) 
	{
		obj.rotation.x += Math.PI/2;
		Build.infProg.axisYZ = 1;
	}
	else
	{
		obj.rotation.x -= Math.PI/2;
		Build.infProg.axisYZ = 0;		
	}
	
	elRotObjX.value = Math.round(THREE.Math.radToDeg(obj.rotation.x));
	elRotObjY.value = Math.round(THREE.Math.radToDeg(obj.rotation.y));
	elRotObjZ.value = Math.round(THREE.Math.radToDeg(obj.rotation.z));	

	Lobj.getBoundObject_1({obj: obj});

	if(1==2)
	{
		let el_inputSizeObjX = document.querySelector('[nameId="inputSizeObjX"]');
		let el_inputSizeObjY = document.querySelector('[nameId="inputSizeObjY"]');
		let el_inputSizeObjZ = document.querySelector('[nameId="inputSizeObjZ"]');	
		el_inputSizeObjX.value = Build.dataFbx.modelSize.x;
		el_inputSizeObjY.value = Build.dataFbx.modelSize.y;
		el_inputSizeObjZ.value = Build.dataFbx.modelSize.z;			
	}
	
	Build.setAxisHelper();	
	Build.render();	
}



// меняем Rotate через input
function inputRotateObj({el, elRotObjX, elRotObjY, elRotObjZ})
{
	if(!Build.infProg.scene) return;
	
	let obj = Build.infProg.scene;
	
	let value = el.value;
	
	value = Build.checkNumberInput({ value: value, unit: 1, limit: {min: -360, max: 360}, int: true });
	
	if(!value) 
	{
		elRotObjX.value = Math.round(THREE.Math.radToDeg(obj.rotation.x));
		elRotObjY.value = Math.round(THREE.Math.radToDeg(obj.rotation.y));
		elRotObjZ.value = Math.round(THREE.Math.radToDeg(obj.rotation.z));
		
		return;
	}

	value = value.num;
	
	let rot = THREE.Math.degToRad(value);	
	
	if(el == elRotObjX) { obj.rotation.x = rot; }
	if(el == elRotObjY) { obj.rotation.y = rot; }
	if(el == elRotObjZ) { obj.rotation.z = rot; }
	
	elRotObjX.value = Math.round(THREE.Math.radToDeg(obj.rotation.x));
	elRotObjY.value = Math.round(THREE.Math.radToDeg(obj.rotation.y));
	elRotObjZ.value = Math.round(THREE.Math.radToDeg(obj.rotation.z));	
	
	Build.setAxisHelper();
	
	Build.render();
}



function resetRotate({elRotObjX, elRotObjY, elRotObjZ})
{
	if(!Build.infProg.scene) return;
	
	let obj = Build.infProg.scene;
	
	obj.rotation.set(0, 0, 0);
	Build.infProg.axisYZ = 0;
	
	elRotObjX.value = Math.round(THREE.Math.radToDeg(obj.rotation.x));
	elRotObjY.value = Math.round(THREE.Math.radToDeg(obj.rotation.y));
	elRotObjZ.value = Math.round(THREE.Math.radToDeg(obj.rotation.z));	
	
	Build.setAxisHelper();
	
	Build.render();
}




