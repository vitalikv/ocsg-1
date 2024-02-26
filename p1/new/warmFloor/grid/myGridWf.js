

class MyGridWf 
{
	matGrid;
	
	constructor()
	{
		this.matGrid = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, lightMap: lightMap_1 });
		//this.matGrid.visible = false;
	}
	
	initTest()
	{
		const grid = this.crGrid({});
		const result = this.getBoundBox({obj: grid});
		this.crLinesGrid({box: result.box, x: result.x, z: result.z});		
	}
	
	crGrid({id = null, idLevel = null})
	{
		const arrPos = [];
		arrPos.push(new THREE.Vector3(-3, 0, -1));
		arrPos.push(new THREE.Vector3(-1, 0, 2));
		arrPos.push(new THREE.Vector3(2, 0, 1));
		arrPos.push(new THREE.Vector3(2, 0, -2));
		
		const geometry = this.crGeometry({arrPos});						
		const obj = new THREE.Mesh( geometry, this.matGrid ); 
		//obj.position.set( 0, points[0].y, 0 );	

		const arrPoints = myWarmFloor.myGridPointWf.crPoints({arrPos, grid: obj});
		
		if(!id) { id = countId; countId++; }		
		obj.userData.tag = 'gridWf';
		obj.userData.id = id;
		obj.userData.arrPoints = arrPoints;

		myWarmFloor.addToArray({obj, type: 'grids', idLevel});
		
		scene.add(obj);
		
		return obj;		
	}	
	
	// получаем точки стеки
	getPoints({obj})
	{
		return obj.userData.arrPoints;
	}
	
	crGeometry({arrPos, depth = 0.1})
	{
		let geometry = null;
		
		const form = [];
		for ( let i = 0; i < arrPos.length; i++ ) 
		{  
			form.push(new THREE.Vector2(arrPos[i].x, -arrPos[i].z));		
		}	 
		
		const shape = new THREE.Shape( form );
		
		geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth });
		geometry.rotateX(-Math.PI / 2);

		
		return geometry;
	}

	// обновляем geometry у сетки
	upGeometryGrid({obj, addPoint = null, delPoint = null})
	{
		if(addPoint) 
		{
			//tube.userData.points.push(addPoint);
		}
		if(delPoint) 
		{
			//const index = tube.userData.points.indexOf(delPoint);
			//if (index > -1) tube.userData.points.splice(index, 1);
		}
					
		const points = this.getPoints({obj});
		const arrPos = points.map((p) => p.position);
		
		const geometry = this.crGeometry({arrPos});
		
		obj.geometry.dispose();
		obj.geometry = geometry;			
	}	

	// получаем прямоугольник в который полностью попадает grid
	getBoundBox({obj})
	{
		obj.geometry.computeBoundingBox();	
		let bound = obj.geometry.boundingBox;
		
		const v = [];
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.min.z).applyMatrix4( obj.matrixWorld );

		bound = { min : { x : Infinity, z : Infinity }, max : { x : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		const centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), 0, ((bound.max.z - bound.min.z)/2 + bound.min.z));
		const x = (bound.max.x - bound.min.x);
		const y = 0.5;
		const z = (bound.max.z - bound.min.z);	

		const geometry = new THREE.BoxGeometry(x, y, z);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, depthTest: false });
		material.visible = false;
		
		const box = new THREE.Mesh( geometry, material );
		box.position.add(centerPos);
		scene.add(box);
		
		return {box, x, z};
	}
	
	
	crLinesGrid({box, x, z})
	{
		let size = 0.5;	// размер ячейки
		
		let countX = Math.floor(x/size);
		let countZ = Math.floor(z/size);
		
		let ofssetX = (countX * size) / 2;
		let ofssetZ = (countZ * size) / 2;
		
		const geomX = new THREE.BoxGeometry(z, 0.01, 0.01);
		const geomZ = new THREE.BoxGeometry(x, 0.01, 0.01);
		let matL = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1.0, depthTest: false });
		
		for ( let i = 0; i <= countX; i ++ ) 
		{
			let lineX = new THREE.Mesh( geomX, matL );
			lineX.position.x = ( i * size ) - ofssetX;
			lineX.rotation.y = 90 * Math.PI / 180;
			//console.log(( i * size ) - (count * size) / 2);
			box.add( lineX );
		}

		for ( let i = 0; i <= countZ; i ++ ) 
		{
			let lineZ = new THREE.Mesh( geomZ, matL );
			lineZ.position.z = ( i * size ) - ofssetZ;
			box.add( lineZ );
		}		
	}
	
	
	render()
	{
		renderCamera();
	}
}







