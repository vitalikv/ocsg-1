


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
			if(this.name === 'demo 1')
			{
				camera3D.position.set(-7.439878890213777, 3.3154713496334285, 5.463682482175339);			
				camera3D.rotation.set(-0.373891599064255, -0.9160633908104759, 2.7755575615628914e-17);			
				infProject.camera.d3.targetO.position.set(-0.7369679466168795, 5.0111501479127856e-14, 0.31786061162317836);
				infProject.camera.d3.targetO.rotation.set(0, -0.9160633908104759, 0);
				
				camera3D.userData.camera.save.pos = camera3D.position.clone();
				camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);								
			}
			
			if(this.name === 'demo 2')
			{
				camera3D.position.set(2.2750910805777775, 2.8388647719569255, 12.403319798672216);			
				camera3D.rotation.set(-0.21880671377680652, 0.013264345364366182, 0);			
				infProject.camera.d3.targetO.position.set(2.1057556450078354, 7.185839207340677e-15, -0.3621427765237808);
				infProject.camera.d3.targetO.rotation.set(0, 0.013264345364366182, 0);
				
				camera3D.userData.camera.save.pos = camera3D.position.clone();
				camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);								
			}			
			
			if(this.name === 'demo 3')
			{
				camera3D.position.set(4.3056373564054615, 5.998624420277156, -11.039353875200328);			
				camera3D.rotation.set(-0.3382383267121755, 2.665165831108994, 0);			
				infProject.camera.d3.targetO.position.set(-3.514850050989855, 4.9713253022648246e-14, 4.1114122118257255);
				
				camera3D.userData.camera.save.pos = camera3D.position.clone();
				camera3D.userData.camera.save.radius = infProject.camera.d3.targetO.position.distanceTo(camera3D.position);								
			}
			
			clickOnBtn2D3D(camera3D);				
		}
		else
		{
			clickOnBtn2D3D(cameraTop);
		}		
	}
}

let startProject = new StartProject();












