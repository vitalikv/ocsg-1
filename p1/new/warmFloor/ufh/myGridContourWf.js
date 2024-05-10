
// отельный класс, для создания контура плоскости (сетки), после создания удаляется и на этом месте появляется сетка
class MyGridContourWf
{
	geomPoint;
	matPoint;
	isTypeToolPoint = false;
	isDown = false;
	isMove = false;	
	sObj = null;
	dataContours = [];
	arrPoints = [];
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
	}
	
	initTestContour()
	{
		const v = [];

		if(1===2)
		{
			v.push(new THREE.Vector3(-5, 0, 0));	
			v.push(new THREE.Vector3(-5, 0, 5));
			v.push(new THREE.Vector3(5, 0, 5));
			v.push(new THREE.Vector3(5, 0, 2.5));
			v.push(new THREE.Vector3(5, 0, 0));	
			v.push(new THREE.Vector3(0, 0, 0));			
		}		
		else if(1===2)
		{
			v.push(new THREE.Vector3(-5, 0, -2));	
			v.push(new THREE.Vector3(-5, 0, 5));
			v.push(new THREE.Vector3(5, 0, 5));
			v.push(new THREE.Vector3(5, 0, 0));			
		}
		else if(1===2)
		{
			v.push(new THREE.Vector3(-5, 0, 0));	
			v.push(new THREE.Vector3(-5, 0, 5));
			v.push(new THREE.Vector3(5, 0, 5));
			v.push(new THREE.Vector3(5, 0, -5));
			v.push(new THREE.Vector3(2.5, 0, -5));
			v.push(new THREE.Vector3(0.6475390424566161, 0, 0));			
		}
		else
		{
			v.push(new THREE.Vector3(-5, 0, 0));	
			v.push(new THREE.Vector3(-5, 0, 5));
			v.push(new THREE.Vector3(0, 0, 5));
			v.push(new THREE.Vector3(5, 0, 5));
			v.push(new THREE.Vector3(5, 0, -5));
			v.push(new THREE.Vector3(2.5, 0, -5));
			//v.push(new THREE.Vector3(1.7, 0, -2));
			v.push(new THREE.Vector3(2, 0, -1));			
		}		

		for ( let i = 0; i < v.length; i++ )
		{
			this.crPoint({pos: v[i]});
		}
		
		const formSteps = this.crContour({points: this.arrPoints});
		
		this.clearPoint();
		
		const n = 3;
		const pointPos = v[0].clone().sub(v[n + 0]).divideScalar( 2 ).add(v[n + 0]);		
		const { newPos, dir } = myWarmFloor.myArrowContourWf.setToolObj({startPos: pointPos});
		
		//myWarmFloor.myJoinContourWf.joinForms({startPos: newPos.clone(), dir, formSteps});
		
		
	}
	
	
	crPoint({pos, toolPoint = false})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint ); 

		obj.userData.tag = 'gridContourWf';
		obj.userData.toolPoint = toolPoint;
		obj.userData.line = null;
		obj.userData.points = [];
		obj.position.copy(pos);		
		scene.add( obj );
		
		this.arrPoints.push(obj);
		
		if(this.arrPoints.length > 1) this.crLine({points: [...this.arrPoints]});

		return obj;
	}
	
	
	crLine({points})
	{
		
		let line = null;
		
		if(!points[0].userData.line)
		{	
			const arrP = [];
			
			for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
			const geometry = new THREE.Geometry();
			geometry.vertices = arrP;
	
			line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000}) );	
			scene.add( line );					
		}
		else
		{
			line = points[0].userData.line;			
		}
		
		for ( let i = 0; i < points.length; i++ )
		{				
			points[i].userData.line = line;
			points[i].userData.points = points;
		}
		
		//this.upGeometryLine({point: points[0]});
	}
	
	// создаем тепл.пол
	crContour({points})
	{
		let arrPos = [];		
		for ( let i = 0; i < points.length; i++ ) arrPos.push(points[i].position.clone());
		
		const result = myMath.checkClockWise(arrPos);	// проверяем последовательность построения точек (по часовой стрелке или нет)
		// если по часовой стрелки, то разворачиваем массив, чтобы был против часовой
		if(result < 0) 
		{
			points.reverse();
			arrPos = [];
			for ( let i = 0; i < points.length; i++ ) arrPos.push(points[i].position.clone());
		}			
		
		const formSteps = myWarmFloor.myUlitkaWf.drawFrom({points: arrPos, offsetStart: -0.2, offsetNext: -0.43});
		
		this.addContour({points});

		return formSteps;
	}
	
	// проверка куда кликнули (попали на точку или трубу)
	clickRayhit({event})
	{
		let rayhit = null;
		
		const points = [];
		for ( let i = 0; i < this.dataContours.length; i++ )
		{
			const pointsV = this.dataContours[i].filter((p) => p.visible);
			points.push(...pointsV);
		}		
		
		const ray = rayIntersect( event, points, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }

		return rayhit;
	}
	
	
	clickRight({obj})
	{
		if(!this.isTypeToolPoint) return;
		
		this.deletePoint({obj});		
				
		this.clearPoint();

		this.render();
	}
	
	mousedown = ({event, obj, toolPoint = false}) =>
	{
		this.isDown = false;
		this.isMove = false;	

		
		// при первом создании Tool, это игнорируется
		if(this.isTypeToolPoint) 
		{
			// определяем с чем точка пересеклась и дальнейшие действия
			const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
			if(joint) 
			{				
				//for ( let i = 0; i < this.arrPoints.length - 2; i++ ) arrPos.push(this.arrPoints[i].position.clone());				
				//const grid = myWarmFloor.myGridWf.crGrid({arrPos});
				//myWarmFloor.myGridWf.myGridWfCSG.upGeometryLines({grid});
				
				this.deletePoint({obj});
				

				const formSteps = this.crContour({points: this.arrPoints});

				let pointPos = myWarmFloor.myArrowContourWf.getPosToolObj();
				const { newPos, dir } = myWarmFloor.myArrowContourWf.setToolObj({startPos: pointPos});				
				myWarmFloor.myJoinContourWf.joinForms({startPos: newPos.clone(), dir, formSteps});				
				
				//this.deleteContour();
				this.clearPoint();
				return null;
			}
			
			obj = this.crPoint({pos: obj.position.clone(), toolPoint});
			
			this.sObj = obj;
			
			if(!this.sObj) 
			{				
				this.isTypeToolPoint = false;
				//this.clearPoint();
				return null;
			}			
		}
		
		this.isTypeToolPoint = toolPoint;
		
		this.sObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		

		myComposerRenderer.outlineAddObj({arr: [obj]});
		myPanelR.myContentObj.activeObjRightPanelUI_1({obj}); 	// UI
		
		this.isDown = true;

		return this.sObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		this.isMove = true;
		
		const obj = this.sObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		obj.position.add( offset );	
		
		
		const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
		if(joint)
		{
			obj.position.copy(this.arrPoints[0].position.clone());
			this.offset = obj.position.clone();
		}
		
		this.upGeometryLine({point: obj});
	}
	
	mouseup = () =>
	{
		if(this.isTypeToolPoint) return;
		
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();
		
		
		if(obj && this.dataContours.length > 0)
		{
			const points = obj.userData.points;		
			
			//myWarmFloor.myUlitkaWf.clearForms();
			
			const formSteps = this.crContour({points: obj.userData.points});

			let pointPos = myWarmFloor.myArrowContourWf.getPosToolObj();
			const { newPos, dir } = myWarmFloor.myArrowContourWf.setToolObj({startPos: pointPos});				
			myWarmFloor.myJoinContourWf.joinForms({startPos: newPos.clone(), dir, formSteps});			
		}		
	}
	
	
	upGeometryLine({point})
	{		
		const line = point.userData.line;
		if(!line) return;
		
		const points = point.userData.points;

		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		if(!point.userData.toolPoint) arrP.push(points[0].position.clone());
		
		var geometry = new THREE.Geometry();
		geometry.vertices = arrP;
		//geometry.verticesNeedUpdate = true;
		
		line.geometry.dispose();
		line.geometry = geometry;
	
	}
	

	clearPoint()
	{
		//if(this.isTypeToolPoint) return;
		
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;
		this.arrPoints = [];
		this.isTypeToolPoint = false;
	}
	
	
	// проверка, если перетаскиваемая точка находится рядом с первой точкой 
	checkJointToPoint({point, points})
	{
		let joint = false;
		
		if(points.length > 2)
		{
			joint = point.position.distanceTo(points[0].position) < 0.2 ? true : false;
		}

		return joint;
	}
	
	
	addContour({points})
	{		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.toolPoint = false;
			points[i].userData.points = points;
		}

		this.dataContours.push(points);		
	}
	
	// получаем точки активного контура
	getActContourPointsPos()
	{
		const contours = this.dataContours;
		const points = contours[contours.length - 1];
				
		const arrPos = [];		
		for ( let i = 0; i < points.length; i++ ) arrPos.push(points[i].position.clone());

		return arrPos;		
	}
	
	
	deletePoint({obj})
	{
		scene.remove(obj);
		
		const index = this.arrPoints.indexOf(obj);
		if (index > -1) this.arrPoints.splice(index, 1);		
	}
	
	deleteContour()
	{
		const arrLines = [];
		const points = this.arrPoints;
		const line = points[0].userData.line;
		
		for ( let i = 0; i < points.length; i++ )
		{
			this.deletePoint({obj: points[i]});
		}
		
		if(line)
		{
			line.geometry.dispose();
			scene.remove(line);			
		}		
	}	
	
	render()
	{
		renderCamera();
	}
}







