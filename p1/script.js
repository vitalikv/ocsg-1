
var containerF = document.getElementById( 'canvasFrame' );
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, preserveDrawingBuffer: true, } );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( containerF.clientWidth, containerF.clientHeight );
containerF.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
//scene.fog = new THREE.Fog('lightblue', 100, 200);






//----------- render
function animate() 
{
	requestAnimationFrame( animate );	
	
	myCameraMoveKey.updateKeyDown();
}



function renderCamera()
{
	//camera.updateMatrixWorld();	
	//upPosLabels_1();
	//composer.render();
	
	//camera.updateMatrixWorld();			
	//composer.render();
	if(myCameraOrbit) myCameraOrbit.render();	
}
//----------- render



//----------- start




var kof_rd = 1;

var countId = 2;

var obj_point = [];
var room = [];
var ceiling = [];
var arrWallFront = [];
//var lightMap_1 = new THREE.TextureLoader().load(infProject.path+'img/lightMap_1.png');
var lightMap_1 = null;

var clickO = resetPop.clickO();
infProject.project = null;


infProject.settings.door = { width: 0.85, height: 2.1 };
infProject.settings.wind = { width: 1.5, height: 1.5, h1: 0.8 };
infProject.settings.gate = { width: 2.5, height: 2.1 };
infProject.settings.roof = { width: 4, length: 6 };
infProject.settings.room = { type: [] };
infProject.settings.blockKeyCode = false;
infProject.scene.grid = backgroundPlane();
infProject.scene.light = {global: {}, lamp: []}; 
infProject.scene.array = resetPop.infProjectSceneArray();
infProject.scene.block = { key : { scroll : false } };		// блокировка действий/клавишь
infProject.scene.block.click = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.scene.block.hover = {wall: false, point: false, door: false, window: false, room: false, tube: false, controll_wd: false, obj: false};
infProject.geometry = { circle : createCircleSpline() };
infProject.geometry.cone = [createGeometryCone_1({r1: 0.003, r2: 0.03, h: 0.25}), createGeometryCone_1({r1: 0.001, r2: 0.04, h: 0.1})];	
infProject.html = {};
infProject.html.label = [];	// хранятся все html label
infProject.html.wd = createHtmlLabelWall({count: 6, display: 'none', tag: 'elem_wd_size'});
infProject.html.furn = {};
infProject.html.furn.size = createHtmlLabelWall({count: 2, display: 'none', tag: 'elem_furn_size', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.html.furn.offset = createHtmlLabelWall({count: 4, display: 'none', tag: 'elem_furn_offset', style: 'border: 1px solid #646464; padding: 2px 5px; background: #fff;'});
infProject.svg = {furn: {}};
infProject.svg.arr = []; 	// хранятся все svg
infProject.svg.furn.size = {};
infProject.svg.furn.size.elem = createSvgLine({count: 2, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.size.show = infProject.settings.obj.cam2D.show.size;
infProject.svg.furn.offset = {};
infProject.svg.furn.offset.elem = createSvgLine({count: 4, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.offset.show = infProject.settings.obj.cam2D.show.offset;
infProject.svg.furn.box2 = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color, dasharray: true})[0];
infProject.svg.furn.box1 = createSvgPath({count: 1, color: infProject.settings.svg.scaleBox.color})[0];
infProject.svg.furn.boxCircle = {};
infProject.svg.furn.boxCircle.elem = createSvgCircle({count: 8, color: infProject.settings.svg.scaleBox.color});
infProject.svg.furn.boxCircle.show = infProject.settings.obj.cam2D.show.scale; 

// controllWD контроллеры для изменения ширины/длины wd
infProject.tools = { cutWall: [], axis: createLineAxis() }; 
infProject.tools.floorPl = createPlaneOutlineFloor(); 
infProject.listColor = resetPop.listColor(); 
infProject.start = true; 

// хранятся данные для расчета
infProject.calc = {};
infProject.calc.boxScale2D = {sizeLine: null, boxCircle: null, box1: null, box2: null, offsetLine: null};
infProject.calc.boxScale2D.pos2D = new THREE.Vector2();
infProject.calc.boxScale2D.pos3D = new THREE.Vector3();
infProject.calc.boxScale2D.arrO = [];

infProject.ur = {};
infProject.ur.count = -1; 
infProject.ur.back = [];
infProject.ur.forward = [];

//infProject.tools = { selectionBox : null }
infProject.tools.selectionBox = { msdown : false, coords : new THREE.Vector2(), mStart : new THREE.Vector2(), mEnd : new THREE.Vector2(), button : false };
	

console.log(infProject); 
 


var planeMath = createPlaneMath();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  
  

//----------- Light
{
	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );
	
	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );
	
	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );
	

	var light = new THREE.AmbientLight( 0xffffff, 0.93 );
	scene.add( light );
	
	infProject.scene.light.global = {ambient: light, point: lights};
}



// cdm
{	
	//await addObjInCatalogUI_1();			// наполняем каталог объектов UI
	//getAutoBuildingJson();
	
	assignEventSvgScaleSizeObj({el: infProject.svg.furn.boxCircle.elem}); 
}

//----------- start





function upPosLabels_1(cdm)
{
	
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	
	if(!cdm) cdm = {};
	
	const cam2D = myCameraOrbit.cam2D;
	
	var stop = true;
	if(cam2D.userData.zoom - cam2D.zoom !== 0) { stop = false; }
	if(cam2D.userData.pos.x - cam2D.position.x !== 0) { stop = false; }
	else if(cam2D.userData.pos.z - cam2D.position.z !== 0) { stop = false; }
	else if(cdm.resize) { stop = false; }
	
	if(stop) return;
	
	cam2D.userData.pos = cam2D.position.clone();
	cam2D.userData.zoom = cam2D.zoom;
	
	
	for ( var i = 0; i < infProject.html.label.length; i++ )
	{
		var elem = infProject.html.label[i];
		
		if(elem.userData.elem.show)
		{
			if(cam2D.zoom < 0.7) { elem.style.display = 'none'; }
			else { elem.style.display = 'block'; }			
		}
		else
		{
			continue;
		}
				
		upPosLabels_2({elem: elem});
	}	
	

	for ( var i = 0; i < infProject.svg.arr.length; i++ )
	{
		var svg = infProject.svg.arr[i];
		
		//if(!svg.userData.svg.show) continue;
		
		if(svg.userData.svg.line)
		{
			updateSvgLine({el: svg});
		}
		else if(svg.userData.svg.circle)
		{
			updateSvgCircle({el: svg});
		}
		else if(svg.userData.svg.path)
		{
			updateSvgPath({el: svg});
		}
		else if(svg.userData.svg.arc)
		{
			updateSvgArc({el: svg});
		}		
	}	
}


function upPosLabels_2(cdm) 
{
	var elem = cdm.elem;
	const cam2D = myCameraOrbit.cam2D;
	
	if(elem.style.display == 'none') return;
	
	//cam2D.updateProjectionMatrix();
	
	var tempV = elem.userData.elem.pos.clone().project(cam2D);

	var x = (tempV.x *  .5 + .5) * canvas.clientWidth;
	var y = (tempV.y * -.5 + .5) * canvas.clientHeight;

	//var x = Math.round((0.5 + tempV.x / 2) * (canvas.width / window.devicePixelRatio));
	//var y = Math.round((0.5 - tempV.y / 2) * (canvas.height / window.devicePixelRatio));	
	//elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;		
	
	elem.style.top = `${y}px`;
	elem.style.left = `${x}px`;

	elem.userData.elem.x = x;
	elem.userData.elem.y = y;	
}


  


function backgroundPlane()
{
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, polygonOffset: true, polygonOffsetFactor: 10.0, polygonOffsetUnits: 4.0 } );
	//var material = new THREE.MeshPhongMaterial( {color: 0xffffff, transparent: true, opacity: 0.5  } );
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.position.y = -0.02;
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	scene.add( planeMath );	
	
	
	var cdm = {};
	var img = infProject.path+'img/f1.png';
	
	new THREE.TextureLoader().load(img, function ( image )  
	{
		material.color = new THREE.Color( 0xffffff );
		var texture = image;			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		
		if(cdm.repeat)
		{
			texture.repeat.x = cdm.repeat.x;
			texture.repeat.y = cdm.repeat.y;			
		}
		else
		{
			texture.repeat.x = 1000;
			texture.repeat.y = 1000;			
		}
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.lightMap = lightMap_1;
		material.needsUpdate = true; 					
		
		renderCamera();
	});		
	
	return planeMath;
}



