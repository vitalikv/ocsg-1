
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';






// screenshot
export function saveAsImage(params) 
{ 
	Build.dataFbx.previewFile = '';
	
	try 
	{		
		let camera3D = Build.infProg.camera3D;
		let camInf = {pos: camera3D.position.clone(), rot: camera3D.rotation.clone()};
		
		let radius = Build.infProg.boxRadius * 0.75;
		camera3D.position.x = radius * Math.sin( -75 * Math.PI / 360 );
		camera3D.position.y = radius * Math.sin( 45 * Math.PI / 360 );
		camera3D.position.z = radius * Math.cos( -75 * Math.PI / 360 );			
		
		camera3D.position.y += Build.infProg.boundBox.position.x;		
		camera3D.lookAt(Build.infProg.boundBox.position);
		
		Build.infProg.gridHelper.visible = false;
		Build.infProg.axesHelper.visible = false;
		Build.renderer.setSize( 700, 700 * (Build.container.clientHeight/Build.container.clientWidth) );
		Build.renderer.render( Build.scene, Build.infProg.camera3D );
		
		
		//let strMime = "image/jpeg";
		//let imgData = Build.renderer.domElement.toDataURL(strMime, 0.75);
		
		let imgData = Build.renderer.domElement.toDataURL('image/png');		
		
		let img = new Image();
		img.src = imgData;
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		
		img.onload = function() 
		{
			canvas.height = 300;
			canvas.width = 300;		
			
			context.fillStyle = '#fff';
			context.fillRect(0, 0, canvas.width, canvas.height);		
			
			let sourceX = (img.width - (img.width * (img.height/img.width))) / 2;
			let sourceY = 0;
			let sourceWidth = img.width - sourceX *2;
			let sourceHeight = img.height;
			
			let width = 300;
			let height = 300;			
			let x = canvas.width / 2 - width / 2;
			let y = canvas.height / 2 - height / 2;
			//console.log( sourceX, sourceY, sourceWidth, sourceHeight, '--------', img.width, img.height );	
			
			context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);			
			
			let imgData = canvas.toDataURL('image/png');	 			
			document.querySelector('[nameId="'+params.nameid+'"]').src = imgData;
			
			Build.dataFbx.previewFile = imgData;
		};

	
		camera3D.position.copy(camInf.pos);
		camera3D.rotation.copy(camInf.rot);
		Build.infProg.gridHelper.visible = true;
		Build.infProg.axesHelper.visible = true;
		//renderer.antialias = false;
		Build.renderer.setSize( Build.container.clientWidth, Build.container.clientHeight );
		Build.renderer.render( Build.scene, Build.infProg.camera3D );				
 
		if(params.open) { openFileImage(imgData.replace(strMime, "image/octet-stream"), "screenshot.jpg"); }
		if(params.binary) { return atob(imgData.split('base64,')[1]); }		
		if(params.src) { return imgData; }
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}





// открыть или сохранить screenshot
let openFileImage = function (strData, filename) 
{
	let link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{		
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
}   


