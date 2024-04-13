
// отельный класс, для создания контура плоскости (сетки), после создания удаляется и на этом месте появляется сетка
class MyGridContourWf
{
	geomPoint;
	matPoint;
	dataContour = {};
	arrPoints = [];
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
	}
	
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint ); 

		obj.userData.tag = 'gridContourWf';
		obj.userData.lines = [];
		obj.userData.points = [];
		obj.position.copy(pos);		
		scene.add( obj );
		
		this.arrPoints.push(obj);
		
		if(this.arrPoints.length > 1) this.crLine({points: this.arrPoints});

		return obj;
	}
	
	
	crLine({points})
	{
		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) arrP.push(points[i].position.clone());
		//arrP.push(points[0].position.clone());
		
		const geometry = new THREE.Geometry();
		geometry.vertices.push( arrP[arrP.length - 2], arrP[arrP.length - 1] );
		
		const line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000}) );	
		scene.add( line );
	
		points[points.length - 1].userData.lines.push(line);
		points[points.length - 1].userData.points.push(points[points.length - 2]);
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
			obj = this.crPoint({pos: obj.position.clone()});
			
			this.sObj = obj;
			
			if(!this.sObj) 
			{				
				this.isTypeToolPoint = false;
				//this.clearPoint();
				return null;
			}
			
			const joint = this.checkJointToPoint({point: obj, points: this.arrPoints});
			if(joint) 
			{
				const arrPos = [];
				//for ( let i = 0; i < this.arrPoints.length - 2; i++ ) arrPos.push(this.arrPoints[i].position.clone());				
				//const grid = myWarmFloor.myGridWf.crGrid({arrPos});
				//myWarmFloor.myGridWf.myGridWfCSG.upGeometryLines({grid});
				
				for ( let i = 0; i < this.arrPoints.length - 1; i++ ) arrPos.push(this.arrPoints[i].position.clone());
				console.log(arrPos);
				
				myWarmFloor.myUlitkaWf.drawFrom({points: arrPos})
				
				//this.clickRight({obj});
				
				//this.deleteContour();
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
		//const obj = this.sObj;
		//const isDown = this.isDown;
		//const isMove = this.isMove;
		
		//this.clearPoint();
	}
	
	
	upGeometryLine({point})
	{
		
		if(point.userData.lines.length === 0) return;
		const geometry = point.userData.lines[0].geometry;
		geometry.dispose();
		geometry.vertices = [point.userData.points[0].position.clone(), point.position.clone()];
		geometry.verticesNeedUpdate = true;
	}
	

	clearPoint()
	{
		if(this.isTypeToolPoint) return;
		
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
	

	
	deletePoint({obj})
	{
		scene.remove(obj);
	}
	
	deleteContour()
	{
		const arrLines = [];
		const points = this.arrPoints;
		
		for ( let i = 0; i < points.length; i++ )
		{
			arrLines.push(...points[i].userData.lines);
			this.deletePoint({obj: points[i]});
		}
		console.log(111, arrLines);
		for ( let i = 0; i < arrLines.length; i++ )
		{
			arrLines[i].geometry.dispose();
			scene.remove(arrLines[i]);			
		}		
	}	
	
	render()
	{
		renderCamera();
	}
}







