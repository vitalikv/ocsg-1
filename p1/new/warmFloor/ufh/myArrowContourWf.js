
// класс стрелка/направление, где должен быть вход в контур теплого пола
class MyArrowContourWf
{
	isDown = false;
	isMove = false;
	toolObj = null;	
	actObj = null;
	
	helpLines = [];	// временное, потом удалить
	
	
	constructor()
	{
		this.toolObj = this.crPoint({pos: new THREE.Vector3()});
		
		this.helpLines = this.testLines();
	}
	
	crPoint({pos})
	{
		const geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
		const material = new THREE.MeshStandardMaterial({ color: 0xff0000, lightMap: lightMap_1 });		
		const obj = new THREE.Mesh( geometry, material ); 

		obj.userData.tag = 'arrowContourWf';
		obj.position.copy(pos);		
		scene.add( obj );

		return obj;
	}
	
	
	
	testLines()
	{
		const lines = [];
		
		for ( let i = 0; i < 2; i++ )
		{
			const geometry = new THREE.Geometry();
			geometry.vertices = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)];
			
			const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
			
			const line = new THREE.Line( geometry, material );
			scene.add(line);

			lines.push(line);
		}
		
		return lines;
	}
	
	testGeometryLines({pos, normal})
	{
		const lines = this.helpLines;
		
		for ( let i = 0; i < lines.length; i++ )
		{
			lines[i].geometry.dispose();
			
			const geometry = new THREE.Geometry();
			geometry.vertices = [pos.clone(), pos.clone().add(normal)];
			
			lines[i].geometry = geometry;
		}
		
		return lines;
	}	
	
	
	// проверка куда кликнули
	clickRayhit({event})
	{
		let rayhit = null;		
		
		const ray = rayIntersect( event, this.toolObj, 'one' );
		if(ray.length > 0) { rayhit = ray[0]; }

		return rayhit;
	}
	

	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;	
		
		this.actObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.offset = intersects[0].point;		

		//myComposerRenderer.outlineAddObj({arr: [obj]});
		//myPanelR.myContentObj.activeObjRightPanelUI_1({obj}); 	// UI
		
		this.isDown = true;

		return this.actObj;
	}
	
	mousemove = (event) =>
	{
		if (!this.isDown) return;
		this.isMove = true;
		
		const obj = this.actObj;	
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		const offset = new THREE.Vector3().subVectors(intersects[0].point, this.offset);
		this.offset = intersects[0].point;		
		
		offset.y = 0;		
		
		//obj.position.add( offset );

		this.setToolObj({startPos: intersects[0].point});
	}
	
	mouseup = () =>
	{
		const obj = this.actObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clearPoint();		
	}
	
	
	// ставим стрелку на контур в зависимости от ближайшей грани 
	setToolObj({startPos})
	{
		const obj = this.toolObj;
		
		const arrP = [];
		let v = myWarmFloor.myGridContourWf.getActContourPointsPos();
		v = [...v];
		v.push(v[0]);
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], startPos);
			
			if(onLine)
			{
				const dist = pos.distanceTo(startPos);
				const normal = myMath.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
				arrP.push({pos, dist, normal});				
			}
		}
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; });
			obj.position.copy(arrP[0].pos);
			
			this.testGeometryLines({pos: arrP[0].pos, normal: arrP[0].normal});
		}		
	}


	// пока проверка потом удалить 
	testCutForm({startPos, formPoints})
	{
		let newPos = new THREE.Vector3();
		
		const arrP = [];
		const v = [...formPoints];
		v.push(v[0]);
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], startPos);
			
			if(onLine)
			{
				const dist = pos.distanceTo(startPos);
				const normal = myMath.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
				
				const pos2 = v[i + 1].clone().sub(v[i]).normalize().divideScalar(-3);
				pos2.add(pos);
				
				arrP.push({ind: i, pos, dist, normal, pos2});				
			}
		}
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; });
			myWarmFloor.myUlitkaWf.crHelpBox({pos: arrP[0].pos, color:  0xff0000});
						
			newPos = arrP[0].pos2.clone();			
			myWarmFloor.myUlitkaWf.crHelpBox({pos: newPos, color:  0xff0000});

			let v = [...formPoints];
//console.log(arrP[0].ind, [...v]);

			if(arrP[0].ind === v.length - 1)
			{
				v.splice(arrP[0].ind + 1, 0, newPos);	// встявляем элемент в массив по индексу
				v.splice(0, 0, arrP[0].pos);				
			}
			else
			{
				v.splice(arrP[0].ind + 1, 0, newPos);	// встявляем элемент в массив по индексу
				v.splice(arrP[0].ind + 2, 0, arrP[0].pos);	
				
				v = myMath.offsetArrayToFirstElem({arr: v, index: arrP[0].ind + 2});				
			}
			
			console.log(arrP[0].ind, newPos, arrP[0].pos, v);
			console.log('--------');
			
			const geometry = new THREE.Geometry();
			geometry.vertices = v;		
			const material = new THREE.LineBasicMaterial({ color:  0x0000ff });		
			const line = new THREE.Line( geometry, material );
			scene.add( line );											
		}

		return newPos;
	}	

	clearPoint()
	{
		this.actObj = null;
		this.isDown = false;
		this.isMove = false;
	}
	
	render()
	{
		renderCamera();
	}
}






