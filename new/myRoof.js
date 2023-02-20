

class MyRoof 
{	
	getGeometry({x, y, z, h, x2, z2})
	{
		// h - высоты крыши
		// x2 - хз как описать, это чтобы приблизиться от краю к центру
		// z2 - хз как описать, это чтобы приблизиться от краю к центру
		
		let hY = 0;		// увеличиваем высоту крыши, чтобы обрезать стены над крышей
		
		let g = createGeometryCube(x, y, z);
		
		let vertices = 
		[
			new THREE.Vector3(-x-x, 0, z),
			new THREE.Vector3(-x-x, y + hY, z),
			new THREE.Vector3(x-x - x2, y + h + hY, z - z2),
			new THREE.Vector3(x-x - x2, 0 + h, z - z2),
			new THREE.Vector3(x-x - x2, 0 + h, -z + z2),
			new THREE.Vector3(x-x - x2, y + h + hY, -z + z2),
			new THREE.Vector3(-x-x, y + hY, -z),
			new THREE.Vector3(-x-x, 0, -z),
		];		
		
		g.vertices = vertices;
		g.verticesNeedUpdate = true;
		this.upUvsRoof( g );

		return g;
	}
	
	// 4-х скатная крыша
	initRoof()
	{
		let material = new THREE.MeshStandardMaterial( { color : 0x736a5a, lightMap : lightMap_1 } );	//side: THREE.DoubleSide
		
		let g = this.getGeometry({x: 2.5, y: 0.07, z: 5, h: 3, z2: 3, x2: 0});
		
		let obj1 = new THREE.Mesh( g, material );		
		
		let obj2 = new THREE.Mesh( g, material );
		obj2.rotation.y = Math.PI;		
		
		g = this.getGeometry({x: 2.5, y: 0.07, z: 5, h: 3, z2: 5, x2: 5 - 3});
		
		let obj3 = new THREE.Mesh( g, material );
		
		obj3.rotation.y = Math.PI/2;		
		
		let obj4 = new THREE.Mesh( g, material );
		obj4.rotation.y = -Math.PI/2;
		
		setTexture({obj: obj1, material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: 0x3f7337 });
		
		let roof = this.getBoxRoof([obj1, obj2, obj3, obj4]);
		
		return roof;
	}
	

	// 2-ная крыша
	initRoof_2()
	{
		let x = 2.5;
		let y = 0.07;
		let z = 5;
		
		let g = createGeometryCube(x, y, z);

		let hY = 0;		// высоты крыши, чтобы обрезать стены над крышей
		let h = 3;
		
		let vertices = 
		[
			new THREE.Vector3(-x-x, 0, z),
			new THREE.Vector3(-x-x, y + hY, z),
			new THREE.Vector3(x-x, y + h + hY, z),
			new THREE.Vector3(x-x, 0 + h, z),
			new THREE.Vector3(x-x, 0 + h, -z),
			new THREE.Vector3(x-x, y + h + hY, -z),
			new THREE.Vector3(-x-x, y + hY, -z),
			new THREE.Vector3(-x-x, 0, -z),
		];		
		
		g.vertices = vertices;
		g.verticesNeedUpdate = true;
		this.upUvsRoof( g );
		
		let material = new THREE.MeshStandardMaterial( { color : 0x736a5a, lightMap : lightMap_1 } );
		
		let obj1 = new THREE.Mesh( g, material );
		
		let obj2 = new THREE.Mesh( g, material );
		obj2.rotation.y = Math.PI;				
		setTexture({obj: obj1, material: { img: "img/load/roof_1.jpg" }, repeat: {x: 0.5, y: 0.5}, rotation: Math.PI/2, color: 0x3f7337 });
		
		let roof = this.getBoxRoof([obj1, obj2]);
		
		return roof;
	}

	// пересчет корректных uvs координат
	upUvsRoof( geometry )
	{ 
		geometry.faceVertexUvs[0] = [];
		let faces = geometry.faces;
		
		for (let i = 0; i < faces.length; i++) 
		{		
			let components = ['x', 'y', 'z'].sort(function(a, b) {
				return Math.abs(faces[i].normal[a]) > Math.abs(faces[i].normal[b]);
			});	


			let v1 = geometry.vertices[faces[i].a];
			let v2 = geometry.vertices[faces[i].b];
			let v3 = geometry.vertices[faces[i].c];				

			geometry.faceVertexUvs[0].push([
				new THREE.Vector2(v1[components[0]], v1[components[1]]),
				new THREE.Vector2(v2[components[0]], v2[components[1]]),
				new THREE.Vector2(v3[components[0]], v3[components[1]])
			]);
		}

		geometry.uvsNeedUpdate = true;
		geometry.elementsNeedUpdate = true;	
	}

	// получаем габариты объекта и строим box-форму
	getBoxRoof(arr)
	{		
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
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		var box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();

		for ( var i = 0; i < arr.length; i++ )
		{
			box.add(arr[i]);
		}
		
		//scene.add(box); не добавляем в сцену, так как будет добавлен через loadObjServer

		return box;
	}
	

}

let myRoof = new MyRoof();








