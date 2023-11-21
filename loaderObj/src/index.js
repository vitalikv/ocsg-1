

import * as THREE from '../node_modules/three/build/three.module.js';

import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { OutlinePass } from './m/OutlinePass.js';

import * as MSV from './mouseClick.js';
import * as MVC from './moveCamera.js';
import * as SendD from './sendData.js';
import * as Screen from './screenshot.js';
import * as Pcolor from './pickerColor.js';
import './exportCollada.js';
import * as Sbox from './selectBox.js';
import * as NEdge from './newEdge.js';
import * as Lobj from './loaderObj.js';
import './inputUpload.js';
import * as Mwind from './ui/modal-windows.js';
import * as Rpanel from './ui/right-panel/right-panel.js';
import { ListMesh } from './ui/right-panel/list-child/list-mesh.js';

import {testMatUI} from './test-mat-ui.js';


export let renderer;
export let container;
export let scene = null;
export let composer, renderPass, fxaaPass, outlinePass;
export let camera;
export let pmremGenerator = null;



export let infProg = {};
infProg.scene = null;
infProg.unit = 1;
infProg.modifScale = 1;
infProg.axisYZ = 0;
infProg.boundBox = null;
infProg.originalSize = null;
infProg.boxRadius = null;
infProg.meshs = [];
infProg.svg = {};
infProg.svg.matreials = [];
infProg.dirLight = null;
infProg.rayhit = null;
infProg.camera = null;
infProg.camera3D = null;
infProg.mouse = {};
infProg.mouse.click = {};
infProg.mouse.click.type = '';
infProg.mouse.pos = new THREE.Vector2();
infProg.planeMath = null;
infProg.gridHelper = null;
infProg.axesHelper = null;
infProg.settings = {};
infProg.settings.materials = [];
infProg.class = {};
infProg.limitTr = 200000;


export let dataFbx = 
{
	"modelName": "name",
	"modelFile": "",
	"previewFile": "",
	"modelSize": {x: 0, y: 0, z: 0},
	"scale": 1, 
	"rotate": {x: 0, y: 0, z: 0},
	"materials": 
	[                // измененные параметры материалов
		{
			"meshName": "shkaf_back_side", 		// имя меша
			"color": "bba4a4",            		// цвет
			"type": "glass",            		// применённый цвет
			"lotId": 1090,            			// применённый лот
			"uvScale": {x: 1, y: 1},        // скейл текстуры, если изменён
			"uvOffset": {x: 0, y: 0}        // смещение текстуры, если изменён
		}
	]
};



function onWindowResize() {

	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.clientWidth, container.clientHeight );
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}



export function render() {

	//renderer.render( scene, camera );
	composer.render();
}


export async function init() {

	//container = document.createElement( 'div' );
	//document.body.appendChild( container );
	//container.style.position = 'fixed';
	//container.style.width = '100%';
	//container.style.height = '100%';
	//container.style.top = 0;
	//container.style.left = 0;		
	document.body.style.zoom = 1;
	
	container = document.querySelector('[nameId="containerScene"]');	

	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	
	
	infProg.gridHelper = new THREE.GridHelper( 10, 10 );
	scene.add( infProg.gridHelper );	

	addLights()

	camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 0.01, 999999 );
	camera.position.set( 0, 1, 5 );
	infProg.camera = camera;
	
	infProg.camera3D = camera;
	
	infProg.camera3D.userData.camera = {};
	infProg.camera3D.userData.camera.save = {};
	infProg.camera3D.userData.camera.save.pos = new THREE.Vector3();
	infProg.camera3D.userData.camera.save.radius = 0;

	infProg.camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
	infProg.camera3D.userData.camera.d3.targetO = MVC.createCenterCamObj();	
	infProg.camera3D.userData.camera.type = 'fly';
	infProg.camera3D.userData.camera.height = 0;
	infProg.camera3D.userData.camera.startProject = true;
	infProg.camera3D.userData.camera.click = {};
	infProg.camera3D.userData.camera.click.pos = new THREE.Vector3();
	

	renderer = new THREE.WebGLRenderer( { logarithmicDepthBuffer: true, antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight );
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;
	//renderer.toneMapping = THREE.ReinhardToneMapping;
	//renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	//renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	
	container.appendChild( renderer.domElement );
	
	//pmremGenerator = new THREE.PMREMGenerator( renderer );
	//pmremGenerator.compileEquirectangularShader();	

	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	renderer.domElement.style.outline = 'none';

	initComposerRender();

	Sbox.initSelectBox({container, camera, scene});
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	container.addEventListener('contextmenu', function(event) { event.preventDefault() });
	container.addEventListener('mousedown', MSV.onDocumentMouseDown, false );
	container.addEventListener('mousemove', MSV.onDocumentMouseMove, false );
	container.addEventListener('mouseup', MSV.onDocumentMouseUp, false );
	container.addEventListener('wheel', MVC.onDocumentMouseWheel, false);		


	infProg.class.modalW = new Mwind.ModalWind();
	infProg.class.rPanel = new Rpanel.RightPanel();
	
	createPlaneMath();
	MVC.startPosCamera3D({radious: 10, theta: 90, phi: 35});	
	
	infProg.class.listMesh = new ListMesh();
	//new Sbox.SelectBoxDiv({container});
	
	//NEdge.initEdgeExample();	
	
	infProg.picker = new Pcolor.PickerCn();
 
	
	infProg.axesHelper = new THREE.AxesHelper( 10000 );
	infProg.axesHelper.visible = false;
	scene.add( infProg.axesHelper );
	
	testMatUI();
	
	render();	

	if( SendD.isCheckExsistFunction(window.parent['UIInvokeFunction']) ) 
	{ 
		console.log('%cWebGL->Unity', 'color: #8500ff', 'LoaderReady');
		window.parent.UIInvokeFunction('LoaderReady'); 
	}	
}

