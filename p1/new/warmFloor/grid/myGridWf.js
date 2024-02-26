

class MyGridWf 
{
	myGridLinesWf;
	matGrid;
	
	constructor()
	{
		this.myGridLinesWf = new MyGridLinesWf();
		this.matGrid = new THREE.MeshStandardMaterial({ color: 0xe3e3e5, lightMap: lightMap_1 });
		//this.matGrid.visible = false;
	}
	
	initTest()
	{
		const grid = this.crGrid({});
		const result = this.myGridLinesWf.getBoundBox({obj: grid});
		const objLines = this.myGridLinesWf.crLinesGrid({x: result.x, z: result.z, centerPos: result.centerPos});

		grid.userData.objLines = objLines;
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
	
	// создаем геометрию стеки
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

		this.myGridLinesWf.upGeometryGridLines({obj});
	}	
	

	render()
	{
		renderCamera();
	}
}







