


class MyMath
{
	// сдвиг всего массива, так чтобы выбранный index оказался самым первым 
	// пример: myMath.offsetArrayToFirstElem({arr: [1,2,3,45,8,9,7,10], index: 5})
	// было arr = [1,2,3,45,8,9,7,10], index: 5
	// стало arr = [ 9, 7, 10, 1, 2, 3, 45, 8 ] 	
	offsetArrayToFirstElem({arr, index})
	{
		// index - выбранный id элемента, который будет самым первым после смещения
		const offsetInd = arr.length - index;
		
		arr = arr.map((el, i, array) => { return i < offsetInd ? array[array.length + i - offsetInd] : array[i - offsetInd] });

		return arr;
	}
	
	
	// перпендикуляр линии (2D)
	calcNormal2D({p1, p2, reverse = false})
	{
		let x = p1.z - p2.z;
		let z = p2.x - p1.x;

		// нормаль вывернуть в обратное напрвление
		if(reverse)
		{
			x *= -1;
			z *= -1;
		}
		
		return new THREE.Vector3(x, 0, z).normalize();								
	}
	
	// проекция точки(С) на прямую (A,B) (2D)
	mathProjectPointOnLine2D({A,B,C})
	{
		const x1 = A.x;
		const y1 = A.z; 
		const x2 = B.x; 
		const y2 = B.z; 
		const x3 = C.x; 
		const y3 = C.z;
		
		const px = x2 - x1;
		const py = y2 - y1; 
		const dAB = px * px + py * py;
		
		const u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
		const x = x1 + u * px;
		const z = y1 + u * py;
		
		return new THREE.Vector3(x, 0, z); 
	} 

