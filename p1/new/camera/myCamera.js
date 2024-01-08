

class MyCameraOrbit
{
	constructor({container, renderer, scene})
	{
		this.renderer = renderer;
		this.canvas = renderer.domElement;
		this.container = container;
		this.scene = scene;
		this.cam2D = this.initCam2D();
		this.cam3D = this.initCam3D();
		this.planeMath = this.initPlaneMath();
		this.activeCam = this.cam2D;		
		
		this.detectBrowser = this.detectBrowser();
		
		this.stopMove = false;
		
		this.mouse = {};
		this.mouse.button = '';
		this.mouse.down = false;
		this.mouse.move = false;		
		this.mouse.pos = {};
		this.mouse.pos.x = 0;
		this.mouse.pos.y = 0;
		
		this.api = new EventMyCamera();	// вспомогательный класс, другие методы подписываются
		
		this.initEvent();	
	}
	
	initEvent()
	{
		const container = this.container;
		
		container.addEventListener( 'mousedown', this.mouseDown, false );
		container.addEventListener( 'mousemove', this.mouseMove, false );
		container.addEventListener( 'mouseup', this.mouseUp, false );	
		
		container.addEventListener( 'touchstart', this.mouseDown, false );
		container.addEventListener( 'touchmove', this.mouseMove, false );
		container.addEventListener( 'touchend', this.mouseUp, false );
		
		container.addEventListener('wheel', this.mouseWheel, false);			

		window.addEventListener( 'resize', this.windowResize, false );
	}
	
	initCam2D()
	{
		const canvas = this.canvas;
		
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const d = 5;
		const camera2D = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
		camera2D.userData.isCam2D = true;
		camera2D.position.set(0, 15, 0);
		camera2D.lookAt(new THREE.Vector3());
		camera2D.zoom = 1;
		camera2D.updateMatrixWorld();
		camera2D.updateProjectionMatrix();	

		camera2D.userData.pos = camera2D.position.clone();
		camera2D.userData.zoom = camera2D.zoom;
	
		return camera2D;
	}

	initCam3D()
	{
		const canvas = this.canvas;		
		const camera3D = new MyCameraPerspective({fov: 65, aspect: canvas.clientWidth / canvas.clientHeight, near: 0.01, far: 1000});  		
		
		return camera3D;
	}
	
	
	initPlaneMath()
	{
		const geometry = new THREE.PlaneGeometry( 10000, 10000 );		
		const material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
		material.visible = false; 
		const planeMath = new THREE.Mesh( geometry, material );
		planeMath.rotation.set(-Math.PI/2, 0, 0);	
		this.scene.add( planeMath );	
		
		return planeMath;
	}	
	
	setActiveCam({cam})
	{
		const camera = (cam === '2D') ? this.cam2D : this.cam3D;
		
		this.activeCam = camera;
		
		this.cam3D.userData.targetO.visible = (cam === '2D') ? false : true;
		
		this.api.setActiveCam({camera})
		
		this.render();
	}
	
	switchFlyFirst()
	{		
		if(!this.activeCam.userData.isCam3D) return;
		
		this.cam3D.switchType();
		this.render();
	}

	mouseDown = (event) =>
	{
		myComposerRenderer.fxaaPass.enabled = false;
		if(this.stopMove) return;
		this.mouse.down = true;
		this.mouse.move = false;
	
		switch ( event.button ) 
		{
			case 0: this.mouse.button = 'left'; break;
			case 1: this.mouse.button = 'right'; break;
			case 2: this.mouse.button = 'right'; break;
		}	
		
		if(event.changedTouches)
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
			this.mouse.button = 'left';	
		}

		this.startCam2D({camera2D: this.cam2D, event: event, button: this.mouse.button});
		this.startCam3D({camera3D: this.cam3D, event: event, button: this.mouse.button});
	
