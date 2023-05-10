

class MyCsgBox
{
	
	init()
	{
		let arrW = [];
		let level = myLevels.levels;
		
		for(let i = 0; i < level.length; i++)
		{
			let arr = level[i].wall.map((w) => w);
			arrW.push(...arr);
		}
		
		console.log(arrW);
		this.calc(arrW);
	}
	
	
	calc(arrW)
	{
		let material = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 1, depthTest: false });
		let geometry = createGeometryCube(0.5, 0.5, 0.5);		
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		let cube = new THREE.Mesh( geometry, material ); 
		cube.position.set(2.710081044870349, 1, 1.9361552454651165);
		scene.add(cube);
		
		for(let i = 0; i < arrW.length; i++)
		{
			let box = this.getBox(arrW[i]);
			scene.add(box);
			//console.log(box);
			this.containsPoint( cube.position, box );
		}
		
		renderCamera();
	}
	
	// получаем габариты объекта и строим box-форму
	getBox(obj)
	{		
		let v = [];
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();	

		let bound = obj.geometry.boundingBox;

		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( obj.matrixWorld );

		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( obj.matrixWorld );		

		
		bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		let x = (bound.max.x - bound.min.x);
		let y = (bound.max.y - bound.min.y);
		let z = (bound.max.z - bound.min.z);	
		
		let material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false, wireframe: true });
		let geometry = createGeometryCube(x, y, z);	
		
		v = geometry.vertices;
		v[0].x = v[1].x = v[6].x = v[7].x = bound.min.x;
		v[3].x = v[2].x = v[5].x = v[4].x = bound.max.x;

		v[0].y = v[3].y = v[4].y = v[7].y = bound.min.y;
		v[1].y = v[2].y = v[5].y = v[6].y = bound.max.y;
		
		v[0].z = v[1].z = v[2].z = v[3].z = bound.max.z;
		v[4].z = v[5].z = v[6].z = v[7].z = bound.min.z;		
			
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		let box = new THREE.Mesh( geometry, material ); 	
		
		box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	

		return box;
	}


	containsPoint( point, box ) 
	{
		let bound = box.geometry.boundingBox;
		
		let result = point.x < bound.min.x || point.x > bound.max.x ||
			point.y < bound.min.y || point.y > bound.max.y ||
			point.z < bound.min.z || point.z > bound.max.z ? false : true;
			
		if(result) box.material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 1, depthTest: false, wireframe: true });	
	}		
}

let myCsgBox = new MyCsgBox();	