	// проекция точки на линию (3D), получаем точку пересечения
	mathProjectPointOnLine3D(cdm)
	{
		var A = cdm.p[0];
		var B = cdm.p[1];
		var C = cdm.rayHit;
		
		var x1 = A.x;
		var y1 = A.y;
		var z1 = A.z;
		
		var x2 = B.x;
		var y2 = B.y;
		var z2 = B.z;
		
		var x3 = C.x;
		var y3 = C.y;
		var z3 = C.z;	
		
		var alpha = ((x3-x1)*(x2-x1) + (y3-y1)*(y2-y1) + (z3-z1)*(z2-z1)) / ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1));
		var pos = new THREE.Vector3(x1+alpha*(x2-x1), y1+alpha*(y2-y1), z1+alpha*(z2-z1));

		return pos;
	}
	
	// опредяляем, надодится точка D за пределами прямой или нет (точка D пересекает прямую АВ, идущая перпендикулярна от точки С)  
	checkPointOnLine(A,B,C)
	{	
		let AB = { x : B.x - A.x, y : B.z - A.z };
		let CD = { x : C.x - A.x, y : C.z - A.z };
		const r1 = AB.x * CD.x + AB.y * CD.y;				// скалярное произведение векторов

		AB = { x : A.x - B.x, y : A.z - B.z };
		CD = { x : C.x - B.x, y : C.z - B.z };
		const r2 = AB.x * CD.x + AB.y * CD.y;

		const cross = (r1 < 0 | r2 < 0) ? false : true;	// если true , то точка D находится на отрезке AB	
		
		return cross;
	}

	// попадает ли точка в граница отрезка 3D BoundBox
	checkPointBoundBoxLine(pointA, pointB, pointToCheck) 
	{
		if(pointToCheck.x < Math.min(pointA.x, pointB.x) || pointToCheck.x > Math.max(pointA.x, pointB.x)) { return false; }

		if(pointToCheck.y < Math.min(pointA.y, pointB.y) || pointToCheck.y > Math.max(pointA.y, pointB.y)) { return false; }

		if(pointToCheck.z < Math.min(pointA.z, pointB.z) || pointToCheck.z > Math.max(pointA.z, pointB.z)) { return false; } 

		return true;
	}	


	//прорека находится ли точка внутри многоугольника
	checkPointInsideForm({point, arrP})
	{
		point = (point instanceof THREE.Vector3) ? new THREE.Vector3(point.x, point.y, point.z) : point.position.clone(); 
		const p = (arrP[0] instanceof THREE.Vector3) ? arrP : arrP.map((p) => p.position);
		
		let result = false;
		
		let j = p.length - 1;
		for (let i = 0; i < p.length; i++) 
		{
			const calc1 = (p[i].z < point.z && p[j].z >= point.z || p[j].z < point.z && p[i].z >= point.z);
			const calc2 = (p[i].x + (point.z - p[i].z) / (p[j].z - p[i].z) * (p[j].x - p[i].x) < point.x);
			
			if(calc1 && calc2)
			{
				result = !result;
			}
				
			j = i;
		}
		
		return result;
	}


	// находим ближайшую точку 
	getClosestPoint({point, arrPoints})
	{
		let result = {minDist: Infinity, pos: new THREE.Vector3(), obj: null};
		
		const pos = point.position.clone();
		
		for ( let i = 0; i < points.length; i++ )
		{
			if(point === points[i]) continue;
			
			const pos2 = points[i].position.clone();
			
			const dist = pos.distanceTo(pos2);
			
			if (dist < result.minDist) 
			{
				result.minDist = dist;
				result.pos = pos2;
				result.obj = points[i];
			}			
		}
		
		return result;
	}


	// проверка на параллельность линий
	checkLinesParallel({ line1, line2 })
	{
		const line1start = line1.start;
		const line1end = line1.end;
		const line2start = line2.start;
		const line2end = line2.end;

		const denominator = ( line2end.z - line2start.z ) * ( line1end.x - line1start.x ) - ( line2end.x - line2start.x ) * ( line1end.z - line1start.z );

		const parallel = ( denominator == 0 ) ? true : false;
		
		return parallel;
	}

	// точка пересечения двух прямых 2D (1 вариант)
	intersectionTwoLines_1({ line1, line2 }) {
		const line1start = line1.start;
		const line1end = line1.end;
		const line2start = line2.start;
		const line2end = line2.end;

		const denominator =
			( line2end.z - line2start.z ) * ( line1end.x - line1start.x )
			- ( line2end.x - line2start.x ) * ( line1end.z - line1start.z );

		// параллельны
		if ( denominator == 0 ) 
		{ 
			const arrDist = [];
			arrDist[0] = { dist: line1start.distanceTo(line2start), pos: line1start};
			arrDist[1] = { dist: line1start.distanceTo(line2end), pos: line1start};
			arrDist[2] = { dist: line1end.distanceTo(line2start), pos: line1end};
			arrDist[3] = { dist: line1end.distanceTo(line2end), pos: line1end};
			
			arrDist.sort((a, b) => { return a.dist - b.dist; });
			
			return new THREE.Vector3( arrDist[0].pos.x, 0, arrDist[0].pos.z ); 
		} 

		const a =
			( ( line2end.x - line2start.x ) * ( line1start.z - line2start.z )
			- ( line2end.z - line2start.z ) * ( line1start.x - line2start.x ) ) / denominator;

		const x = line1start.x + ( a * ( line1end.x - line1start.x ) );
		const z = line1start.z + ( a * ( line1end.z - line1start.z ) );

		return new THREE.Vector3( x, 0, z );
	}	
	

	// точка пересечения двух прямых 2D (2 вариант, работает лучше)
	intersectionTwoLines_2(a1, a2, b1, b2)
	{
		const t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
		const t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);
		const f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001) return null; // паралельны
		
		const point = new THREE.Vector3();
		point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;		 
		
		return point;
	}
	
	
	intersectionTwoLines_3(a1, a2, b1, b2)
	{
		const t1 = DirectEquation(a1.x, a1.z, a2.x, a2.z);
		const t2 = DirectEquation(b1.x, b1.z, b2.x, b2.z);
		const f1 = DetMatrix2x2(t1[0], t1[1], t2[0], t2[1]);
		
		if(Math.abs(f1) < 0.0001) return null; // паралельны
		
		const point = new THREE.Vector3();
		point.x = DetMatrix2x2(-t1[2], t1[1], -t2[2], t2[1]) / f1;
		point.z = DetMatrix2x2(t1[0], -t1[2], t2[0], -t2[2]) / f1;		 
		
		return point;
	}	

	// Проверка двух отрезков на пересечение (ориентированная площадь треугольника)
	checkCrossLine(a, b, c, d)
	{
		const swap = (a, b) => { let c; c = a; a = b; b = c; return [a, b]; }
		
		const intersect = (a, b, c, d) =>
		{
			if (a > b) { const res = swap(a, b); a = res[0]; b = res[1]; }
			if (c > d) { const res = swap(c, d); c = res[0]; d = res[1]; }
			return Math.max(a, c) <= Math.min(b, d);
		}

		const area = (a, b, c) => { return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x); }
		
		return intersect(a.x, b.x, c.x, d.x) && intersect(a.z, b.z, c.z, d.z) && area(a, b, c) * area(a, b, d) <= 0 && area(c, d, a) * area(c, d, b) <= 0;
	}


	// смещение формы (точки должны идти против часавой) (контру должен быть замкнут, последняя точка ровна первой)
	offsetForm_3({points, offset}) 
	{
		const lines = this.offsetLines({points, offset});

		const pt1 = this.intersectionTwoLines_1({line1: lines[0], line2: lines [lines.length - 1]});
		const pointsOffset = [ new THREE.Vector3( pt1.x, 0, pt1.z ) ];

		for ( let i = 0; i < lines.length - 1; i++ ) 
		{
			const pt = this.intersectionTwoLines_1({line1: lines[i], line2: lines [i + 1]});

			pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );
		}

		const closed = (points[0].distanceTo(points[points.length - 1]) > 0.0001) ? false : true;	// закнут контру или нет
		if(closed) pointsOffset.push( pointsOffset[0].clone() );

		return pointsOffset;
	}
	
	
	offsetForm_2({points, offset}) 
	{
		const lines = this.offsetLines({points, offset});
		
		const pointsOffset = [];
		
		let cross = this.checkCrossLine(lines[0].start, lines[0].end, lines[lines.length - 1].start, lines[lines.length - 1].end);
		if(cross)
		{
			const pt1 = this.intersectionTwoLines_1({line1: lines[0], line2: lines [lines.length - 1]});
			pointsOffset.push(new THREE.Vector3( pt1.x, 0, pt1.z ));			
		}

		let n1 = 0;
		let n2 = 1;
		
		//for ( let i = 0; i < lines.length - 1; i++ )
		while (n1 < lines.length - 1)
		{
			console.log(lines.length - 1, n2);
			cross = this.checkCrossLine(lines[n1].start, lines[n1].end, lines[n2].start, lines[n2].end);
			if(cross)
			{
				const pt = this.intersectionTwoLines_1({line1: lines[n1], line2: lines [n2]});
				pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );
				n1++;
				n2 = n1 + 1;
				
			}
			else
			{
				const pt = this.intersectionTwoLines_1({line1: lines[n1], line2: lines [n2]});
				pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );
				
				n1++;
				n2 = n1 + 1;				
				if(n2 >= lines.length - 1)
				{
					n1++;
					n2 = n1 + 1;					
				}
			}
		}

		const closed = (points[0].distanceTo(points[points.length - 1]) > 0.0001) ? false : true;	// закнут контру или нет
		if(closed) pointsOffset.push( pointsOffset[0].clone() );

		return pointsOffset;
	}	


	offsetForm({points, offset}) 
	{
		
		points = [...points];
		
		// удаляем соседние паралельные точки
		const pPar = [];
		
		let dirPr = points[0].clone().sub(points[points.length - 1]).normalize();
		
		for ( let i = 0; i < points.length; i++ )
		{
			let ptC = points[ i ];
			let pt2 = (i + 1 > points.length - 1) ? points[0] : points[i + 1];		

			const dirPr2 = pt2.clone().sub(ptC).normalize();
			
			const trueDir = (dirPr.dot(dirPr2) > 0.999) ? true : false;
			
			if(trueDir)
			{
				pPar.push(i);
			}			
			
			dirPr = dirPr2;
		}
		
		for ( let i = pPar.length - 1; i >= 0; i-- )
		{
			points.splice(pPar[i], 1);
		}
		
		
		
		const lines1 = [];
		
		let points1 = [...points];
		if(1 === 1)	
		{
			const p1 = points1[0];
			const p2 = points1[points1.length - 1];
			points1.push(p1);
			points1.unshift(p2);
		}	
		
		for ( let i = 1; i < points1.length - 1; i++ ) 
		{
			let pt1 = points1[ i - 1 ];
			let ptC = points1[ i ];
			let pt2 = points1[ i + 1 ];

			const offsetPt0 = new THREE.Vector3( pt1.x, 0, pt1.z );
			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );

			const dirB1 = offsetPt0.clone().sub(offsetPt1).normalize();
			const dirB2 = offsetPt2.clone().sub(offsetPt1).normalize();
			
			//let helper = new THREE.ArrowHelper(this.calcNormal2D({p1: dirB1, p2: dirB2, reverse: true}).normalize(), offsetPt1, 0.5, 0x0000ff);
			//scene.add(helper);
		}		
		
		
		let pointsOffset = [];
		
		const arr = this.offsetLines({points, offset});		
		const lines2 = [arr[arr.length - 1], ...arr];

		for ( let i = 0; i < lines2.length - 1; i++ ) 
		{			
			
			const dirB1 = lines2[i].start.clone().sub(lines2[i].end).normalize();
			const dirB2 = lines2[i + 1].end.clone().sub(lines2[i + 1].start).normalize();

			//const dot1 = dirA1.dot(dirB2);
			//const dot2 = dirB1.dot(dirA2);
			//let dergree = THREE.Math.radToDeg( dirA2.angleTo(dirA1) );
			
			const pt = this.intersectionTwoLines_1({line1: lines2[i], line2: lines2[i + 1]});

			pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );
			
			//const rad = Math.atan2(dirB2.x - dirB1.x, dirB2.z - dirB1.z);	
			
			//myWarmFloor.myUlitkaWf.crLines_3({points: [lines2[i].start, lines2[i].end], color: 0x000000, addPoints: true, h: 0});			
		}
		
		
		const points2 = [...pointsOffset];
		// 
		if(1 === 1)	
		{
			const p1 = points2[0];
			const p2 = points2[points2.length - 1];
			points2.push(p1);
			points2.unshift(p2);
		}		
		
		for ( let i = 1; i < points2.length - 1; i++ )
		{
			let pt1 = points2[ i - 1 ];
			let ptC = points2[ i ];
			let pt2 = points2[ i + 1 ];

			const offsetPt0 = new THREE.Vector3( pt1.x, 0, pt1.z );
			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );
			//myWarmFloor.myUlitkaWf.crLines_3({points: [offsetPt1, offsetPt2], color: 0xff0000, addPoints: true, h: 0});
			

			const dirB1 = offsetPt0.clone().sub(offsetPt1).normalize();
			const dirB2 = offsetPt2.clone().sub(offsetPt1).normalize();
			
			//let helper = new THREE.ArrowHelper(this.calcNormal2D({p1: dirB1, p2: dirB2, reverse: true}).normalize(), offsetPt1, 0.5, 0xff0000);
			//scene.add(helper);			
			
			//helper = new THREE.ArrowHelper(dirB1, offsetPt1, 0.2, 0x000000);
			//scene.add(helper);

			//helper = new THREE.ArrowHelper(dirB2, offsetPt1, 0.2, 0x000000);
			//scene.add(helper);			
		}
		
		const points3 = [];
		
		for ( let i = 1; i < points2.length - 1; i++ )
		{
			let ps1 = points1[ i - 1 ];
			let psC = points1[ i ];
			let ps2 = points1[ i + 1 ];

			const offsetPs0 = new THREE.Vector3( ps1.x, 0, ps1.z );
			const offsetPs1 = new THREE.Vector3( psC.x, 0, psC.z );
			const offsetPs2 = new THREE.Vector3( ps2.x, 0, ps2.z );

			const dirA1 = offsetPs0.clone().sub(offsetPs1).normalize();
			const dirA2 = offsetPs2.clone().sub(offsetPs1).normalize();			
			
			
			
			let pt1 = points2[ i - 1 ];
			let ptC = points2[ i ];
			let pt2 = points2[ i + 1 ];

			const offsetPt0 = new THREE.Vector3( pt1.x, 0, pt1.z );
			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );
			//myWarmFloor.myUlitkaWf.crLines_3({points: [offsetPt1, offsetPt2], color: 0xff0000, addPoints: false, h: 0});
			

			const dirB1 = offsetPt0.clone().sub(offsetPt1).normalize();
			const dirB2 = offsetPt2.clone().sub(offsetPt1).normalize();
			
			const dir1 = this.calcNormal2D({p1: dirA1, p2: dirA2, reverse: true}).normalize();
			const dir2 = this.calcNormal2D({p1: dirB1, p2: dirB2, reverse: true}).normalize();
			
			if(1===2)
			{				
				let helper = new THREE.ArrowHelper(dir1, offsetPt1, 0.5, 0x0000ff);
				scene.add(helper);
				
				helper = new THREE.ArrowHelper(dir2, offsetPt1, 0.5, 0xff0000);
				scene.add(helper);							
			}
			
			//helper = new THREE.ArrowHelper(dirB1, offsetPt1, 0.2, 0x000000);
			//scene.add(helper);

			//helper = new THREE.ArrowHelper(dirB2, offsetPt1, 0.2, 0x000000);
			//scene.add(helper);

			points3.push({ind: i - 1, pos: offsetPt1, dir1: dirA2, dir2: dirB2, length: offsetPs1.distanceTo(offsetPs2)});
		}

		const deletePoints = [];

		for ( let i = 0; i < points3.length; i++ )
		{			
			const trueDir = (points3[i].dir1.dot(points3[i].dir2) > 0.98) ? true : false;
			
			if(!trueDir)
			{
				let helper = new THREE.ArrowHelper(points3[i].dir1, points3[i].pos, 0.5, 0x0000ff);
				scene.add(helper);
				
				helper = new THREE.ArrowHelper(points3[i].dir2, points3[i].pos, 0.5, 0xff0000);
				scene.add(helper);

				const data = {ind: points3[i].ind, pos: points3[i].pos, dir: points3[i].dir1, length: points3[i].length};
				deletePoints.push(data);
			}
		}
		
		const arrDelPoints = [];
		
		for ( let i = 0; i < deletePoints.length; i++ )
		{
			const arrData = [];			
			
			arrData.push(deletePoints[i]);
			
			let i2 = i;
			let ind = deletePoints[i].ind;
			
			for ( let i2 = i + 1; i2 < deletePoints.length; i2++ )
			{
				if(deletePoints[i2].ind !== ind + 1) break;
				
				i++;
				ind++;
				arrData.push(deletePoints[i2]);
			}
			
			arrDelPoints.push(arrData);
		}
		
		const upIndInArr = ({ind, arr}) =>
		{
			for ( let i = ind; i < arr.length; i++ )
			{
				arr[i].ind -= 1;
			}
		}
		//console.log(444, arrDelPoints);
		for ( let i = 0; i < arrDelPoints.length; i++ )
		{
			if(points3.length < 3) break;
			arrDelPoints[i].sort((a, b) => { return a.length - b.length; });
			
			//console.log(777, arrDelPoints[i][0]);
			
			const ind = points3.findIndex((o) => o.ind === arrDelPoints[i][0].ind);
			const ind1 = (ind - 1 < 0) ? points3.length - 1 : points3.findIndex((o) => o.ind === ind - 1);
			const ind2 = (ind + 1 > points3.length - 1) ? 0 : points3.findIndex((o) => o.ind === ind + 1);
			
			console.log('ind0', ind, 'ind1', ind1, 'ind2', ind2, [...points3]);
			
			if(ind > -1)
			{
				const line1 = { start: points3[ind1].pos, end: points3[ind1].pos.clone().add(points3[ind1].dir1)};
				
				console.log('delete p', ind, ind + 1);
				
				const line2 = { start: points3[ind2].pos, end: points3[ind2].pos.clone().add(points3[ind2].dir1)};
				
				const pt = this.intersectionTwoLines_3(line1.start, line1.end, line2.start, line2.end);
		
				points3.splice(ind, 1);	// удаляем 1 точку				
				points3.splice(ind, 1);	// удаляем 2 точку				
				
				if(!pt) upIndInArr({ind: ind, arr: points3});
				else upIndInArr({ind: ind + 0, arr: points3});
				
				if(i + 1 < arrDelPoints.length) 
				{
					//console.log(888, arrDelPoints[i + 1]);
					upIndInArr({ind: 0, arr: arrDelPoints[i + 1]});
				}
				
				if(pt)
				{
					//myWarmFloor.myUlitkaWf.crHelpBox({pos: new THREE.Vector3( pt.x, 0, pt.z ), size: 0.06, color: 0x0000ff})
					console.log('add p', ind);
					points3.splice(ind, 0, {ind, pos: new THREE.Vector3( pt.x, 0, pt.z )});	// на место удаленной точки добавляем точку	пересечения					
				}
				else
				{
					const ind1 = (ind - 1 < 0) ? points3.length - 1 : ind - 1;
					const ind2 = (ind1 + 1 > points3.length - 1) ? 0 : ind1 + 1;

					const line1 = { start: points3[ind1].pos, end: points3[ind1].pos.clone().add(points3[ind1].dir1)};					
					const line2 = { start: points3[ind2].pos, end: points3[ind2].pos.clone().add(points3[ind2].dir1)};
					
					const pt = this.intersectionTwoLines_3(line1.start, line1.end, line2.start, line2.end);

					if(pt)
					{
						points3.splice(ind, 1);	// удаляем 1 точку
						
						myWarmFloor.myUlitkaWf.crHelpBox({pos: new THREE.Vector3( pt.x, 0, pt.z ), size: 0.06, color: 0x0000ff})
						console.log('add p22222', ind);
						points3.splice(ind, 0, {ind: ind, pos: new THREE.Vector3( pt.x, 0, pt.z )});	// на место удаленной точки добавляем точку	пересечения							
					}
				}
			}
		}
		
		let points4 = points3.map((p) => p.pos);
		let points5 = points3.map((p) => p.pos);
		
		if(points3.length > 2)
		{
			console.log('points3------------', points4.length, points3, pointsOffset);
			
			if(1 === 1)	
			{
				points4.push(points4[0]);
			}		
			for ( let i = 0; i < points4.length - 1; i++ )
			{
				myWarmFloor.myUlitkaWf.crLines_3({points: [points4[ i ], points4[ i + 1 ]], color: 0x000000, addPoints: true, h: 0});

//if(points3.length === 3) myWarmFloor.myUlitkaWf.crHelpBox({pos: points4[ i ], size: 0.06, color: 0x0000ff})				
			}		
			
		}