		this.render();
	}

	mouseMove = (event) =>
	{
		if(this.stopMove) return;
		if(!this.mouse.down) return;		
		
		if(event.changedTouches)
		{
			event.clientX = event.targetTouches[0].clientX;
			event.clientY = event.targetTouches[0].clientY;
		}

		if(this.mouse.down && !this.mouse.move)
		{
			this.mouse.move = true;
		}

		this.moveCam2D( event );
		this.moveCam3D( event );
			
		//infProject.class.api.camMove();
		
		this.render();
	}

	mouseUp = (event) =>
	{
		myComposerRenderer.fxaaPass.enabled = true;
		this.mouse.button = '';
		this.mouse.down = false;
		this.mouse.move = false;
		this.render();
	}
	
	
	windowResize = () => 
	{
		const canvas = this.canvas;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		//if (!needResize) { return; }
		
		this.renderer.setSize(width, height, false);
		
		const aspect = width / height;
		const d = 5;
		
		this.cam2D.left = -d * aspect;
		this.cam2D.right = d * aspect;
		this.cam2D.top = d;
		this.cam2D.bottom = -d;
		this.cam2D.updateMatrixWorld();
		this.cam2D.updateProjectionMatrix();

		 
		this.cam3D.aspect = aspect;
		this.cam3D.updateMatrixWorld();
		this.cam3D.updateProjectionMatrix();	
		
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		
		this.render();

	}	


	// установить 3D камеру в нужное положение
	setStartPosRot3D({posCam, rot, posTarget})
	{
		const camera3D = this.cam3D;
		
		camera3D.position.copy(posCam);	
		camera3D.lookAt(posTarget);
		//camera3D.rotation.set(-0.40309943010546634, -2.371254594012155, 0);			
		camera3D.userData.targetO.position.copy(posTarget);
		camera3D.userData.targetO.rotation.set(0, camera3D.rotation.y, 0);
		
		camera3D.userData.pos = camera3D.position.clone();
		camera3D.userData.radius = camera3D.userData.targetO.position.distanceTo(camera3D.position);			
	}

	startCam2D({camera2D, event, button})
	{
		if(!this.activeCam.userData.isCam2D) return;

		const planeMath = this.planeMath;
		
		planeMath.position.set(camera2D.position.x, 0, camera2D.position.z);
		planeMath.rotation.set(-Math.PI/2,0,0);  
		planeMath.updateMatrixWorld();
		
		const intersects = this.rayIntersect( event, planeMath, 'one' );
		
		this.mouse.pos.x = intersects[0].point.x;
		this.mouse.pos.y = intersects[0].point.z;	 		
	}


	startCam3D({camera3D, event, button})
	{
		if(!this.activeCam.userData.isCam3D) return;
		
		this.mouse.pos.x = event.clientX;
		this.mouse.pos.y = event.clientY;
		
		if(button === 'left')				
		{
			//var dir = camera.getWorldDirection();
			let dir = new THREE.Vector3().subVectors( camera3D.userData.targetO.position, camera3D.position ).normalize();
			
			// получаем угол наклона камеры к target (к точке куда она смотрит)
			let dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
			if(dir.y > 0) { dergree *= -1; } 			
			
			// получаем угол направления (на плоскости) камеры к target 
			dir.y = 0; 
			dir.normalize();    						
			
			camera3D.userData.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
			camera3D.userData.phi = dergree; 
		}
		else if(button === 'right')		
		{
			const planeMath = this.planeMath;
			
			planeMath.position.copy( camera3D.userData.targetO.position );
			
			planeMath.rotation.copy( camera3D.rotation );
			//planeMath.rotation.set(-Math.PI/2, 0, 0);			
			planeMath.updateMatrixWorld();

			const intersects = this.rayIntersect( event, planeMath, 'one' );
			if(!intersects[0]) return;
			camera3D.userData.clickPos = intersects[0].point; 		
		}	
	}


	moveCam2D( event ) 
	{
		if(!this.activeCam.userData.isCam2D) return;
		if(this.mouse.button === '') return;
						
		const intersects = this.rayIntersect( event, this.planeMath, 'one' );
		
		const camera2D = this.activeCam;
		camera2D.position.x += this.mouse.pos.x - intersects[0].point.x;
		camera2D.position.z += this.mouse.pos.y - intersects[0].point.z;

		camera2D.updateMatrixWorld();
		this.api.moveCam2D();
	}


	moveCam3D( event )
	{ 
		if(!this.activeCam.userData.isCam3D) return;
		if(this.mouse.button === '') return;
		
		const type = this.activeCam.userData.type;
		
		if(type === 'fly') this.moveCamFly3D(); 
		if(type === 'first') this.moveCamFirst3D();
	}
	

	moveCamFly3D()
	{
		const camera3D = this.activeCam;
		
		if(this.mouse.button === 'left') 
		{  
			const radious = camera3D.userData.targetO.position.distanceTo( camera3D.position );
			
			const theta = - ( ( event.clientX - this.mouse.pos.x ) * 0.5 ) + camera3D.userData.theta;
			let phi = ( ( event.clientY - this.mouse.pos.y ) * 0.5 ) + camera3D.userData.phi;
			phi = Math.min( 170, Math.max( -60, phi ) );

			camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera3D.position.add( camera3D.userData.targetO.position );  
			camera3D.lookAt( camera3D.userData.targetO.position );			
			
			camera3D.userData.targetO.rotation.set( 0, camera3D.rotation.y, 0 );		
		}
		
		if(this.mouse.button === 'right')    
		{
			const intersects = this.rayIntersect( event, this.planeMath, 'one' );
			if(!intersects[0]) return;
			const offset = new THREE.Vector3().subVectors( camera3D.userData.clickPos, intersects[0].point );
			offset.y = 0;
			camera3D.position.add( offset );
			camera3D.userData.targetO.position.add( offset );			
		}

		this.api.moveCamFly3D()
	}
	
	moveCamFirst3D()
	{
		const camera3D = this.activeCam;
		
		// вращение
		if(this.mouse.button === 'left') 
		{
			const y = ( ( event.clientX - this.mouse.pos.x ) * 0.002 );
			const x = ( ( event.clientY - this.mouse.pos.y ) * 0.002 );

			camera3D.rotation.x -= x;
			camera3D.rotation.y -= y;
			this.mouse.pos.x = event.clientX;
			this.mouse.pos.y = event.clientY;
			
			camera3D.userData.targetO.position.set( camera3D.position.x, camera3D.userData.targetO.position.y, camera3D.position.z );
			camera3D.userData.targetO.rotation.set( 0, camera3D.rotation.y, 0 );			
		}
		
		// перемещение
		if(this.mouse.button === 'right')    
		{
			const y = ( ( event.clientX - this.mouse.pos.x ) * 0.005 );
			const x = ( ( event.clientY - this.mouse.pos.y ) * 0.005 );
			
			this.mouse.pos.x = event.clientX;
			this.mouse.pos.y = event.clientY;
			
			const dir = camera3D.getWorldDirection(new THREE.Vector3());
			dir.y = 0;
			dir.normalize();
			
			const offset = new THREE.Vector3().addScaledVector(dir, x);
			
			const dir2 = new THREE.Vector3(-dir.z, 0, dir.x);	// перпендикуляр от нулевой точки
			const offset2 = new THREE.Vector3().addScaledVector(dir2, -y / 2);
			offset.add(offset2);
			
			camera3D.position.add( offset );
			camera3D.userData.targetO.position.add( offset );			
		}		
	
		this.api.moveCamFirst3D()
	}	
	
	rayIntersect( event, obj, t ) 
	{		
		const canvas = this.canvas;
		const mouse = getMousePosition( event );
		
		function getMousePosition( event )
		{
			const rect = canvas.getBoundingClientRect();

			const x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
			const y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;	
			
			return new THREE.Vector2(x, y);
		}		
		
		const raycaster = new THREE.Raycaster()
		raycaster.setFromCamera( mouse, this.activeCam );
		
		let intersects = null;
		if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
		else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
		
		return intersects;
	}


	mouseWheel = (event) =>
	{		
		let delta = -event.wheelDelta / 120;	
		
		this.cameraZoom2D({delta, event});
		this.cameraZoom3D({delta});
		
		//infProject.class.api.camZoom();
		
		this.render();
	}
	
	

	cameraZoom2D({delta, event})
	{
		if(!this.activeCam.userData.isCam2D) return;
		const camera = this.activeCam;
		
		const zoomOld = camera.zoom;
		
		camera.zoom -= ( delta * 0.3 * ( camera.zoom / 2 ) );

		// зумирование на конкретный объект/точку в простаранстве 
		const zoomOnTarget = ({event, zoomOld}) =>
		{ 
			this.planeMath.position.set(camera.position.x, 0, camera.position.z);
			this.planeMath.rotation.set(-Math.PI/2,0,0);  
			this.planeMath.updateMatrixWorld();
				
			const intersects = this.rayIntersect( event, this.planeMath, 'one' );	
			if(intersects.length == 0) return;
			
			const pos = intersects[0].point;

			const xNew = pos.x + (((camera.position.x - pos.x) * camera.zoom) /zoomOld);
			const yNew = pos.z + (((camera.position.z - pos.z) * camera.zoom) /zoomOld);

			camera.position.x += camera.position.x - xNew;
			camera.position.z += camera.position.z - yNew;

			camera.updateMatrixWorld();
		}

		zoomOnTarget({event, zoomOld});
		camera.updateProjectionMatrix();
		
		this.api.cameraZoom2D();		
	}


	cameraZoom3D({delta})
	{
		if(!this.activeCam.userData.isCam3D) return;
		if(this.activeCam.userData.type !== 'fly') return;
		
		const camera3D = this.activeCam;
		
		let movement = ( delta < 0 ) ? 1 : -1;
		movement *= 1.2;
		
		let pos1 = camera3D.userData.targetO.position;
		let pos2 = camera3D.position.clone();
				
		
		const dir = camera3D.getWorldDirection(new THREE.Vector3());
		let offset = new THREE.Vector3().addScaledVector( dir, movement );
		
		pos1 = offsetTargetCam({posCenter: pos1, dir: dir, dist: 0.1});
		offset = stopTargetCam({posCenter: pos1, posCam: pos2, offset: offset});
		
		
		// устанавливаем расстояние насколько близко можно приблизиться камерой к target
		function offsetTargetCam(params)
		{
			let dir = params.dir;
			let dist = params.dist;
			let posCenter = params.posCenter;
			
			let dirInvers = new THREE.Vector3(-dir.x, -dir.y, -dir.z);		
			let offset = new THREE.Vector3().addScaledVector( dirInvers, dist );
			
			let newPos = new THREE.Vector3().addVectors( posCenter, offset );
			
			return newPos;
		}	
		
		
		// запрещаем перемещение камеры за пределы центра/target
		function stopTargetCam(params)
		{	
			let offset = params.offset;
			let posCam = params.posCam;
			let posCenter = params.posCenter;
			
			let newPos = new THREE.Vector3().addVectors( posCam, offset );
			let dir2 = new THREE.Vector3().subVectors( posCenter, newPos ).normalize();		
			
			let dot = dir.dot(dir2);

			if(dot < 0) 
			{
				offset = new THREE.Vector3().subVectors( posCenter, posCam )
			}
			
			return offset;
		}	

		camera3D.position.add( offset );

		this.api.cameraZoom3D();
	}


	// приближаемся к выбранному объекту
	fitCamera({obj, rot = true})
	{
		let camera = this.activeCam;

		let v = [];
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();	

		let bound = obj.geometry.boundingBox;
		
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );			


		if(camera.userData.isCam3D)
		{
			bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
			
			for(let i = 0; i < v.length; i++)
			{
				if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
				if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
				if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
				if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
				if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
				if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
			}		
			
			
			let center = new THREE.Vector3((bound.max.x - bound.min.x)/2 + bound.min.x, (bound.max.y - bound.min.y)/2 + bound.min.y, (bound.max.z - bound.min.z)/2 + bound.min.z);
			
			// визуализируем 
			if(1==2)
			{
				let g = createGeometryCube(0.01, 0.01, 0.01);
				let material = new THREE.MeshLambertMaterial( { color : 0x030202, transparent: true, opacity: 1, depthTest: false } );

				let cube = [];
				for(let i = 0; i < 6; i++)
				{
					cube[i] = new THREE.Mesh( g, material );
					scene.add( cube[i] );	
				}
				cube[0].position.set(bound.min.x, center.y, center.z); 
				cube[1].position.set(bound.max.x, center.y, center.z); 
				cube[2].position.set(center.x, bound.min.y, center.z); 
				cube[3].position.set(center.x, bound.max.y, center.z); 
				cube[4].position.set(center.x, center.y, bound.min.z); 
				cube[5].position.set(center.x, center.y, bound.max.z);		
			}
			
			let fitOffset = 5.1;
			let maxSize = Math.max( bound.max.x - bound.min.x, bound.max.y - bound.min.y, bound.max.z - bound.min.z );  
			//let fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );		
			//let fitWidthDistance = fitHeightDistance / camera.aspect;		
			//let distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );		
			
			
			if(rot)
			{
				camera.lookAt(center);		
				let dir = center.clone().sub( camera.position ).normalize().multiplyScalar( maxSize + 0.25 );	
				camera.position.copy(center).sub(dir);			
			}
			else
			{	
				//let maxSize = Math.max( bound.max.x - bound.min.x, bound.max.y - bound.min.y );
				let dir = obj.getWorldDirection().multiplyScalar( maxSize * 2 );	
				camera.position.copy(center).add(dir);
				camera.lookAt(center);			
			}		
			
			camera.userData.targetO.position.copy( center );
		}
		
		
		if(camera.userData.isCam2D)
		{
			bound = { min : { x : Infinity, z : Infinity }, max : { x : -Infinity, z : -Infinity } };
			
			for(let i = 0; i < v.length; i++)
			{
				if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
				if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
				if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
				if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
			}					

			let aspect = ( bound.max.x - bound.min.x )/( bound.max.z - bound.min.z );		
			
			if( aspect > 1.0 )	// определяем что больше ширина или высота 
			{
				let x = ( bound.max.x - bound.min.x < 0.1) ? 0.1 : bound.max.x - bound.min.x;
				camera.zoom = camera.right / (x/0.5);
			}
			else
			{
				let z = ( bound.max.z - bound.min.z < 0.1) ? 0.1 : bound.max.z - bound.min.z;
				camera.zoom = camera.top / (z/0.5);
			}
			
			

			// центр нужно считать, так как у трубы центр всегда в нулях
			let pos = new THREE.Vector3((bound.max.x - bound.min.x)/2 + bound.min.x, 0, (bound.max.z - bound.min.z)/2 + bound.min.z);		
			camera.position.x = pos.x;
			camera.position.z = pos.z;	
		}
		
		camera.updateProjectionMatrix();
		
		//infProject.class.api.camMove();
		
		this.render();
	}
	

	// центрируем камеру Camera2D по массиву точек
	centerCamera2D({arr}={})
	{
		if(!arr) return;
		if(arr.length === 0) return;
		
		let pos = new THREE.Vector3();

		let minX = Infinity; 
		let maxX = -Infinity;
		let minZ = Infinity; 
		let maxZ = -Infinity;		
		
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i].position.x < minX) { minX = arr[i].position.x; }
			if(arr[i].position.x > maxX) { maxX = arr[i].position.x; }
			if(arr[i].position.z < minZ) { minZ = arr[i].position.z; }
			if(arr[i].position.z > maxZ) { maxZ = arr[i].position.z; }
		}				
		
		pos = new THREE.Vector3((maxX - minX)/2 + minX, 0, (maxZ - minZ)/2 + minZ);		
				
		this.cam2D.position.x = pos.x;
		this.cam2D.position.z = pos.z;
	}	
	
	detectBrowser()
	{
		let ua = navigator.userAgent;

		if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
		if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
		if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
		if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
		if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
		if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
		if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
		if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

		// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
		if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

		// а может это вообще поисковый робот
		return 'Search Bot';
	}	

	render() 
	{
		if (myComposerRenderer) { myComposerRenderer.composer.render(); } 
		else { this.renderer.render( this.scene, this.activeCam ); }
	}
	
}







