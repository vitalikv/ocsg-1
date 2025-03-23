


class MyStartProject
{
	name = '';
	
	constructor()
	{

	}
	
	
	async init({name})
	{
		this.name = name;
		
		let paramsString = document.location.search; // ?demo=1&demo=2
		let searchParams = new URLSearchParams(paramsString);	
		let demo = searchParams.get('demo');
			
		myPanelR.myLevelVisible.switchShowAllLevel({value: true});
		myPanelR.myLevelVisible.switchWallTransparent({value: true});			
			
		if(demo)
		{
			if(demo && Number(demo) === 1) this.name = 'demo 1';
			if(demo && Number(demo) === 2) this.name = 'demo 2';
			if(demo && Number(demo) === 3) this.name = 'demo 3';
			if(demo && Number(demo) === 4) this.name = 'demo 4';
			if(demo && Number(demo) === 5) this.name = 'demo 5';
			
			console.log(888, demo, paramsString, this.name);
		}
		
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4' || this.name === 'demo 5')
		{
			myPanelR.myLevelVisible.switchShowAllLevel({value: true});
			myPanelR.myLevelVisible.switchWallTransparent({value: false});

			let nameFile = '1.json';
			if(this.name === 'demo 1') nameFile = '1.json';
			if(this.name === 'demo 2') nameFile = '2.json';
			if(this.name === 'demo 3') nameFile = '3.json';
			if(this.name === 'demo 4') nameFile = '4.json';
			if(this.name === 'demo 5') nameFile = '5.json';
			
			infProject.settings.load.file = 'demo/' + nameFile;
			infProject.settings.save.file = 'demo/' + nameFile;
			
			myPanelR.showHidePanelR({show: false});			
		}

		if(this.name === 'new') await loadFile({});
		else await loadFile({local: infProject.settings.load.file});
		
		myCalcBlocks.init();
	}
	
	setCamera()
	{
		myCameraOrbit.centerCamera2D({arr: obj_point});
		
			
		if(this.name === 'demo 1' || this.name === 'demo 2' || this.name === 'demo 3' || this.name === 'demo 4' || this.name === 'demo 5')
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
			if(this.name === 'demo 5')
			{
				const posCam = new THREE.Vector3(-5.423621210213024, 8.416384589708008, 10.811106485572816);
				const posTarget = new THREE.Vector3(-0.7498043105489184, 0, 0);
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
		const listPr = ['demo 1', 'demo 2', 'demo 3', 'demo 4', 'demo 5'];
		
		for(let i = 0; i < listPr.length; i++)
		{
			if(this.name === listPr[i]) show = false;
		}
		
		return show;
	}
}