if(points5.length < 3) points5 = [];

console.log('----------');

		return points5;
	}


	offsetForm_4({points, offset}) 
	{
		const lines1 = [];
		
		let points1 = [...points];
		points1.push(points1[0]);
		
		for ( let i = 0; i < points1.length - 1; i++ ) 
		{
			let ptC = points1[ i ];
			let pt2 = points1[ i + 1 ];

			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );

			lines1.push({start: offsetPt1, end: offsetPt2});
		}		
		
		
		const pointsOffset = [];
		
		const arr = this.offsetLines({points, offset});		
		const linesOffset = [arr[arr.length - 1], ...arr];

		for ( let i = 0; i < linesOffset.length - 1; i++ ) 
		{					
			const pt = this.intersectionTwoLines_1({line1: linesOffset[i], line2: linesOffset[i + 1]});

			pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );		
		}
		
		const lines2 = [];
		const points2 = [...pointsOffset];
		points2.push(points2[0]);		
		
		for ( let i = 0; i < points2.length - 1; i++ )
		{
			let ptC = points2[ i ];
			let pt2 = points2[ i + 1 ];

			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );
			lines2.push({start: offsetPt1, end: offsetPt2});
			//myWarmFloor.myUlitkaWf.crLines_3({points: [offsetPt1, offsetPt2], color: 0xff0000, addPoints: true, h: 0});			
		}
		
		const points3 = [];
		
		for ( let i = 0; i < lines1.length; i++ )
		{
			const dir1 = lines1[i].end.clone().sub(lines1[i].start).normalize();			
			const dir2 = lines2[i].end.clone().sub(lines2[i].start).normalize();	

			points3.push({ind: i, pos: lines2[i].start, dir1, dir2, length: lines1[i].start.distanceTo(lines1[i].end)});
			
			myWarmFloor.myUlitkaWf.crLines_3({points: [lines2[i].start, lines2[i].end], color: 0xff0000, addPoints: true, h: 0});
		}


		const deletePoints = [];

		for ( let i = 0; i < points3.length; i++ )
		{			
			const trueDir = (points3[i].dir1.dot(points3[i].dir2) > 0.98) ? true : false;
			
			if(!trueDir)
			{
				let helper = new THREE.ArrowHelper(points3[i].dir1, points3[i].pos, 0.5, 0x0000ff);
				scene.add(helper);
				
				helper = new THREE.ArrowHelper(points3[i].dir2, points3[i].pos, 0.5, 0xff0000);
				scene.add(helper);

				const data = {ind: points3[i].ind, pos: points3[i].pos, dir: points3[i].dir1, length: points3[i].length};
				deletePoints.push(data);
				
				console.log(444, data);
			}
		}

	console.log(555, points3);	

		const closed = (points[0].distanceTo(points[points.length - 1]) > 0.0001) ? false : true;	// закнут контру или нет
		if(closed) pointsOffset.push( pointsOffset[0].clone() );

