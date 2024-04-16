

class MyUlitkaWf
{
	arrPoints_1 = [];
	arrLines_1 = [];
	arrLines_2 = []; // потом удалить
	
	
	initUlitkaTest()
	{
		const v = [];
		v.push(new THREE.Vector3(-5, 0, 0));	
		v.push(new THREE.Vector3(-5, 0, 5));
		v.push(new THREE.Vector3(5, 0, 5));
		v.push(new THREE.Vector3(5, 0, -5));
		v.push(new THREE.Vector3(2.5, 0, -5));
		v.push(new THREE.Vector3(2.5, 0, 0));
		
		this.crLines_3({points: v, color: 0x000000, addPoints: false, h: 0});		

		this.drawFrom({points: v});
	}
	
	
	drawFrom({points})
	{
		points = [...points];		
		
		const result = myMath.checkClockWise(points);	// проверяем последовательность построения точек (по часовой стрелке или нет)
		if(result < 0) points.reverse();	// если по часовой стрелки, то разворачиваем массив, чтобы был против часовой
		
		let arrFroms = [points];	// стартовый контур от которого идет смещение
		
		while (arrFroms.length > 0) 
		{
			arrFroms = this.loopFroms({oldFormPoints: arrFroms});
			//arrFroms = [];
		}

		return this.arrLines_1;
	}
	
