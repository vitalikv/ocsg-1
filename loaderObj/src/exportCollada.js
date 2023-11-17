
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as SendD from './sendData.js';
import { ColladaExporter } from "./m/ColladaExporter.js";
import { optimizeGeomModelToFinish } from './modifierGeometry.js'


const exporter = new ColladaExporter();

export async function exportCollada() 
{
	optimizeGeomModelToFinish();
	
	let result = exporter.parse( Build.infProg.scene, undefined, { version: '1.5.0', upAxis: 'Y_UP', unitName: 'millimeter', unitMeter: 0.001 } );
	
	//let fileObj = result.data;
	//fileObj = new Blob( [ result.data ], { type: 'data:application/csv;charset=utf-8' } );

	result.textures.forEach((res) => res.data = "data:image/"+res.ext+";filename:"+res.name+"."+res.ext+";base64," + res.data )
	
	document.querySelector('[nameId="wrap_preview"]').style.display = 'none';
	document.body.querySelector('[nameId="wrap_inf_sizes_1"]').style.display = 'none';

	if( SendD.isCheckExsistFunction(window.parent['EditorInvokeFunction']) ) 
	{ 
		let strBase64 = "data:application/octet-stream;filename:obj.dae;base64," + window.btoa(unescape(encodeURIComponent(result.data)));
		
		Build.dataFbx.modelFile = strBase64;
		Build.dataFbx.textures = [];
		result.textures.forEach((res, index) => Build.dataFbx.textures.push(res.data) )		
		let data = JSON.stringify(Build.dataFbx);		
		
		console.log('%cSENDING', 'color: #8500ff', 'Import' );
		window.parent.EditorInvokeFunction('ImportModel', data); 
		
		Build.dataFbx.modelFile = null;
		Build.dataFbx.textures = null;	

		Build.infProg.class.modalW.elem.import.hide();
	}
	else
	{
		if(1==1)
		{
			let strBase64 = await phpConvertBase65({file: result.data});
			
			console.log(result.textures);
			
			result.textures.forEach((res, index) => saveLocalImg({name: res.name+'.'+res.ext, data: res.data}) )
			
			saveLocalFile({file: strBase64});
		}
		else
		{
			let strBase64 = "data:application/octet-stream;filename:obj.dae;base64," + window.btoa(unescape(encodeURIComponent(result.data)));
			console.log(strBase64);
			
			let link = document.createElement('a');
			link.style.display = 'none';
			document.body.appendChild(link);
			link.href = strBase64;
			link.download = 'obj.dae';
			link.click();
			document.body.removeChild(link);			
		}
		
		Build.infProg.class.modalW.elem.import.hide();
	}
}


async function phpConvertBase65({file})
{
	let url = 'save-local-file/base64.php';			
	
	let response = await fetch(url, 
	{
		method: 'POST',
		body: 'str='+encodeURIComponent(file),
		headers: 
		{	
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
		},				
	});
	let base64 = await response.text();
	
	let objBase64 = "data:application/octet-stream;filename:obj.dae;base64," + base64;
	
	return objBase64;
}


async function saveLocalFile({file})
{
	let url = 'save-local-file/saveFile.php';			
	
	let response = await fetch(url, 
	{
		method: 'POST',
		body: 'str='+encodeURIComponent(file),
		headers: 
		{	
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
		},				
	});
	let inf = await response.text();
	
	console.log(inf);
}


async function saveLocalImg({name, data})
{
	let url = 'save-local-file/saveImg.php';			
	
	let response = await fetch(url, 
	{
		method: 'POST',
		body: 'name='+encodeURIComponent(name)+'&data='+encodeURIComponent(data),
		headers: 
		{	
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
		},				
	});
	let inf = await response.text();
	
	console.log(inf);
}



