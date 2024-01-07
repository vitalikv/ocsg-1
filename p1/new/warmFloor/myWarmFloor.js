

class MyWarmFloor 
{
	myPointWf;
	myPointWfMove;
	myTubeWf;
	levels = [];
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.initLevels();
		this.myPointWf = new MyPointWf();
		this.myPointWfMove = new MyPointWfMove();
		this.myTubeWf = new MyTubeWf();
	}
	
	initLevels()
	{
		this.levels[0] = {points: [], tubes: []};
		this.levels[1] = {points: [], tubes: []};
		this.levels[2] = {points: [], tubes: []};
		this.levels[3] = {points: [], tubes: []};
	}
	
	// проверка куда кликнули (попали на точку или трубу)
	clickRayhit({event, type})
	{
		const id = myLevels.getIdActLevel();
		
		let rayhit = null;
		const array = (type === 'points') ? this.levels[id].points : this.levels[id].tubes;
		const ray = rayIntersect( event, array, 'arr' );
		if(ray.length > 0) rayhit = ray[0];

		return rayhit;
	}
	
	// добавляем точку или трубу в массив
	addToArray({obj, type})
	{
		const id = myLevels.getIdActLevel();
		
		if(type === 'points') this.levels[id].points.push(obj);
		if(type === 'tubes') this.levels[id].tubes.push(obj);
	}

	// удаляем точку или трубу уз массива
	deleteFromArray({obj, type})
	{
		const id = myLevels.getIdActLevel();
		
		let array = [];
		if(type === 'points') array = this.levels[id].points;
		if(type === 'tubes') array = this.levels[id].tubes;
		
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
			
			// обновляем линию
			if(result.up.tube) this.myTubeWf.upTube({tube: result.up.tube, delPoint: obj});
			
			// удаляем точки
			result.del.points.forEach((o) => { this.myPointWf.deletePointWf({obj: o}); });
			
			// удаляем линию
			if(result.del.tube)	this.myTubeWf.deleteTubeWf({obj: result.del.tube});			
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
}







