

class MyTubeWf 
{
	geometry;
	material;
	defVert;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.material = new THREE.MeshStandardMaterial({ color: 0xcccccc, lightMap : lightMap_1 });
	}
	

	// создаем новую линию
	crLine({points, id = null})
	{
		const geometry = new THREE.Geometry();
		
		for(let i = 0; i < points.length; i++)
		{
			geometry.vertices.push(points[i].position);
		}
	
		const line = new THREE.Line( geometry, new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 2 }) );		

		if(!id) { id = countId; countId++; }	
		line.userData.id = id;	
		line.userData.tag = 'tubeWf';
		line.userData.points = points;
		
		scene.add( line );	
		
		myWarmFloor.addToArray({obj: line, type: 'tubes'});
		
		line.userData.tube = this.crTube({points});
		
		return line;
	}
	
	
	crTube({tube = null, points})
	{
		const arrPos = [];		
		for(let i = 0; i < points.length; i++) arrPos[i] = points[i].position.clone();
	
		const pipeSpline = new THREE.CatmullRomCurve3(arrPos);
		pipeSpline.curveType = 'catmullrom';
		pipeSpline.tension = 0;
		
		let length = 0;
		for(let i = 0; i < arrPos.length - 1; i++) 
		{ 
			length += arrPos[i].distanceTo(arrPos[i + 1]); 
		}		
		
		const diameter = 0.05;
		const inf = { extrusionSegments: Math.round(length * 50), radiusSegments: 12, closed: false };
		
		const geometry = new THREE.TubeBufferGeometry( pipeSpline, inf.extrusionSegments, diameter/2, inf.radiusSegments, inf.closed );	
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		if(!tube) 
		{
			tube = new THREE.Mesh(geometry, this.material);			
			scene.add( tube );			
		}
		else
		{
			tube.geometry.dispose();
			tube.geometry = geometry;			
		}

		return tube;
	}
	
	
	// обновляем геометрию линии
	upLine({line, addPoint = null, delPoint = null})
	{

		if(addPoint) 
		{
			line.userData.points.push(addPoint);
		}
		if(delPoint) 
		{
			const index = line.userData.points.indexOf(delPoint);
			if (index > -1) line.userData.points.splice(index, 1);
		}
		
		const geometry = new THREE.Geometry();
		const points = line.userData.points;
		
		for(let i = 0; i < points.length; i++)
		{
			geometry.vertices.push(points[i].position);
		}
		
		line.geometry.dispose();
		line.geometry = geometry;
		line.geometry.verticesNeedUpdate = true; 
		line.geometry.elementsNeedUpdate = true;

		this.crTube({tube: line.userData.tube, points});
	}
	
	
	// существует ли точка на линии
	existPointOnLine({line, point})
	{
		const index = line.userData.points.indexOf(point);
		
		return index;
	}
	
	
	// получаем кол-во точек из скольких состоит линия (нужно для проверки при удалении точки)
	getCountPointsInLine({line})
	{
		return line.userData.points.length;
	}
	
	// получаем точку из массива линии
	getPointInArrayLine({line, index})
	{
		return line.userData.points[index];
	}

	// удаляем трубу
	deleteTubeWf({obj})
	{
		console.log(myWarmFloor.tubes.length);
		myWarmFloor.deleteFromArray({obj, type: 'tubes'}); 
		disposeHierchy({obj});
		scene.remove(obj);
		console.log(myWarmFloor.tubes.length);
	}	
}







