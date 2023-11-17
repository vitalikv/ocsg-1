
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';




export class UIsvgLine
{
	constructor({container})
	{
		this.elem = null;		
		this.arr = [];
		this.coord = {x:0, y:0};
		
		this.init({container});
	}
	
	init({container})
	{
		let div = document.createElement('div');
		div.innerHTML = this.html();
		div = div.children[0];
		container.prepend(div);

		this.elem = div;
		this.arr = this.crSvg();
	}
	
	html()
	{
		let html =
		`<svg id="containerSvg" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute;">
		</svg>`;
		
		return html;
	}

	
	crSvg()
	{
		let arr = [];
		
		for(let i = 0; i < 4; i++)
		{
			arr[i] = crLine({container: this.elem});
		}
		
		function crLine({container})
		{
			let line  = document.createElementNS('http://www.w3.org/2000/svg', 'line');

			line.setAttribute("stroke-width", "2px");
			line.setAttribute("stroke", "#269CFF");
			//line.setAttribute("stroke", "rgb(255, 162, 23)");
			//line.setAttribute("display", "none");
			
			container.append(line);	
			//line.remove();
			
			return line;
		}
		
		return arr;
	}
	
	
	setSvg({id})
	{
		this.resetLineCoord();
		
		if(id === 0) this.step1();
		if(id === 1) this.step2();
		if(id === 2) this.step3();
		if(id === 3) this.step4();
	}
	
	
	step1()
	{
		let rect = this.elem.getBoundingClientRect();
		let x1 = rect.width - 25;
		let x2 = rect.right;
		
		let el1 = Build.infProg.class.rPanel.elem.rot.elem;
		let rect1 = el1.getBoundingClientRect();
		let posY1 = rect1.top + rect1.height/2;
		this.setLineCoord({line: this.arr[0], x1, y1: posY1, x2, y2: posY1});
		
		
		let el2 = Build.infProg.class.rPanel.elem.size.elem;
		let rect2 = el2.getBoundingClientRect();
		let posY2 = rect2.top + rect2.height/2;	
		this.setLineCoord({line: this.arr[1], x1, y1: posY2, x2, y2: posY2});
		
		this.setLineCoord({line: this.arr[2], x1, y1: posY1, x2: x1, y2: posY2});
		
		let posY3 = (posY2 - posY1)/2 + posY1;
		this.setLineCoord({line: this.arr[3], x1, y1: posY3, x2: x1 - 25, y2: posY3});
		
		
		this.coord = {x: x1 - 25, y: posY3};		
	}
	
	
	step2()
	{
		let rect = this.elem.getBoundingClientRect();
		let x1 = rect.width - 25;
		let x2 = rect.right;
		
		let elRot = Build.infProg.class.rPanel.elem.trnInput.elem;
		let rect1 = elRot.getBoundingClientRect();
		let posY1 = rect1.top + rect1.height/2;
		this.setLineCoord({line: this.arr[0], x1, y1: posY1, x2, y2: posY1});
		
		
		let posY2 = 0;	
		if(Build.infProg.class.listMesh.arr.length > 0)
		{
			let el2 = Build.infProg.class.listMesh.arr[0].class.elem;
			let rect2 = el2.getBoundingClientRect();
			posY2 = rect2.top + rect2.height/2;				
			this.setLineCoord({line: this.arr[1], x1, y1: posY2, x2, y2: posY2});			
		}		
		
		this.setLineCoord({line: this.arr[2], x1, y1: posY1, x2: x1, y2: posY2});
		
		let posY3 = (posY2 - posY1)/2 + posY1;
		this.setLineCoord({line: this.arr[3], x1, y1: posY3, x2: x1 - 25, y2: posY3});
		
		
		this.coord = {x: x1 - 25, y: posY3};		
	}


	step3()
	{
		let rect = this.elem.getBoundingClientRect();
		let x1 = rect.width - 50;
		let x2 = rect.right;
		
			
		if(Build.infProg.class.listMesh.arr.length > 0)
		{
			let el2 = Build.infProg.class.listMesh.arr[0].class.elem;
			let rect2 = el2.getBoundingClientRect();
			let posY2 = rect2.top + rect2.height/2;				
			this.setLineCoord({line: this.arr[0], x1, y1: posY2, x2, y2: posY2});

			this.coord = {x: x1, y: posY2};
		}			
	}		

	
	step4()
	{
		let rect = this.elem.getBoundingClientRect();
		let x1 = rect.width - 50;
		let x2 = rect.right;
		
		let el2 = Build.infProg.class.rPanel.elem.btnImport.elem;	
		let rect2 = el2.getBoundingClientRect();
		let posY2 = rect2.top + rect2.height/2;				
		this.setLineCoord({line: this.arr[0], x1, y1: posY2, x2, y2: posY2});

		this.coord = {x: x1, y: posY2 - 50};
			
	}

	
	setLineCoord({line, x1, y1, x2, y2})
	{
		line.setAttribute("x1", x1);
		line.setAttribute("y1", y1);

		line.setAttribute("x2", x2);
		line.setAttribute("y2", y2);
	}		


	resetLineCoord()
	{
		for(let i = 0; i < this.arr.length; i++)
		{
			this.arr[i].setAttribute("x1", 0);
			this.arr[i].setAttribute("y1", 0);

			this.arr[i].setAttribute("x2", 0);
			this.arr[i].setAttribute("y2", 0);
		}		
	}	
}


