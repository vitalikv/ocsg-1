

class MyGridWf 
{
	geomPoint;
	matGrid;
	matPoint;
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.matGrid = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, lightMap: lightMap_1 });
		//this.matGrid.visible = false;
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
	}
	
	initTest()
	{
		const grid = this.crGrid({});
		const result = this.getBoundBox({obj: grid});
		this.crLinesGrid({box: result.box, x: result.x, z: result.z});		
	}
	
	crGrid({id = null, idLevel = null})
	{
		const points = [];
		points.push(new THREE.Vector2(-3, -1));
		points.push(new THREE.Vector2(-1, 2));
		points.push(new THREE.Vector2(2, 1));
		points.push(new THREE.Vector2(2, -2));
		
		const arrPoints = this.crPoints({points});
		
		const geometry = this.crGeometry({points});		
				
		const obj = new THREE.Mesh( geometry, this.matGrid ); 
		//obj.position.set( 0, points[0].y, 0 );	

		if(!id) { id = countId; countId++; }
		
		obj.userData.tag = 'gridWf';
		obj.userData.id = id;
		obj.userData.arrPoints = arrPoints;

		myWarmFloor.addToArray({obj, type: 'grids', idLevel});
		
		scene.add(obj);
		
		return obj;		
	}

	crPoints({points})
	{
		const arrP = [];
		
		for ( let i = 0; i < points.length; i++ ) 
		{  
			const obj = this.crPoint({pos: new THREE.Vector3(points[i].x, 0, points[i].y)});
			arrP.push(obj);
		}

		return arrP;
	}
	
	crPoint({pos})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint ); 

		obj.userData.tag = 'gridPointWf';		
		obj.position.copy(pos);		
		scene.add( obj );

		return obj;
	}
	
	
	// получаем точки стеки
	getPoints({obj})
	{
		return obj.userData.arrPoints;
	}
	
	crGeometry({points, depth = 0.1})
	{
		let geometry = null;
		
		const form = [];
		for ( let i = 0; i < points.length; i++ ) 
		{  
			form.push(new THREE.Vector2(points[i].x, -points[i].y));		
		}	 
		
		const shape = new THREE.Shape( form );
		
		geometry = new THREE.ExtrudeGeometry(shape, { bevelEnabled: false, depth });
		geometry.rotateX(-Math.PI / 2);

		
		return geometry;
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







