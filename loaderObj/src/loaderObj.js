

import * as THREE from '../node_modules/three/build/three.module.js';

import { FBXLoader } from './m/FBXLoader.js';
import { TDSLoader } from '../node_modules/three/examples/jsm/loaders/TDSLoader.js';
import { ColladaLoader } from '../node_modules/three/examples/jsm/loaders/ColladaLoader.js';
//import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from './m/GLTFLoader.js';
import { OBJLoader } from './m/OBJLoader.js';

import * as Build from './index.js';
import * as SettMat from './settMat.js';
import * as SendD from './sendData.js';
import * as INPL from './inputUpload.js';
import { optimizeGeomModelToFinish } from './modifierGeometry.js'



export let dataObj = null;



window.LoadModel = LoadModel;


// загрузка модели из planoplan
function LoadModel(...params) 
{
	console.log('unity->WebGL LoadModel()');  
	
	let base64 = params[0];

	if(!base64) 
	{
		Build.infProg.class.modalW.elem.loading.hide();	
		Build.infProg.class.modalW.elem.err.show();
		return;
	}

	let base64_str = base64.split(",")[1].split("=")[0];
	let strLength = base64_str.length;
	let fileLength = strLength - (strLength / 8) * 2;

	let sizeMB = Math.round(2697184 / Math.pow(1024, Math.floor (fileLength)), 2)
	
	console.log('MB', sizeMB);

	if(sizeMB > 50) 
	{
		Build.infProg.class.modalW.elem.loading.hide();	
		Build.infProg.class.modalW.elem.err.show();
		return;
	}	

	let arrayBuffer = base64ToArrayBuffer(base64);
	

	let fileName = params[1];
	let catalogKeys = params[2];
	
	
	
	for (let i = 3; i < params.length; ++i)
	{
		let name = params[i].match(/filename=(.*);/);
		name = (name.length > 1) ? name[1] : '';

		INPL.arrInd.push({name: name, result: params[i]});
	}
	
	
	Build.dataFbx.modelName = fileName;			

	parseObj_1({data: arrayBuffer});
	
	Build.infProg.class.modalW.elem.loading.hide();	
}



