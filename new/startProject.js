


class StartProject
{
	name = 'new';
	
	constructor()
	{

	}
	
	
	init(name)
	{
		if(name) this.name = name;
		else
		{
			let paramsString = document.location.search; // ?demo=1&demo=2
			let searchParams = new URLSearchParams(paramsString);	
			let demo = searchParams.get('demo');

			if(demo && Number(demo) === 1) this.name = 'demo 1';
			if(demo && Number(demo) === 2) this.name = 'demo 2';
			if(demo && Number(demo) === 3) this.name = 'demo 3';
			
			console.log(888, demo, paramsString, this.name);
		}
		
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3')
		{
			infProject.jsonProject.showAllLevel = true;
			infProject.jsonProject.wallTransparent = false;	

			infProject.settings.load.file = 'demo/1.json';
			infProject.settings.save.file = 'demo/1.json';
			
			showHideCatalogMenuUI({show: false});			
		}

		if(this.name === 'new') loadFile({id: 0});
		else loadFile({json: infProject.settings.load.file});		
	}
	
	setCamera()
	{
		centerCamera2D();
		cameraZoomTop( camera.zoom );
			
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3')
		{
			clickOnBtn2D3D(camera3D);	// changeCamera(cameraTop);			
		}
		else
		{
			clickOnBtn2D3D(cameraTop);
		}		
	}
}

let startProject = new StartProject();












