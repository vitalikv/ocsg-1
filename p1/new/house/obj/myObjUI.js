

class MyObjUI 
{
	container;
	btnCopy;
	
	constructor()
	{
		this.container = document.querySelector('[nameId="bl_object_3d"]');

		this.btnCopy = this.container.querySelector('[nameId="button_copy_obj"]');

		this.initEvent();
	}
	
	initEvent()
	{
		this.btnCopy.onmousedown = () => { myHouse.myObjAction.copyObj(); }		
	}
}






