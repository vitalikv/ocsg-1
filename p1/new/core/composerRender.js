

class MyComposerRenderer
{
	renderer;
	scene;
	container;
	camera;
	
	composer;
	renderPass;
	outlinePass;	
	fxaaPass;
	saoPass;
	
	constructor({container, renderer, scene, camera})
	{
		this.container = container;
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
		
		this.init();
	}
	
	init()
	{
		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.setSize( this.container.clientWidth, this.container.clientHeight );
		
		this.renderPass = new THREE.RenderPass( this.scene, this.camera );
		this.composer.addPass( this.renderPass );
		
		this.initOutline();
		this.initFxaa();
		//this.initSao();				
	}

	
	initOutline()
	{
		const ccc = new THREE.Color().setHex( '0x'+infProject.settings.profile.color );
		
		this.outlinePass = new THREE.OutlinePass( new THREE.Vector2( this.container.clientWidth, this.container.clientHeight ), this.scene, this.camera );
		this.outlinePass.visibleEdgeColor.set( ccc );
		this.outlinePass.hiddenEdgeColor.set( ccc );
		this.outlinePass.edgeStrength = Number( 5 );		// сила/прочность
		this.outlinePass.edgeThickness = Number( 0.01 );	// толщина

		this.outlinePass.selectedObjects = [];

		this.composer.addPass( this.outlinePass );
	}
	
	initFxaa()	
	{
		this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );	
		this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( containerF.clientWidth * window.devicePixelRatio );
		this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( containerF.clientHeight * window.devicePixelRatio );	
		this.fxaaPass.enabled = true;
		
		this.composer.addPass( this.fxaaPass ); 	
	}	
	
	
	initSao()
	{
		this.saoPass = new THREE.SAOPass(this.scene, this.camera, true, true);	
		//saoPass.resolution.set(8192, 8192);
		this.saoPass['params']['output'] = THREE.SAOPass.OUTPUT.Default;
		this.saoPass['params']['saoBias'] = 1;
		this.saoPass['params']['saoIntensity'] = .05;
		this.saoPass['params']['saoScale'] = 100;
		this.saoPass['params']['saoKernelRadius'] = 5;
		this.saoPass['params']['saoMinResolution'] = 0;
		this.saoPass['params']['saoBlur'] = true;
		this.saoPass['params']['saoBlurRadius'] = 8;
		this.saoPass['params']['saoBlurStdDev'] = 4;
		this.saoPass['params']['saoBlurDepthCutoff'] = .01;
		
		this.composer.addPass( this.saoPass );		
	}
	
	changeCamera({camera})
	{
		this.renderPass.camera = camera;
		this.outlinePass.renderCamera = camera;
		if(this.saoPass) this.saoPass.camera = camera;		
	}

	outlineAddObj({arr})
	{			
		this.outlinePass.selectedObjects = arr;  
	}
	
	getOutlineObj()
	{
		const obj = (this.outlinePass.selectedObjects.length > 0) ? this.outlinePass.selectedObjects[0] : null;
		
		return obj;
	}

	outlineRemoveObj()
	{
		this.outlinePass.selectedObjects = [];
	}	
}

