


class MyToolPG 
{
	myPivot = null;
	myGizmo = null;
	myScale = null;	
	pivot = null;
	gizmo = null;
	scale = null;
	isDown = false;
	type = 'pivot';
	obj = null;
	arrO = [];
	pos = new THREE.Vector3();
	qt = new THREE.Quaternion();
	

	constructor({type = 'pivot'}={}) 
	{
		this.myPivot = new MyPivot();
		this.myGizmo = new MyGizmo();	
		this.myScale = new MyScale();
		
		this.pivot = this.myPivot.obj;
		this.gizmo = this.myGizmo.obj;		
		this.scale = this.myScale.obj;
		
		this.type = type;
	}
	

	calcPos(params) 
	{
		let obj = params.obj;
		let pos = new THREE.Vector3();
		
		if(obj.userData.tag === 'obj' || obj.userData.tag === 'roof')		// группа или объект
		{ 
			obj.updateMatrixWorld();
			pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	  
		}		
		else if(obj.userData.tag == 'joinPoint')		// разъем
		{ 
			pos = obj.getWorldPosition(new THREE.Vector3());  
		}		
		else //if(obj.userData.tag == 'wtGrid')	 сетка теплого пола
		{ 
			pos = obj.position;  
		}

		return pos;
	}
	
	calcRot({obj, mode = ''}) 
	{
		let qt = new THREE.Quaternion();		
		
		if(mode != '') {}
		else if(myCameraOrbit.activeCam.userData.isCam2D) { mode = '2d'; }
		else if(myCameraOrbit.activeCam.userData.isCam3D) { mode = '3d'; }
		
		if(mode === '2d')	
		{		
			if(!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
			const bound = obj.geometry.boundingBox;
			
			obj.updateMatrixWorld();
			const v1 = new THREE.Vector3(bound.min.x, 0, 0).applyMatrix4( obj.matrixWorld );
			const v2 = new THREE.Vector3(bound.max.x, 0, 0).applyMatrix4( obj.matrixWorld );
			
			const dir = v2.clone().sub(v1).normalize();
			const rotY = Math.atan2(dir.x, dir.z);
			
			qt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY - Math.PI/2);
		}
		
		if(mode === '3d') qt = obj.getWorldQuaternion(new THREE.Quaternion());	

		return qt;
	}

	// показываем Pivot/Gizmo
	activeTool({type = null, obj = null, arrO = [], pos = null})
	{
		if(type) obj = this.obj;	// если есть type, то это переключение инструмента
		
		this.hide();
		
		if(type) this.type = type;		
		if(obj) this.obj = obj;
		//this.arrO = (arrO) ? arrO : ddGetGroup({obj, tubePoint: true});
		this.arrO = arrO;
		
		const mode = (this.type === 'scale') ? '3d' : '';
			
		this.pos = (pos) ? pos : this.calcPos({obj: this.obj});		
		this.qt = this.calcRot({obj: this.obj, mode});
		
		
		myToolPG_UI.setPosUI();
		myToolPG_UI.setRotUI();
		myToolPG_UI.setSclUI();
		this.displayMenuUI({visible: ''});
		

		if(this.type == 'pivot') this.pivot.userData.propPivot({type: 'setPivot', obj: this.obj, arrO: this.arrO, pos: this.pos, qt: this.qt});		
		if(this.type == 'gizmo') this.gizmo.userData.propGizmo({type: 'setGizmo', obj: this.obj, arrO: this.arrO, pos: this.pos, qt: this.qt});
		if(this.type == 'scale') this.myScale.actScale({obj: this.obj, pos: this.pos, qt: this.qt});
		
		//setClickLastObj({obj});
		
		this.render();	
	}
	
	// получаем объект на котором стоит pivot/gizmo
	getActObj()
	{
		return this.obj;
	}
	
	mousedown = ({event, rayhit}) => 
	{
		this.isDown = true;
		
		if(this.type === 'pivot') this.myPivot.mousedown({event, rayhit});
		if(this.type === 'gizmo') this.myGizmo.mousedown({event, rayhit});
		if(this.type === 'scale') this.myScale.mousedown({event, rayhit});
	}
	
	mousemove = (event) => 
	{
		if(!this.isDown) return;
		
		if(this.type === 'pivot') this.myPivot.mousemove(event);
		if(this.type === 'gizmo') this.myGizmo.mousemove(event);
		if(this.type === 'scale') this.myScale.mousemove(event);
	}

	mouseup = (event) => 
	{	
		if(this.type === 'pivot') this.myPivot.mouseup();
		if(this.type === 'gizmo') this.myGizmo.mouseup();
		if(this.type === 'scale') this.myScale.mouseup();
		
		const obj = this.getActObj();
		
		if(obj && obj.userData.tag === 'roof') myHouse.myRoofCSG.updateCgsRoof();		
		
		this.isDown = false;
	}	
	

	// назначаем pos после измениния/перемещения 
	setPosPivotGizmo({pos})
	{
		this.pos = pos;
		myToolPG_UI.setPosUI();
		this.pivot.position.copy(pos);
		this.gizmo.position.copy(pos);
		this.scale.position.copy(pos);
	}
	
	
	// назначаем qt после измениния/вращения
	setRotPivotGizmo({qt})
	{
		this.qt = qt;
		myToolPG_UI.setRotUI();
		this.pivot.quaternion.copy(qt);
		this.gizmo.quaternion.copy(qt);
		this.scale.quaternion.copy(qt);
	}
		
	
	setScale()
	{
		if(this.type === 'pivot') this.pivot.userData.propPivot({type: 'updateScale'});
		if(this.type === 'gizmo') this.gizmo.userData.propGizmo({type: 'updateScale'});
		if(this.type === 'scale') this.myScale.updateScale();
	}
	

	setGizmoClipping()
	{
		this.gizmo.userData.propGizmo({type: 'clippingGizmo'});
	}


	// скрываем/показываем Pivot/Gizmo (только визуально)
	visible({value})
	{
		let obj = null;
		if(this.type == 'pivot') obj = this.pivot;
		if(this.type == 'gizmo') obj = this.gizmo;
		if(this.type == 'scale') obj = this.scale;
		
		obj.visible = value;
	}
	
	
	// скрываем Pivot/Gizmo
	hide()
	{
		const obj = this.obj;
		if(!obj) return;
		
		this.pivot.userData.propPivot({type: 'hide'});
		this.gizmo.userData.propGizmo({type: 'hide'});
		
		let done = true;
		if(obj.userData.tag === 'pointWf') done = false;
		if(obj.userData.tag === 'tubeWf') done = false;
		
		if(done) this.myScale.hide();

		this.obj = null;
		this.arrO = [];		
		this.displayMenuUI({visible: 'none'});
		
		//resetClickLastObj({});
		
		this.render();		
	}
	
	displayMenuUI({visible})
	{
		myToolPG_UI.displayMenuUI({visible});
	}
	
	render()
	{
		//camOrbit.render();
		renderCamera();
	}
}




