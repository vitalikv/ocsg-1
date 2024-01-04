

class MyPointWf 
{
	geometry;
	material;
	defVert;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.material = new THREE.MeshPhongMaterial({ color : 0xcccccc, transparent: true, opacity: 1.0, depthTest: false });
		
		this.defVert = this.getDefaultVertices();
	}
	
	// получаем один раз при старте default значения геометрии, чтобы потом можно было от них делать scale
	getDefaultVertices()
	{
		const v2 = [];
		const v = this.geometry.vertices;
		for ( let i = 0; i < v.length; i++ ) { v2[i] = v[i].clone(); }
		
		return v2;
	}


	crPoint({pos, lastPoint = null, id = null})
	{ 
		const point = new THREE.Mesh( this.geometry, this.material.clone() );
		point.position.copy( pos );		

		if(!id) { id = countId; countId++; }	
		point.userData.id = id;	
		point.userData.tag = 'pointWf';
		point.userData.line = null;
				
		//point.visible = (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;	
		
		scene.add( point );	
		
		myWarmFloor.addToArray({obj: point, type: 'points'});
		
		if(lastPoint)
		{
			let line = lastPoint.userData.line;
			
			if(!line)
			{
				line = myWarmFloor.myTubeWf.crLine({points: [lastPoint, point]});
				point.userData.line = line;
				lastPoint.userData.line = line;
			}
			else
			{
				point.userData.line = line;
				myWarmFloor.myTubeWf.upLine({line, addPoint: point});
			}
		}
		
		return point;
	}
	
	setScale({value})
	{	
		const v = this.geometry.vertices;
		const v2 = this.defVert;
			
		for ( let i = 0; i < v2.length; i++ )
		{
			v[i].x = v2[i].x * 1/value;
			v[i].z = v2[i].z * 1/value;
		}	

		this.geometry.verticesNeedUpdate = true;
		this.geometry.elementsNeedUpdate = true;		
	}
	

	// удаление точки
	deletePointWf({obj})
	{
		console.log(myWarmFloor.points.length);
		myWarmFloor.deleteFromArray({obj, type: 'points'}); 
		disposeHierchy({obj});
		scene.remove(obj);
		console.log(myWarmFloor.points.length);
	}
	
}