function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	//var geometry = new THREE.PlaneGeometry( 10, 10 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
	material.visible = false; 
	var planeMath = new THREE.Mesh( geometry, material );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}





function createGeometryCube(x, y, z, cdm)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	

	if(cdm)
	{
		if(cdm.material)
		{
			geometry.faces[0].materialIndex = 1;
			geometry.faces[1].materialIndex = 1;	
			geometry.faces[2].materialIndex = 2;
			geometry.faces[3].materialIndex = 2;	
			geometry.faces[6].materialIndex = 3;
			geometry.faces[7].materialIndex = 3;				
		}
	}
	
	return geometry;
}




function createGeometryWD(cdm)  
{
	var x = cdm.x;
	var y = cdm.y;
	var z = cdm.z;
	var zC = 0;
	
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var f = 0.9;
	
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x*f,y,z*f),
				new THREE.Vector3(x*f,y,zC*f),
				new THREE.Vector3(x,-y,zC),
				new THREE.Vector3(x,-y,-zC),
				new THREE.Vector3(x*f,y,-zC*f),
				new THREE.Vector3(-x*f,y,-z*f),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}


function createGeometryWall(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = 0;
	
	if(1==1)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	geometry.faces[4].materialIndex = 3;
	geometry.faces[5].materialIndex = 3;
	geometry.faces[6].materialIndex = 3;
	geometry.faces[7].materialIndex = 3;
	
	return geometry;
}



