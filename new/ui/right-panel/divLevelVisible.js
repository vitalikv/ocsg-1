

class DivLevelVisible 
{
	showAllLevel;
	wallTransparent;
	container;
	checkBox1;	// input показать все этажи
	checkBox2;	// input прозрачные стены
	
	constructor({showAllLevel = false, wallTransparent = true})
	{
		this.showAllLevel = showAllLevel;
		this.wallTransparent = wallTransparent;
		
		const elBlock = document.querySelector('[nameId="wrap_level"]');
		this.container = elBlock.querySelector('[nameId="div_type_cam_vis"]');
		
		this.checkBox1 = this.container.querySelector('[nameId="type_cam_vis_1"]');
		this.checkBox2 = this.container.querySelector('[nameId="type_cam_vis_2"]');

		this.init();
		this.initEvent();
	}
	
	init()
	{
		this.setCheckBox({type: 'allLevel'});
		this.setCheckBox({type: 'wallTransparent'});
	}
	
	// кликнули на checkBox
	initEvent()
	{
		this.checkBox1.onmousedown = () => { this.switchShowAllLevel(); }
		this.checkBox2.onmousedown = () => { this.switchWallTransparent(); }	
	}
	
	switchShowAllLevel({value} = {value: undefined})
	{
		this.showAllLevel = (value !== undefined) ? value : !this.showAllLevel;
		this.setCheckBox({type: 'allLevel'});		
	}

	switchWallTransparent({value} = {value: undefined})
	{
		this.wallTransparent = (value !== undefined) ? value : !this.wallTransparent;
		this.setCheckBox({type: 'wallTransparent'});
	}
	
	setCheckBox({type})
	{
		if(type === 'allLevel')
		{
			const elem = this.checkBox1;
			elem.children[0].style.background = (this.showAllLevel) ? 'rgb(213, 213, 213)' : 'none';
			
			changeVisibleLevels();		
		}
		
		if(type === 'wallTransparent')
		{
			const elem = this.checkBox2;
			elem.children[0].style.background = (this.wallTransparent) ? 'rgb(213, 213, 213)' : 'none';
			
			if(camera === camera3D)
			{
				getInfoRenderWall();
				if(this.wallTransparent && camera3D.userData.camera.type === 'fly') wallAfterRender_2();
				else showAllWallRender();						
			}
		}
	}	
}







