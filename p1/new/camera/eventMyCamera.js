



// класс для камеры, в котором хранятся методы для работы с другими классами, методами
// аналог подписки на события
class EventMyCamera
{
	constructor()
	{
		
	}
	
	setActiveCam({camera})
	{
		myMouse.clearClick();
		myComposerRenderer.outlineRemoveObj();	
		if(myComposerRenderer) myComposerRenderer.changeCamera({camera});

		changeCamera();
	}
		
	moveCam2D()
	{  
		upPosLabels_1();
	}
		
	moveCamFly3D()
	{
		if(divLevelVisible.wallTransparent) wallAfterRender_2();
		myToolPG.setScale();
		myToolPG.setGizmoClipping();		
	}
	
	moveCamFirst3D()
	{
		myToolPG.setScale();
		myToolPG.setGizmoClipping();		
	}	
	
	cameraZoom2D()
	{
		upPosLabels_1();
		
		const delta = myCameraOrbit.cam2D.zoom;
		
		infProject.tools.axis[0].scale.set(1,1/delta,1/delta);
		infProject.tools.axis[1].scale.set(1,1/delta,1/delta);
		
		// zoom label
		const k = 1 / delta;
		if(k <= infProject.settings.camera.limitZoom) 
		{		
			myHouse.myPoint.setScale({value: delta});

			myHouse.myWDRulers.setScale({value: delta});						
		}

		myToolPG.setScale();
		
		myWarmFloor.myPointWf.setScale({value: delta});
	}
	
	cameraZoom3D()
	{
		myToolPG.setScale();
	}	
	
	camFit()
	{
		
	}	
}