function createLineAxis() 
{
	var axis = [];
	
	var geometry = createGeometryCube(0.5, 0.02, 0.02);		
	var v = geometry.vertices;	
	v[3].x = v[2].x = v[5].x = v[4].x = 500;
	v[0].x = v[1].x = v[6].x = v[7].x = -500;	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xcccccc, transparent: true, depthTest: false, lightMap : lightMap_1 } );
	
	for(var i = 0; i < 2; i++)
	{
		axis[i] = new THREE.Mesh( geometry, material );
		axis[i].renderOrder = 2;
		axis[i].visible = false;
		scene.add( axis[i] );				
	}		
	
	return axis;
}

// vertex для Gizmo
function createGeometryCircle( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}




function createCircleSpline()
{
	var count = 48;
	var circle = [];
	var g = (Math.PI * 2) / count;
	
	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[i] = new THREE.Vector3();
		circle[i].x = Math.sin(angle);
		circle[i].z = Math.cos(angle);
		//circle[i].y = 0;
	}

	return circle;
}


// создаем Geometry конуса для рулеток
function createGeometryCone_1(cdm)
{	
	var n = 0;
	var v = [];
	var circle = infProject.geometry.circle;
	
	var r2 = cdm.r2;
	var h = cdm.h;
	var r1 = cdm.r1;
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r2 );
		v[n].y = -h;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = -h;
		n++;
		
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), r1 );
		v[n].y = 0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = 0.001;
		n++;		
	}	 
	
	return createGeometryCircle(v);
}





function upUvs_4( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {			
			return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true; 
}





// показываем/скрываем html размеры стен
function showHideLabelSizeWall(cdm) 
{
	if(!cdm) { cdm = {}; }
	
	if(cdm.switch)
	{
		infProject.settings.html.fonts.wall.show = !infProject.settings.html.fonts.wall.show;		
	}
	else if(cdm.show)
	{
		infProject.settings.html.fonts.wall.show = true;
	}
	else if(cdm.hide)
	{
		infProject.settings.html.fonts.wall.show = false;
	}
	else 
	{
		return;
	}
	
	
	var wall = infProject.scene.array.wall;
	
	// удаляем html размеры стен
	for ( var i = 0; i < wall.length; i++ )
	{ 		
		if(wall[i].userData.wall.html.label)
		{
			for ( var i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
			{
				//infProject.html.wd[i].style.display = 'none';
				deleteValueFromArrya({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
				wall[i].userData.wall.html.label[i2].remove();
			}
		}					 
	}


	// создаем html размеры стен
	if(infProject.settings.html.fonts.wall.show)
	{
		
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			wall[i].userData.wall.html.label = createHtmlLabelWall({count: 2, tag: 'elem_wall_size'});				
		}
		
		var label = [];
		for ( var i = 0; i < wall.length; i++ )
		{ 		
			if(!wall[i].userData.wall.html.label) continue;
			
			for ( var i2 = 0; i2 <  wall[i].userData.wall.html.label.length; i2++ )
			{
				label[label.length] = wall[i].userData.wall.html.label[i2];  
			}					 
		}
		 
		showElementHtml(label);
		upLabelPlan_1(wall, true);
	}
}


// блокируем/разблокируем клавиатуру 
function blockKeyCode(cdm)
{	
	if(!cdm) { cdm = {}; }
	
	if(cdm.block !== undefined)
	{
		infProject.settings.blockKeyCode = cdm.block;
	}	
}


function getMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) / containerF.clientWidth ) * 2 - 1;
	var y = - ( ( event.clientY - containerF.offsetTop ) / containerF.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}


function getScreenMousePosition( event )
{
	var x = ( ( event.clientX - containerF.offsetLeft ) );
	var y = ( ( event.clientY - containerF.offsetTop ) );	
	
	return new THREE.Vector2(x, y);
}	
	

function rayIntersect( event, obj, t, recursive ) 
{
	mouse = getMousePosition( event );
	
	raycaster.setFromCamera( mouse, myCameraOrbit.activeCam );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, recursive ); }
	
	return intersects;
}



