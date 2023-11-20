
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as Ecollada from './exportCollada.js';
import * as Egltf from './exportGlb.js';
import { updateListMaterial } from './settMat.js';





export function sendData()
{
	if(!Build.infProg.scene) return;
	
	let obj = Build.infProg.scene;
	
	Build.dataFbx.scale = obj.scale.x;
	
	Build.dataFbx.rotate = getRotation();
	
	
	Build.dataFbx.materials = [];
	let arrM = updateListMaterial();
	
	for ( let i = 0; i < arrM.length; i++ )
	{
		Build.dataFbx.materials[i] = {};
		Build.dataFbx.materials[i].meshName = arrM[i].userData.meshName;
		Build.dataFbx.materials[i].name = arrM[i].userData.name;
		Build.dataFbx.materials[i].type = arrM[i].userData.type;
		Build.dataFbx.materials[i].color = arrM[i].color.getHexString();
		Build.dataFbx.materials[i].index = arrM[i].userData.index;
		
		if(arrM[i].userData.NoTexture) Build.dataFbx.materials[i].NoTexture = arrM[i].userData.NoTexture;
		
		//console.log(Build.dataFbx.materials[i]);
	}
	
	//Build.infProg.class.modalW.elem.import.show();
	
	save({obj});
	saveImage();
}



function getRotation()
{
	let obj = Build.infProg.scene;
	
	let q = obj.quaternion;
	q = new THREE.Quaternion( -q.x, q.y, q.z, -q.w );	
	 
	let v = new THREE.Euler().setFromQuaternion( q, "YXZ" );	
	
	return {x: THREE.Math.radToDeg(v.x), y: THREE.Math.radToDeg(v.y), z: THREE.Math.radToDeg(v.z)};
}





export function isCheckExsistFunction(functionToCheck)  
{
    let getType = {};
	
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]' || functionToCheck && getType.toString.call(functionToCheck) === '[object AsyncFunction]';
}


function save({obj})
{
	if(!obj) return;
	
	let rotO = obj.rotation.clone();
		
	obj.position.set(0, 0, 0);
	obj.rotation.set(0, 0, 0);
	
	let arr = [];

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
		
		//console.log(111111, arr[i], bound);

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
	}
	
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
	

	
	let centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), -bound.min.y, ((bound.max.z - bound.min.z)/2 + bound.min.z));
	let x = (bound.max.x - bound.min.x);
	let y = (bound.max.y - bound.min.y);
	let z = (bound.max.z - bound.min.z);			

	
	let q = new THREE.Quaternion().setFromEuler(rotO);
	obj.position.sub(centerPos);
	obj.position.sub(new THREE.Vector3(0, y/2, 0));
	obj.position.applyQuaternion(q);
	//obj.position.add(centerPos);
	obj.quaternion.copy(q);
	
	obj.updateMatrixWorld(true);
	

	
	if(1==1)
	{
		let geometry = new THREE.BoxGeometry(x, y, z);	
		let material = new THREE.MeshStandardMaterial( {color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false} );
		let cube2 = new THREE.Mesh( geometry, material );
		cube2.position.sub(new THREE.Vector3(0, -y/2, 0));
		cube2.rotation.copy(rotO);
		cube2.material.visible = false;
		cube2.add( obj );
		Build.scene.add( cube2 );		
		
		const str = JSON.stringify(cube2.toJSON());
		const data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(str);		
		
		
		let link = document.createElement('a');
		link.style.display = 'none';
		document.body.appendChild(link);
		link.href = data;
		link.download = 'model.json';
		link.click();
		document.body.removeChild(link);

		
		Build.scene.add( obj );
		obj.position.set(0, 0, 0);
		obj.position.sub(centerPos);
		
		Build.scene.remove(cube2);
	}

	
	Build.render();
}

// сохранить screenshot
function saveImage() 
{
	let link = document.createElement('a');
	
	document.body.appendChild(link); //Firefox requires the link to be in the body
	link.download = 'prew.jpg';
	link.href = Build.dataFbx.previewFile;
	link.click();
	document.body.removeChild(link); //remove the link when done
} 


