



// класс для камеры, в котором хранятся методы для работы с другими классами, методами
// аналог подписки на события
class EventMyCamera
{
	constructor()
	{
		
	}
	
	setActiveCam({camera})
	{
		if(myComposerRenderer)
		{ 
			myComposerRenderer.changeCamera({camera});
		}		
	}
		
	moveCam2D()
	{  
		upPosLabels_1();
	}
		
	moveCamFly3D()
	{
		if(divLevelVisible.wallTransparent) wallAfterRender_2();
	}
	
	cameraZoom2D()
	{
		upPosLabels_1();
	}
	
	camFit()
	{
		
	}	
}