export function base64ToArrayBuffer(bytes) 
{
	let base64 = null;
	let binary_string = null;
	
	
	try 
	{
		base64 = bytes.split('base64,')[1];;
	} 
	catch (err) 
	{
		console.log(err);
		return null;
	}
	
	try 
	{
		binary_string = window.atob(base64);
	} 
	catch (err) 
	{
		console.log(err);
		return null;
	}		
    
    let len = binary_string.length;
    bytes = new Uint8Array(len);
	
    for (let i = 0; i < len; i++) 
	{
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}





export function getextensionObj({name})
{
	let ext = name.split('.');
	if(ext.length > 1) { ext = ext[ext.length - 1]; }	
	
	let typeF = null;
	if(new RegExp( /fbx/ ,'i').test( ext )){ typeF = 'fbx'; }
	else if(new RegExp( /3ds/ ,'i').test( ext )){ typeF = '3ds'; }
	else if(new RegExp( /obj/ ,'i').test( ext )){ typeF = 'obj'; }
	else if(new RegExp( /dae/ ,'i').test( ext )){ typeF = 'dae'; }
	else if(new RegExp( /glb/ ,'i').test( ext )){ typeF = 'glb'; }
	else if(new RegExp( /gltf/ ,'i').test( ext )){ typeF = 'gltf'; }
	
	return typeF;
}

function promiseGlb(data)
{
	startSettingObj({obj: data.scene});
}


export function parseObj_1(params)
{
	deleteObj();

	if(!params.data) { errInf({show: true}); return; }
	
	dataObj = params.data;
	
	let obj = null;

	let typeF = getextensionObj({name: Build.dataFbx.modelName});	
	if(!typeF) { console.log('extension is not correct'); return; }
	
	try 
	{
		if(typeF == 'fbx') { obj = new FBXLoader().parse( params.data ); }
		if(typeF == '3ds') { obj = new TDSLoader().parse( params.data ); }
		if(typeF == 'obj') { obj = new OBJLoader().parse( new TextDecoder("utf-8").decode(params.data) ); }
		if(typeF == 'dae') { obj = new ColladaLoader().parse(new TextDecoder("utf-8").decode(params.data)).scene; }
		if(typeF == 'gltf' || typeF == 'glb') { obj = new GLTFLoader().parse(params.data, '', promiseGlb); return }
	} 
	catch (err) 
	{
		console.log(err);
		errInf({show: true}); return;
	}	

	
	startSettingObj({typeF, obj});	
}

function startSettingObj({typeF = '', obj})
{	
	if(!obj) { errInf({show: true}); return; }
	
	
	if(typeF == '3ds') 
	{ 
		if(obj.children.length == 1) { obj.children[0].rotation.set(Math.PI/2+Math.PI,0,Math.PI); }
	}
	else if(typeF == 'fbx' || typeF == 'obj')
	{
		if(obj.children.length == 1) obj.children[0].rotation.set(0,0,0);
	}

	obj.scale.set(1, 1, 1);
	
	if(1==1)
	{
		obj.traverse(function(child)
		{
			let s = child.scale.clone();
			
			//console.log('----NO', s , child.name);
			
			if(child.geometry) 
			{ 
				let attrP = child.geometry.attributes.position.array;
				
				//console.log('----', s);
				
				for(let i = 0; i < attrP.length; i += 3)
				{
					attrP[i + 0] *= s.x;
					attrP[i + 1] *= s.y;	
					attrP[i + 2] *= s.z;
				}				
				
				child.geometry.attributes.position.needsUpdate = true;		
			}
			
			if(!child.geometry && 1==2) 
			{
				let pos = child.position.clone();
				child.position.set(child.position.x/s.x, child.position.y/s.y, child.position.z/s.z);
				//console.log('----NO', s , pos, child.position);
			}
			
			child.scale.set(1, 1, 1);
		});
		
	}


	let count = {g: 0, m: 0};
	
	new RGBELoader().setDataType( THREE.UnsignedByteType ).load( 'textures/studio_small_03_1k.hdr', function ( texture ) 
	{

			let envMap = Build.pmremGenerator.fromEquirectangular( texture ).texture;

			//scene.background = envMap;
			Build.scene.environment = envMap;

			texture.dispose();
			Build.pmremGenerator.dispose();

			
			let arrM = [];
			Build.infProg.scene = obj;			
			
			optimizeGeomModelToFinish();
			
			
			obj.traverse( function ( child ) 
			{
				if (child instanceof THREE.Mesh) 
				{
					if (child.geometry) 
					{ 
						count.g += 1; 
					}
					
					child.castShadow = true;	
					child.receiveShadow = true;					

					if (child.material)
					{
						let fs = child.geometry.groups.map(o => o.materialIndex);
						fs = [...new Set(fs)]; 					
						
						if(fs.length > 0)
						{
							for ( let i = 0; i < fs.length; i++ )
							{							
								let m2 = (Array.isArray(child.material)) ? child.material[fs[i]] : child.material;
								arrM[arrM.length] = {o: child, m: m2.clone(), ind: fs[i]};
							}
						}
						else
						{
							arrM[arrM.length] = {o: child, m: child.material.clone(), ind: 0};
							
							if(typeF == 'obj') 
							{
								arrM[arrM.length-1].m.name = child.name+'Mat';
							}						
						}
						
						
						disposeNode(child);
					}					
				}
				
			});	
			
			//console.log(arrM);
			
			for ( let i = 0; i < arrM.length; i++ )
			{
				let o = arrM[i].o;
				let m = arrM[i].m;
				let ind = arrM[i].ind;
				
				if(!m) continue;
				
				let map = null;  
				if(m.map && m.map.image) 
				{ 
					map = m.map;
					map.name = 'img-'+ i;
				}
				
				m = new THREE.MeshStandardMaterial({ color: m.color, transparent: true, map: map, lightMap: m.lightMap, name: m.name, side: THREE.DoubleSide });
				//m = new THREE.MeshStandardMaterial({ color: m.color, transparent: true, map: map, lightMap: m.lightMap, name: m.name });
				
				m.userData.type = 'matte';
				m.userData.name = m.name;
				m.userData.index = ind;
				m.userData.meshName = (o.geometry.name.length === 0 || !o.geometry.name.trim()) ? o.name : o.geometry.name;
											

				if(o.material instanceof Array){ o.material[ind] = m; }
				else { o.material = m; }
				
				Build.infProg.meshs.push({m, o, gclone: o.geometry.clone(), class: {}});  
			}
			
			//let arrMat = Build.infProg.meshs.map(item => item.m);
			
			for(let i = 0; i < Build.infProg.meshs.length; i++)
			{
				let m = Build.infProg.meshs[i].m;
				SettMat.setNewMaterial({material: m, name: m.name});
			}			
			
			Build.scene.add( obj );			

			getBoundObject_1({obj: obj});
			fitCameraToObject({obj: Build.infProg.boundBox, start: true});						
	
			Build.infProg.class.listMesh.creatList({arr: Build.infProg.meshs});
			

			Build.infProg.scene = obj;
			

			
			let elNameObj = document.querySelector('[nameId="itemNameObj"]');		
			elNameObj.innerText = Build.dataFbx.modelName;

	
			Build.infProg.class.rPanel.elem.trnInput.getStartCountTr();			
			Build.infProg.class.rPanel.elem.size.clearInput();
			Build.infProg.class.rPanel.elem.size.setSize();		
			Build.infProg.class.rPanel.elem.rot.setRotate();
			Build.infProg.class.rPanel.elem.btnImport.actBtn();
			Build.infProg.class.modalW.elem.tut.show();
			Build.setAxisHelper();			
			
			Build.render();
			
			Build.infProg.class.modalW.elem.loading.hide();
	});		
	
	
}

//phpMod({arr: [12, 22, 55], obj: 22, geom: {attr: {v: [new THREE.Vector3(4, 5, -7), new THREE.Vector3(), new THREE.Vector3(2, -1, 3)]}} });

async function phpMod({arr, obj, geom}) 
{
	let url = 'save-local-file/modGeom.php';
	
	//arr = arr.map(o => JSON.stringify( o ));
	arr = JSON.stringify( arr );
	obj = JSON.stringify( obj );
	geom = JSON.stringify( geom );
	
	let response = await fetch(url, 
	{
		method: 'POST',
		body: '&arr='+encodeURIComponent(arr)+'&obj='+encodeURIComponent(obj)+'&geom='+encodeURIComponent(geom), 
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },				
	});
	let json = await response.json();
	if(json.error) return null;	
	
	console.log(888, json);
}	



