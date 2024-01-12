

class MySaveWf 
{

	// собираем данные для сохренения теплого пола на всех этажах
	save({posY})
	{
		const levels = [];
		const count = myWarmFloor.levels.length;
		
		for ( let i = 0; i < count; i++ )
		{		
			const objs = myWarmFloor.getObjsActLevel(i);
			
			const tubes = [];
			
			for ( let i2 = 0; i2 < objs.tubes.length; i2++ )
			{
				const points = myWarmFloor.myTubeWf.getPointsInArrayTube({tube: objs.tubes[i2]});
				
				const data = {};
				data.id = objs.tubes[i2].userData.id;
				data.pos = objs.tubes[i2].position.clone();
				data.pos.y -= posY;
				data.d = myWarmFloor.myTubeWf.getDiameterTube({tube: objs.tubes[i2]});
				data.p = [];
				
				for ( let i3 = 0; i3 < points.length; i3++ )
				{
					const pos = points[i3].position.clone();
					pos.y -= posY;
					
					data.p.push({id: points[i3].userData.id, pos});
				}
				
				tubes.push(data);
			}
			
			levels.push({tubes});
		}

		return {levels};
	}
	
}







