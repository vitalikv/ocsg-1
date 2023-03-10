




function infoListTexture()
{
	var arr = [];	 	
	
	arr[0] =
	{
		url : 'img/load/floor_1.jpg', 
	};
	
	arr[1] =
	{
		url : 'img/load/w1.jpg', 
	};

	arr[2] =
	{
		url : 'img/load/kirpich.jpg', 
	};

	arr[3] =
	{
		url : 'img/load/beton.jpg', 
	};	

	arr[4] =
	{
		url : 'img/load/w2.jpg', 
	};

	arr[5] =
	{
		url : 'img/load/f1.jpg', 
	};

	arr[6] =
	{
		url : 'img/load/f2.jpeg', 
	};

	arr[7] =
	{
		url : 'img/load/f3.jpg', 
	};	

	arr[8] = { url : 'img/load/gazbeton.jpg' }
	arr[9] = { url : 'img/load/proflist_1.jpg' }
	arr[10] = { url : 'img/load/roof_1.jpg' }
	
	return arr;
}



// ищем был ли до этого объект добавлен в сцену (если был, то береме сохраненную копию, усли нет, то ищем в базе)
async function getObjFromBase({lotid})
{
	let base = infProject.scene.array.base;		// объекты в памяти	
	
	for(let i = 0; i < base.length; i++)
	{
		if(base[i].id == lotid)
		{
			return base[i];		// объект есть в кэше
		}
	}

	let inf = {};
	
	if(lotid === 1)
	{
		inf.name = 'куб';
		inf.obj = myObj.crBox();
		inf.planeMath = 0.5;
	}
	
	if(lotid === 2)
	{
		inf.name = 'сфера';
		inf.obj = myObj.crSphere();
		inf.planeMath = 0.5;
	}

	if(lotid === 3)
	{
		inf.name = 'цилиндр';
		inf.obj = myObj.crCylinder();
		inf.planeMath = 0.5;
	}	
	
	if(lotid === 19)	// крыша 1
	{
		inf.id = lotid;			// не используется, lotid берется в loadObjServer(cdm) cdm.lotid
		inf.name = 'крыша четырехскатная';
		inf.obj = myRoof.initRoof();
		inf.model = null;		// в этом случаи не нужно, нужно только при загрузки из бд
		inf.preview = null;		// не используется
		inf.planeMath = 0.0;	// высота над полом
		inf.size = new THREE.Vector3();	// не нужно, для объектов считается в самой ф-ции
	}

	if(lotid === 20)	// крыша 2
	{
		inf.name = 'крыша двухскатная';
		inf.obj = myRoof.initRoof_2();
	}
	
	// объект не из бд, а из ф-ции	
	if(inf.obj !== undefined) 
	{
		addObjInBase(inf, inf.obj);	// сохраняем в память
		return inf;
	}		
	
	let url = infProject.path+'components_2/getObjSql.php?id='+lotid;  	
	let response = await fetch(url, { method: 'GET' });	
	let json = await response.json();
	
	if(!json.error)
	{
		inf = json;
		inf.planeMath = 0.0;
		
		return inf;
	}	
	
	return null;
}




// cdm - информация, которая пришла из вне
// inf - статическая инфа из базы
async function loadObjServer(cdm)
{ 	
	if(!cdm.lotid) return;
	
	var lotid = cdm.lotid;	
	
	var inf = await getObjFromBase({lotid: lotid});
	if(!inf) return;		// объект не существует в API/каталоге
	
	if(inf.obj)		// объект есть в кэше
	{ 
		console.log(lotid, '--- объект есть в кэше');
	}
	else if(inf.model)		// объекта нет в кэше, сохраняем/добавляем в кэш
	{	
		var obj = new THREE.ObjectLoader().parse( inf.model );			
		addObjInBase(inf, obj);		
	}	
	
	addObjInScene(inf, cdm);
}








// добавляем новый объект в базу/кэш (добавляются только уникальные объекты, которых нет в базе)
function addObjInBase(inf, obj)
{
	obj.geometry.computeBoundingBox();	
	
	// накладываем на материал объекта lightMap
	obj.traverse(function(child) 
	{
		if(child.isMesh && child.material.visible) 
		{ 
			
		}
	});

	//var inf_2 = JSON.parse( JSON.stringify( inf ) );
	inf.model = null;
	inf.obj = obj;	
	
	infProject.scene.array.base[infProject.scene.array.base.length] = inf;
}




