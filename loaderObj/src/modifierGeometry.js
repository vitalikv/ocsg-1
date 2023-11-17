import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as Lobj from './loaderObj.js';
import { simplifyMesh } from "./m/simplifyModifier.js";



export function optimizeGeomModel() 
{
	if(!Build.infProg.scene) return;
	
	if(1==2)
	{
		let hostname = document.location.hostname;
		let urlParams = new URLSearchParams(document.location.search);					
		
		let defF = true;
		if(urlParams.get('geom')){ defF = false; }		// http://test-webgl/loaderObj/src/?geom=true				
	}
	
	Build.infProg.class.modalW.elem.modgeom.show();

	//Lobj.disposeNode(Build.infProg.scene);
	//scene.remove(Build.infProg.scene);				

	//let obj = Build.infProg.scene.clone();
	let obj = Build.infProg.scene;
	
	let childs = [];
	let listName = [];
	obj.traverse(function(child) 
	{
		if (child.isMesh && child.geometry && child.geometry.attributes  && child.geometry.attributes.position) 
		{ 
			childs.push(child);
			listName.push(child.name);
		}		
	});
	
	Build.infProg.class.modalW.elem.modgeom.setListMesh({list: listName});
	
	let ratio = caclTr();
	
	function caclTr()
	{
		let triangles = 0;	
		for(let i = 0; i < childs.length; i++)
		{
			triangles += childs[i].geometry.attributes.position.count/3;
		}
		
		return 1 - (Build.infProg.limitTr - 5000)/triangles;
	}
	
	if(ratio <= 0)
	{
		Build.infProg.class.modalW.elem.modgeom.hide();
		return;
	}
	
	setTimeout(()=>
	{ 
		if(childs.length > 0) simplifyMesh({childs, childId: 0, ratio});		
	}, 100);
}


import { BufferGeometry, Geometry } from "../node_modules/three/build/three.module.js";

export function optimizeGeomModelToFinish() 
{
	if(!Build.infProg.scene) return;
	
	let obj = Build.infProg.scene;	
	
	obj.traverse(function(child) 
	{
		//if (child.isMesh && child.geometry && child.geometry instanceof BufferGeometry && child.geometry.attributes  && child.geometry.attributes.position) 
		if (child.isMesh && child.geometry && 1==2) 
		{ 			
			child.geometry.computeBoundingBox(); 	
			child.geometry.computeBoundingSphere();

			child.geometry.computeTangents();
			child.geometry.computeVertexNormals();			
		}

		if (child.isMesh && child.geometry && child.geometry instanceof BufferGeometry && child.geometry.attributes  && child.geometry.attributes.position) 
		{ 			
			child.geometry.dispose();

			let geometry = new Geometry().fromBufferGeometry(child.geometry);
			geometry.mergeVertices();
			//geometry.computeVertexNormals();
			//geometry.computeFaceNormals();
			
			child.geometry = new BufferGeometry().fromGeometry(geometry);
			//child.geometry.computeBoundingBox(); 	
			//child.geometry.computeBoundingSphere();

			//child.geometry.computeTangents();
			//child.geometry.computeVertexNormals();			
		}		
	});		
}



