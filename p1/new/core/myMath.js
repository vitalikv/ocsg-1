


class MyMath
{
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


	// точка пересечения двух прямых 2D (1 вариант)
	intersectionTwoLines({ line1, line2 }) {
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
	offsetForm({points, offset}) 
	{
		const lines = this.offsetLines({points, offset});

		const pt1 = this.intersectionTwoLines({line1: lines[0], line2: lines [lines.length - 1]});
		const pointsOffset = [ new THREE.Vector3( pt1.x, 0, pt1.z ) ];

		for ( let i = 0; i < lines.length - 1; i++ ) 
		{
			const pt = this.intersectionTwoLines({line1: lines[i], line2: lines [i + 1]});

			pointsOffset.push( new THREE.Vector3( pt.x, 0, pt.z ) );
		}

		const closed = (points[0].distanceTo(points[points.length - 1]) > 0.0001) ? false : true;	// закнут контру или нет
		if(closed) pointsOffset.push( pointsOffset[0].clone() );

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














