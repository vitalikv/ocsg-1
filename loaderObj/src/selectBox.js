import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as MSV from './mouseClick.js';
import { SelectionBox } from './m/interactive/SelectionBox.js';
import * as Lobj from './loaderObj.js';
import { addOutline, resetOutline, getMeshOutline } from './outline.js';
import { deleteMesh } from './deleteMesh.js';

export class SelectBoxDiv
{
	constructor({container}) 
	{
		this.element = document.createElement('div');
		this.element.style.cssText = `border: 1px solid #55aaff; background-color: rgba(75, 160, 255, 0.3); position: fixed;`;
		//this.element.style.pointerEvents = 'none';
		this.element.style.display = 'none';
		
		this.container = container;
		this.container.append( this.element );
		
		this.startPoint = {x: 0, y: 0};
		this.pointTopLeft = {x: 0, y: 0};
		this.pointBottomRight = {x: 0, y: 0};

		this.isDown = false;
		this.isKeyDown = false;
		
		this.initEvent();
	}
	
	
	initEvent() 
	{ 
		this.container.addEventListener( 'mousedown', this.onPointerDown.bind(this) );
		this.container.addEventListener( 'mousemove', this.onPointerMove.bind(this) );
		this.container.addEventListener( 'mouseup', this.onPointerUp.bind(this) );

		document.addEventListener('keydown', (e) => { if(e.code == 'ShiftLeft' || e.keyCode == 16) { this.isKeyDown = true;} })
		document.addEventListener('keyup', (e) => { if(e.code == 'ShiftLeft' || e.keyCode == 16) { this.isKeyDown = false; this.onPointerUp(); } })				
	}


	onPointerDown( event ) 
	{			
		if(!this.isKeyDown) return;
		
		this.isDown = true;
		this.onSelectStart( event );
		MSV.setMouseStop(true);
	}	
	
	
	onPointerMove( event ) 
	{
		if(!this.isDown) return;
		
		this.onSelectMove( event );
	}
	
	
	onPointerUp() 
	{		
		if(!this.isDown) return;		
		
		this.isDown = false;
		this.onSelectOver();
		MSV.setMouseStop(false);
	}
	
	onSelectStart( event ) 
	{
		this.element.style.display = '';

		let rect = Build.container.getBoundingClientRect();
		let zoom = document.body.style.zoom;
		
		this.startPoint.x = event.clientX / zoom - rect.left;
		this.startPoint.y = event.clientY / zoom - rect.top;
		
		this.element.style.left = this.startPoint.x + 'px';
		this.element.style.top = this.startPoint.y + 'px';
		this.element.style.width = '0px';
		this.element.style.height = '0px';
	}

	onSelectMove( event ) 
	{
		let rect = Build.container.getBoundingClientRect();
		let zoom = document.body.style.zoom;
		
		let left = event.clientX / zoom - rect.left;
		let right = event.clientY / zoom - rect.top;
		
		this.pointTopLeft.x = Math.min( this.startPoint.x, left );
		this.pointTopLeft.y = Math.min( this.startPoint.y, right );		
		this.pointBottomRight.x = Math.max( this.startPoint.x, left );
		this.pointBottomRight.y = Math.max( this.startPoint.y, right );

		this.element.style.left = this.pointTopLeft.x + 'px';
		this.element.style.top = this.pointTopLeft.y + 'px';
		this.element.style.width = ( this.pointBottomRight.x - this.pointTopLeft.x ) + 'px';
		this.element.style.height = ( this.pointBottomRight.y - this.pointTopLeft.y ) + 'px';
	}

	onSelectOver() {

		this.element.style.display = 'none';
	}	
}



export function initSelectBox({container, camera, scene})
{	
	const selectionBox = new SelectionBox( camera, scene );
	const helper = new SelectBoxDiv({container});

	let isMove = false;
	let isClick = false;
	
	container.addEventListener( 'mousedown', function ( event ) 
	{
		isClick = true;
		isMove = false;
		resetOutline();
		
		let mouse = MSV.getMousePosition( event );
		
		selectionBox.startPoint.set(mouse.x, mouse.y, 0.5);
	});


	container.addEventListener( 'mousemove', function ( event ) 
	{
		isMove = true;
	});

	container.addEventListener( 'mouseup', function ( event ) 
	{
		if(isClick && isMove)
		{
			Build.outlinePass.selectedObjects = [];
			
			let mouse = MSV.getMousePosition( event );
			selectionBox.endPoint.set(mouse.x, mouse.y, 0.5);

			const allSelected = selectionBox.select();

			for ( let i = 0; i < allSelected.length; i ++ ) 
			{
				addOutline({obj: allSelected[i]});
			}
		}
		else if(isClick && Build.infProg.scene)
		{
			let ray = MSV.rayIntersect( event, [Build.infProg.scene], 'arr' );
			if (ray.length === 0) return;
			let obj = ray[0].object;
			
			addOutline({obj});
		}

		Build.render();
	});


	document.addEventListener("keydown", function (e)  
	{ 
		if(e.keyCode == 46 || e.code == 'Backspace') 
		{ 			
			if(e.target instanceof HTMLInputElement) return;
			
			deleteMesh({arr: getMeshOutline()});
			
			getBoundObject_2({obj: Build.infProg.scene}); 
						
			Build.infProg.class.rPanel.elem.trnInput.getCountTr_1();			
			
			Build.render();
		}
	});	
}




function getBoundObject_2({obj})
{
	if(!obj) return;
	
	if(Build.infProg.boundBox)
	{
		Build.infProg.boundBox.geometry.dispose();
		Build.scene.remove(Build.infProg.boundBox);
	}	
	
	let arr = [];
	let rotO = obj.rotation.clone();
	obj.updateMatrixWorld(true);
	
	obj.traverse(function(child) 
	{
		if (child instanceof THREE.Mesh)
		{
			if(child.geometry) 
			{ 
				arr[arr.length] = child;					
			}
		}
	});	

	//scene.updateMatrixWorld();
	
	let v = [];
	let bound;
	
	for ( let i = 0; i < arr.length; i++ )
	{		
		arr[i].geometry.computeBoundingBox();	
		arr[i].geometry.computeBoundingSphere();

		bound = arr[i].geometry.boundingBox;

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
	}
	
	bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
	
	for(let i = 0; i < v.length; i++)
	{
		if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
		if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
		if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
		if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
		if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
		if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
	}
	

	
	let centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), ((bound.max.y - bound.min.y)/2 + bound.min.y), ((bound.max.z - bound.min.z)/2 + bound.min.z));
	let x = (bound.max.x - bound.min.x);
	let y = (bound.max.y - bound.min.y);
	let z = (bound.max.z - bound.min.z);			

	
	if(1==1)
	{
		let geometry = new THREE.BoxGeometry(x, y, z);	
		let material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
		let cube = new THREE.Mesh( geometry, material );
		cube.position.copy(centerPos);
		cube.rotation.copy(rotO);
		cube.visible = false;
		Build.scene.add( cube );

		Build.infProg.boundBox = cube;
	}
	
	Build.render();
}