	// расчитываем один шаг смещения от контура
	loopFroms({oldFormPoints})
	{
		const arrFroms = [];
		
		for ( let i = 0; i < oldFormPoints.length; i++ )
		{
			const newFormPoints = myMath.offsetForm({points: oldFormPoints[i], offset: -0.2});
			const forms = this.calcForm(newFormPoints, oldFormPoints[i]);			
			arrFroms.push(...forms);
			
			// линии пола после смещения, без оптимизации
			//const line1 = this.crLines_3({points: newFormPoints, color: 0xff0000, addPoints: false, h: 0});
			//this.arrLines_1.push(line1);
			
			// линии пола после смещения и оптимизации
			for ( let i2 = 0; i2 < forms.length; i2++ )
			{
				const line2 = this.crLines_3({points: forms[i2], color: 0x0000ff, addPoints: false, h: 0});
				this.arrLines_2.push(line2);				
			}
		}
		
		return arrFroms;
	}

	
	calcForm(arrPos, arrOldPos)
	{	
		arrPos = [...arrPos];
		arrOldPos = [...arrOldPos];
		
		//arrPos.splice(arrPos.length - 1, 1); // удаляем последний элем., потому приходит массив, где последний элем. - копия нулевого элем.
		//arrOldPos.splice(arrOldPos.length - 1, 1);
		

		const arrLine = [];
		for ( let i = 0; i < arrPos.length - 1; i++ )
		{
			const dir = new THREE.Vector3().subVectors( arrOldPos[i], arrOldPos[i + 1] ).normalize();
			arrLine.push({start: arrPos[i], end: arrPos[i + 1], startId: i, endId: i + 1, dir, crossLines: [], crossPoints: []});
		}
		const dir = new THREE.Vector3().subVectors( arrOldPos[arrOldPos.length - 1], arrOldPos[0] ).normalize();
		arrLine.push({start: arrPos[arrPos.length - 1], end: arrPos[0], startId: arrPos.length - 1, endId: 0, dir, crossLines: [], crossPoints: []});
		
		
		const arrPos2 = this.calcCrossLine({arrLine});
		
		const points = this.calcPath({arrLine, arrPos, arrPos2});
		
		const forms = this.calcForms(points);
		
		return forms;
	}
		
	
	// через массив последовательных точек строим отрезки и ищем пересечение между отрезками
	calcCrossLine({arrLine})
	{
		const arrPos2 = [];		// точки пересечения линий		

		for ( let i = 0; i < arrLine.length; i++ )
		{
			for ( let i2 = 0; i2 < arrLine.length; i2++ )
			{
				if(i === i2) continue;
				
				// линии уже пересекались 
				if(arrLine[i2].crossLines.indexOf(i) > -1) continue;
				
				const cross = myMath.checkCrossLine(arrLine[i].start, arrLine[i].end, arrLine[i2].start, arrLine[i2].end);
				
				if(cross)
				{				
					const pos = myMath.intersectionTwoLines({ line1: arrLine[i], line2: arrLine[i2] });
					
					const d1 = pos.distanceTo(arrLine[i].start);
					const d2 = pos.distanceTo(arrLine[i].end);
					const d3 = pos.distanceTo(arrLine[i2].start);
					const d4 = pos.distanceTo(arrLine[i2].end);
					
					// проверка отрезков хоть и пересекались, но на самом дели может быть это стыковка концов отрезков
					// т.к. мы отправляем уже готовые отрезки, а не линии
					const limitD = 0.00001;	
					let joint = false;
					if(d1 < limitD) joint = true;
					if(d2 < limitD) joint = true;
					if(d3 < limitD) joint = true;
					if(d4 < limitD) joint = true;
					
					// отрезкам которые пересеклись друг с другом, добавляем информацию 
					// и добавляем в массив точек точки пересечения
					if(!joint) 
					{						
						arrLine[i].crossLines.push(i2);
						arrLine[i2].crossLines.push(i);

						const idP = arrPos2.length;
						arrPos2[idP] = pos.clone();						
						arrLine[i].crossPoints.push(idP);
						arrLine[i2].crossPoints.push(idP);
					}										
				}
			}			
		}

		return arrPos2;
	}
	
	
	// собираем точки отрезков и точки пересечения отрезков в один массив и выстраиваем в упорядочанном порядке
	calcPath({arrLine, arrPos, arrPos2})
	{
		const indexOffset = arrPos.length;
		arrPos = [...arrPos, ...arrPos2];
		
		const points = [];
		
		// выстраиваем последовательность точек, чтобы шли по порядку 
		for ( let i = 0; i < arrLine.length; i++ )
		{
			const dir = arrLine[i].dir;
			
			points.push({pos: arrLine[i].start, id: arrLine[i].startId, dir, p: []});	// начальная точка отрезка
			
			// точки пересечение отрезков
			if(arrLine[i].crossPoints.length > 0)
			{
				const arrDist = [];
				const firstPointPos = arrLine[i].start;
				for ( let i2 = 0; i2 < arrLine[i].crossPoints.length; i2++ )
				{
					const id = arrLine[i].crossPoints[i2] + indexOffset;
					const p1 = arrPos[id];
					const dist = p1.distanceTo(arrLine[i].start);
					arrDist.push({dist, pos: p1, id });
				}
				
				arrDist.sort((a, b) => { return a.dist - b.dist; });
				
				for ( let i2 = 0; i2 < arrDist.length; i2++ )
				{
					points.push({pos: arrDist[i2].pos, id: arrDist[i2].id, p: []});
				}
			}
			
			points.push({pos: arrLine[i].end, id: arrLine[i].endId, p: []});	// конечная точка отрезка
		}
		
		// добавлем информацию о соседних точек (id)
		for ( let i = 0; i < points.length - 1; i++ )
		{			
			const pId1 = (i === 0) ? points[points.length - 1].id : points[i - 1].id;
			const pId2 = points[i + 1].id;
			
			if(pId1 !== points[i].id) points[i].p.push(pId1);
			if(pId2 !== points[i].id) points[i].p.push(pId2);
		}
		
		const ind = points.length - 1;
		if(points[ind].id !== points[ind - 1].id) points[ind].p.push(points[ind - 1].id);
		if(points[ind].id !== points[0].id) points[ind].p.push(points[0].id);		
		
		// убираем повторяющиеся точки (с одинаковым id), чтобы были только уникальные точки
		const points2 = [];
		for ( let i = 0; i < points.length; i++ )
		{
			const ind = points2.findIndex((o) => o.id === points[i].id);
			
			if(ind === -1) points2.push(points[i]);		// еще такого элемента в массиве не было
			else
			{	
				// элемент повторился, значит точка пересекалась с отрезком, добавлем к массиву соседних точек, еще соседние точки
				points2[ind].p.push(...points[i].p);	
				if(points[i].dir) points2[ind].dir = points[i].dir;
			}
		}


		for ( let i = 0; i < points2.length; i++ )
		{
			const pO = [];
			for ( let i2 = 0; i2 < points2[i].p.length; i2++ )
			{
				const id = points2[i].p[i2];
				const ind = points2.findIndex((o) => o.id === id);
				pO.push(points2[ind]);
			}
			points2[i].pO = pO;
		}				
		
		//console.log(points2);
		
		return points2;
	}


	crHelpBox2({pos, color = 0x0000ff})
	{
		const geometry = new THREE.BoxGeometry( 0.04, 0.04, 0.04 );
		const material = new THREE.MeshBasicMaterial({color});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
	}
	
	
	// получаем массив оптимизированных контуров
	calcForms(points)
	{		
		const arrF = [];
		
		for ( let i = 0; i < points.length; i++ )
		{			
			for ( let i2 = 0; i2 < points[i].pO.length; i2++ )
			{						
				const form = this.getContour([points[i]], points[i].pO[i2]); 						 
				
				if(form[0].id !== form[form.length - 1].id){ continue; }					
				
				const trueDir = this.getCheckDir(form);
				if(!trueDir) continue;

				if(this.detectEqualForm({arrF, points: form})){ continue; }
				
				arrF.push(form);
				
				break; 
			}
		}
		
		
		const newV = [];
		for ( let i = 0; i < arrF.length; i++ )
		{
			const v = [];
			
			for ( let i2 = 0; i2 < arrF[i].length - 1; i2++ )
			{
				v.push(arrF[i][i2].pos.clone());
			}
			
			newV.push(v);
		}
		
		return newV;
	}

