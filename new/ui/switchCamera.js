

class SwitchCamera 
{
	btnCam2D;
	btnCam3D;
	btnCamFirst;
	divLevelVis;
	
	constructor()
	{
		this.btnCam2D = document.querySelector('[nameId="butt_camera_2D"]');
		this.btnCam3D = document.querySelector('[nameId="butt_camera_3D"]');
		this.btnCamFirst = document.querySelector('[nameId="butt_cam_walk"]');
		
		this.initBtnEvent();
		
		this.divLevelVis = divLevelVisible.container;	 	
	}
	
	initBtnEvent()
	{
		this.btnCam2D.onmousedown = () => { this.clickOnBtn2D3D(cameraTop); }
		this.btnCam3D.onmousedown = () => { this.clickOnBtn2D3D(camera3D); }
		this.btnCamFirst.onmousedown = () => { switchCamera3D(); }
	}
		
	// меняем камеру 2D или 3D
	clickOnBtn2D3D(cam)
	{
		this.btnCam2D.style.display = 'none';
		this.btnCam3D.style.display = 'none';

		if(cam === cameraTop) 
		{
			this.btnCam3D.style.display = '';
			this.btnCamFirst.style.display = 'none';
		}	
		
		if(cam === camera3D) 
		{
			this.btnCam2D.style.display = '';
			this.btnCamFirst.style.display = '';
		}
		
		changeCamera(cam);
		tabs.upCurrentTab();	// обновляем текущую вкладку, например прячем в 3D вкладку 'Дом'
		this.showHideDivTypeCam();	
	}
	
	// прячем/показываем блок с настройками отображения стен и этажей
	showHideDivTypeCam()
	{
		if(camera === cameraTop) this.divLevelVis.style.display = 'none';
		if(camera === camera3D) this.divLevelVis.style.display = '';
	}	
}







