

class MyPoint 
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
		this.material = new THREE.MeshStandardMaterial({ color : 0xcccccc, transparent: true, opacity: 0.5, depthTest: false });
		
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
	
	getGeometryPoint()
	{
		return this.geometry;
	}
		
	createToolPoint()
	{			
		const obj = new THREE.Mesh(this.geometry, this.material);
		obj.userData.tag = 'tool_point';
		obj.userData.tool_point = {};
		obj.userData.tool_point.v2 = this.defVert;
		obj.renderOrder = 1;
		obj.position.set(0,0,0);
		obj.visible = false;	
		scene.add( obj );
		
		return obj;
	}

	createPoint( pos, id )
	{ 
		const point = new THREE.Mesh( this.geometry, this.material.clone() );
		point.position.copy( pos );		

		point.renderOrder = 1;
		 
		point.w = [];
		point.p = [];
		point.start = [];		
		point.zone = [];
		point.zoneP = [];
		
		
		if(id == 0) { id = countId; countId++; }	
		point.userData.id = id;	
		point.userData.tag = 'point';
		point.userData.point = {};
		point.userData.point.color = point.material.color.clone();
		point.userData.point.cross = null;
		point.userData.point.type = null;
		point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
		//point.userData.level = myLevels.activeId;
		
		point.visible = (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;	
		
		scene.add( point );	
		obj_point[obj_point.length] = point;
		
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
}







