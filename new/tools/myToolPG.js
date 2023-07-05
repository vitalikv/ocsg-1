


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
	

	constructor({type = 'pivot'}={}) 
	{
		this.myPivot = new MyPivot();
		this.myGizmo = new MyGizmo();	
	
		this.pivot = this.myPivot.obj;
		this.gizmo = this.myGizmo.obj;		
		
		this.type = type;
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
		
		
		myToolPG_UI.setPosUI();
		myToolPG_UI.setRotUI();
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
		myToolPG_UI.setPosUI();
		this.pivot.position.copy(pos);
		this.gizmo.position.copy(pos);
	}
	
	
	// назначаем qt после измениния/вращения
	setRotPivotGizmo({qt})
	{
		this.qt = qt;
		myToolPG_UI.setRotUI();
		this.pivot.quaternion.copy(qt);
		this.gizmo.quaternion.copy(qt);
	}
		
	
	setZoom()
	{
		if(this.type === 'pivot') this.pivot.userData.propPivot({type: 'updateScale'});
		if(this.type === 'gizmo') this.gizmo.userData.propPivot({type: 'updateScale'});		
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
		myToolPG_UI.displayMenuUI({visible});
	}
	
	render()
	{
		//camOrbit.render();
		renderCamera();
	}
}




