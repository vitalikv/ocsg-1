

class MyWarmFloor 
{
	myPointWf;
	myPointWfMove;
	myTubeWf;
	points = [];
	tubes = [];
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.myPointWf = new MyPointWf();
		this.myPointWfMove = new MyPointWfMove();
		this.myTubeWf = new MyTubeWf();
	}
	
	// проверка куда кликнули (попали на точку или трубу)
	clickRayhit({event, type})
	{
		let rayhit = null;
		const array = (type === 'points') ? this.points : this.tubes;
		const ray = rayIntersect( event, array, 'arr' );
		if(ray.length > 0) rayhit = ray[0];

		return rayhit;
	}
	
	// добавляем точку или трубу в массив
	addToArray({obj, type})
	{
		if(type === 'points') this.points.push(obj);
		if(type === 'tubes') this.tubes.push(obj);
	}

	// удаляем точку или трубу уз массива
	deleteFromArray({obj, type})
	{
		let array = [];
		if(type === 'points') array = this.points;
		if(type === 'tubes') array = this.tubes;
		
		const index = array.indexOf(obj);
		if (index > -1) array.splice(index, 1);		
	}
	
	
	// удаляем точку или трубу из сцены
	deleteObj({obj})
	{
		let result = {del: {points: [], tube: null, line: null}, up: {tube: null, line: null}};
		
		if(obj.userData.tag === 'pointWf')
		{
			result = this.checkDelPointWf({result, point: obj});
			
			// обновляем линию
			if(result.up.line) this.myTubeWf.upLine({line: result.up.line, delPoint: obj});
			
			// удаляем точки
			result.del.points.forEach((o) => { this.myPointWf.deletePointWf({obj: o}); });
			
			// удаляем линию
			if(result.del.line)	this.myTubeWf.deleteTubeWf({obj: result.del.line});			
		}
		
	}
	
	// проверка перед удалением точки
	checkDelPointWf({result, point})
	{		
		const line = point.userData.line;
		
		result.del.points.push(point);
		
		if(line)
		{
			const countP = this.myTubeWf.getCountPointsInLine({line});
			const index = this.myTubeWf.existPointOnLine({line, point});
			
			if(countP === 2)
			{
				const index2 = (index === 0) ? 1 : 0;
				const point2 = this.myTubeWf.getPointInArrayLine({line, index: index2});
				result.del.points.push(point2);
				result.del.line = line;
			}
			else
			{
				result.up.line = line;
			}
		}
		
		return result;
	}	
}