function boxUnwrapUVs(geometry, scale = new THREE.Vector3(1, 1, 1)) {	
	//console.log(geometry instanceof THREE.Geometry, geometry instanceof THREE.BufferGeometry)
	
	if(geometry instanceof THREE.BufferGeometry) return;
	
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];
        var faceUVs = geometry.faceVertexUvs[0][i]
        var va = geometry.vertices[geometry.faces[i].a].clone();
        var vb = geometry.vertices[geometry.faces[i].b].clone();
        var vc = geometry.vertices[geometry.faces[i].c].clone();
		
		if(1===1)
		{
			va.x *= scale.x; va.y *= scale.y; va.z *= scale.z;
			vb.x *= scale.x; vb.y *= scale.y; vb.z *= scale.z;
			vc.x *= scale.x; vc.y *= scale.y; vc.z *= scale.z;
		}
		
        var vab = new THREE.Vector3().copy(vb).sub(va)
        var vac = new THREE.Vector3().copy(vc).sub(va)
        //now we have 2 vectors to get the cross product of...
        var vcross = new THREE.Vector3().copy(vab).cross(vac);
        //Find the largest axis of the plane normal...
        vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z))
        var majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z'
        //Take the other two axis from the largest axis
        var uAxis = majorAxis == 'x' ? 'y' : majorAxis == 'y' ? 'x' : 'x';
        var vAxis = majorAxis == 'x' ? 'z' : majorAxis == 'y' ? 'z' : 'y';
        faceUVs[0].set(va[uAxis], va[vAxis])
        faceUVs[1].set(vb[uAxis], vb[vAxis])
        faceUVs[2].set(vc[uAxis], vc[vAxis])
    }
    geometry.elementsNeedUpdate = geometry.verticesNeedUpdate = true;
}

function upUvs_1( obj )
{ 
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
	
    for (var i = 0; i < faces.length; i++) 
	{		
		var components = ['x', 'y', 'z'].sort(function(a, b) {
			return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
		});	


        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;	
}





//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math
 


	
	
 
function setUnits()
{
	 
}



// находим стены/точки/объекты по id
function findObjFromId( cdm, id )
{
	var point = infProject.scene.array.point;
	var wall = infProject.scene.array.wall;
	var window = infProject.scene.array.window;
	var door = infProject.scene.array.door;	
	var floor = infProject.scene.array.floor;
	var obj = infProject.scene.array.obj; 
	
	
	if(cdm == 'wall')
	{
		for ( var i = 0; i < wall.length; i++ ){ if(wall[i].userData.id == id){ return wall[i]; } }			
	}
	else if(cdm == 'point')
	{
		for ( var i = 0; i < point.length; i++ ){ if(point[i].userData.id == id){ return point[i]; } }
	}
	else if(cdm == 'wd')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'window')
	{
		for ( var i = 0; i < window.length; i++ ){ if(window[i].userData.id == id){ return window[i]; } }
	}
	else if(cdm == 'door')
	{
		for ( var i = 0; i < door.length; i++ ){ if(door[i].userData.id == id){ return door[i]; } }
	}
	else if(cdm == 'room')
	{
		for ( var i = 0; i < floor.length; i++ ){ if(floor[i].userData.id == id){ return floor[i]; } }
	}
	else if(cdm == 'obj')
	{
		for ( var i = 0; i < obj.length; i++ ){ if(obj[i].userData.id == id){ return obj[i]; } }
	}
	
	return null;
}











