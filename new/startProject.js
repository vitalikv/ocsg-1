


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
			if(demo && Number(demo) === 4) this.name = 'demo 4';
			
			console.log(888, demo, paramsString, this.name);
		}
		
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
		{
			infProject.jsonProject.showAllLevel = true;
			infProject.jsonProject.wallTransparent = false;	

			let nameFile = '1.json';
			if(this.name === 'demo 1') nameFile = '1.json';
			if(this.name === 'demo 2') nameFile = '2.json';
			if(this.name === 'demo 3') nameFile = '3.json';
			if(this.name === 'demo 4') nameFile = '4.json';
			
			infProject.settings.load.file = 'demo/' + nameFile;
			infProject.settings.save.file = 'demo/' + nameFile;
			
			showHideCatalogMenuUI({show: false});			
		}

		if(this.name === 'new') loadFile({id: 0});
		else loadFile({json: infProject.settings.load.file});		
	}
	
	setCamera()
	{
		centerCamera2D();
		cameraZoomTop( camera.zoom );
			
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
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












