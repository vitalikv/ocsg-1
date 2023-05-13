

class MyCameraPerspective extends THREE.PerspectiveCamera 
{
	constructor({fov, aspect, near, far})
	{
		super(fov, aspect, near, far);
		
		this.rotation.order = 'YZX';		//'ZYX'
		this.position.set(5, 7, 5);	
		this.lookAt( new THREE.Vector3() );

		this.init();
	}
	
	init()
	{
		this.userData.isCam3D = true;
		this.userData.type = 'fly';			
		this.userData.theta = 0;
		this.userData.phi = 0;		
		this.userData.pos = new THREE.Vector3();
		this.userData.radius = 0;
		this.userData.clickPos = new THREE.Vector3();
		//this.userData.targetO = this.targetO();
		this.userData.targetO = createCenterCamObj();			
	}
	
	// создаем объект, для обозначения куда смотрит камера в 3D режиме
	targetO()
	{
		const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 1, depthTest: false });
		const obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
		obj.renderOrder = 2;
		//obj.visible = false;			
		this.scene.add( obj );
		
		return obj;
	}


	// переключаем в 3D режиме полёт/вид от первого лица
	switchType()
	{
		this.userData.type = (this.userData.type === 'fly') ? 'first' : 'fly';
		
		const posCenter = this.userData.targetO.position;
		
		if(this.userData.type === 'first')
		{		
			this.userData.pos = this.position.clone();
			this.userData.radius = posCenter.distanceTo(camera.position);		
			
			//newCameraPosition = { positionFirst: new THREE.Vector3(posCenter.x, 1.5, posCenter.z) };
			this.position.set(posCenter.x, 1.5, posCenter.z);
			
			// показываем стены, которые были спрятаны
			showAllWallRender();	
		}
		
		if(this.userData.type === 'fly')
		{
			const pos = new THREE.Vector3();
			const radius = this.userData.radius;					
			
			const radH = Math.acos(this.userData.pos.y/radius);
			
			this.updateMatrixWorld();
			let dir = this.getWorldDirection(new THREE.Vector3());
			dir = new THREE.Vector3(dir.x, 0, dir.z).normalize();
			
			const radXZ = Math.atan2(dir.z, dir.x);		
		
			pos.x = -radius * Math.sin(radH) * Math.cos(radXZ) + posCenter.x; 
			pos.z = -radius * Math.sin(radH) * Math.sin(radXZ) + posCenter.z;
			pos.y = radius * Math.cos(radH);					
			
			//newCameraPosition = { positionFly: pos };
			this.position.copy(pos);
			this.lookAt( posCenter );
			
			// прячем стены
			getInfoRenderWall();
			if(divLevelVisible.wallTransparent && this.userData.type === 'fly') wallAfterRender_2();	
			else showAllWallRender();
		}
	}	
}