




// ищем был ли до этого объект добавлен в сцену (если был, то береме сохраненную копию, усли нет, то ищем в базе)
async function getObjFromBase({lotid})
{
	let base = infProject.scene.array.base;		// объекты в памяти	
	
	for(let i = 0; i < base.length; i++)
	{
		if(base[i].id === lotid)
		{
			return base[i];		// объект есть в кэше
		}
	}

	let inf = {};
	
	if(lotid === 1)
	{
		inf.id = lotid;
		inf.name = 'куб';
		inf.obj = myHouse.myObjPrimitives.crBox();
	}
	
	if(lotid === 2)
	{
		inf.id = lotid;
		inf.name = 'сфера';
		inf.obj = myHouse.myObjPrimitives.crSphere();
	}

	if(lotid === 3)
	{
		inf.id = lotid;
		inf.name = 'цилиндр';
		inf.obj = myHouse.myObjPrimitives.crCylinder();
	}


	if(lotid === 5)
	{
		inf.name = 'окно глухое';
		inf.obj = myHouse.myWindow.createWind({id: 1});
	}

	if(lotid === 6)
	{
		inf.name = 'окно двухстворчатое';
		inf.obj = myHouse.myWindow.createWind({id: 2});
	}

	if(lotid === 7)
	{
		inf.name = 'окно трехстворчатое';
		inf.obj = myHouse.myWindow.createWind({id: 3});
	}	

	if(lotid === 8)
	{
		inf.name = 'окно треугольное';
		inf.obj = myHouse.myWindow.createWind({id: 4});
	}	

	if(lotid === 9)
	{
		inf.name = 'окно треугольное';
		inf.obj = myHouse.myWindow.createWind({id: 5});
	}	

	if(lotid === 17)	// крыша 1
	{
		inf.name = 'крыша односкатная';
		inf.obj = myHouse.myRoofObj.initRoof_1();
	}

	if(lotid === 18)	// крыша 2
	{
		inf.name = 'крыша двухскатная';
		inf.obj = myHouse.myRoofObj.initRoof_2();
	}
	
	if(lotid === 19)	// крыша 1
	{
		inf.id = lotid;			// не используется, lotid берется в loadObjServer(cdm) cdm.lotid
		inf.name = 'крыша четырехскатная';
		inf.obj = myHouse.myRoofObj.initRoof_3();
		inf.model = null;		// в этом случаи не нужно, нужно только при загрузки из бд
		inf.preview = null;		// не используется
		inf.size = new THREE.Vector3();	// не нужно, для объектов считается в самой ф-ции
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
	
	obj = addObjInScene(inf, cdm);
	
	return obj;
}








// добавляем новый объект в базу/кэш (добавляются только уникальные объекты, которых нет в базе)
function addObjInBase(inf, obj)
{
	
	obj.geometry.computeBoundingBox();	
	
	// накладываем на материал объекта lightMap
	obj.traverse(function(child) 
	{
		if(child.isMesh && child.material && child.material.visible) 
		{ 
			//if(!child.material.lightMap) console.log(333, child.material.visible, child)
		}
	});

	//var inf_2 = JSON.parse( JSON.stringify( inf ) );
	inf.model = null;
	inf.obj = obj;	
	
	infProject.scene.array.base.push(inf);
}





// добавляем объект в сцену
function addObjInScene(inf, cdm)
{  
	var obj = inf.obj.clone();
	obj.material = obj.material.clone();
	
	//var inf = JSON.parse( JSON.stringify( inf ) );	
	
	// загрузка wd
	if(cdm.wd)
	{  
		setObjInWD({obj, wd: cdm.wd});
		return;
	}
	
	if(cdm.roof)
	{
		clRoof.initRoof({obj, lotid: cdm.lotid, nameRus: inf.name});
		clRoof.setRoofParams({obj, id: cdm.id, pos: cdm.pos, q: cdm.q, scale: cdm.scale, material: cdm.material});
		return obj;
	}
	
	myHouse.myObjInit.initObj({obj, lotid: cdm.lotid, nameRus: inf.name});

	myHouse.myObjInit.setObjParams({obj, id: cdm.id, pos: cdm.pos, q: cdm.q, scale: cdm.scale, material: cdm.material});
		
	
	infProject.scene.array.obj.push(obj);

	scene.add( obj );		
	
	renderCamera();
	
	return obj;
}


// если у объекта есть текстура, то обнволяем UVs
function upDateTextureObj3D({obj, force = false})
{	
	if(obj.userData.tag !== 'obj') return;
	
	const scaW = obj.getWorldScale(new THREE.Vector3());
	
	obj.children[0].traverse(function(child) 
	{
		if(child.isMesh && (child.material.map || force)) 
		{ 
			boxUnwrapUVs(child.geometry, obj.scale)				
		}
	});	
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







