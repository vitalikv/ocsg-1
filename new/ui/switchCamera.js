

class SwitchCamera 
{
	btnCam2D;
	btnCam3D;
	btnCamFirst;
	divLevelVisible;
	
	constructor()
	{
		this.btnCam2D = document.querySelector('[nameId="butt_camera_2D"]');
		this.btnCam3D = document.querySelector('[nameId="butt_camera_3D"]');
		this.btnCamFirst = document.querySelector('[nameId="butt_cam_walk"]');
		
		this.initBtnEvent();
		
		const elBlock = document.querySelector('[nameId="wrap_level"]');
		this.divLevelVisible = elBlock.querySelector('[nameId="div_type_cam_vis"]');		
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
		if(camera === cameraTop) this.divLevelVisible.style.display = 'none';
		if(camera === camera3D) this.divLevelVisible.style.display = '';
	}	
}







