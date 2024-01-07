

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
	

	// создаем новую трубу
	crTube({points, id = null, idLevel = null})
	{
		const geometry = this.getGeometryTube({points});
	
		const tube = new THREE.Mesh(geometry, this.material);			

		if(!id) { id = countId; countId++; }	
		tube.userData.id = id;	
		tube.userData.tag = 'tubeWf';
		tube.userData.points = points;
		
		myWarmFloor.addToArray({obj: tube, type: 'tubes', idLevel});
		
		scene.add( tube );	
		
		return tube;
	}
		
	
	// обновляем трубу
	upTube({tube, addPoint = null, delPoint = null})
	{
		if(addPoint) 
		{
			tube.userData.points.push(addPoint);
		}
		if(delPoint) 
		{
			const index = tube.userData.points.indexOf(delPoint);
			if (index > -1) tube.userData.points.splice(index, 1);
		}
				
		const points = tube.userData.points;		
		const geometry = this.getGeometryTube({points});
		
		tube.geometry.dispose();
		tube.geometry = geometry;			
	}	
	
	// рассчитываем геометрию трубы
	getGeometryTube({points})
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

		return geometry;
	}

	
	// существует ли точка на трубе
	existPointOnTube({tube, point})
	{
		const index = tube.userData.points.indexOf(point);
		
		return index;
	}
	
	
	// получаем кол-во точек из скольких состоит линия (нужно для проверки при удалении точки)
	getCountPointsInTube({tube})
	{
		return tube.userData.points.length;
	}
	
	// получаем точку из массива трубы
	getPointInArrayTube({tube, index})
	{
		return tube.userData.points[index];
	}

	// получаем все толчки из массива трубы
	getPointsInArrayTube({tube})
	{
		return tube.userData.points;
	}
	
	// удаляем трубу
	deleteTubeWf({obj})
	{
		myWarmFloor.deleteFromArray({obj, type: 'tubes'}); 
		disposeHierchy({obj});
		scene.remove(obj);
	}	
}







