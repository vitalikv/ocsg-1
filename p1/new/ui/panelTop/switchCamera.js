

class SwitchCamera 
{
	btnCam2D;
	btnCam3D;
	btnCamFirst;
	
	
	constructor()
	{
		this.btnCam2D = document.querySelector('[nameId="butt_camera_2D"]');
		this.btnCam3D = document.querySelector('[nameId="butt_camera_3D"]');
		this.btnCamFirst = document.querySelector('[nameId="butt_cam_walk"]');
		
		this.initBtnEvent();	 	
	}
	
	initBtnEvent()
	{
		this.btnCam2D.onmousedown = () => { this.clickOnBtn2D3D('2D'); }
		this.btnCam3D.onmousedown = () => { this.clickOnBtn2D3D('3D'); }
		this.btnCamFirst.onmousedown = () => { myCameraOrbit.switchFlyFirst(); }
	}
		
	// меняем камеру 2D или 3D
	clickOnBtn2D3D(cam)
	{
		this.btnCam2D.style.display = 'none';
		this.btnCam3D.style.display = 'none';

		if(cam === '2D') 
		{
			this.btnCam3D.style.display = '';
			this.btnCamFirst.style.display = 'none';
		}	
		
		if(cam === '3D') 
		{
			this.btnCam2D.style.display = '';
			this.btnCamFirst.style.display = '';
		}
		
		
		myCameraOrbit.setActiveCam({cam});		
		
		myPanelR.myTabsR.upCurrentTab();	// обновляем текущую вкладку, например прячем в 3D вкладку 'Дом'
		this.showHideDivTypeCam();	
	}
	
	// прячем/показываем блок с настройками отображения стен и этажей
	showHideDivTypeCam()
	{
		if(myCameraOrbit.activeCam.userData.isCam2D) myPanelR.myLevelVisible.showHideBlock({show: false});
		if(myCameraOrbit.activeCam.userData.isCam3D) myPanelR.myLevelVisible.showHideBlock({show: true});
	}	
}







