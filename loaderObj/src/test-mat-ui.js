import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import { ListMesh } from './ui/right-panel/list-child/list-mesh.js';






export function testMatUI()
{
	console.log('testMatUI');
	return;
	let arrM = [];
	
	let geom = new THREE.BufferGeometry();
	let matS = new THREE.MeshStandardMaterial();
	let obj = new THREE.Mesh( geom, matS );
	
	let arr = [{c: 0xff0000, t: 'glass'}, {c: 0x0000ff, t: 'matte'}];
	arr.push(...[{c: 0xff0000, t: 'glass'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}, {c: 0x0000ff, t: 'matte'}]);
	
	for(let i = 0; i < arr.length; i++)
	{
		let m = matS.clone();
		m.color = new THREE.Color( arr[i].c );
		m.userData.type = arr[i].t;
		m.userData.name = 'test';
		m.userData.index = 0;
		m.userData.meshName = 'geom';
		
		Build.infProg.meshs.push({m, o: obj, gclone: obj.geometry.clone(), class: {}});
	}
	
	
	
	Build.infProg.class.listMesh.creatList({arr: Build.infProg.meshs})
}