function addLights()
{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );	
}



function initComposerRender() 
{
	composer = new EffectComposer(renderer);
	composer.renderer.outputEncoding = THREE.sRGBEncoding;
	//composer.renderer.gammaFactor = 2.2;
	composer.setSize(container.clientWidth, container.clientHeight);
	//composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;		закомитил, чтобы цветовая гамма соответсвовала ocsg
	//composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;

	renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);


	outlinePass = new OutlinePass(new THREE.Vector2(container.offsetWidth, container.offsetHeight), scene, camera);
	composer.addPass(outlinePass);
	outlinePass.overlayMaterial.blending = THREE.CustomBlending; 	// важно
	outlinePass.visibleEdgeColor.set(0x00ff00);
	outlinePass.hiddenEdgeColor.set(0x00ff00);
	outlinePass.edgeStrength = Number(5); // сила/прочность
	outlinePass.edgeThickness = Number(0.01); // толщина
	outlinePass.selectedObjects = [];
	
	if(1==1)
	{
		fxaaPass = new ShaderPass(FXAAShader);
		let pixelRatio = renderer.getPixelRatio();
		fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.offsetWidth * pixelRatio);
		fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.offsetHeight * pixelRatio);
		//fxaaPass.material.uniforms[ 'tDiffuse' ].value.encoding = THREE.sRGBEncoding;
		composer.addPass(fxaaPass);		
	}	
}






function PreLoadModel()
{
	console.log('unity->WebGL PreLoadModel()');
}



window.LoaderObjInvokeFunction = LoaderObjInvokeFunction;

function LoaderObjInvokeFunction(nameFunct, params)
{
	if(nameFunct == 'ExitLoaderObj')
	{
		infProg.class.modalW.elem.exit.show();		
	}	
	
	if(nameFunct == 'Language')
	{
				
	}		
}




function createPlaneMath()
{
	let geometry = new THREE.PlaneGeometry( 10000, 10000 );
	
	let material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	let planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	infProg.planeMath = planeMath;
}



export function setAxisHelper()
{
	if(!infProg.scene)
	{
		infProg.axesHelper.visible = false;
		return;
	}
	
	let obj = infProg.scene;
	
	infProg.boundBox.rotation.copy(obj.rotation);
	
	infProg.axesHelper.rotation.copy(obj.rotation);
	infProg.axesHelper.position.copy(infProg.boundBox.position);
	infProg.axesHelper.visible = true;	
	
	render();
}


//----------- Math			
export function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}



export function quaternionDirection(dir1)
{
	let mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math

function isNumeric(n) 
{   
   return !isNaN(parseFloat(n)) && isFinite(n);   
}

export function checkNumberInput(cdm)
{
	let value = cdm.value;
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!isNumeric(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } // см
		else if(cdm.unit == 0.001) { value /= 1000; } // мм
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}


document.addEventListener("DOMContentLoaded", init);





