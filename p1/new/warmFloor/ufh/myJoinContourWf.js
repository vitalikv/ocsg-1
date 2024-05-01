
// класс объединение всех конуров в один
class MyJoinContourWf
{
	lineWf = null;
	pointsObj = [];
	
	constructor()
	{
		
	}
	
	
	joinForms({startPos, formSteps})
	{
		this.delete();
		
		const pointsPos = [];
		
		for ( let i = 0; i < formSteps.length; i++ )
		{
			const result = this.testCutForm({startPos, formPoints: formSteps[i][0]});
			
			if(result.newPos)
			{
				startPos = result.newPos;			
				pointsPos.push(...result.formPoints2);				
			}
			else
			{
				break;
			}
		}

		this.crLine({pointsPos});
	}
	
	
	
	testCutForm({startPos, formPoints})
	{
		let newPos = null;
		
		const arrP = [];
		const v = [...formPoints];
		v.push(v[0]);
		for ( let i = 0; i < v.length - 1; i++ )
		{
			const pos = myMath.mathProjectPointOnLine2D({A: v[i], B: v[i + 1], C: startPos});
			const onLine = myMath.checkPointOnLine(v[i], v[i + 1], startPos);
			
			if(onLine)
			{
				const dist = pos.distanceTo(startPos);
				const normal = myMath.calcNormal2D({p1: v[i], p2: v[i + 1], reverse: true});
				
				const pos2 = v[i + 1].clone().sub(v[i]).normalize();
				pos2.x *= -0.3;
				pos2.z *= -0.3;
				pos2.add(pos);
				
				arrP.push({ind: i, pos, dist, normal, pos2});				
			}
		}
		
		let formPoints2 = [...formPoints];
		
		if(arrP.length > 0)
		{
			arrP.sort((a, b) => { return a.dist - b.dist; });
			const p1 = myWarmFloor.myUlitkaWf.crHelpBox({pos: arrP[0].pos, color:  0xff0000});
			this.pointsObj.push(p1);
			
			newPos = arrP[0].pos2.clone();			
			const p2 = myWarmFloor.myUlitkaWf.crHelpBox({pos: newPos, color:  0xff0000});
			this.pointsObj.push(p2);
			
			let v = [...formPoints];

			if(arrP[0].ind === v.length - 1)
			{
				v.splice(arrP[0].ind + 1, 0, newPos);	// встявляем элемент в массив по индексу
				v.splice(0, 0, arrP[0].pos);				
			}
			else
			{
				v.splice(arrP[0].ind + 1, 0, newPos);	// встявляем элемент в массив по индексу
				v.splice(arrP[0].ind + 2, 0, arrP[0].pos);	
				
				v = myMath.offsetArrayToFirstElem({arr: v, index: arrP[0].ind + 2});				
			}
			
			formPoints2 = v;
		}

		return { newPos, formPoints2 };
	}	
	
	
	crLine({pointsPos})
	{
		const geometry = new THREE.Geometry();
		geometry.vertices = pointsPos;		
		const material = new THREE.LineBasicMaterial({ color:  0x0000ff });		
		const line = new THREE.Line( geometry, material );
		scene.add( line );

		this.lineWf = line;
		
		this.render();
	}


	delete()
	{
		const points = this.pointsObj;
		
		for ( let i = 0; i < points.length; i++ )
		{
			scene.remove(points[i]);
		}
		
		this.pointsObj = [];
		
		if(this.lineWf)
		{
			this.lineWf.geometry.dispose();
			scene.remove(this.lineWf);			
		}

		this.lineWf = null;
	}
	
	
	render()
	{
		renderCamera();
	}

}







