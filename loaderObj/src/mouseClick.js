
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as MVC from './moveCamera.js';



let long_click = false;
let lastClickTime = 0;
let catchTime = 0.30;

let onfM = {};
onfM.stop = false;
onfM.rayhitStop = false;

export function setMouseStop(value) 
{
	onfM.stop = value;
}


export function onDocumentMouseDown( event ) 
{
	if(onfM.stop) return;
	
	long_click = false;
	lastClickTime = new Date().getTime();
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		Build.infProg.mouse.click.type = 'left';
	}	

	switch ( event.button ) 
	{
		case 0: Build.infProg.mouse.click.type = 'left'; break;
		case 1: Build.infProg.mouse.click.type = 'right'; /*middle*/ break;
		case 2: Build.infProg.mouse.click.type = 'right'; break;
	}

	
	MVC.clickSetCamera3D( event, Build.infProg.mouse.click.type );
	
	Build.infProg.rayhit = null;	
				
	//var ray = rayIntersect( event, infProject.obj, 'one' );
	
	//if(ray.length > 0) { infProject.rayhit = ray[0]; }	
	
	//clickObj();
	
	Build.render();
}





export function onDocumentMouseMove( event ) 
{ 
	if(onfM.stop) return;
	
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		Build.infProg.mouse.click.type = 'left';
	}
		

	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }
	
	MVC.cameraMove3D( event );
	
	Build.render();
}


export function onDocumentMouseUp( event )  
{
	if(onfM.stop) return;
	
	Build.infProg.mouse.click.type = '';
	
	Build.render();
}



export function getMousePosition( event )
{
	let rect = Build.container.getBoundingClientRect();
	let zoom = document.body.style.zoom;
	
	let x = ( ( event.clientX/zoom - rect.left ) / rect.width ) * 2 - 1;
	let y = - ( ( event.clientY/zoom - rect.top ) / rect.height ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}

	

export function rayIntersect( event, obj, t ) 
{
	let mouse = getMousePosition( event );
	
	let raycaster = new THREE.Raycaster();
	
	raycaster.setFromCamera( mouse, Build.infProg.camera );
	
	let intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
	
	return intersects;
}