// удаление пятно объекта
function deleteSpotObj(cdm)
{ 
	var obj = null;	
	
	if(cdm.obj)
	{ 
		obj = cdm.obj; 
	}
	else if(cdm.id)
	{
		var arr = infProject.scene.array.objSpot;
		
		for ( var i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.objSpot.id == cdm.id)
			{
				obj = arr[i];
				break;
			}
		}
	}
	
	if(!obj) return;
	if(obj.userData.tag != 'obj_spot') return;
	
	deleteValueFromArrya({arr: infProject.scene.array.objSpot, o: obj});
	disposeNode(obj);
	scene.remove(obj); 
}



// добавляем объект в сцену
function addObjInScene(inf, cdm)
{  
	var obj = inf.obj.clone();
	
	var inf = JSON.parse( JSON.stringify( inf ) );	
	inf.obj = obj;
	
	
	// загрузка wd
	if(cdm.wd)
	{  
		setObjInWD(inf, cdm);
		return;
	}
	
	if(cdm.roof)
	{
		clRoof.initRoof(inf, cdm);
		
		return;
	}
	
	var obj = inf.obj;
	
	if(cdm.pos){ obj.position.copy(cdm.pos); }
	else if(inf.planeMath)
	{ 
		obj.position.y = inf.planeMath;
		planeMath.position.y = inf.planeMath; 
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld(); 
	}
	
	//if(cdm.rot){ obj.rotation.set(cdm.rot.x, cdm.rot.y, cdm.rot.z); }					
	if(cdm.q){ obj.quaternion.set(cdm.q.x, cdm.q.y, cdm.q.z, cdm.q.w); }
	

	if(cdm.id){ obj.userData.id = cdm.id; }
	else { obj.userData.id = countId; countId++; }
	
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = cdm.lotid;
	obj.userData.obj3D.nameRus = (inf.name) ? inf.name : 'объект';
	obj.userData.obj3D.typeGroup = '';
	obj.userData.obj3D.helper = null;
	
	obj.userData.obj3D.ur = {};
	obj.userData.obj3D.ur.pos = new THREE.Vector3();
	obj.userData.obj3D.ur.q = new THREE.Quaternion();
	
	if(!cdm.id){ obj.userData.obj3D.newO = true; }
	
		
	
	// получаем начальные размеры объекта, что потом можно было масштабировать от начальных размеров
	if(1==1)
	{
		obj.geometry.computeBoundingBox();
		var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.obj3D.box = new THREE.Vector3(x, y, z);
	}

	
	
	if(cdm.scale){ obj.scale.set(cdm.scale.x, cdm.scale.y, cdm.scale.z); }

	if(inf.type)
	{
		if(inf.type == 'light point')
		{
			var intensity = 1;
			if(cdm.light)
			{
				if(cdm.light.intensity) { intensity = cdm.light.intensity; }
			}
			setLightInobj({obj: obj, intensity: intensity}); 
		}
	}
	
	obj.material.visible = false;

	
	// CubeCamera
	//checkReflectionMaterial({obj: obj});			
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );		
	
	if(cdm.cursor) 	// объект был добавлен в сцену из каталога
	{ 
		deleteSpotObj({obj: clickO.move});
		clickO.move = obj; 
	} 
	else	// объект был добавлен в сцену из сохраннего файла
	{
		deleteSpotObj({id: obj.userData.id});
	}
	
	renderCamera();
}


