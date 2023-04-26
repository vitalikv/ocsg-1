

class DivLevelVisible 
{
	checkBox1;	// показать все этажи
	checkBox2;	// прозрачные стены
	
	constructor()
	{
		const elBlock = document.querySelector('[nameId="wrap_level"]');
		this.checkBox1 = elBlock.querySelector('[nameId="type_cam_vis_1"]');
		this.checkBox2 = elBlock.querySelector('[nameId="type_cam_vis_2"]');
		
		this.checkBox1.children[0].style.background = (infProject.jsonProject.showAllLevel) ? 'rgb(213, 213, 213)' : 'none';
		this.checkBox2.children[0].style.background = (infProject.jsonProject.wallTransparent) ? 'rgb(213, 213, 213)' : 'none';

		this.initEvent();
	}
	
	initEvent()
	{
		this.checkBox1.onmousedown = () => { changeCheckBoxLevelVis({elem: this.checkBox1, type: 'allLevel'}); }
		this.checkBox2.onmousedown = () => { changeCheckBoxLevelVis({elem: this.checkBox2, type: 'wallTransparent'}); }	
	}
}







