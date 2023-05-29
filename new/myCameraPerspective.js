

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
		this.userData.fov = {};
		this.userData.fov.fly = 65;
		this.userData.fov.first = 85;
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
		
		const camera = this;
		
		if(this.userData.type === 'first')
		{		
			this.userData.pos = camera.position.clone();
			this.userData.radius = posCenter.distanceTo(camera.position);		
			
			//newCameraPosition = { positionFirst: new THREE.Vector3(posCenter.x, 1.5, posCenter.z) };
			//this.position.set(posCenter.x, 1.7, posCenter.z); 
			
			let dir1 = camera.getWorldDirection(new THREE.Vector3());
			dir1 = new THREE.Vector3().addScaledVector( dir1, 3 );
			const dir2 = new THREE.Vector3(dir1.x, 0, dir1.z).normalize();
			
			const startPos1 = camera.position;
			const endPos1 = new THREE.Vector3(posCenter.x, 1.7, posCenter.z);
			const startPos2 = camera.position.clone().add(dir1);
			const endPos2 = new THREE.Vector3(posCenter.x, 1.7, posCenter.z).add(dir2);
			
			const path_1 = this.pathCamera({startPos: startPos1, endPos: endPos1 });
			const path_2 = this.pathCamera({startPos: startPos2, endPos: endPos2 });			
			this.movePathCam(path_1, path_2);
		
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
			//this.position.copy(pos);
			//this.lookAt( posCenter );
			
			let dir1 = camera.getWorldDirection(new THREE.Vector3());
			dir1 = new THREE.Vector3().addScaledVector( dir1, 3 );

			const path_1 = this.pathCamera({startPos: camera.position, endPos: pos });
			const path_2 = this.pathCamera({startPos: camera.position.clone().add(dir1), endPos: posCenter });			
			this.movePathCam(path_1, path_2);			
			
			// прячем стены
			getInfoRenderWall();
			if(divLevelVisible.wallTransparent && this.userData.type === 'fly') wallAfterRender_2();	
			else showAllWallRender();
		}
	}

	// старый метод подлета камеры, оставил для примера
	moveCameraToNewPosition()
	{

		if ( !newCameraPosition ) return;
		
		if ( camera == camera3D && newCameraPosition.positionFirst || camera == camera3D && newCameraPosition.positionFly )
		{
			var pos = (newCameraPosition.positionFirst) ? newCameraPosition.positionFirst : newCameraPosition.positionFly;
			
			camera.position.lerp( pos, 0.1 );
			
			
			if(newCameraPosition.positionFirst)
			{
				var dir = camera.getWorldDirection(new THREE.Vector3()); 			
				dir.y = 0; 
				dir.normalize();
				dir.add( newCameraPosition.positionFirst );	
				camera.lookAt( dir );
			}
			if(newCameraPosition.positionFly)
			{
				var radius_1 = camera3D.userData.camera.save.radius;
				var radius_2 = infProject.camera.d3.targetO.position.distanceTo(camera.position);
				
				var k = Math.abs((radius_2/radius_1) - 1);
				
				var dir = camera.getWorldDirection(new THREE.Vector3()); 			
				dir.y = 0; 
				dir.normalize();
				dir.x *= 15*k;
				dir.z *= 15*k;
				dir.add( infProject.camera.d3.targetO.position );	
				
				camera.lookAt( dir ); 
			}		
			
			
			if(comparePos(camera.position, pos)) 
			{ 	
				newCameraPosition = null; 
			};		
		}
		else
		{
			newCameraPosition = null;
		}
		
		renderCamera();
	}

	
	// метод подлета камеры
	movePathCam(path, path_2) 
	{
		const camera = this;

		const length = path.points.length;
		const t2 = (path.p1 + path.pi) / length;
		const p1 = Math.floor(path.p1 + path.pi) % length;
		const p2 = (p1 + 1) % length;

		if (path.pi >= 1) path.pi = 0;

		const points = path.points;

		let pos = new THREE.Vector3();
		pos = new THREE.Vector3().subVectors(points[p2], points[p1]);
		pos = new THREE.Vector3().addScaledVector(pos, path.pi);
		pos.add(points[p1]);

		camera.position.copy(pos);

		if (path_2) 
		{
			const points_2 = path_2.points;

			let pos_2 = new THREE.Vector3();
			pos_2 = new THREE.Vector3().subVectors(points_2[p2], points_2[p1]);
			pos_2 = new THREE.Vector3().addScaledVector(pos_2, path.pi);
			pos_2.add(points_2[p1]);

			camera.lookAt(pos_2);
		}

		path.p1 = p1;
		path.p2 = p2;
		path.pi += 0.25 + 0.003;
		
		// меняем угол обзора
		if(camera.userData.type === 'fly') { camera.fov += (camera.userData.fov.fly - camera.fov) * t2; }
		if(camera.userData.type === 'first') { camera.fov += (camera.userData.fov.first - camera.fov) * t2; }
		camera.updateProjectionMatrix();
	
		renderCamera();
		
		if (p1 + 1 < length) 
		{
			requestAnimationFrame(() => {this.movePathCam(path, path_2);});
		}
	}
  
	// расчитываем путь камеры
	pathCamera({startPos, endPos}) 
	{
		const helpTool = false;

		const count = 21;
		const dist = startPos.distanceTo(endPos);
		const dir = new THREE.Vector3().subVectors(endPos, startPos).normalize();
		const unit = new THREE.Vector3().addScaledVector(dir, dist / (count - 1));

		const points = [];

		for (let i = 0; i < count; i++) 
		{
			points[i] = new THREE.Vector3().addScaledVector(unit, i);
			points[i].add(startPos);
		}

		const path = { p1: 0, p2: 1, pi: 0, points };

		if (helpTool) 
		{
			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
			const line = new THREE.Line(geometry, material);
			scene.add(line);

			for (let i = 0; i < points.length; i++) 
			{
				const o = new THREE.Mesh( new THREE.SphereGeometry(0.02, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0000ff }) );
				o.position.copy(points[i]);
				scene.add(o);
			}
		}

		return path;
	}	
}