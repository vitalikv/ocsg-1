



// класс для камеры, в котором хранятся методы для работы с другими классами, методами
// аналог подписки на события
class EventMyCamera
{
	constructor()
	{
		
	}
	
	setActiveCam({camera})
	{
		deActiveSelected();
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
			// point geometry
			const point = infProject.tools.point;	
			const v = point.geometry.vertices;
			const v2 = point.userData.tool_point.v2;
				
			for ( let i = 0; i < v2.length; i++ )
			{
				v[i].x = v2[i].x * 1/delta;
				v[i].z = v2[i].z * 1/delta;
			}	

			infProject.tools.point.geometry.verticesNeedUpdate = true;
			infProject.tools.point.geometry.elementsNeedUpdate = true;


			// wd рулетки 
			for ( let i = 0; i < infProject.scene.size.wd_1.line.length; i++ ){ infProject.scene.size.wd_1.line[i].scale.set(1,1/delta,1/delta); }			
		}		
	}
	
	camFit()
	{
		
	}	
}