console.log('----------', pointsOffset, points);

		return pointsOffset;
	}
	
	

	// смещение массива точек контура, отдаем массив линий (контру должен быть замкнут, последняя точка ровна первой)
	offsetLines({points, offset})
	{
		const lines = [];
		
		// проверяем закунт ли контур, если нет, то делаем замкнутый массив точек
		if(points[0].distanceTo(points[points.length - 1]) > 0.0001)	
		{
			points = [...points]; 	// копируем массив, создав новый
			points.push(points[0]);
		}
		
		for ( let i = 0; i < points.length - 1; i++ ) 
		{
			let pt1 = points[ i ];
			let pt2 = points[ i + 1 ];

			const dir = pt2.clone().sub( pt1 );
			const angle = Math.atan2( dir.z, dir.x );

			const offsetPt1 = new THREE.Vector3( pt1.x - offset * Math.cos( angle - Math.PI / 2 ), 0, pt1.z + offset * Math.sin( angle + Math.PI / 2 ) );
			const offsetPt2 = new THREE.Vector3( pt2.x - offset * Math.cos( angle - Math.PI / 2 ), 0, pt2.z + offset * Math.sin( angle + Math.PI / 2 ) );

			lines.push({start: offsetPt1, end: offsetPt2});	

			//const line1 = myWarmFloor.myUlitkaWf.crLines_3({points: [offsetPt1, offsetPt2], color: 0x000000, addPoints: true, h: 0});
			//this.arrLines_1.push(line1);			
		}

		return lines;
	}

	// находим точку пересечения двух линий в 3D
	// решение по ссылке
	// https://discourse.threejs.org/t/find-intersection-between-two-line3/7119
	// https://discourse.threejs.org/t/solved-how-to-find-intersection-between-two-rays/6464/8
	// метод находит точку пересечения, даже если линии не пересеклись
	// но есть проверка на пересечение (если dpnqnDet === 0, то линии пересекаются)
	// по ссылке есть еще один метод, но я выбрал этот
	closestPointsDet(p1, dir1, p2, dir2) 
	{
		const qp = new THREE.Vector3().subVectors(p1, p2);

		const qpDotmp = qp.dot(dir1);
		const qpDotmq = qp.dot(dir2);
		const mpDotmp = dir1.dot(dir1);
		const mqDotmq = dir2.dot(dir2);
		const mpDotmq = dir1.dot(dir2);

		const detp = qpDotmp * mqDotmq - qpDotmq * mpDotmq;
		const detq = qpDotmp * mpDotmq - qpDotmq * mpDotmp;

		const detm = mpDotmq * mpDotmq - mqDotmq * mpDotmp;

		const pnDet = p1.clone().add(dir1.clone().multiplyScalar(detp / detm));
		const qnDet = p2.clone().add(dir2.clone().multiplyScalar(detq / detm));

		const dpnqnDet = pnDet.clone().sub(qnDet).length();

		const cross = Number(dpnqnDet.toFixed(10)) < 0.0001 ? true : false;

		return { cross, pos: qnDet };
	}	

	//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
	checkClockWise( arrP )
	{  
		let res = 0;
		const n = arrP.length;
		
		for (let i = 0; i < n; i++) 
		{
			const p1 = arrP[i];
			let p2 = new THREE.Vector3();
			let p3 = new THREE.Vector3();
			
			if (i == 0)
			{
				p2 = arrP[n-1];
				p3 = arrP[i+1];					
			}
			else if (i == n-1)
			{
				p2 = arrP[i-1];
				p3 = arrP[0];			
			}
			else
			{
				p2 = arrP[i-1];
				p3 = arrP[i+1];			
			}
			
			res += p1.x*(p2.z - p3.z);
		}
		
		
		res = res / 2;
		res = Math.round(res * 10) / 10;
		
		return res;
	}

}