document.addEventListener("keydown", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	if(clickO.keys[e.keyCode]) return;
	
	if(infProject.activeInput) 
	{ 
		if(e.keyCode == 13)
		{ 
			console.log(infProject.activeInput);
			
			if(infProject.activeInput == 'input-height') { changeHeightWall(); } 
			if(infProject.activeInput == 'wall_1') { inputChangeWall_1({}); }	 		
			if(infProject.activeInput == 'size-wd-length') { myHouse.myWD.inputWidthHeightWD(); }
			if(infProject.activeInput == 'size-wd-height') { myHouse.myWD.inputWidthHeightWD(); }
			if(infProject.activeInput == 'rp_wd_h1') { myHouse.myWD.inputWidthHeightWD(); }
			if(infProject.activeInput == 'size_wall_width_1') 
			{ 
				var width = $('[nameid="size_wall_width_1"]').val();
				
				inputWidthOneWall({wall: myComposerRenderer.getOutlineObj(), width:{value: width}, offset:'wallRedBlueArrow'}); 
			}			
		}		
		 
		return; 
	}
	


	if(e.keyCode == 46) { detectDeleteObj(); }
	
	if (window.location.hostname === 'ocsg-1')
	{
		if(e.keyCode == 90 && e.ctrlKey || e.keyCode == 90 && e.keyCode == 91) { setInfoEvent1( 'undo' ); }	// ctrl + z
		if(e.keyCode == 89 && e.ctrlKey || e.keyCode == 89 && e.keyCode == 91) { setInfoEvent1( 'redo' ); }	// ctrl + y	
		
		if(clickO.keys[18] && e.keyCode == 90) { loadFile({json: true}); }		// alt + z
		if(clickO.keys[18] && e.keyCode == 72) { disposeHierchy({obj: scene}); getConsoleRendererInfo(); }		// alt + h
		if(clickO.keys[18] && e.keyCode == 77) { loadFile({id: 0}); }				// alt + m
		if(clickO.keys[18] && e.keyCode == 84) { saveFile({json: true}); }			// alt + t
		if(clickO.keys[18] && e.keyCode == 86) { console.log(infProject); }
		if(clickO.keys[18] && e.keyCode == 86) { console.log(clickO); }  		
		if(clickO.keys[18] && e.keyCode == 86) { console.log(renderer.info.memory); }	// alt + v
		if(clickO.keys[18] && e.keyCode == 66) 	// alt + b
		{ 
			if(infProject.settings.shader.saoPass)
			{
				saoPass['params']['output'] = (saoPass['params']['output']==THREE.SAOPass.OUTPUT.Default)? THREE.SAOPass.OUTPUT.Beauty : THREE.SAOPass.OUTPUT.Default;
				console.log(saoPass['params']['output']);
				renderCamera();			
			}
		}  
		
		//if(e.keyCode == 56) { showHideLabelSizeWall({switch: true}); }
		//if(e.keyCode == 66) { switchCamera3D(); } 	// b
		if(e.keyCode == 89 && !e.ctrlKey) { saveFile({txt: true}); } 			// y
		//if(e.keyCode == 86) { resetScene(); getAutoBuildingJson(); } // v		
	}
	
	if(!infProject.settings.blockKeyCode) clickO.keys[e.keyCode] = true;
	
} );



document.addEventListener("keyup", function (e) 
{ 
	if(infProject.settings.blockKeyCode) return;
	clickO.keys[e.keyCode] = false;
	
	if(myCameraOrbit.activeCam.userData.isCam2D)
	{
		if(e.keyCode == 16){ selectionBoxHide(); } 
	}
	
});





