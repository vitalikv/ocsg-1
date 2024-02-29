
// обрезаем линии сетки
class MyGridWfCSG 
{

	upGeometryLines({grid})
	{
		const shape1 = this.crShape_1({grid});	// прямоугольник 
		const shape2 = this.crShape_2({grid});
		
		this.cutShapesCSG({shape1, shape2});	// в прямоугольники вырезаем отверстие 
		
		const objLines = myWarmFloor.myGridWf.getGridLines({obj: grid});		
		if(objLines.geometry.vertices.length === 0) return;

		this.cutLinesCSG({shape1, objLines, shape2});		
	}
	
	
	calcPlanes({grid})
	{
		const material = new THREE.MeshStandardMaterial({ color : 0xff0000, transparent: true, opacity: 1.0, depthTest: false });
		
		const arrPlane = [];
		const points = myWarmFloor.myGridWf.getPoints({obj: grid});
		
		for ( let i = 0; i < points.length; i++ ) 
		{  
			const n = (i < points.length - 1) ? i + 1 : 0;
			const subP = points[n].position.clone().sub(points[i].position);	

			const x1 = points[n].position.z - points[i].position.z;
			const z1 = points[i].position.x - points[n].position.x;	
			const dir = new THREE.Vector3(x1, 0, z1).normalize();		// перпендикуляр стены
			const radY = Math.atan2(x1, z1);
		
			const geometry = new THREE.PlaneGeometry( subP.length(), 2 );
			const plane = new THREE.Mesh( geometry, material );
			plane.position.copy(subP.clone().divideScalar( 2 ).add(points[i].position));
			plane.rotation.set(0, radY, 0);
			//scene.add(plane);		// отображение плоскостей
			
			arrPlane.push(plane);
		}

		return arrPlane;
	}

	
	// создаем прямоугольную форму, чуть больше области сетки
	crShape_1({grid})
	{
		const objLines = myWarmFloor.myGridWf.getGridLines({obj: grid});
		
		objLines.geometry.computeBoundingBox();	
		let bound = objLines.geometry.boundingBox;
		
		const v = [];
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.min.z).applyMatrix4( objLines.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.max.z).applyMatrix4( objLines.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.max.z).applyMatrix4( objLines.matrixWorld );			
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.min.z).applyMatrix4( objLines.matrixWorld );					
		
		v[0].add(new THREE.Vector3(-0.2, 0, -0.2));
		v[1].add(new THREE.Vector3(-0.2, 0, 0.2));
		v[2].add(new THREE.Vector3(0.2, 0, 0.2));
		v[3].add(new THREE.Vector3(0.2, 0, -0.2));									
		
		const geometry = this.crGeometry({type: 'extrude', points: v, depth: 0.5});
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		
		const shape = new THREE.Mesh( geometry, material );
		shape.position.y = -0.2;
		//scene.add(shape);

		return shape;
	}
	
	
	// создаем форму плиты равную сетки
	crShape_2({grid})
	{
		const points = myWarmFloor.myGridWf.getPoints({obj: grid});
		const pos = points.map((p) => p.position);
		const geometry = this.crGeometry({type: 'extrude', points: pos, depth: 0.5});
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.3, depthTest: false });
		//material.visible = false;
		
		const shape = new THREE.Mesh( geometry, material );
		shape.position.y = -0.2;
		//scene.add(shape);

		return shape;
	}
	
	// создаем новую пола или потолка
	crGeometry({type = 'plane', points, depth = 0})
	{
		let geometry = null;
		
		const form = [];
		for ( let i = 0; i < points.length; i++ ) 
		{  
			form.push(new THREE.Vector2(points[i].x, -points[i].z));		
		}	 
		
		const shape = new THREE.Shape( form );
		
		if(type === 'extrude')
		{
			geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth });
			geometry.rotateX(-Math.PI / 2);
		}
		if(type === 'plane')
		{
			geometry = new THREE.ShapeGeometry( shape );
		}
		
		return geometry;
	}	


	// shape1 - прямоугольник, shape2 - контур сетки, вычитаем из прямоугольника контур 
	cutShapesCSG({shape1, shape2})
	{
		shape2.updateMatrixWorld();
		const objBSP = new ThreeBSP( shape2 );

		shape1.updateMatrixWorld();
		const wBSP = new ThreeBSP( shape1 );	

		const newBSP = wBSP.subtract( objBSP );		// вычитаем из стены объект нужной формы
		
		shape1.geometry.dispose();				
		shape1.geometry = newBSP.toGeometry();			
	}
	
	
	cutLinesCSG({shape1, objLines, shape2})
	{
		shape1.updateMatrixWorld();
		const objBSP = new ThreeBSP( shape1 );
		
		objLines.updateMatrixWorld();
		const wBSP = new ThreeBSP( objLines );
		
		const newBSP = wBSP.subtract( objBSP );		// вычитаем из стены объект нужной формы
		
		objLines.geometry.dispose();				
		objLines.geometry = newBSP.toGeometry();			
		
		shape1.geometry.dispose();
		shape2.geometry.dispose();
	}	
}







