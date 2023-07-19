

class MyRoofUI 
{
	container;
	inputLength;
	inputHeight;
	inputWidth;
	btnCopy;
	
	constructor()
	{
		this.container = document.querySelector('[nameId="bl_roof_3d"]');
		this.inputLength = this.container.querySelector('[nameId="size-roof-length"]');
		this.inputHeight = this.container.querySelector('[nameId="size-roof-height"]');
		this.inputWidth = this.container.querySelector('[nameId="size-roof-width"]');

		this.btnCopy = this.container.querySelector('[nameId="btn_copy_roof"]');

		this.initEvent();
	}
	
	initEvent()
	{
		this.btnCopy.onmousedown = () => { myHouse.myRoofAction.copyRoof(); }
		
		const inputs = [this.inputLength, this.inputHeight, this.inputWidth];		
		inputs.forEach((input) => 
		{
			input.onfocus = (e) => 
			{
				e.preventDefault();
				e.stopPropagation();

				input.onkeydown = (e2) => { if (e2.code === 'Enter') this.changeInputsSizeUI({obj: myComposerRenderer.getOutlineObj()});; }
			}					
		});		
	}

	
	// при выборе объекта показываем размер объекта
	showInputsSizeUI({obj})
	{	
		const size = myHouse.myRoofAction.getObjSize({obj});			
		
		this.setSizeInput({size});
	}
	
	
	changeInputsSizeUI({obj})
	{
		if(!obj) return; 		
		
		const size = myHouse.myRoofAction.getObjSize({obj});	
		let x = size.x;
		let y = size.y;
		let z = size.z; 
		
		let x2 = this.inputLength.value;
		let y2 = this.inputHeight.value;
		let z2 = this.inputWidth.value; 

		x2 = x2.replace(",", ".");
		y2 = y2.replace(",", ".");
		z2 = z2.replace(",", ".");	
		
		x2 = (!isNumeric(x2)) ? x : Number(x2);
		y2 = (!isNumeric(y2)) ? y : Number(y2);
		z2 = (!isNumeric(z2)) ? z : Number(z2);		

		
		const limit = { x_min : 0.01, x_max : 100, y_min : 0.01, y_max : 100, z_min : 0.01, z_max : 100 };
		
		if(x2 < limit.x_min) { x2 = limit.x_min; }
		else if(x2 > limit.x_max) { x2 = limit.x_max; }
		
		if(y2 < limit.y_min) { y2 = limit.y_min; }
		else if(y2 > limit.y_max) { y2 = limit.y_max; }

		if(z2 < limit.z_min) { z2 = limit.z_min; }
		else if(z2 > limit.z_max) { z2 = limit.z_max; }			
		
		this.setSizeInput({size: new THREE.Vector3(x2, y2, z2)}) 
		
		
		myHouse.myRoofAction.setObjSize({obj, size: new THREE.Vector3(x2, y2, z2)});
		myHouse.myRoofCSG.updateCgsRoof();
		myHouse.myRoofAction.upDateTextureRoof({obj})	
		myToolPG.activeTool({obj});
		//if(myCameraOrbit.activeCam.userData.isCam2D) showSvgSizeObj({obj: obj, boxCircle: true, getObjRoom: true, resetPos: true});
	
		this.render();		
	}
	
	// устанавливаем значения в inputs
	setSizeInput({size})
	{
		this.inputLength.value = Math.round(size.x * 100) / 100;
		this.inputHeight.value = Math.round(size.y * 100) / 100;
		this.inputWidth.value = Math.round(size.z * 100) / 100;		
	}
	
	render()
	{
		renderCamera();
	}
}






