

import * as THREE from '../node_modules/three/build/three.module.js';

import * as Build from './index.js';
import * as Lobj from './loaderObj.js';


let input = initInputUpload();

export let arrInd = [];

function initInputUpload()
{
	let hostname = document.location.hostname;
	let urlParams = new URLSearchParams(document.location.search);		// http://test-webgl/loaderObj/src/?btn-unload=true		
	
	//if(hostname === 'test-webgl') {}
	//else if(urlParams.get('btn-unload')){}
	//else { return; }
		
	

	//<!--accept=".gltf, .glb, .fbx, .3ds, .obj, .dae, .mtl, image/png, image/jpeg"-->
	let html = 
	`<div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: #fff;">
		<div nameId="topP" style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">
			<input name="file" type="file" multiple="multiple" id="load_obj_1" style="opacity: 0; visibility: hidden; position: absolute;">
			
			<label for="load_obj_1" style="display: flex; align-items: center; justify-content: center; width: 278px; height: 64px; margin: 0; border-radius: 4px; background: #269CFF; cursor: pointer;">
				<div style="text-align: center;">
					<div style="font-size: 14px; color: #ffffff; line-height: 17px;">
					 	Upload 3D model
					</div>
					<div style="font-size: 10px; color: #D1D1D1; line-height: 12px;">
					 	FBX, DAE, 3DS, OBJ
					</div>
				</div>			
			</label>
		</div>
	</div>`;


	let div = document.createElement('div');
	div.innerHTML = html;
	let elem = div.firstChild;
	document.body.querySelector('[nameId="containerScene"]').append(elem);
	
	elem.querySelector('#load_obj_1').addEventListener('change', readURL, false);	
	
	return elem;
}


function readURL(e) 
{
	input.style.display = 'none';
	
	Build.dataFbx.modelName = '';	
	arrInd = [];
	
	if(this.files.length > 0) 
	{	
		const data = [];
		let pending = 0;

		for (let index = 0; index < this.files.length; ++index) 
		{
			const file = this.files[index];
			
			//console.log(file);
			let limitMB = 500;
			if(Lobj.bytesToSize(file.size) > limitMB) 
			{
				Build.infProg.class.modalW.elem.loading.hide();	
				Build.infProg.class.modalW.elem.err.show();
				return;
			}
			
			const reader = new FileReader();
			
			reader.onload = () => 
			{
				data[index] = {result: reader.result, name: file.name};
				--pending;
				
				if (pending == 0) 
				{
					Build.infProg.class.modalW.elem.loading.show();
					setTimeout(()=> { checkFiles({data}); }, 100);													
				}
			}
			
			if(file.name.indexOf( '.mtl' ) !== -1) { reader.readAsText(file); }
			else { reader.readAsDataURL(file); }
			
			++pending;
		}						
	}	
	
	
	function checkFiles({data})
	{
		let extCount = 0;
		
		for (let i = 0; i < data.length; ++i)
		{
			arrInd.push({name: data[i].name, result: data[i].result});
			
			if(Lobj.getextensionObj({name: data[i].name})) 
			{
				data[i].typeObj = true;			
				extCount++;
			}
		}
		
		console.log('arrInd', arrInd);
		
		if(extCount == 1)
		{			
			// parse obj
			for (let i = 0; i < data.length; ++i)
			{
				if(!data[i].typeObj) continue;
				Build.dataFbx.modelName = data[i].name;
				//console.log(data[i].result);
				Lobj.parseObj_1({data: Lobj.base64ToArrayBuffer(data[i].result) });				
				break;
			}
		}
		else 
		{ 
			console.log('extension is not correct', extCount);
			Build.infProg.class.modalW.elem.loading.hide();	
			Build.infProg.class.modalW.elem.err.show();			
		}
	}
	
};


	