// добавлеям к светильнику источник света
function setLightInobj(cdm)
{
	var obj = cdm.obj;
	obj.userData.obj3D.typeGroup = 'light point';
	
	
	var light = new THREE.PointLight( 0xffffff, cdm.intensity, 10 );
	
	light.castShadow = true;            // default false
	scene.add( light );
	
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			child.castShadow = false;	
			child.receiveShadow = false;				
		}
	});	
	
	light.decay = 2;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1048;  // default
	light.shadow.mapSize.height = 1048; // default
	light.shadow.camera.near = 0.01;       // default
	light.shadow.camera.far = 10;      // default
	
	light.position.set(0, -0.01, 0);

	if(infProject.settings.light.type == 'global')
	{
		light.visible = false;
	}
	
	
	obj.add( light );

	infProject.scene.light.lamp[infProject.scene.light.lamp.length] = light;
	
	
	if(1==2)
	{
		var spotLight = new THREE.SpotLight( 0xffffff );	

		spotLight.castShadow = true;

		spotLight.angle = Math.PI / 2 - 0.1;
		spotLight.penumbra = 0.05;
		spotLight.decay = 2;
		spotLight.distance = 10;	

		spotLight.castShadow = true;
		spotLight.shadow.mapSize.width = 4048;
		spotLight.shadow.mapSize.height = 4048;
		spotLight.shadow.camera.near = 0.01;
		spotLight.shadow.camera.far = 10;


		
		if(1==2)
		{
			scene.add( spotLight );
			scene.add( spotLight.target );
			
			spotLight.position.copy(obj.position);
			spotLight.target.position.set(obj.position.x, -1, obj.position.z);		
		}
		else
		{
			spotLight.position.set(0, -0.05, 0);
			spotLight.target.position.set(0, -1, 0);		
			
			obj.add( spotLight );
			obj.add( spotLight.target );	
		}
		
		console.log('spotLight', spotLight);
		//--------

		if(1==1)
		{
			spotLightCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
			scene.add( spotLightCameraHelper );	

			spotLightHelper = new THREE.SpotLightHelper( spotLight );
			scene.add( spotLightHelper );		

			obj.userData.obj3D.helper = [spotLightCameraHelper];
		}
		
	}

}


// определяем нужно ли для объекта устанавливать отражение, если да, то ставим CubeCamera
function checkReflectionMaterial(cdm)
{
	var obj = cdm.obj;
	var arrCubeO = [];
	
	obj.traverse(function(child) 
	{
		if(child.isMesh && child.material) 
		{ 
			if(new RegExp('mirror','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'mirror';			
				arrCubeO[arrCubeO.length] = child;		 									
			}
			else if(new RegExp('glass','i').test( child.material.name )) 
			{  								
				child.material.userData.type = 'glass';			
				child.material.opacity = 0.1;	
				child.material.transparent = true;
				child.material.side = THREE.DoubleSide;	
			}			
		}
	});

	//if(arrCubeO.length > 0) createCubeCam({obj: obj, arrO: arrCubeO});		
	
}


function createCubeCam(cdm)
{
	var obj = cdm.obj;
	var arrO = cdm.arrO;
	
	var cubeCam = new THREE.CubeCamera(0.1, 100, 1024);					
	scene.add(cubeCam); 

	infProject.scene.array.cubeCam[infProject.scene.array.cubeCam.length] = obj;
	obj.userData.cubeCam = cubeCam;

	 
	obj.traverse(function(child) 
	{
		if(child.isMesh) 
		{ 
			if(child.material)
			{
				if(child.material.userData.type == 'mirror')
				{
					child.material.envMap = cubeCam.renderTarget.texture;
					//child.material.specular = new THREE.Color(0xffffff);
					//child.material.shininess = 100;
					//child.material.envMapIntensity = 2;
					//child.material.color = new THREE.Color(0xffffff);
					child.material.metalness = 1;
					child.material.roughness = 0;
					//child.material.reflectivity = 1;
				}								
			}				
		}
	});	
	
	updateCubeCam({obj: obj});
}


function updateCubeCam(cdm)
{
	var obj = cdm.obj;
	if(!obj) return;
	if(!obj.userData.cubeCam) return;
	
	var cubeCam = obj.userData.cubeCam;					
				
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingSphere();
	var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	
	cubeCam.position.copy(pos);
	
	obj.visible = false;
	cubeCam.update( renderer, scene );			
	obj.visible = true;
}




function loadInputFile(cdm)
{

	if(1==1)	// gltf/glb
	{
		var loader = new THREE.GLTFLoader();
		loader.parse( cdm.data, '', function ( obj ) 						
		{ 
			//var obj = obj.scene.children[0];
			setParamObj({obj: obj.scene});
		});
		
	}
	else	// fbx
	{
		var loader = new THREE.FBXLoader();
		var obj = loader.parse( cdm.data );		
		setParamObj({obj: obj});			
	}

	$('[nameId="window_main_load_obj"]').css({"display":"none"});
}


function loadUrlFile()
{	
	var url = $('[nameId="input_link_obj_1"]').val(); 
	var url = url.trim();
	
	// /import/furn_1.fbx 
	// /import/vm_furn_3.glb
	// /import/80105983_krovat_dafna5.glb
	
	var json = true;
	var glb = false;
	var fbx = false;
	
	if(json)
	{
		//url = 'https://files.planoplan.com/upload/catalog/lot/201810/40a5dafd.unity3d';
		//url = 'https://files.planoplan.com/upload/catalog/lot/201903/bf730220.unity3d';	
		//url = 'https://files.planoplan.com/upload/catalog/lot/201803/04bea56c.unity3d';	
		
		var loader = new THREE.ObjectLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			var box = createBoundObject({obj: obj});
			box.add(obj);
			
			setParamObj({obj: box})
		});			
	}

	if(glb)	// gltf/glb
	{
		url = infProject.path+'import/glb/wd/okno1x1.glb';
		
		var loader = new THREE.GLTFLoader();
		loader.load( url, function ( obj ) 						
		{ 
			//var obj = obj.scene.children[0];
			setParamObj({obj: obj.scene});
		});			
	}
	
	if(fbx)	// fbx
	{
		var loader = new THREE.FBXLoader();
		loader.load( url, function ( obj ) 						
		{ 			
			setParamObj({obj: obj});
		});			
	}

	$('[nameId="window_main_load_obj"]').css({"display":"none"});
}





