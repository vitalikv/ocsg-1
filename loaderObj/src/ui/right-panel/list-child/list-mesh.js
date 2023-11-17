
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';
import { ItemMesh } from './item-mesh.js';
import { addOutlineFromUI } from '../../../outline.js';



export class ListMesh
{
	constructor()
	{
		this.container = document.querySelector('[nameId="wrap_materials"]');
		this.arr = [];
	}
	
	
	creatList({arr})
	{
		this.arr = arr;
		this.deleteList();

		for(let i = 0; i < arr.length; i++)
		{
			let f = {};
			f.selectItemFromUI = this.selectItemFromUI.bind(this);
			
			let clI = new ItemMesh({container: this.container, obj: arr[i].o, material: arr[i].m, gclone: arr[i].gclone, f});
			
			arr[i].class = clI;
		}		
	}
	
	
	deleteList()
	{
		this.container.innerHTML = '';	
	}
	
	
	
	resetListModGeom()
	{		
		for(let i = 0; i < this.arr.length; i++) 
		{
			this.arr[i].class.clTrnGeom.defaultGeom();
			this.arr[i].class.clTrnGeom.updateCountTrn();
		}
	
		Build.infProg.class.rPanel.elem.trnInput.getCountTr_2();
		
		Build.render();		
	}
	
	
	updateListCountTrn()
	{
		for(let i = 0; i < this.arr.length; i++) 
		{
			this.arr[i].class.clTrnGeom.updateCountTrn();
		}
	}	

	defaultItemsBorder()
	{
		for(let i = 0; i < this.container.children.length; i++)
		{
			let item = this.container.children[i];			
			item.children[0].style.border = '1px solid #F0F0F0';
		}
	}

	selectItemFromUI({el, obj})
	{		
		this.defaultItemsBorder();
		el.children[0].style.border = '1px solid #269CFF';
		
		addOutlineFromUI({obj})		
	}
	
	selectItemFromScene({obj})
	{
		this.defaultItemsBorder();
		
		for(let i = 0; i < this.arr.length; i++) 
		{
			if(this.arr[i].o !== obj) continue;			
			this.arr[i].class.elem.children[0].style.border = '1px solid #269CFF';			
		}
	}	
}










