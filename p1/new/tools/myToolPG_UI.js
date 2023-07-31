



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
				<div style="display: flex; align-items: center;">
					<div nameId="select_pivot" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						<img src="${infProject.path}/img/move_1.png">
					</div>	
					
					<div class="flex_1 input_rotate">
						<input type="text" nameId="object_pos_X" value="0" style="width: 100px;">
						<input type="text" nameId="object_pos_Y" value="0" style="width: 100px;">
						<input type="text" nameId="object_pos_Z" value="0" style="width: 100px;">
					</div>	
				</div>
				
				<div style="display: flex; margin-top: 10px;">
					<div nameId="select_gizmo" class="button1 button_gradient_1" style="width: 20px; margin: 0;">
						<img src="${infProject.path}/img/rotate_1.png">	
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
				
			</div>
		</div>`;					
		
		return str;
	}
	
	initEventButton()
	{
		this.el.querySelector('[nameId="select_pivot"]').onmousedown = (e) => { myToolPG.toggleTool({type:'pivot'}); e.stopPropagation(); };
		this.el.querySelector('[nameId="select_gizmo"]').onmousedown = (e) => { myToolPG.toggleTool({type:'gizmo'}); e.stopPropagation(); };

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
		this.ui.pos.x = this.el.querySelector('[nameId="object_pos_X"]');
		this.ui.pos.y = this.el.querySelector('[nameId="object_pos_Y"]');
		this.ui.pos.z = this.el.querySelector('[nameId="object_pos_Z"]');
		
		this.ui.rot = {};
		this.ui.rot.x = this.el.querySelector('[nameId="object_rotate_X"]');
		this.ui.rot.y = this.el.querySelector('[nameId="object_rotate_Y"]');
		this.ui.rot.z = this.el.querySelector('[nameId="object_rotate_Z"]');		
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
		
		myToolPG.pivot.userData.propPivot({type: 'setPosPivot', pos: pos});
		myToolPG.gizmo.userData.propGizmo({type: 'setPosGizmo', pos: pos});
		myToolPG.pivot.userData.propPivot({type: 'moveObjs', obj: myToolPG.obj, arrO: myToolPG.arrO, offset: offset});		
		
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
		
		if(x.num == 180 && z.num == 180) { x.num = 0; z.num = 0; console.log(180); }
		if(x.num == -180 && z.num == -180) { x.num = 0; z.num = 0; console.log(-180); }
		
		x = THREE.Math.degToRad(x.num);
		y = THREE.Math.degToRad(y.num);
		z = THREE.Math.degToRad(z.num);		
		
		console.log(Math.round(THREE.Math.radToDeg(x)), Math.round(THREE.Math.radToDeg(y)), Math.round(THREE.Math.radToDeg(z)));
		let q_New = new THREE.Quaternion().setFromEuler(new THREE.Euler().set(x, y, z))
		let q_Offset = q_New.clone().multiply(myToolPG.qt.clone().inverse());		
				
		myToolPG.pivot.userData.propPivot({type: 'setRotPivot', qt: q_New});
		myToolPG.gizmo.userData.propGizmo({type: 'setRotGizmo', qt: q_New});
		myToolPG.gizmo.userData.propGizmo({type: 'rotObjs', pos: myToolPG.pos, arrO: [myToolPG.obj], q_Offset: q_Offset});	
		
		myToolPG.qt = q_New;

		this.setRotUI();	
		
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
		let qt = myToolPG.qt;
		let rot = new THREE.Euler().setFromQuaternion(qt);
		
		this.ui.rot.x.value = Math.round(THREE.Math.radToDeg(rot.x));
		this.ui.rot.y.value = Math.round(THREE.Math.radToDeg(rot.y));
		this.ui.rot.z.value = Math.round(THREE.Math.radToDeg(rot.z));		
	}
	
	
	// поворот на заданный угол по одной из оси
	setAngleRotUI(params)
	{
		let angle = params.angle;
		let axis = params.axis;
		
		this.ui.rot[axis].value = Number(this.ui.rot[axis].value) + angle;		
		
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
	displayMenuUI({visible})
	{
		this.el.style.display = visible;
	}

	render()
	{
		renderCamera();
	}	
}



