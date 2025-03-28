


// создаем копию стены (для ThreeBSP), но без перемещаемого окна/двери (запускается один раз в момент, когда начали перемещать окно/дверь)
// 1. обновляем стену до простой стены без окон/дверей
// 2. добавляем откосы
// 3. вырезаем отверстия для окон/дверей , кроме перемещаемого окна/двери
function clickMoveWD_BSP( wd, wall )  
{
	console.log('clone wall (без перемещаемого WD)');
	
	if(!wall) { wall = wd.userData.door.wall; }	// делаем отверстия для всех wd, кроме выделенного 
	else {  }	// делаем отверстия для всех wd
	
	var p1 = wall.userData.wall.p[0].position;
	var p2 = wall.userData.wall.p[1].position;	
	var d = p1.distanceTo( p2 );		
	

	wall.geometry.dispose();
	wall.geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены
	
	// добавляем откосы
	var v = wall.geometry.vertices;
	
	for ( var i = 0; i < v.length; i++ ) { v[i] = wall.userData.wall.v[i].clone(); }
	
	//wall.updateMatrixWorld();

	upUvs_1( wall ); 
	
	// вырезаем отверстия для окон/дверей
	var arrO = wall.userData.wall.arrO;
	
	for ( var n = 0; n < arrO.length; n++ )
	{
		if(arrO[n] == wd) continue;
		
		var objClone = createCloneWD_BSP( arrO[n] ); 

		var wdBSP = new ThreeBSP( objClone );    
		var wallBSP = new ThreeBSP( wall ); 			// копируем выбранную стену	
		var newBSP = wallBSP.subtract( wdBSP );		// вычитаем из стены объект нужной формы		
		wall.geometry = newBSP.toGeometry();	
	}
	
	if(arrO.length > 1 || wd == null)
	{
		wall.geometry.computeFaceNormals();

		for ( var i = 0; i < wall.geometry.faces.length; i++ )
		{
			wall.geometry.faces[i].normal.normalize();
			if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
			else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
			else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
			else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
		}		
	}			
	
	return wall; 
}




// создаем форму окна/двери (для boolean), чуть шире стены
function createCloneWD_BSP( wd )
{
	// парметрическое окно
	if(wd.children.length > 0 && wd.children[0].userData.contour && wd.children[0].userData.contour.length > 0)
	{
		const wdCSG = myHouse.myWindow.calcContourCSG(wd.children[0]);		
		return wdCSG;
	}
	
	var obj = new THREE.Mesh();
	obj.geometry = wd.geometry.clone(); 
	obj.position.copy( wd.position );
	obj.rotation.copy( wd.rotation );
	
	//var width = wd.userData.door.width / 2 + 0.3;
	var minZ = wd.userData.door.form.v.minZ;
	var maxZ = wd.userData.door.form.v.maxZ;
	
	var v = obj.geometry.vertices;
	
	for ( var i = 0; i < minZ.length; i++ ) { v[minZ[i]].z -= 3.2; }
	for ( var i = 0; i < maxZ.length; i++ ) { v[maxZ[i]].z += 3.2; }

	return obj;		
}



// вырезаем отверстие под окно/дверь 
function MeshBSP( wd, objsBSP, wall )
{  
	if(!wall) wall = wd.userData.door.wall;
	
	var wallClone = objsBSP.wall;
	var wdClone = objsBSP.wd;
	
	wdClone.position.copy( wd.position );

	var wdBSP = new ThreeBSP( wdClone );    
	var wallBSP = new ThreeBSP( wallClone ); 			// копируем выбранную стену	
	var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы
	
	
	wallClone.geometry.dispose();
	wall.geometry.dispose();	
	
	wall.geometry = newBSP.toGeometry();		
	wall.geometry.computeFaceNormals();
 
	for ( var i = 0; i < wall.geometry.faces.length; i++ )
	{
		wall.geometry.faces[i].normal.normalize();
		if(wall.geometry.faces[i].normal.z == 1) { wall.geometry.faces[i].materialIndex = 1; }
		else if(wall.geometry.faces[i].normal.z == -1) { wall.geometry.faces[i].materialIndex = 2; }
		else if(wall.geometry.faces[i].normal.y == 1) { wall.geometry.faces[i].materialIndex = 3; }
		else if(wall.geometry.faces[i].normal.y == -1) { wall.geometry.faces[i].materialIndex = 3; }
	}
	
}

 
 
 
 // создаем копии стен (для ThreeBSP) без окон/дверей (запускается один раз, когда начали перемещать точку)
function clickMovePoint_BSP( arrW ) 
{
	console.log('click_BSP_1');
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i]; 
		
		//if(wall.userData.wall.arrO.length == 0) continue;
		
		var p1 = wall.userData.wall.p[0].position;
		var p2 = wall.userData.wall.p[1].position;	
		var d = p1.distanceTo( p2 );		
		
		wall.geometry.dispose();
		wall.geometry = createGeometryWall(d, wall.userData.wall.height_1, wall.userData.wall.width, wall.userData.wall.offsetZ);	// обновляем стену до простой стены		
		 
		// добавляем откосы
		var v = wall.geometry.vertices;
		for ( var i2 = 0; i2 < v.length; i2++ ) { v[i2] = wall.userData.wall.v[i2].clone(); }	
		wall.geometry.verticesNeedUpdate = true;
		wall.geometry.elementsNeedUpdate = true;	
		wall.geometry.computeBoundingSphere();
	}
}
 
 
// сняли клик, после перемещения точки (вставляем wd)
function clickPointUP_BSP( arrW )   
{
	console.log('click_BSP_2');
	
	for ( var i = 0; i < arrW.length; i++ )
	{
		var wall = arrW[i];
		
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ )
		{
			var wd = wall.userData.wall.arrO[i2];
			
			var wdClone = createCloneWD_BSP( wd );
			
			objsBSP = { wall : wall, wd : wdClone };		
			
			MeshBSP( wd, objsBSP );			
		}
		
		upUvs_1( wall );
		boxUnwrapUVs(wall.geometry);		
	}
} 





 
 