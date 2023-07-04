


class MyToolPG 
{
	myPivot = null;
	myGizmo = null;		
	pivot = null;
	gizmo = null;
	isDown = false;
	type = 'pivot';
	obj = null;
	arrO = [];
	pos = new THREE.Vector3();
	qt = new THREE.Quaternion();

	ui_menu = null;
	ui = {};
	
	
	

	constructor({type = 'pivot'}={}) 
	{
		let container = document.querySelector('#canvasFrame');
		
		this.ui_menu = new UI_menuPivotGizmo({container: container});
		
		//crPivot({container: container});
		//crGizmo({container: container});	

		this.myPivot = new MyPivot();
		this.myGizmo = new MyGizmo();	
	
		this.pivot = this.myPivot.obj;
		this.gizmo = this.myGizmo.obj;		
		
		this.type = type;
		this.initButton();
		this.getPosRotUI();
		this.initInput();
	}
	
	// кнопки переключения Pivot/Gizmo
	initButton()
	{
		this.ui_menu.el.querySelector('[nameId="select_pivot"]').onmousedown = (e) => { this.toggleTool({type:'pivot'}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="select_gizmo"]').onmousedown = (e) => { this.toggleTool({type:'gizmo'}); e.stopPropagation(); };

		this.ui_menu.el.querySelector('[nameId="obj_rotate_X_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_X_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'x', angle: 45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Y_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Y_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'y', angle: 45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Z_90"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: -45}); e.stopPropagation(); };
		this.ui_menu.el.querySelector('[nameId="obj_rotate_Z_90m"]').onmousedown = (e) => { this.setAngleRotUI({axis: 'z', angle: 45}); e.stopPropagation(); };
		
		this.ui_menu.el.querySelector('[nameId="obj_rotate_reset"]').onmousedown = (e) => { this.resetRot(); e.stopPropagation(); };
	}
	
	getPosRotUI()
	{
		this.ui.menu = document.querySelector('[nameId="block_pos"]');
		
		this.ui.pos = {};
		this.ui.pos.x = this.ui.menu.querySelector('[nameId="object_pos_X"]');
		this.ui.pos.y = this.ui.menu.querySelector('[nameId="object_pos_Y"]');
		this.ui.pos.z = this.ui.menu.querySelector('[nameId="object_pos_Z"]');
		
		this.ui.rot = {};
		this.ui.rot.x = this.ui.menu.querySelector('[nameId="object_rotate_X"]');
		this.ui.rot.y = this.ui.menu.querySelector('[nameId="object_rotate_Y"]');
		this.ui.rot.z = this.ui.menu.querySelector('[nameId="object_rotate_Z"]');		
	}
	
	initInput()
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

	calcPos(params) 
	{
		let obj = params.obj;
		let pos = new THREE.Vector3();
		
		if(obj.userData.tag == 'obj')		// группа или объект
		{ 
			obj.updateMatrixWorld();
			pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	
		}		
		else if(obj.userData.tag == 'joinPoint')		// разъем
		{ 
			pos = obj.getWorldPosition(new THREE.Vector3());  
		}		
		else if(obj.userData.tag == 'wtGrid')		// сетка теплого пола
		{ 
			pos = obj.position;  
		}

		return pos;
	}
	
	calcRot(params) 
	{
		let obj = params.obj;
		let qt = new THREE.Quaternion();
		
		if(myCameraOrbit.activeCam.userData.isCam2D)	
		{		
			if(!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
			let bound = obj.geometry.boundingBox;
			
			obj.updateMatrixWorld();
			let v1 = new THREE.Vector3(bound.min.x, 0, 0).applyMatrix4( obj.matrixWorld );
			let v2 = new THREE.Vector3(bound.max.x, 0, 0).applyMatrix4( obj.matrixWorld );
			
			let dir = v2.clone().sub(v1).normalize();
			let rotY = Math.atan2(dir.x, dir.z);
			
			qt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY - Math.PI/2);
		}
		
		if(myCameraOrbit.activeCam.userData.isCam3D) qt = obj.getWorldQuaternion(new THREE.Quaternion());	

		return qt;
	}

	// показываем Pivot/Gizmo
	activeTool(params)
	{
		let obj = params.obj;
		let arrO = params.arrO;
		let pos = params.pos;
		
		this.hide();
		
		this.obj = obj;
		//this.arrO = (arrO) ? arrO : ddGetGroup({obj, tubePoint: true});
		this.arrO = [];
		
		this.pos = (pos) ? pos : this.calcPos({obj: obj});		
		this.qt = this.calcRot({obj: obj});
		
		
		this.setPosUI();
		this.setRotUI();
		this.displayMenuUI({visible: ''});
		

		if(this.type == 'pivot') this.pivot.userData.propPivot({type: 'setPivot', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});		
		if(this.type == 'gizmo') this.gizmo.userData.propGizmo({type: 'setGizmo', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});

		//setClickLastObj({obj});
		
		this.render();	
	}
	
	
	mousedown = ({event, rayhit}) => 
	{
		this.isDown = true;
		
		if(this.type === 'pivot') this.myPivot.mousedown({event, rayhit});
		if(this.type === 'gizmo') this.myGizmo.mousedown({event, rayhit});
	}
	
	mousemove = (event) => 
	{
		if(!this.isDown) return;
		
		if(this.type === 'pivot') this.myPivot.mousemove(event);
		if(this.type === 'gizmo') this.myGizmo.mousemove(event);			
	}

	mouseup = (event) => 
	{	
		if(this.type === 'pivot') this.myPivot.mouseup();
		if(this.type === 'gizmo') this.myGizmo.mouseup();
		
		this.isDown = false;
	}	
	
	
	// переключаем Pivot/Gizmo
	toggleTool({type})
	{
		let obj = this.obj;
		let arrO = this.arrO;
		
		if(!obj) return;
		
		this.hide();
				
		this.type = type;	
		this.obj = obj;
		this.arrO = arrO;
		
		
		if(this.type == 'pivot') this.pivot.userData.propPivot({type: 'setPivot', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});		
		if(this.type == 'gizmo') this.gizmo.userData.propGizmo({type: 'setGizmo', obj: obj, arrO: this.arrO, pos: this.pos, qt: this.qt});
		
		this.displayMenuUI({visible: ''});
		
		this.render();
	}
	

	// назначаем pos после измениния/перемещения 
	setPosPivotGizmo({pos})
	{
		this.pos = pos;
		this.setPosUI();
		this.pivot.position.copy(pos);
		this.gizmo.position.copy(pos);
	}
	
	
	// назначаем qt после измениния/вращения
	setRotPivotGizmo({qt})
	{
		this.qt = qt;
		this.setRotUI();
		this.pivot.quaternion.copy(qt);
		this.gizmo.quaternion.copy(qt);
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
		let offset = pos.clone().sub(this.pos);
		
		this.pivot.userData.propPivot({type: 'setPosPivot', pos: pos});
		this.gizmo.userData.propGizmo({type: 'setPosGizmo', pos: pos});
		this.pivot.userData.propPivot({type: 'moveObjs', obj: this.obj, arrO: this.arrO, offset: offset});		
		
		this.pos = pos;		
		
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
		let q_Offset = q_New.clone().multiply(this.qt.clone().inverse());		
				
		this.pivot.userData.propPivot({type: 'setRotPivot', qt: q_New});
		this.gizmo.userData.propGizmo({type: 'setRotGizmo', qt: q_New});
		this.gizmo.userData.propGizmo({type: 'rotObjs', pos: this.pos, arrO: [this.obj], q_Offset: q_Offset});	
		
		this.qt = q_New;

		this.setRotUI();	
		
		this.render();
	}
	
	
	// вставляем в input position
	setPosUI()
	{
		let pos = this.pos;
		
		this.ui.pos.x.value = Math.round(pos.x * 100) / 100;
		this.ui.pos.y.value = Math.round(pos.y * 100) / 100;
		this.ui.pos.z.value = Math.round(pos.z * 100) / 100;			
	}	
	
	// вставляем в input rotation
	setRotUI()
	{
		let qt = this.qt;
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


	// скрываем/показываем Pivot/Gizmo (только визуально)
	visible({value})
	{
		let obj = null;
		if(this.type == 'pivot') obj = this.pivot;
		if(this.type == 'gizmo') obj = this.gizmo;
		
		obj.visible = value;
	}
	
	
	// скрываем Pivot/Gizmo
	hide()
	{
		this.obj = null;
		this.arrO = [];
		this.pivot.userData.propPivot({type: 'hide'});
		this.gizmo.userData.propGizmo({type: 'hide'});
		
		this.displayMenuUI({visible: 'none'});
		
		//resetClickLastObj({});
		
		this.render();		
	}
	
	displayMenuUI({visible})
	{
		this.ui.menu.style.display = visible;
	}
	
	render()
	{
		//camOrbit.render();
		renderCamera();
	}
}


class UI_menuPivotGizmo 
{
	
	
	constructor({container})
	{
		this.el = null;	
		this.init({container});
	}
	
	init({container})
	{
		let div = document.createElement('div');			
		div.innerHTML = this.html();
		this.el = div.children[0];
		
		container.append(this.el);
		
		this.initEvent();			
	}
	
	initEvent()
	{
		//this.el.addEventListener('mousedown', function(e) { e.stopPropagation(); });
		//this.el.addEventListener('mousemove', function(e) { e.stopPropagation(); });
		//this.el.addEventListener('mouseup', function(e) { e.stopPropagation(); });	
	}
	
	html()
	{
		const css1 = `position: absolute; left: 10px; bottom: 0; height: 80px;`;
		
		let str = 
		`<div nameId="block_pos" class="block_pos" ui_1="">
			<div style="display: flex;">
				<div style="display: flex; align-items: center;">
					<div class="button1 button_gradient_1" nameId="select_pivot">
						<img src="${infProject.path}/img/move_1.png">
					</div>	
					
					<div class="flex_1 input_rotate">
						<input type="text" nameId="object_pos_X" value="0">
						<input type="text" nameId="object_pos_Y" value="0">
						<input type="text" nameId="object_pos_Z" value="0">
					</div>	
				</div>
				
				<div style="display: flex; align-items: center; margin-left: 40px;">
					<div class="button1 button_gradient_1" nameId="select_gizmo">
						<img src="${infProject.path}/img/rotate_1.png">	
					</div>	

					<div class="flex_1 input_rotate">
						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_X_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_X" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_X_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>
						
						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_Y" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>

						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_Z" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>									
						
					</div>	

					<div class="flex_1">
						<div style="width: 20px; height: 2px; background: rgb(247, 72, 72);"></div>
						<div style="width: 20px; height: 2px; background: rgb(17, 255, 0);"></div>
						<div style="width: 20px; height: 2px; background: rgb(72, 116, 247);"></div>
					</div>
										
				
					<div class="button1 button_gradient_1" nameId="obj_rotate_reset">
						сбросить	
					</div>											
				</div>
				
			</div>
		</div>`;					
		
		return str;
	}


}



