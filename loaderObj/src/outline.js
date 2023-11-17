import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';




export function addOutline({obj})
{
	console.log('addOutline', obj);
	
	Build.infProg.class.listMesh.selectItemFromScene({obj});
	Build.outlinePass.selectedObjects.push(obj);
}


export function getMeshOutline()
{
	return Build.outlinePass.selectedObjects;
}


export function resetOutline()
{
	Build.infProg.class.listMesh.defaultItemsBorder();
	Build.outlinePass.selectedObjects = [];
}


export function addOutlineFromUI({obj})
{
	Build.outlinePass.selectedObjects = [];
	Build.outlinePass.selectedObjects.push(obj);
	Build.render();
}


