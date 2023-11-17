import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import { resetOutline } from './outline.js';
import { updateListChild } from './settMat.js';

export function deleteMesh({arr})
{
	resetOutline();
	
	console.log('delMeshesOrigin', arr);
	
	for(let i = 0; i < arr.length; i ++) 
	{
		arr[i].geometry.dispose();
		arr[i].geometry = new THREE.BufferGeometry();
		arr[i].geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3));
		arr[i].geometry.userData.empty = true;
		//arr[i].parent.remove(arr[i]);
		disposeNode(arr[i]);

		let item = Build.infProg.meshs.find((item) => item.o === arr[i]);
		
		if(item)
		{
			item.class.deleteElemItem();
		}		
	}
}



function disposeNode(obj) 
{
	if(1==2)
	{
		let arr = [];
		obj.traverse((child) => arr.push(child));
		arr.forEach((o) => clearMemory(o));		
	}
	else
	{
		clearMemory(obj);
	}

	function clearMemory(node) 
	{
		if(!node.geometry) return;

		node.geometry.dispose();

		if(node.material) 
		{
			let materialArray = node.material instanceof Array ? node.material : [node.material];

			materialArray.forEach(function (mtrl, idx) 
			{
				if (mtrl.map) mtrl.map.dispose();
				if (mtrl.lightMap) mtrl.lightMap.dispose();
				if (mtrl.bumpMap) mtrl.bumpMap.dispose();
				if (mtrl.normalMap) mtrl.normalMap.dispose();
				if (mtrl.specularMap) mtrl.specularMap.dispose();
				if (mtrl.envMap) mtrl.envMap.dispose();
				mtrl.dispose();
			});
		}

		Build.renderer.renderLists.dispose();
	}
}