async function loadObjFromUrl()
{
	let url = 'models/multi-mat.fbx';
	let response = await fetch(url, { method: 'POST' });
	let arrayBuffer = await response.arrayBuffer();
	
	parseObj_1({data: arrayBuffer});
}



function deleteObj()
{		
	
	if(Build.infProg.boundBox)
	{
		disposeNode(Build.infProg.boundBox);		
		Build.scene.remove(Build.infProg.boundBox);
		Build.infProg.boundBox = null;
	}


	if(Build.infProg.scene)
	{
		let obj = Build.infProg.scene;

		obj.traverse( function ( child ) 
		{
			disposeNode(child);
		});

		Build.infProg.scene = null;
		Build.scene.remove(obj);		
	}

	Build.infProg.originalSize = null;
	Build.infProg.unit = 1;
	Build.infProg.modifScale = 1;
	Build.infProg.axisYZ = 0;
	Build.infProg.boxRadius = null;
	console.log(Build.infProg.meshs);
	Build.infProg.class.listMesh.deleteList();
	Build.infProg.meshs = [];
	
	document.body.querySelector('[nameId="itemNameObj"]').innerText = '';
	Build.infProg.class.rPanel.elem.trnInput.divTr_1.innerText = 0;
	Build.infProg.class.rPanel.elem.size.clearInput();
	Build.infProg.class.rPanel.elem.rot.reset();
	Build.infProg.class.rPanel.elem.gmod.reset();
	Build.infProg.class.rPanel.elem.btnImport.reset();
	document.body.querySelector('[nameId="wrap_materials"]').innerHTML = '';

	
	Build.infProg.class.modalW.elem.err.hide();
	document.body.querySelector('[nameId="wrap_inf_sizes_1"]').style.display = 'none';
}


