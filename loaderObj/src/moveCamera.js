
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as MSV from './mouseClick.js';


var type_browser = detectBrowser();


// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
export function createCenterCamObj()
{

	var material = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 1, depthTest: false });
	var obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
	obj.renderOrder = 2;
	obj.visible = false;
	
	Build.scene.add( obj );
	
	
	return obj;
}



// первоначальные настройки при страте 
export function startPosCamera3D(cdm)
{
	let camera3D = Build.infProg.camera3D;
	
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);	
}





// 1. кликаем левой кнопокой мыши (собираем инфу для вращения камеры в 3D режиме)
// 2. кликаем правой кнопокой мыши (собираем инфу для перемещения камеры в 3D режиме и устанавливаем мат.плоскость)
export function clickSetCamera3D( event, click )
{
	//if ( camera != camera3D ) { return; }

	let camera3D = Build.infProg.camera3D;
	
	
	Build.infProg.mouse.pos.x = event.clientX;
	Build.infProg.mouse.pos.y = event.clientY;

	if ( click == 'left' )				
	{
		//var dir = camera.getWorldDirection();
		let dir = new THREE.Vector3().subVectors( camera3D.userData.camera.d3.targetO.position, camera3D.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		let dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    			
		
		
		camera3D.userData.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		camera3D.userData.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		
	{
		Build.infProg.planeMath.position.copy( camera3D.userData.camera.d3.targetO.position );
		//Build.infProg.planeMath.rotation.set(-Math.PI/2, 0, 0);
		Build.infProg.planeMath.rotation.copy( camera3D.rotation );
		Build.infProg.planeMath.updateMatrixWorld();

		let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );	
		camera3D.userData.camera.click.pos = intersects[0].point;  
	}
}







export function cameraMove3D( event )
{ 
	let camera3D = Build.infProg.camera3D;
	
	if ( camera3D.userData.camera.type == 'fly' )
	{
		if ( Build.infProg.mouse.click.type == 'left' ) 
		{  
			let radious = camera3D.userData.camera.d3.targetO.position.distanceTo( camera3D.position );
			
			let theta = - ( ( event.clientX - Build.infProg.mouse.pos.x ) * 0.5 ) + camera3D.userData.camera.d3.theta;
			let phi = ( ( event.clientY - Build.infProg.mouse.pos.y ) * 0.5 ) + camera3D.userData.camera.d3.phi;
			phi = Math.min( 180, Math.max( -60, phi ) );

			camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
			camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
			camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

			camera3D.position.add( camera3D.userData.camera.d3.targetO.position );  
			camera3D.lookAt( camera3D.userData.camera.d3.targetO.position );			
			
			camera3D.userData.camera.d3.targetO.rotation.set( 0, camera3D.rotation.y, 0 );
		}
		if ( Build.infProg.mouse.click.type == 'right' )    
		{
			let intersects = MSV.rayIntersect( event, Build.infProg.planeMath, 'one' );
			let offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
			camera3D.position.add( offset );
			camera3D.userData.camera.d3.targetO.position.add( offset );
		}
		
	}		
	
}







// cameraZoom
export function onDocumentMouseWheel( e )
{	
	let delta = -e.wheelDelta / 120;

	cameraZoom3D( delta, 1 );
	
	Build.render();
}






function cameraZoomTopLoop() 
{
	var flag = false;
	
	if ( camera == camera3D )
	{
		if ( zoomLoop == 'zoomOut' ) { cameraZoom3D( 0.3, 0.3 ); flag = true; }
		if ( zoomLoop == 'zoomIn' ) { cameraZoom3D( -0.3, 0.3 ); flag = true; }
	}
	
	if(flag) { renderCamera(); }
}







function cameraZoom3D( delta, z )
{
	//if ( camera != camera3D ) return;

	let camera3D = Build.infProg.camera3D;
	
	if(camera3D.userData.camera.type == 'fly')
	{
		var vect = ( delta < 0 ) ? z : -z;

		var pos1 = camera3D.userData.camera.d3.targetO.position;
		var pos2 = camera3D.position.clone();
		
		var dir = new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize();
		dir = new THREE.Vector3().addScaledVector( dir, vect );
		dir.addScalar( 0.001 );
		var pos3 = new THREE.Vector3().addVectors( camera3D.position, dir );	


		var qt = Build.quaternionDirection( new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize() );
		var v1 = Build.localTransformPoint( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


		var offset = new THREE.Vector3().subVectors( pos3, pos2 );
		var pos2 = new THREE.Vector3().addVectors( pos1, offset );

		var centerCam_2 = pos1.clone();
		
		if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
		
		if ( v1.z >= 0.05) 
		{ 
			camera3D.userData.camera.d3.targetO.position.copy(centerCam_2);
			camera3D.position.copy( pos3 ); 	
		}			
	}
}






function detectBrowser()
{
	var ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) 
	{
		if(navigator.vendor == "Google Inc.") return 'Chrome';
		else return 'Firefox';
	}
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


console.log( detectBrowser() );
