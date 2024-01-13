

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
		this.material = new THREE.MeshStandardMaterial({ color: 0xcccccc, lightMap: lightMap_1, side: THREE.DoubleSide });
	}
	

	// создаем новую трубу
	crTube({points, id = null, idLevel = null, diameter = 0.05})
	{
		const geometry = this.getGeometryTube({points, diameter});
	
		const tube = new THREE.Mesh(geometry, this.material.clone());			

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
				
		const points = this.getPointsInArrayTube({tube});
		const diameter = this.getDiameterTube({tube});
		const geometry = this.getGeometryTube({points, diameter});
		
		tube.geometry.dispose();
		tube.geometry = geometry;			
	}	
	
	// рассчитываем геометрию трубы
	getGeometryTube({points, diameter = 0.05})
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

	// получаем все точки из массива трубы
	getPointsInArrayTube({tube})
	{
		return tube.userData.points;
	}
	
	// скрываем показываем точки у трубы
	visiblePointsOnTube({tube, visible})
	{
		const points = this.getPointsInArrayTube({tube});
		
		points.forEach((p) => { p.visible = visible; });
	}
	
	// получаем длину трубы
	getLengthTube({tube})
	{
		const points = this.getPointsInArrayTube({tube});

		let length = 0;
		for(let i = 0; i < points.length - 1; i++) 
		{ 
			length += points[i].position.distanceTo(points[i + 1].position); 
		}	
		
		length = Math.round(length * 100)/100;
		
		return length;
	}


	// получаем диаметр трубы
	getDiameterTube({tube})
	{
		return tube.geometry.parameters.radius * 2;
	}


	// изменяем диаметр трубы
	changeDiameterTube({tube, diameter})
	{		
		tube.geometry.parameters.radius = diameter / 2;
		
		const points = this.getPointsInArrayTube({tube});
		
		this.upTube({tube});
		
		this.render();
	}


	// получаем цвет трубы
	getColorTube({tube})
	{
		return tube.material.color;
	}

	// изменяем цвет трубы
	changeColorTube({tube, color})
	{
		tube.material.color = new THREE.Color( color );
		tube.material.needsUpdate = true;
		
		this.render();
	}	
	
	// удаляем трубу
	deleteTubeWf({obj})
	{
		myWarmFloor.deleteFromArray({obj, type: 'tubes'}); 
		disposeHierchy({obj});
		scene.remove(obj);
		
		myManagerClick.hideMenuObjUI_2D();
	}

	
	render()
	{
		renderCamera();
	}
}