// проверяем правильность ввода числа (вводим число в своих единицах, отдаем в метрах)
function checkNumberInput(cdm)
{	
	var value = cdm.value; 
	//var value = value.trim();
	
	if((/,/i).test( value )) { value = value.replace(",", "."); }
	
	if(!isNumeric(value)) return null; 
	
	value = Number(value);
	
	if(cdm.abs)
	{
		value = Math.abs(value);
	}
	
	if(cdm.int)
	{ 
		value = Math.round(value);  
	}	
	
	if(cdm.unit)
	{
		if(cdm.unit == 0.01) { value /= 100; } // см
		else if(cdm.unit == 0.001) { value /= 1000; } // мм
	}		

	if(cdm.limit)
	{
		if(cdm.limit.max < value) { value = cdm.limit.max; }
		if(cdm.limit.min > value) { value = cdm.limit.min; }
	}

	return {num: value};	
}


// проверяем существует ли функция
function isCheckExsistFunction(functionToCheck)  
{
    var getType = {};
	
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]' || functionToCheck && getType.toString.call(functionToCheck) === '[object AsyncFunction]';
}



let docReady = false;
let myPanelTop;
let windUI;
let windTabs;
let windDivAbout;
let windDivAccount;
let windDivProjectLoad;
let windDivProjectSave;
let windDivProjectDemo;
let windDivSubs;
let myPanelR;
let myPanelPlan;
let myTabsR;
let myContentLevel;
let myContentPlan;
let divLevelVisible;
let tabObject;
let myCatalogList;
let myPanelWF;

let myCookie;
let myTexture;
let switchCamera;

let myMouse;
let myManagerClick;
let myCameraOrbit;
let myCameraMoveKey;
let myComposerRenderer;
let myLevels;
let myToolPG;
let myToolPG_UI;
let myHouse;
let clRoof;
let myWarmFloor;
let startProject;




document.addEventListener("DOMContentLoaded", ()=>
{
	docReady = true;
	
	myPanelTop = new MyPanelTop();
	myPanelTop.init();
	
	windUI = new WindUI();
	windTabs = new WindTabs();
	windDivAbout = new WindDivAbout();
	windDivAccount = new WindDivAccount();
	windDivProjectLoad = new WindDivProjectLoad();
	windDivProjectSave = new WindDivProjectSave();
	windDivProjectDemo = new WindDivProjectDemo();
	windDivSubs = new WindDivSubs();
	windTabs.init();
	windDivAbout.init();
	windDivAccount.init();
	windDivProjectLoad.init();
	windDivProjectSave.init();
	windDivProjectDemo.init();
	windUI.init();
	
	
	myCookie = new MyCookie();
	
	myManagerClick = new MyManagerClick();
	myMouse = new MyMouse({container: containerF, scene});
	myCameraOrbit = new MyCameraOrbit({container: containerF, renderer, scene});
	myCameraMoveKey = new MyCameraMoveKey();
	
	myComposerRenderer = new MyComposerRenderer({container: containerF, renderer, scene, camera: myCameraOrbit.activeCam});
	
	myLevels = new MyLevels();

	myPanelR = new MyPanelR();
	myPanelPlan = new MyPanelPlan();
	
	myContentLevel = new MyContentLevel();
	myContentPlan = new MyContentPlan();
	myTabsR = new MyTabsR();
	
	divLevelVisible = new DivLevelVisible({showAllLevel: true, wallTransparent: false});	
	tabObject = new TabObject();
	myCatalogList = new MyCatalogList();
	switchCamera = new SwitchCamera();	
	myPanelWF = new MyPanelWF();	
	
	
	myTexture = new MyTexture();
	
	myToolPG = new MyToolPG();
	myToolPG_UI = new MyToolPG_UI({container: containerF});
	
	myHouse = new MyHouse();
	clRoof = new Roof();
	myWarmFloor = new MyWarmFloor();
	
	startProject = new StartProject();
	startProject.init();
	
	//if(startProject.detectShowStartWind()) windUI.showWin();
	
	if(1===1) myPanelTop.addPaidPanel();	// панель для платных пользователей	
	
	animate();
	renderCamera();	
});



function testSss()
{
	var svgline = createSvgLine({count: 1, x1: 400, y1: 700, x2: 800, y2: 700, display: "block"})[0]; 
	upSvgLinePosScene({el: [svgline]});
	updateSvgLine({el: svgline});

	var svgline2 = createSvgPath({count: 1, arrS: [new THREE.Vector2(420, 710), new THREE.Vector2(400, 700), new THREE.Vector2(420, 690)], stroke_width: "2px", display: "block"})[0];
	upSvgPathPosScene({el: [svgline2]});  

	console.log(55555, svgline);
	console.log(55555, svgline2); 
}	
	






