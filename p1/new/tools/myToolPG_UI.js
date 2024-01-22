



class MyToolPG_UI 
{
	el = null;
	ui_menu = null;
	ui = {};
	
	constructor({container})
	{
		this.el = null;
		this.init({container});
	}
	
	init({container})
	{
		const div = document.createElement('div');			
		div.innerHTML = this.html();
		this.el = div.children[0];		
		container.append(this.el);
		
		this.initEventButton();
		this.getPosRotUI();
		this.initEventInput();
	}

	html()
	{
		const css1 = `position: absolute; left: 10px; bottom: 0; height: 80px;`;

		let str = 
		`<div nameId="block_pos" class="block_pos" ui_1="" style="display: none;">
			<div style="padding: 2px;">
				<div nameId="divPivot" style="display: flex; align-items: center;">
					<div nameId="btn_pivot" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						<img src="${infProject.path}img/icon/tools/pivot.svg">
					</div>	
					
					<div class="flex_1 input_rotate">
						<input type="text" nameId="object_pos_X" value="0" style="width: 100px;">
						<input type="text" nameId="object_pos_Y" value="0" style="width: 100px;">
						<input type="text" nameId="object_pos_Z" value="0" style="width: 100px;">
					</div>	
				</div>
				
				<div nameId="divGizmo" style="display: flex; margin-top: 10px;">
					<div nameId="btn_gizmo" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						<img src="${infProject.path}img/icon/tools/gizmo.svg">	
					</div>	

					<div class="flex_1 input_rotate">
						<div style="margin: 0 5px; display: flex; flex-direction: column;">
							<div style="position: relative;">
								<div class="button1 button_gradient_1" nameId="obj_rotate_X_90m" style="position: absolute; top: 0; left: 0; width: 10px;">-</div>
								<input type="text" nameId="object_rotate_X" value="0">
								<div class="button1 button_gradient_1" nameId="obj_rotate_X_90" style="position: absolute; top: 0; right: 0; width: 10px;">+</div>
							</div>
							<div style="width: auto; height: 2px; background: rgb(247, 72, 72);"></div>
						</div>
						
						<div style="margin: 0 5px; display: flex; flex-direction: column;">
							<div style="position: relative;">
								<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90m" style="position: absolute; top: 0; left: 0; width: 10px;">-</div>
								<input type="text" nameId="object_rotate_Y" value="0">
								<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90" style="position: absolute; top: 0; right: 0; width: 10px;">+</div>
							</div>						
							<div style="width: auto; height: 2px; background: rgb(17, 255, 0);"></div>
						</div>

						<div style="margin: 0 5px; display: flex; flex-direction: column;">
							<div style="position: relative;">
								<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90m" style="position: absolute; top: 0; left: 0; width: 10px;">-</div>
								<input type="text" nameId="object_rotate_Z" value="0">
								<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90" style="position: absolute; top: 0; right: 0; width: 10px;">+</div>
							</div>
							<div style="width: auto; height: 2px; background: rgb(72, 116, 247);"></div>
						</div>									
						
					</div>
										
				
					<div nameId="obj_rotate_reset" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						0	
					</div>											
				</div>

				<div nameId="divScale" style="display: flex; margin-top: 10px;">
					<div nameId="btn_scale" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						<img src="${infProject.path}img/icon/tools/scale.svg">	
					</div>	

					<div class="flex_1 input_rotate">
						<div style="display: flex; flex-direction: column;">
							<input type="text" nameId="scaleX" value="0" style="width: 100px;">
							<div style="width: 100px; height: 2px; margin: auto; background: rgb(247, 72, 72);"></div>
						</div>
						
						<div style="display: flex; flex-direction: column;">
							<input type="text" nameId="scaleY" value="0" style="width: 100px;">						
							<div style="width: 100px; height: 2px; margin: auto; background: rgb(17, 255, 0);"></div>
						</div>

						<div style="display: flex; flex-direction: column;">
							<input type="text" nameId="scaleZ" value="0" style="width: 100px;">
							<div style="width: 100px; height: 2px; margin: auto; background: rgb(72, 116, 247);"></div>
						</div>									
						
					</div>											
				</div>				
			</div>
		</div>`;					
		
		return str;
	}
	
