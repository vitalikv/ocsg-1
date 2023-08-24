

class MyObjPrimitives 
{
	crBox()
	{
		let g = new THREE.BoxGeometry( 1, 1, 1 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );	//side: THREE.DoubleSide
		
		let mesh = new THREE.Mesh( g, this.material2 );
		myTexture.setImage({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}
	
	crSphere()
	{
		let g = new THREE.SphereGeometry( 0.5, 16, 16 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );	

		let mesh = new THREE.Mesh( g, this.material2 );
		myTexture.setImage({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}
	
	crCylinder()
	{
		let g = new THREE.CylinderGeometry( 0.5, 0.5, 1, 16 );
		let material = new THREE.MeshStandardMaterial( { color : 0xffffff, lightMap : lightMap_1 } );	

		let mesh = new THREE.Mesh( g, this.material2 );
		myTexture.setImage({obj: mesh, material: { img: 'img/load/beton.jpg' } });				
		
		let obj = this.getBox([mesh]);
		
		return obj;
	}	

	// получаем габариты объекта и строим box-форму
	getBox(arr)
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
	

	// выбрали текстуру из меню 
	clickBtnChangeTextureObj3D({url})
	{	
		const obj = myComposerRenderer.getOutlineObj();
		
		if(!obj) return;
		if(obj.userData.tag !== 'obj') return;	
		
		myTexture.setImage({obj: obj.children[0], material: { img: url } }); 	
	}
}














