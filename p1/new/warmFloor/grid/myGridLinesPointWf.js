
// точки пересечения между линий сетки
class MyGridLinesPointWf 
{
	geomPoint;
	matPoint;
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.03, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0xff0000, lightMap: lightMap_1, transparent: true, opacity: 1.0, depthTest: false });
	}
	

	// создаем точки внутри формы сетки
	crTestPoints({objLines, arrPoints})
	{
		this.deletePointsTest({objLines});
		const {countX, countZ, size, ofssetX, ofssetZ, centerPos} = myWarmFloor.myGridWf.myGridLinesWf.getParamsGridLinesGeom({objLines});
		
		const geometry = new THREE.Geometry();
		
		const mergeGeom = false;
		let pointsTest = (!mergeGeom) ? [] : null;
		
		for ( let i = 0; i <= countX; i ++ )
		{
			for ( let i2 = 0; i2 <= countZ; i2 ++ )
			{
				const pos = new THREE.Vector3(( i * size ) - ofssetX, 0, ( i2 * size ) - ofssetZ).add(centerPos);
				
				const result = myMath.checkPointInsideForm({point: pos, arrP: arrPoints});
				
				if(!result) continue;
				
				if(mergeGeom)
				{
					const g = this.geomPoint.clone();
					g.translate(pos.x, pos.y, pos.z);
					geometry.merge(g);										
				}
				else
				{
					const point = new THREE.Mesh( this.geomPoint, this.matPoint );
					point.position.copy(pos);
					scene.add( point );	

					pointsTest.push(point);
				}
			}			
		}
		
		if(mergeGeom)
		{
			pointsTest = new THREE.Mesh( geometry, matPoint );
			scene.add( pointsTest );			
		}
		
		myWarmFloor.myGridWf.myGridLinesWf.setPointsTest({objLines, pointsTest});
	}
	

	// удаляем точки
	deletePointsTest({objLines})
	{
		const points = myWarmFloor.myGridWf.myGridLinesWf.getPointsTest({objLines});
		if(!points) return;
		
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
		}
	}	
}







