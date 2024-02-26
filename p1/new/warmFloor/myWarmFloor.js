

class MyWarmFloor 
{
	myGridWf;
	myGridPointWf;
	myGridWfMove;
	myGridPointWfMove;
	
	myPointWf;
	myPointWfMove;
	myTubeWf;
	myTubeWfMove;
	mySaveWf;
	myLoadWf;
	levels = [];
	bdObjs = [];
	
	myObjsWfInit;
	myObjWfMove;
	
	myGeneratorWf
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.initLevels();
		
		this.myGridWf = new MyGridWf();
		this.myGridPointWf = new MyGridPointWf();
		this.myGridWfMove = new MyGridWfMove();
		this.myGridPointWfMove = new MyGridPointWfMove();
		
		this.myPointWf = new MyPointWf();
		this.myPointWfMove = new MyPointWfMove();
		this.myTubeWf = new MyTubeWf();
		this.myTubeWfMove = new MyTubeWfMove();
		this.mySaveWf = new MySaveWf();
		this.myLoadWf = new MyLoadWf();
		
		this.myObjsWfInit = new MyObjsWfInit();		
		this.myObjWfMove = new MyObjWfMove();
		
		this.myGeneratorWf = new MyGeneratorWf();
	}
	
	initLevels()
	{
		this.levels[0] = {points: [], tubes: [], grids: [], objs: []};
		this.levels[1] = {points: [], tubes: [], grids: [], objs: []};
		this.levels[2] = {points: [], tubes: [], grids: [], objs: []};
		this.levels[3] = {points: [], tubes: [], grids: [], objs: []};
	}
	
	// полчаем массив объектов активного этажа или выбранного по номеру
	getObjsActLevel(id = null)
	{
		if(id === null) id = myLevels.getIdActLevel();
		
		return this.levels[id];
	}
	
	// проверка куда кликнули (попали на точку или трубу)
	clickRayhit({event})
	{
		const list = this.getObjsActLevel();
		
		let rayhit = null;
		const array = [];
		
		const points = list.points.filter((p) => p.visible);
		
		const pointsGrids = [];
		for ( let i = 0; i < list.grids.length; i++ )
		{
			const pointsGrid = this.myGridWf.getPoints({obj: list.grids[i]});
			pointsGrids.push(...pointsGrid);
		}
		
		
		array.push(...points);		
		array.push(...list.tubes);
		array.push(...list.grids);
		array.push(...pointsGrids);
		array.push(...list.objs);
		
		
		const ray = rayIntersect( event, array, 'arr' );
		if(ray.length > 0) 
		{
			rayhit = ray[0];
			
			// если показываются точки у труб, ищем кликнули на них или нет
			for ( let i = 0; i < ray.length; i++ )
			{
				const index = list.points.indexOf(ray[i].object);
				
				if(index > -1)
				{
					rayhit = ray[i];
					break;
				}
			}
		}

		return rayhit;
	}
	
	// добавляем объект в бд, если объект уже загружался, брать его от туда
	addObjToBD({obj})
	{
		const { exists } = this.checkExistsObjToBD({typeObj: obj.userData.typeObj, lotid: obj.userData.lotid});
		
		if(!exists) this.bdObjs.push(obj.clone());
	}
	
	// проверяем если объект в бд
	checkExistsObjToBD({typeObj, lotid})
	{
		let exists = false;
		let obj = null;
		const bdObjs = this.bdObjs;
		
		for ( let i = 0; i < bdObjs.length; i++ )
		{
			if(typeObj === bdObjs[i].userData.typeObj && lotid === bdObjs[i].userData.lotid)
			{
				exists = true;
				obj = bdObjs[i].clone();
				break;
			}
		}

		return { exists, obj };
	}
	
	// добавляем объект в массив
	addToArray({obj, type, idLevel = null})
	{
		const list = this.getObjsActLevel(idLevel);
		
		if(type === 'points') list.points.push(obj);
		if(type === 'tubes') list.tubes.push(obj);
		if(type === 'grids') list.grids.push(obj);
		if(type === 'objs') list.objs.push(obj);
		
		if(type === 'objs') this.addObjToBD({obj});
	}

	// удаляем объект уз массива
	deleteFromArray({obj, type})
	{
		const list = this.getObjsActLevel();
		
		let array = [];
		if(type === 'points') array = list.points;
		if(type === 'tubes') array = list.tubes;
		if(type === 'objs') array = list.objs;
		
		const index = array.indexOf(obj);
		if (index > -1) array.splice(index, 1);		
	}
	
	
	// удаляем точку или трубу из сцены
	deleteObj({obj})
	{
		let result = {del: {points: [], tube: null}, up: {tube: null}};
		
		if(obj.userData.tag === 'pointWf')
		{
			result = this.checkDelPointWf({result, point: obj});
			
			// обновляем линию и удаляем из массива трубы точку
			if(result.up.tube) this.myTubeWf.upTube({tube: result.up.tube, delPoint: obj});
			
			// удаляем точки
			result.del.points.forEach((o) => { this.myPointWf.deletePointWf({obj: o}); });
			
			// удаляем линию
			if(result.del.tube)	this.myTubeWf.deleteTubeWf({obj: result.del.tube});			
		}
		
		if(obj.userData.tag === 'tubeWf')
		{
			const points = this.myTubeWf.getPointsInArrayTube({tube: obj});
			
			points.forEach((o) => { this.myPointWf.deletePointWf({obj: o}); });
			
			this.myTubeWf.deleteTubeWf({obj});
		}
		
		if(obj.userData.tag === 'objWf')
		{
			this.myObjsWfInit.deleteObjWf({obj});
		}		
	}
	
	// проверка перед удалением точки
	checkDelPointWf({result, point})
	{		
		const tube = point.userData.tube;
		
		result.del.points.push(point);
		
		if(tube)
		{
			const countP = this.myTubeWf.getCountPointsInTube({tube});
			const index = this.myTubeWf.existPointOnTube({tube, point});
			
			if(countP === 2)
			{
				const index2 = (index === 0) ? 1 : 0;
				const point2 = this.myTubeWf.getPointInArrayTube({tube, index: index2});
				result.del.points.push(point2);
				result.del.tube = tube;
			}
			else
			{
				result.up.tube = tube;
			}
		}
		
		return result;
	}


	// собираем данные для сохренения теплого пола на всех этажах
	getDataForSave({posY})
	{
		return this.mySaveWf.save({posY});
	}
	
	load({data})
	{
		this.myLoadWf.load({data});
	}

}







