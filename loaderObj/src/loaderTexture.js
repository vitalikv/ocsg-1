
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';




export function loadTexture({material, src})
{
	let map = (material.map) ? material.map : new THREE.Texture();
	
	map.dispose();
	
	if(!material.map)
	{
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
	}
	
	map.image = new Image();
	map.image.src = src;
	//map.anisotropy = Build.renderer.capabilities.getMaxAnisotropy();
	map.encoding = THREE.sRGBEncoding;				
	map.needsUpdate = true;

	map.image.onload = () => { Build.render(); }	
	
	material.map = map;
	material.needsUpdate = true;
}





export function deleteTexture({material})
{
	if(!material.map) return;
	
	material.map = null; 
	material.needsUpdate = true;
	
	Build.render();		
}



export function updateSettingTexture({type, value, material})      
{	
	if(type === 'scaleX') material.map.repeat.x = Number(value);
	if(type === 'scaleY') material.map.repeat.y = Number(value);
	if(type === 'offsetX') material.map.offset.x = Number(value);
	if(type === 'offsetY') material.map.offset.y = Number(value);
	if(type === 'rotateT') material.map.rotation = Number(value);
	
	material.map.needsUpdate = true;
	
	Build.render();		
}