export function disposeNode(node) 
{
	if (node.geometry) { node.geometry.dispose(); }
	
	if (node.material) 
	{
		let materialArray = [];
		
		if(node.material instanceof Array) { materialArray = node.material; }
		else { materialArray = [node.material]; }
		
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
}



export function getBoundObject_1({obj})
{
	if(!obj) return;
	
	if(Build.infProg.boundBox)
	{
		disposeNode(Build.infProg.boundBox);		
		Build.scene.remove(Build.infProg.boundBox);
	}
	
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
	

	
	let centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), ((bound.max.y - bound.min.y)/2 + bound.min.y), ((bound.max.z - bound.min.z)/2 + bound.min.z));
	let x = (bound.max.x - bound.min.x);
	let y = (bound.max.y - bound.min.y);
	let z = (bound.max.z - bound.min.z);			

	
	let q = new THREE.Quaternion().setFromEuler(rotO);
	obj.position.sub(centerPos);
	obj.position.applyQuaternion(q);
	//obj.position.add(centerPos);
	obj.quaternion.copy(q);
	
	obj.updateMatrixWorld(true);
	
	if(1==1)
	{
		let geometry = new THREE.BoxGeometry(x, y, z);	
		let material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent: true, opacity: 0.5} );
		let cube = new THREE.Mesh( geometry, material );
		//cube.position.copy(centerPos);
		cube.rotation.copy(rotO);
		cube.visible = false;
		Build.scene.add( cube );

		Build.infProg.boundBox = cube;
	}


	x = Math.round(x*100)/100;
	y = Math.round(y*100)/100;
	z = Math.round(z*100)/100;	
	
	Build.dataFbx.modelSize = {x: x, y: y, z: z};
	
	if(!Build.infProg.originalSize) { Build.infProg.originalSize = {x: x, y: y, z: z}; }
	
	Build.render();
}


export function fitCameraToObject(params)
{
	let obj = params.obj; 
	
	if(!obj) return;
	
	let camera = Build.camera;

	let v = [];
	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();	

	let bound = obj.geometry.boundingBox;
	
	v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );

	v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );
	v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );			


	{
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
		
		
		let center = new THREE.Vector3((bound.max.x - bound.min.x)/2 + bound.min.x, (bound.max.y - bound.min.y)/2 + bound.min.y, (bound.max.z - bound.min.z)/2 + bound.min.z);
						
		let maxSize = Math.max( bound.max.x - bound.min.x, bound.max.y - bound.min.y, bound.max.z - bound.min.z );  
		let dir = null;	

		
		if(params.start)
		{
			let radius = maxSize * 2;
			camera.position.x = radius * Math.sin( -75 * Math.PI / 360 );
			camera.position.y = radius * Math.sin( 45 * Math.PI / 360 );
			camera.position.z = radius * Math.cos( -75 * Math.PI / 360 );			
			
			camera.position.y += Build.infProg.boundBox.position.x;		
			camera.lookAt(Build.infProg.boundBox.position);			
		}
		else if(params.front)
		{	
			dir = obj.getWorldDirection().multiplyScalar( maxSize * 2 );	
			camera.position.copy(center).add(dir);
			camera.lookAt(center);			
		}			
		else
		{
			camera.lookAt(center);		
			dir = center.clone().sub( camera.position ).normalize().multiplyScalar( maxSize * 2 );	
			camera.position.copy(center).sub(dir);			
		}
		
		Build.infProg.boxRadius = camera.position.distanceTo(center);
		
		//controls.target.copy( center );
		Build.infProg.camera3D.userData.camera.d3.targetO.position.copy( center );
	}
	
	
	camera.updateProjectionMatrix();
	
	Build.render();
}



export function errInf({show})
{
	Build.infProg.class.modalW.elem.loading.hide();
	
	if(show) Build.infProg.class.modalW.elem.err.show();
	else Build.infProg.class.modalW.elem.err.hide();
}


export function bytesToSize(bytes) 
{
	let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Byte';
	//var index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	let index = 2;	// MB
	
	return Math.round(bytes / Math.pow(1024, index), 2);
}








