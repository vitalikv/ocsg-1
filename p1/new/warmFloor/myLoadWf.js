

class MyLoadWf 
{

	load({data})
	{
		const levels = data.levels;
		
		for ( let i = 0; i < levels.length; i++ )
		{
			const idLevel = i;
			
			for ( let i2 = 0; i2 < levels[i].tubes.length; i2++ )
			{
				const t = levels[i].tubes[i2];
				const id = t.id;
				const minY = t.pos.y;
				const diameter = (t.d) ? t.d : undefined;
				const color = (t.color) ? t.color : undefined;
				const p = t.p;
									
				const arrP = [];
				
				for ( let i3 = 0; i3 < p.length; i3++ )
				{
					const id = p[i3].id;
					const pos = p[i3].pos;
					pos.y -= minY;
					
					const point = myWarmFloor.myPointWf.crPoint({pos, id, idLevel});
					point.visible = false;
					arrP.push(point);
				}
				
				const tube = myWarmFloor.myTubeWf.crTube({points: arrP, id, idLevel, diameter});
				tube.position.y += minY;
				
				if(color)
				{
					myWarmFloor.myTubeWf.changeColorTube({tube, color});
				}
				
				for ( let i3 = 0; i3 < arrP.length; i3++ )
				{
					arrP[i3].position.y += minY;
					arrP[i3].userData.tube = tube;
				}				
			}
			
		}
	}
	
}







