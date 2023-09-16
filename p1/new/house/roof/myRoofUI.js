

class MyRoofUI 
{
	container;
	btnCopy;
	
	constructor()
	{
		this.container = document.querySelector('[nameId="bl_roof_3d"]');

		this.btnCopy = this.container.querySelector('[nameId="btn_copy_roof"]');

		this.initEvent();
	}
	
	initEvent()
	{
		this.btnCopy.onmousedown = () => { myHouse.myRoofAction.copyRoof(); }		
	}

	
	render()
	{
		renderCamera();
	}
}






