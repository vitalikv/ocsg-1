
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
//import { BtnDelTexture } from './ui/right-panel/list-child/btn-del-texture.js';



export async function getMaterialTypesApi(params)
{
	let response = await fetch(params.host);				
	let json = await response.json();
	
	let url = json.materialTypes;
	
	//-------получаем список материалов
	response = await fetch(url, { method: 'GET' });
	json = await response.json();
	
	//-------добавляем материалы в массив
	let arr = json.materials;
	let m = [];
	
	for(let i = 0; i < arr.length; i++)
	{
		if(arr[i].version == 0){}
		else { continue; }
		
		let n = m.length;
		
		m[n] = {};
		m[n].id = arr[i].id;
		m[n].name = arr[i].name;
		m[n].alias = arr[i].alias;
		m[n].old_alias = arr[i].old_alias;
		m[n].params = arr[i].params;
	}
	
	Build.infProg.settings.materials = m;
}



export function changeColorTexture_2(params)
{
	let material = params.material;
	let el = params.el;
	let value = params.value;
		
	if(el) el.style.backgroundColor = value;
	
	material.color = new THREE.Color( value );
	material.needsUpdate = true;
	
	Build.render();
}






export function setNewMaterial({material, name})
{	
	let list = [];
	
	list[list.length] = {old: 'mattet', new: 'tulle', metalness: 0, roughness: 1, opacity: 1, transmission: 0.69};
	list[list.length] = {old: 'matte', new: 'matt', metalness: 0, roughness: 1, opacity: 1, transmission: 0 };
	list[list.length] = {old: 'satin', new: 'semimatt', metalness: 0.19, roughness: 0.2, opacity: 1, transmission: 0};
	list[list.length] = {old: 'semigloss', new: 'semiglossy', metalness: 0.59, roughness: 0.15, opacity: 1, transmission: 0};
	list[list.length] = {old: 'glossy', new: 'glossy', metalness: 0.6, roughness: 0.1, opacity: 1, transmission: 0};
	list[list.length] = {old: 'reflective', new: 'reflective', metalness: 1, roughness: 0.0, opacity: 1, transmission: 0};
	list[list.length] = {old: 'brushed', new: 'brushed', metalness: 0.33, roughness: 0.23, opacity: 1, transmission: 0};
	list[list.length] = {old: 'polished', new: 'polished', metalness: 0.7, roughness: 0.1, opacity: 1, transmission: 0};
	list[list.length] = {old: 'chrome', new: 'chrome', metalness: 1.0, roughness: 0, opacity: 1, transmission: 0, NoTexture: true};
	list[list.length] = {old: 'mirror', new: 'mirror', metalness: 1, roughness: 0, opacity: 1, transmission: 0, NoTexture: true};
	list[list.length] = {old: 'glass', new: 'glass', metalness: 1, roughness: 0, opacity: 0.54, transmission: 1, NoTexture: true};
	list[list.length] = {old: 'steklo_blur', new: 'frostedglass', metalness: 0.45, roughness: 0.26, opacity: 1, transmission: 1};	
	list[list.length] = {old: 'selfluminous', new: 'selfluminous', metalness: 0, roughness: 1, opacity: 1, transmission: 0, NoTexture: true};
	

	for ( let i = 0; i < list.length; i++ )
	{		
		if(new RegExp( list[i].old ,'i').test( name ))
		{	 
			if(list[i].color) { material.color = list[i].color; }
			
			material.metalness = list[i].metalness;
			material.roughness = list[i].roughness;
			material.opacity = list[i].opacity;
			material.transmission = list[i].transmission;
			//console.log(list[i].new, name);	
			material.userData.type = list[i].old;
			
			let map = material.map;
			if(!map) map = (material.userData.map) ? material.userData.map : null;
			
			if(list[i].NoTexture)
			{
				material.userData.NoTexture = true;
				material.userData.map = map;
				material.map = null;
			}
			else
			{
				material.map = map;
				material.userData.NoTexture = false;
			}
			
			material.needsUpdate = true;
			
			Build.render();			
			
			break;
		}
	}
	
	material.needsUpdate = true;
	Build.render();	
}



export function updateListChild()
{	
	let arrO = [];
	let arrM = [];
	
	Build.infProg.scene.traverse((child) => arrO.push(child));
	arrO.forEach((o) => getArrMaT(o));				
	
	function getArrMaT(node) 
	{
		if(!node.geometry) return;
		if(node.geometry.userData.empty) return;
		if(!node.material) return;
		
		let materialArray = node.material instanceof Array ? node.material : [node.material];

		materialArray.forEach((m, idx) => arrM.push({m, o: node}));
	}

	return arrM;
}


export function updateListMaterial()
{	
	let arrO = [];
	let arrM = [];
	
	Build.infProg.scene.traverse((child) => arrO.push(child));
	arrO.forEach((o) => getArrMaT(o));				
	
	function getArrMaT(node) 
	{
		if(!node.geometry) return;
		if(node.geometry.userData.empty) return;
		if(!node.material) return;
		
		let materialArray = node.material instanceof Array ? node.material : [node.material];

		materialArray.forEach(function (mtrl, idx) 
		{
			arrM.push(mtrl);
		});
	}

	return arrM;
}





