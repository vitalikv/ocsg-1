
// отельный класс, для создания контура плоскости (сетки), после создания удаляется и на этом месте появляется сетка
class MyGridContourWf
{
	geomPoint;
	matPoint;
	sObj = null;
	dataContours = [];
	dataLines = [];
	arrPoints = [];
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
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
				const arrPos = [];
				//for ( let i = 0; i < this.arrPoints.length - 2; i++ ) arrPos.push(this.arrPoints[i].position.clone());				
				//const grid = myWarmFloor.myGridWf.crGrid({arrPos});
				//myWarmFloor.myGridWf.myGridWfCSG.upGeometryLines({grid});
				
				this.deletePoint({obj});
				
				for ( let i = 0; i < this.arrPoints.length; i++ ) arrPos.push(this.arrPoints[i].position.clone());
				
				const arrLines = myWarmFloor.myUlitkaWf.drawFrom({points: arrPos})
				
				//this.clickRight({obj});
				
				this.addContour({points: this.arrPoints, lines: arrLines});
				
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
		
		
		if(this.dataContours.length > 0)
		{
			const points = obj.userData.points;
			
			const arrP = [];
			for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());		
			
			myWarmFloor.myUlitkaWf.clearForms();
			
			const arrLines = myWarmFloor.myUlitkaWf.drawFrom({points: arrP})			
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
	
	
	addContour({points, lines})
	{
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].userData.toolPoint = false;
			points[i].userData.points = points;
		}

		this.dataContours.push(points);
		this.dataLines.push(...lines);
		
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