	// ищем замкнутый контур помещения
	getContour(arr, point)
	{
		var p2 = arr[arr.length - 1];
		arr[arr.length] = point;		
		
		var dir1 = new THREE.Vector3().subVectors( point.pos, p2.pos ).normalize();	
		
		var arrD = [];
		var n = 0;
		for ( var i = 0; i < point.pO.length; i++ )
		{
			if(point.p[i].id === p2.id){ continue; }		
			if(point.pO[i].pO.length < 2){ continue; }
			
			const pS = point.pO[i];
			var dir2 = new THREE.Vector3().subVectors( pS.pos, point.pos ).normalize();
			
			arrD[n] = [];
			arrD[n][1] = pS;
			
			var d = (pS.pos.x - p2.pos.x) * (point.pos.z - p2.pos.z) - (pS.pos.z - p2.pos.z) * (point.pos.x - p2.pos.x);
			
			var angle = dir1.angleTo( dir2 );
			
			if(d > 0){ angle *= -1; }
			
			arrD[n][0] = angle;
			if(!this.isNumeric(angle)) { return arr; }
			
			n++;
		}	
		
		
		if(arrD.length > 0)
		{ 
			arrD.sort(function (a, b) { return a[0] - b[0]; });
			
			for ( var i = 0; i < arrD.length; i++ )
			{			
				if(arr[0].id !== arrD[i][1].id) { return this.getContour(arr, arrD[i][1]); }
				else { arr[arr.length] = arrD[i][1]; break; }						
			}
		}
		
		return arr;
	}


	getCheckDir(points)
	{
		let trueDir = true;

		for (let i = 0; i < points.length - 1; i++) 
		{			
			if(!points[i].dir) continue;
			
			const dir = new THREE.Vector3().subVectors( points[i].pos, points[i + 1].pos ).normalize();			
			
			trueDir = (dir.dot(points[i].dir) > 0.98) ? true : false;
			//console.log(points[i].userData.id, points[i].userData.dir, dir, trueDir);
			
			if(!trueDir) break;
		}
		//console.log('-------');
		return trueDir;
	}


	// проверяем если контур с такими же точками в массиве контуров arrF
	detectEqualForm({arrF, points})
	{
		let flag = false;
		
		for ( let i = 0; i < arrF.length; i++ )
		{
			let ln = 0;
			
			if(arrF[i].length !== points.length) { continue; }
				
			for ( let i2 = 0; i2 < arrF[i].length - 1; i2++ )
			{
				for ( let i3 = 0; i3 < points.length - 1; i3++ )
				{
					if(arrF[i][i2].id === points[i3].id) { ln++; }
				}
			}
			
			if(ln === points.length - 1) { flag = true; break; }
		}
		
		return flag;
	}
	
	
	// определяем число ли это или нет
	isNumeric(n) 
	{   
	   return !isNaN(parseFloat(n)) && isFinite(n);   
	   // Метод isNaN пытается преобразовать переданный параметр в число. 
	   // Если параметр не может быть преобразован, возвращает true, иначе возвращает false.
	   // isNaN("12") // false 
	}
	

	crLines_3({points, color = 0xff0000, addPoints = false, h = 0})
	{
		if(addPoints)
		{
			for ( let i = 0; i < points.length; i++ )
			{
				const newP = this.crHelpBox2({pos: points[i], color});
				newP.position.y = h;
				scene.add(newP);
				this.arrPoints_1.push(newP);
			}				
		}			
		
		points = [...points];
		points.push(points[0]);
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i].y = h;
		}		
		
		const geometry = new THREE.Geometry();
		geometry.vertices = points;
		
		const material = new THREE.LineBasicMaterial({ color });
		
		const line = new THREE.Line( geometry, material );
		scene.add( line );		

		return line;
	}
	
	clearForms()
	{
		for ( let i = 0; i < this.arrPoints_1.length; i++ )
		{
			this.arrPoints_1[i].geometry.dispose();
			scene.remove(this.arrPoints_1[i]);			
		}		
		
		for ( let i = 0; i < this.arrLines_1.length; i++ )
		{
			this.arrLines_1[i].geometry.dispose();
			scene.remove(this.arrLines_1[i]);			
		}
		
		for ( let i = 0; i < this.arrLines_2.length; i++ )
		{
			this.arrLines_2[i].geometry.dispose();
			scene.remove(this.arrLines_2[i]);			
		}		

		this.arrLines_1 = [];
		this.arrLines_2 = []; 		
	}
}






