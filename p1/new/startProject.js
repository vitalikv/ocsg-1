


class StartProject
{
	name = 'new';
	
	constructor()
	{

	}
	
	
	init()
	{
		let paramsString = document.location.search; // ?demo=1&demo=2
		let searchParams = new URLSearchParams(paramsString);	
		let demo = searchParams.get('demo');
			
		divLevelVisible.switchShowAllLevel({value: true});
		divLevelVisible.switchWallTransparent({value: true});			
			
		if(demo)
		{
			if(demo && Number(demo) === 1) this.name = 'demo 1';
			if(demo && Number(demo) === 2) this.name = 'demo 2';
			if(demo && Number(demo) === 3) this.name = 'demo 3';
			if(demo && Number(demo) === 4) this.name = 'demo 4';
			
			console.log(888, demo, paramsString, this.name);
		}
		
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
		{
			divLevelVisible.switchShowAllLevel({value: true});
			divLevelVisible.switchWallTransparent({value: false});

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
		myCameraOrbit.centerCamera2D({arr: obj_point});
		
			
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4')
		{
			if(this.name === 'demo 1')
			{
				const posCam = new THREE.Vector3(-7.439878890213777, 3.3154713496334285, 5.463682482175339);
				const posTarget = new THREE.Vector3(-0.7369679466168795, 0, 0.31786061162317836);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});											
			}
			
			if(this.name === 'demo 2')
			{
				const posCam = new THREE.Vector3(2.2750910805777775, 2.8388647719569255, 12.403319798672216);
				const posTarget = new THREE.Vector3(2.1057556450078354, 0, -0.3621427765237808);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});								
			}						
			
			if(this.name === 'demo 3')
			{
				const posCam = new THREE.Vector3(-12.980195647195652, 4.725726151717402, -12.990587090348361);
				const posTarget = new THREE.Vector3(-2.039031079023262, 0, 0.5941402268183111);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});							
			}

			if(this.name === 'demo 4')
			{
				const posCam = new THREE.Vector3(-10.150758808809238, 7.476452542725171, -9.096691766295946);
				const posTarget = new THREE.Vector3(2.0579833473162843, 0, 3.485431627682769);
				myCameraOrbit.setStartPosRot3D({posCam, posTarget});									
			}			
			
			switchCamera.clickOnBtn2D3D('3D');				
		}
		else
		{
			switchCamera.clickOnBtn2D3D('2D');
		}		
	}
	
	
	detectShowStartWind()
	{
		let show = true;
		const listPr = ['demo 1', 'demo 2', 'demo 3', 'demo 4'];
		
		for(let i = 0; i < listPr.length; i++)
		{
			if(this.name === listPr[i]) show = false;
		}
		
		return show;
	}
}














