

class MyRoofCSG 
{

	// получаем модифицированную клон-крышу, с высокими откасами, чтобы резать стены
	crRoofMod( obj )
	{ 		
		obj.updateMatrixWorld(true);
		let g = obj.children[0].children[0].geometry;
		
		let geometry = new THREE.Geometry().fromBufferGeometry(g);
		
		geometry.computeFaceNormals();		
		
		var faces = geometry.faces;		
		
		let arrV = [];
		for (var i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.z < 0.8) continue;

			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
		}
		
		let n = arrV.length;
		
		for (var i = 0; i < geometry.vertices.length; i++)
		{
			for (var i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (var i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].z += 5; 		
		}
		
		//geometry.vertices = v;
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	

		let obj2 = new THREE.Mesh( geometry, this.material2 );
		obj2.position.copy(obj.position);
		obj2.rotation.copy(obj.children[0].children[0].rotation);
		//obj2.position.y = +0;
		obj2.scale.set(obj.scale.x, obj.scale.z, obj.scale.y);	// объект из 3ds , поэтому оси не равны y z
		scene.add( obj2 );

		return obj2;
	}	

	

	
	// обновление обрезаных стен
	updateCgsRoof()
	{
		if(!myCameraOrbit.activeCam.userData.isCam3D) return;
		
		this.resetWall({force: true});
		this.cgs();
	}
	
	// старт обрезание стен крышами
	cgs()
	{
		let level = myLevels.levels;
		let arr = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				this.cgs_2(level[i].roof[i2]);
			}
		}
	}
	
	cgs_2(roof)
	{		
		console.log('обрезаем стены крышами');
		
		let group = [];
		for(let i = 0; i < roof.children.length; i++)
		{
			let child = roof.children[i];
			
			let posW = child.getWorldPosition(new THREE.Vector3());
			let quaW = child.getWorldQuaternion(new THREE.Quaternion());							
			let scaW = child.getWorldScale(new THREE.Vector3());
			
			let roofClone = new THREE.Mesh(child.geometry.clone(), child.material);
			
			roofClone.position.copy( posW );
			roofClone.quaternion.copy( quaW );
			roofClone.scale.copy( scaW );
			
			this.crRoofMod_2( roofClone );
			
			group.push(roofClone);
		}
		
		for(let i = 0; i < group.length; i++)
		{
			//group[i].position.y += 1;
			//scene.add(group[i]);
			this.cutMeshBSP(group[i]);
			group[i].geometry.dispose();
		}		
	}

	
	// получаем модифицированную клон-крышу, с высокими откасами, чтобы резать стены
	crRoofMod_2( obj )
	{ 		
		obj.updateMatrixWorld();
		
		let geometry = obj.geometry;
		
		//geometry.computeFaceNormals();	не правильно (подсчитать нормали)		
		geometry.computeVertexNormals();	//правильно (подсчитать нормали)
		
		let faces = geometry.faces;		
		
		let arrV = [];
		for (let i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.y < 0.8) continue;

			let v1 = geometry.vertices[faces[i].a];
			let v2 = geometry.vertices[faces[i].b];
			let v3 = geometry.vertices[faces[i].c];							
			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
			
			let helperDir = false;
			if(helperDir)
			{
				let origin = v1.clone().applyMatrix4( obj.matrixWorld );
				let helper = new THREE.ArrowHelper(faces[i].normal, origin, 2, 0xff0000);
				helper.position.copy(origin);
				scene.add(helper);							
			}
		}
		

		for (let i = 0; i < geometry.vertices.length; i++)
		{
			for (let i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;				
				if(i2 === i) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					arrV[i] = geometry.vertices[i];
				}
			}			
		}		
		
		for (let i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].y += 15; 		
		}
		
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	
	}	


	// обрезаем стены всех этажей и полы
	cutMeshBSP(obj)
	{  
		const level = myLevels.levels;
		const w = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				w.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}		
		
		obj.updateMatrixWorld();
		let objBSP = new ThreeBSP( obj );
		
		for ( let i = 0; i < w.length; i++ )
		{
			if(w[i].geometry.vertices.length === 0) continue;
			
			w[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( w[i] );
			
			let newBSP = wBSP.subtract( objBSP );		// вычитаем из стены объект нужной формы
			
			w[i].geometry.dispose();				
			w[i].geometry = newBSP.toGeometry();
			
			//wall.geometry.computeVertexNormals();	
			w[i].geometry.computeFaceNormals();	
			boxUnwrapUVs(w[i].geometry);
			for ( let i2 = 0; i2 < w[i].geometry.faces.length; i2++ )
			{
				w[i].geometry.faces[i2].normal.normalize();
				if(w[i].geometry.faces[i2].normal.z == 1) { w[i].geometry.faces[i2].materialIndex = 1; }
				else if(w[i].geometry.faces[i2].normal.z == -1) { w[i].geometry.faces[i2].materialIndex = 2; }
				else if(w[i].geometry.faces[i2].normal.x == 1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else if(w[i].geometry.faces[i2].normal.x == -1) { w[i].geometry.faces[i2].materialIndex = 0; }
				else { w[i].geometry.faces[i2].materialIndex = 3; }
			}
		}
		
		for ( let i = 0; i < f.length; i++ )
		{
			if(f[i].geometry.vertices.length === 0) continue;
			
			f[i].updateMatrixWorld();
			let wBSP = new ThreeBSP( f[i] );
			
			let newBSP = wBSP.subtract( objBSP );	
			
			f[i].geometry.dispose();				
			f[i].geometry = newBSP.toGeometry();

			myHouse.myFloor.upFaceGeometry({geometry: f[i].geometry});

			boxUnwrapUVs(f[i].geometry);			
		}
	}


	// восстанавливаем все стены и пол
	resetWall({force = false} = {})   
	{
		const level = myLevels.levels;
		let count = 0;
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].roof.length; i2++)
			{
				count++;
			}
		}	

		if(!force && count === 0) return;
		
		console.log('восстанавливаем все стены после крыш');

		
		const arrW = [];
		const f = [];
		
		for(let i = 0; i < level.length; i++)
		{
			for(let i2 = 0; i2 < level[i].wall.length; i2++)
			{
				arrW.push(level[i].wall[i2]);
			}
			
			for(let i2 = 0; i2 < level[i].floor.length; i2++)
			{
				f.push(level[i].floor[i2]);
			}			
		}
		
		for (let i = 0; i < arrW.length; i++)
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
			upUvs_1( wall ); 	// без этого не работает boxUnwrapUVs(wall.geometry)
		}
	
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
			
			boxUnwrapUVs(wall.geometry);
		}
		
		// восстанавливаем пол
		myHouse.myFloor.updateShapeFloors(f);		
	} 	
	

}