function setParamObj(cdm)
{	
	var obj = cdm.obj;
	
	//var obj = obj.children[0];		
	obj.position.y = 0;	

	planeMath.position.y = 0; 
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.updateMatrixWorld(); 	
 
	obj.userData.tag = 'obj';
	obj.userData.obj3D = {};
	obj.userData.obj3D.lotid = 0;
	obj.userData.obj3D.nameRus = 'неизвестный объект';
	obj.userData.obj3D.typeGroup = '';
	obj.userData.obj3D.helper = null;
	
	obj.userData.obj3D.ur = {};
	obj.userData.obj3D.ur.pos = new THREE.Vector3();
	obj.userData.obj3D.ur.q = new THREE.Quaternion();	
			

	//obj.material.visible = false;		
	
	infProject.scene.array.obj[infProject.scene.array.obj.length] = obj;

	scene.add( obj );	
	
	clickO.move = obj;
	
	renderCamera();	
}








// создаем box-форму для объекта (находим все дочерние объекты и создаем максимальную форму)
function createBoundObject(cdm)
{
	var obj = cdm.obj;
	
	if(!obj) return;
	
	var arr = [];
	
	obj.traverse(function(child) 
	{
		if (child instanceof THREE.Mesh)
		{
			if(child.geometry) { arr[arr.length] = child; }
		}
	});	

	//scene.updateMatrixWorld();
	
	var v = [];
	
	for ( var i = 0; i < arr.length; i++ )
	{
		arr[i].updateMatrixWorld();
		arr[i].geometry.computeBoundingBox();	
		arr[i].geometry.computeBoundingSphere();

		var bound = arr[i].geometry.boundingBox;
		
		//console.log(111111, arr[i], bound);

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );		
	}
	
	var bound = { min : { x : 999999, y : 999999, z : 999999 }, max : { x : -999999, y : -999999, z : -999999 } };
	
	for(var i = 0; i < v.length; i++)
	{
		if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
		if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
		if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
		if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
		if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
		if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
	}

	var x = (bound.max.x - bound.min.x);
	var y = (bound.max.y - bound.min.y);
	var z = (bound.max.z - bound.min.z);	
	
	var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false });
	var geometry = createGeometryCube(x, y, z);	
	
	var v = geometry.vertices;
	v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
	v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

	v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
	v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
	
	v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
	v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;	
		
	var box = new THREE.Mesh( geometry, material ); 	
	//box.position.copy(centP);
	scene.add(box);
	
	box.position.copy(obj.position);
	box.rotation.copy(obj.rotation);
	
	box.updateMatrixWorld();
	box.geometry.computeBoundingBox();	
	box.geometry.computeBoundingSphere();			
	  

	return box;
}







