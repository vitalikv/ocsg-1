
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
	
	Build.infProg.class.modalW.elem.import.show();
	
	setTimeout(()=>
	{ 
		Ecollada.exportCollada();
		//Egltf.exportGLTF()		
	}, 100);
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






