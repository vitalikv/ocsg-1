

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
		this.geometry = new THREE.SphereGeometry( 0.03, 16, 16 );
		this.material = new THREE.MeshStandardMaterial({ color : 0xff0000, transparent: true, opacity: 1.0, depthTest: false });
		
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
		point.userData.tube = null;
				
		//point.visible = (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;	
		
		scene.add( point );	
		
		myWarmFloor.addToArray({obj: point, type: 'points'});
		
		if(lastPoint)
		{
			let tube = lastPoint.userData.tube;
			
			if(!tube)
			{
				tube = myWarmFloor.myTubeWf.crTube({points: [lastPoint, point]});
				point.userData.tube = tube;
				lastPoint.userData.tube = tube;
			}
			else
			{
				point.userData.tube = tube;
				myWarmFloor.myTubeWf.upTube({tube, addPoint: point});
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
			v[i].y = v2[i].y * 1/value;
			v[i].z = v2[i].z * 1/value;
		}	

		this.geometry.verticesNeedUpdate = true;
		this.geometry.elementsNeedUpdate = true;		
	}
	

	// удаление точки
	deletePointWf({obj})
	{
		myWarmFloor.deleteFromArray({obj, type: 'points'}); 
		disposeHierchy({obj});
		scene.remove(obj);
	}
	
}