	initEventButton()
	{
		this.el.querySelector('[nameId="btn_pivot"]').onmousedown = (e) => { myToolPG.activeTool({type:'pivot', obj: myToolPG.obj}); e.stopPropagation(); };
		this.el.querySelector('[nameId="btn_gizmo"]').onmousedown = (e) => { myToolPG.activeTool({type:'gizmo', obj: myToolPG.obj}); e.stopPropagation(); };
		this.el.querySelector('[nameId="btn_scale"]').onmousedown = (e) => { myToolPG.activeTool({type:'scale', obj: myToolPG.obj}); e.stopPropagation(); };
		
		this.el.querySelector('[nameId="obj_rotate_X_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: -45}); e.stopPropagation(); };
		this.el.querySelector('[nameId="obj_rotate_X_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: 45}); e.stopPropagation(); };
		this.el.querySelector('[nameId="obj_rotate_Y_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: -45}); e.stopPropagation(); };
		this.el.querySelector('[nameId="obj_rotate_Y_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: 45}); e.stopPropagation(); };
		this.el.querySelector('[nameId="obj_rotate_Z_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: -45}); e.stopPropagation(); };
		this.el.querySelector('[nameId="obj_rotate_Z_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: 45}); e.stopPropagation(); };
		
		this.el.querySelector('[nameId="obj_rotate_reset"]').onmousedown = (e) => { this.resetRot(); e.stopPropagation(); };	
	}

	getPosRotUI()
	{
		this.ui.pos = {};
		this.ui.pos.div = this.el.querySelector('[nameId="divPivot"]');
		this.ui.pos.x = this.el.querySelector('[nameId="object_pos_X"]');
		this.ui.pos.y = this.el.querySelector('[nameId="object_pos_Y"]');
		this.ui.pos.z = this.el.querySelector('[nameId="object_pos_Z"]');
		
		this.ui.rot = {};
		this.ui.rot.div = this.el.querySelector('[nameId="divGizmo"]');
		this.ui.rot.x = this.el.querySelector('[nameId="object_rotate_X"]');
		this.ui.rot.y = this.el.querySelector('[nameId="object_rotate_Y"]');
		this.ui.rot.z = this.el.querySelector('[nameId="object_rotate_Z"]');

		this.ui.scl = {};
		this.ui.scl.div = this.el.querySelector('[nameId="divScale"]');
		this.ui.scl.x = this.el.querySelector('[nameId="scaleX"]');
		this.ui.scl.y = this.el.querySelector('[nameId="scaleY"]');
		this.ui.scl.z = this.el.querySelector('[nameId="scaleZ"]');		
	}
	
	// события для ввода Input
	initEventInput()
	{
		const arrPos = [this.ui.pos.x, this.ui.pos.y, this.ui.pos.z];
		
		arrPos.forEach((input) => 
		{
			input.onfocus = (e) => 
			{
				e.preventDefault();
				e.stopPropagation();

				input.onkeydown = (e2) => { if (e2.code === 'Enter') this.applyPosUI(); }
			}					
		});	

		const arrRot = [this.ui.rot.x, this.ui.rot.y, this.ui.rot.z];
		
		arrRot.forEach((input) => 
		{
			input.onfocus = (e) => 
			{
				e.preventDefault();
				e.stopPropagation();

				input.onkeydown = (e2) => { if (e2.code === 'Enter') this.applyRotUI(); }
			}					
		});

		const arrScl = [this.ui.scl.x, this.ui.scl.y, this.ui.scl.z];
		
		arrScl.forEach((input) => 
		{
			input.onfocus = (e) => 
			{
				e.preventDefault();
				e.stopPropagation();

				input.onkeydown = (e2) => { if (e2.code === 'Enter') this.applySclUI(); }
			}					
		});		
	}	


	// вставили в input значения position и нажали Enter
	applyPosUI()
	{
		let x = this.ui.pos.x.value;
		let y = this.ui.pos.y.value;
		let z = this.ui.pos.z.value;

		x = checkNumberInput({ value: x, unit: 1 });
		y = checkNumberInput({ value: y, unit: 1 });
		z = checkNumberInput({ value: z, unit: 1 });
		
		// не числовое значение
		if(!x || !y || !z)
		{		
			this.setPosUI();
			return;
		}
			
		let pos = new THREE.Vector3(x.num, y.num, z.num);
		let offset = pos.clone().sub(myToolPG.pos);
		
		myToolPG.myPivot.setPosPivot({pos: pos});
		myToolPG.gizmo.userData.propGizmo({type: 'setPosGizmo', pos: pos});
		myToolPG.scale.userData.propScale({type: 'setPosScale', pos: pos});
		myToolPG.myPivot.moveObjs({obj: myToolPG.obj, arrO: myToolPG.arrO, offset});				
		
		myToolPG.pos = pos;		
		
		this.setPosUI();
		
		this.render();
	}
	
	
	// вставили в input значения rotation и нажали Enter
	applyRotUI()
	{
		let x = this.ui.rot.x.value;
		let y = this.ui.rot.y.value;
		let z = this.ui.rot.z.value;

		x = checkNumberInput({ value: x, unit: 1 });
		y = checkNumberInput({ value: y, unit: 1 });
		z = checkNumberInput({ value: z, unit: 1 });
		
		// не числовое значение
		if(!x || !y || !z)
		{		
			this.setRotUI();
			return;
		}
		
		//if(x.num == 180 && z.num == 180) { x.num = 0; z.num = 0; console.log(180); }
		//if(x.num == -180 && z.num == -180) { x.num = 0; z.num = 0; console.log(-180); }
		
		x = THREE.Math.degToRad(x.num);
		y = THREE.Math.degToRad(y.num);
		z = THREE.Math.degToRad(z.num);		
		
		const qt = myToolPG.obj.quaternion.clone();
		let q_New = new THREE.Quaternion().setFromEuler(new THREE.Euler().set(x, y, z));	// новое положение gizmo
		let q_Offset = q_New.clone().multiply(qt.clone().inverse());		
				
				
		myToolPG.gizmo.userData.propGizmo({type: 'rotObjs', pos: myToolPG.pos, arrO: [myToolPG.obj], q_Offset});	// сначала обновляем rot obj
		myToolPG.myGizmo.setRotGizmo();
		myToolPG.myPivot.setRotPivot();
		myToolPG.myScale.setRotScale({qt: q_New});

		this.setRotUI();

		if(myToolPG.obj && myToolPG.obj.userData.tag === 'roof') 
		{
			myToolPG.obj.updateMatrixWorld(true);
			myHouse.myRoofCSG.updateCgsRoof();
		}
		
		this.render();
	}
	
	
	// вставили в input значения scale и нажали Enter
	applySclUI()
	{
		const obj = myComposerRenderer.getOutlineObj();
		if(!obj) return; 		
		
		let size = new THREE.Vector3();
		
		if(obj.userData.tag === 'obj')
		{
			size = myHouse.myObjAction.getObjSize({obj});
		}

		if(obj.userData.tag === 'roof')
		{
			size = myHouse.myRoofAction.getObjSize({obj});
		}		

		let x = size.x;
		let y = size.y;
		let z = size.z; 
		
		let x2 = this.ui.scl.x.value;
		let y2 = this.ui.scl.y.value;
		let z2 = this.ui.scl.z.value; 

		x2 = x2.replace(",", ".");
		y2 = y2.replace(",", ".");
		z2 = z2.replace(",", ".");	
		
		x2 = (!isNumeric(x2)) ? x : Number(x2);
		y2 = (!isNumeric(y2)) ? y : Number(y2);
		z2 = (!isNumeric(z2)) ? z : Number(z2);		

		
		const limit = { x_min : 0.01, x_max : 30, y_min : 0.01, y_max : 30, z_min : 0.01, z_max : 30 };
		
		if(x2 < limit.x_min) { x2 = limit.x_min; }
		else if(x2 > limit.x_max) { x2 = limit.x_max; }
		
		if(y2 < limit.y_min) { y2 = limit.y_min; }
		else if(y2 > limit.y_max) { y2 = limit.y_max; }

		if(z2 < limit.z_min) { z2 = limit.z_min; }
		else if(z2 > limit.z_max) { z2 = limit.z_max; }			
		
		this.setSizeInput({size: new THREE.Vector3(x2, y2, z2)}) 
		

		if(obj.userData.tag === 'obj')
		{
			myHouse.myObjAction.setObjSize({obj, size: new THREE.Vector3(x2, y2, z2)});
			upDateTextureObj3D({obj})
		}

		if(obj.userData.tag === 'roof')
		{
			myHouse.myRoofAction.setObjSize({obj, size: new THREE.Vector3(x2, y2, z2)});
			myHouse.myRoofCSG.updateCgsRoof();
			myHouse.myRoofAction.upDateTextureRoof({obj})						
		}

		myToolPG.activeTool({obj});
		
		this.render();		
	}
	
	
	// вставляем в input position
	setPosUI()
	{
		let pos = myToolPG.pos;
		
		this.ui.pos.x.value = Math.round(pos.x * 100) / 100;
		this.ui.pos.y.value = Math.round(pos.y * 100) / 100;
		this.ui.pos.z.value = Math.round(pos.z * 100) / 100;			
	}	
	
	// вставляем в input rotation
	setRotUI()
	{
		if(!myToolPG.obj) return;
		
		const qt = myToolPG.obj.quaternion.clone();
		let rot = new THREE.Euler().setFromQuaternion(qt);
		
		this.ui.rot.x.value = Math.round(THREE.Math.radToDeg(rot.x));
		this.ui.rot.y.value = Math.round(THREE.Math.radToDeg(rot.y));
		this.ui.rot.z.value = Math.round(THREE.Math.radToDeg(rot.z));		
	}

	// при выборе объекта показываем размер объекта
	setSclUI()
	{
		const obj = myToolPG.obj;	
		if(!obj) return;

		let size = new THREE.Vector3();
		
		if(obj.userData.tag === 'obj')
		{
			size = myHouse.myObjAction.getObjSize({obj})
		}

		if(obj.userData.tag === 'roof')
		{
			size = myHouse.myRoofAction.getObjSize({obj});		
		}		
		
		this.setSizeInput({size});
	}
	
	// устанавливаем scale значения в inputs
	setSizeInput({size})
	{
		this.ui.scl.x.value = Math.round(size.x * 100) / 100;
		this.ui.scl.y.value = Math.round(size.y * 100) / 100;
		this.ui.scl.z.value = Math.round(size.z * 100) / 100;		
	}	
	
	
	// поворот на заданный угол по одной из оси через btn
	setAngleRotUI({axis, angle})
	{	
		if(!myToolPG.obj) return;
		
		const rad = THREE.Math.degToRad(angle);
		let vec3 = new THREE.Vector3();
		
		if(axis === 'x') vec3 = new THREE.Vector3(1, 0, 0);
		if(axis === 'y') vec3 = new THREE.Vector3(0, 1, 0);
		if(axis === 'z') vec3 = new THREE.Vector3(0, 0, 1);
		
		const q1 = myToolPG.obj.quaternion.clone();
		const q2 = new THREE.Quaternion().setFromAxisAngle( vec3, rad );
		q1.multiply( q2 );
		const rot = new THREE.Euler().setFromQuaternion(q1);
		
		this.ui.rot.x.value = THREE.Math.radToDeg(rot.x);
		this.ui.rot.y.value = THREE.Math.radToDeg(rot.y);
		this.ui.rot.z.value = THREE.Math.radToDeg(rot.z);
		
		this.applyRotUI();
	}
	
	resetRot()
	{
		this.ui.rot.x.value = 0;
		this.ui.rot.y.value = 0;
		this.ui.rot.z.value = 0;
		
		this.applyRotUI();
	}

	// скрываем/показываем меню
	displayMenuUI({visible, showUI = null})
	{
		this.el.style.display = visible;
		
		this.ui.pos.div.style.display = 'flex';
		this.ui.rot.div.style.display = 'flex';
		this.ui.scl.div.style.display = 'flex';
		
		if(showUI)
		{
			this.ui.pos.div.style.display = showUI.p ? 'flex' : 'none';
			this.ui.rot.div.style.display = showUI.r ? 'flex' : 'none';
			this.ui.scl.div.style.display = showUI.s ? 'flex' : 'none';
		}					
	}

	render()
	{
		renderCamera();
	}	
}



