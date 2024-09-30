

class MyUlitkaWf
{
	arrPoints_1 = [];
	arrLines_1 = [];
	arrLines_2 = []; // потом удалить
	arrArrowHelp_1 = [];
	
	
	drawFrom({points, offsetStart = -0.2, offsetNext = -0.2})
	{
		this.clearForms();
		points = [...points];		
		
		const result = myMath.checkClockWise(points);	// проверяем последовательность построения точек (по часовой стрелке или нет)
		if(result < 0) points.reverse();	// если по часовой стрелки, то разворачиваем массив, чтобы был против часовой
		
		let offset = offsetStart;	// смещение стартового от контура
		let arrFroms = [points];	// стартовый контур от которого идет смещение		
		
		const formSteps = [];	// все формы одного контура
		
		let count = 0;
		while (arrFroms.length > 0) 
		{
			arrFroms = this.loopFroms({count, oldFormPoints: arrFroms, offset});
			offset = offsetNext;	// смещение от построеного контура
			if(count === 0) arrFroms = [];
			count++;
			if(arrFroms.length > 0) formSteps.push(arrFroms);
			console.log(arrFroms);
		}
		
		
		// показываем линии пола после смещения и оптимизации
		for ( let i = 0; i < formSteps.length; i++ )
		{
			const points = formSteps[i];
			for ( let i2 = 0; i2 < points.length; i2++ )
			{
				//const line2 = this.crLines_3({points: points[i2], color: 0x0000ff, addPoints: false, h: 0});
				//this.arrLines_2.push(line2);									
			}
		}

		return formSteps;
	}
	
	// расчитываем один шаг смещения от контура
	loopFroms({count, oldFormPoints, offset})
	{
		const forms = [];
		
		for ( let i = 0; i < oldFormPoints.length; i++ )
		{
			const newFormPoints = this.offsetForm({count, points: oldFormPoints[i], offset});
			//const newFormPoints = myMath.offsetForm({points: oldFormPoints[i], offset});
			//const points = this.calcForm(newFormPoints, oldFormPoints[i]);			
			if(newFormPoints.length > 0) forms.push(...newFormPoints);
			
			// линии пола после смещения, без оптимизации/обрезки пересечений
			//const line1 = this.crLines_3({points: newFormPoints, color: 0xff0000, addPoints: false, h: 0});
			//this.arrLines_1.push(line1);
		}
		
		return forms;
	}


	offsetForm({count, points, offset}) 
	{
		
		points = [...points];
		
		// удаляем соседние паралельные точки, чтобы оставались только точки с углами
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
			
		
		console.log('----------> count', count);

		
		let pointsOffset = [];
		
		const arr = myMath.offsetLines({points, offset});	// массив линий со смещением		
		const lines = [arr[arr.length - 1], ...arr];

		
		let i2 = 1;
		for ( let i = 0; i < lines.length - 1; i++ ) 
		{
			const dir1 = lines[i].start.clone().sub(lines[i].end).normalize();
			const dir2 = lines[i2].end.clone().sub(lines[i2].start).normalize();			
			
			
			let rot1 = THREE.Math.radToDeg(Math.atan2(dir1.x, dir1.z));
			let rot2 = THREE.Math.radToDeg(Math.atan2(dir2.x, dir2.z));
			//if(rot1 <= 0) rot1 = Math.abs(rot1) + 180;
			//if(rot2 <= 0) rot2 = Math.abs(rot2) + 180;
			const dot = dir2.dot(dir1);
			let dergree = THREE.Math.radToDeg(dir1.angleTo( dir2 ));
			 

			if(i > -1)
			{
				
				//const dir1 = lines[i].start.clone().sub(lines[i].end).normalize();
				let helper = new THREE.ArrowHelper(dir1, lines[i].end, 1, 0xff0000);
				//scene.add(helper);

				helper = new THREE.ArrowHelper(dir2, lines[i].end, 1, 0xff0000);
				//scene.add(helper);	


				const norm1 = myMath.calcNormal2D({p1: lines[i].start, p2: lines[i].end, reverse: true});				
				const norm2 = myMath.calcNormal2D({p1: lines[i2].start, p2: lines[i2].end, reverse: true});				
				
				let l1 = {};
				l1.start = lines[i].end.clone().sub(lines[i].start).divideScalar( 2 ).add(lines[i].start);
				l1.end = l1.start.clone().add(norm1.clone().multiplyScalar( 10 ));
				
				let l2 = {};
				l2.start = lines[i2].end.clone().sub(lines[i2].start).divideScalar( 2 ).add(lines[i2].start);
				l2.end = l2.start.clone().add(norm2.clone().multiplyScalar( 10 ));				
				
				const cross = myMath.checkCrossLine(l1.start, l1.end, l2.start, l2.end);
				
				if(!cross) 
				{
					dergree = 360 - dergree;
					const helper1 = new THREE.ArrowHelper(norm1, l1.start, 1, 0x0000ff);
					const helper2 = new THREE.ArrowHelper(norm2, l2.start, 1, 0x0000ff);
					scene.add(helper1); this.arrArrowHelp_1.push(helper1);
					scene.add(helper2); this.arrArrowHelp_1.push(helper2);					
				}
			}
			
			const newP = (i + 1 !== i2) ? true : false;
			
			console.log('dergree', i, i2, dot, '--', dergree);
			
			//if(dergree > 0) this.crHelpBox({pos: lines[i].end, size: 0.46, color: 0x0000ff})
			if(count > -1 && 1===2)
			{
				this.crLines_3({points: [lines[i].start, lines[i].end], color: 0xff0000, addPoints: true, h: 1});
				this.crLines_3({points: [lines[i2].start, lines[i2].end], color: 0x0000ff, addPoints: true, h: 1});						
			}
			
			
			if(newP || dergree > 180)
			{
				const pt = myMath.intersectionTwoLines_1({line1: lines[i], line2: lines[i2]});
				pointsOffset.push({ind: i, pos: new THREE.Vector3( pt.x, 0, pt.z ), newP});							
			}
			else
			{
				const cross = myMath.checkCrossLine(lines[i].start, lines[i].end, lines[i2].start, lines[i2].end);
				
				if(cross)
				{
					const pt = myMath.intersectionTwoLines_1({line1: lines[i], line2: lines[i2]});
					pointsOffset.push({ind: i, pos: new THREE.Vector3( pt.x, 0, pt.z ), newP});								
				}
				else
				{						
					if(i2 + 1 < lines.length) 
					{ 
						i2++;
						i -= 1;
						continue;
					}
					else { break; }										
				}
				
			}
			
			i = i2 - 1;
			i2++;
			
			
			// вот тут нужносделать расчет пересечения с правлиьным направлением, и если есть пересечение, то добавляем точку в массив точек
			//this.crLines_3({points: [lines[i].start, lines[i].end], color: 0x0000ff, addPoints: true, h: 0});			
		}
		

		const points1 = [...points, points[0]];
		const points2 = [...pointsOffset, pointsOffset[0]];			
		
		// получаем массив точек, с направлением линии (старой и новой)
		const points3 = [];
		
		for ( let i = 0; i < points2.length - 1; i++ )
		{
			const ind = points2[ i ].ind;
			
			let psC = points1[ ind ];
			let ps2 = points1[ ind + 1 ];

			const offsetPs1 = new THREE.Vector3( psC.x, 0, psC.z );
			const offsetPs2 = new THREE.Vector3( ps2.x, 0, ps2.z );
			const dir1 = offsetPs2.clone().sub(offsetPs1).normalize();			

			let ptC = points2[ i ].pos;
			let pt2 = points2[ i + 1 ].pos;

			const offsetPt1 = new THREE.Vector3( ptC.x, 0, ptC.z );
			const offsetPt2 = new THREE.Vector3( pt2.x, 0, pt2.z );
			const dir2 = offsetPt2.clone().sub(offsetPt1).normalize();
			
			const line1 = this.crLines_3({points: [offsetPt1, offsetPt2], color: 0xff0000, addPoints: false, h: 0});
			this.arrLines_1.push(line1);
			
			const newP  = points2[ i ].newP;
			
			points3.push({ind: i, pos: offsetPt1, dir1, dir2, length: offsetPs1.distanceTo(offsetPs2), newP});
		}


		let forms = [];
		
		if(1===1)
		{
			let arrPos = points3.map((p) => p.pos);
			const arrLine = [];
			
			const dir = new THREE.Vector3()
			
			for ( let i = 0; i < arrPos.length - 1; i++ )
			{
				//const dir = new THREE.Vector3().subVectors( arrOldPos[i], arrOldPos[i + 1] ).normalize();
				arrLine.push({start: arrPos[i], end: arrPos[i + 1], startId: i, endId: i + 1, dir, crossLines: [], crossPoints: []});
			}
			//const dir = new THREE.Vector3().subVectors( arrOldPos[arrOldPos.length - 1], arrOldPos[0] ).normalize();
			arrLine.push({start: arrPos[arrPos.length - 1], end: arrPos[0], startId: arrPos.length - 1, endId: 0, dir, crossLines: [], crossPoints: []});
			
			
			const arrPos2 = this.calcCrossLine({arrLine});
			
			for ( let i = 0; i < arrPos2.length; i++ )
			{
				this.crHelpBox({pos: arrPos2[ i ], size: 0.06, color: 0x0000ff})
			}
			
			const points = this.calcPath({arrLine, arrPos, arrPos2});
			
			forms = this.calcForms_2(points, arrPos2.length > 0);

			console.log(999999999999, forms)
			
		}
		

		if(1===2)
		{
			// находим точки у которых после смещения неправельное направление
			const deletePoints = [];

			for ( let i = 0; i < points3.length; i++ )
			{			
				if(points3[i].newP) continue;
				
				const trueDir = (points3[i].dir1.dot(points3[i].dir2) > 0.98) ? true : false;
				
				if(!trueDir)
				{
					let helper = new THREE.ArrowHelper(points3[i].dir1, points3[i].pos, 0.5, 0x0000ff);				
					scene.add(helper);
					this.arrArrowHelp_1.push(helper);
					
					helper = new THREE.ArrowHelper(points3[i].dir2, points3[i].pos, 0.5, 0xff0000);
					scene.add(helper);
					this.arrArrowHelp_1.push(helper);

					const data = {ind: points3[i].ind, pos: points3[i].pos, dir: points3[i].dir1, length: points3[i].length};
					deletePoints.push(data);
				}
			}
			
			// если точки с неправельным направлением соседние, то объединяем в один массив 
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
			

			console.log(444, arrDelPoints.map((arr) => arr.map((p) => p.ind)));
			for ( let i = 0; i < arrDelPoints.length; i++ )
			{
				if(points3.length < 3) break;
				arrDelPoints[i].sort((a, b) => { return a.length - b.length; });
				
				//console.log(777, arrDelPoints[i][0]);
				
				const ind = points3.findIndex((o) => o.ind === arrDelPoints[i][0].ind);
				const ind1 = (ind - 1 < 0) ? points3.length - 1 : ind - 1;
				const ind2 = (ind + 1 > points3.length - 1) ? 0 : ind + 1;
				
				console.log('ind0', ind, 'ind1', ind1, 'ind2', ind2, points3.map((p) => p.ind));
				
				if(ind > -1)
				{
					console.log('delete p', ind, ind + 1);
					
					let pt = null;
					let stop = false;
					
					if(points3[ind1].dir1 && points3[ind2].dir1)
					{
						const line1 = { start: points3[ind1].pos, end: points3[ind1].pos.clone().add(points3[ind1].dir1)};
						const line2 = { start: points3[ind2].pos, end: points3[ind2].pos.clone().add(points3[ind2].dir1)};
						
						pt = myMath.intersectionTwoLines_3(line1.start, line1.end, line2.start, line2.end);					
					}
					else
					{
						stop = true;
					}
			
					points3.splice(ind, 1);	// удаляем 1 точку				
					points3.splice(ind, 1);	// удаляем 2 точку				

					if(stop) continue;
					
					if(pt)
					{
						//this.crHelpBox({pos: new THREE.Vector3( pt.x, 0, pt.z ), size: 0.06, color: 0x0000ff})
						console.log('add p', ind);
						points3.splice(ind, 0, {ind, pos: new THREE.Vector3( pt.x, 0, pt.z )});	// на место удаленной точки добавляем точку	пересечения					
					}
					else
					{
						const ind1 = (ind - 1 < 0) ? points3.length - 1 : ind - 1;
						const ind2 = (ind1 + 1 > points3.length - 1) ? 0 : ind1 + 1;

						const line1 = { start: points3[ind1].pos, end: points3[ind1].pos.clone().add(points3[ind1].dir1)};					
						const line2 = { start: points3[ind2].pos, end: points3[ind2].pos.clone().add(points3[ind2].dir1)};
						
						const pt = myMath.intersectionTwoLines_3(line1.start, line1.end, line2.start, line2.end);

						if(pt)
						{
							points3.splice(ind, 1);	// удаляем 1 точку						
							
							const box = this.crHelpBox({pos: new THREE.Vector3( pt.x, 0, pt.z ), size: 0.06, color: 0x0000ff});
							this.arrPoints_1.push(box);
							
							console.log('add p22222', ind);
							points3.splice(ind, 0, {ind: ind, pos: new THREE.Vector3( pt.x, 0, pt.z )});	// на место удаленной точки добавляем точку	пересечения	
							
						}
					}
					
					console.log(points3.map((p) => p.ind));
				}
			}
			
		}

		
		let points5 = [];
		
		if(forms.length > 0)
		{
			points5 = forms;		
		}
		else
		{
			//points4 = points3.map((p) => p.pos);
			//points5 = points3.map((p) => p.pos);			
		}

		
		if(forms.length > 0)
		{			
			for ( let i = 0; i < forms.length; i++ )
			{
				let points4 = [...forms[i]];
				if(1 === 1)	
				{
					points4.push(points4[0]);
				}		
				for ( let i = 0; i < points4.length - 1; i++ )
				{
					const line1 = this.crLines_3({points: [points4[ i ], points4[ i + 1 ]], color: 0x000000, addPoints: true, h: 1});
					this.arrLines_1.push(line1);
	//if(points3.length === 3) this.crHelpBox({pos: points4[ i ], size: 0.06, color: 0x0000ff})				
				}						
			}
			
		}






console.log('----------');

		return points5;
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
					const pos = myMath.intersectionTwoLines_1({ line1: arrLine[i], line2: arrLine[i2] });
					
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


	// собираем точки отрезков и точки пересечения отрезков в один массив и выстраиваем в упорядочанном порядке
	calcPath_2({arrLine, arrPos, arrPos2})
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
			
			//if(pId1 !== points[i].id) points[i].p.push(pId1);
			if(pId2 !== points[i].id) points[i].p.push(pId2);
		}
		
		const ind = points.length - 1;
		//if(points[ind].id !== points[ind - 1].id) points[ind].p.push(points[ind - 1].id);
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
				if(this.detectEqualForm({arrF, points: form})){ continue; }
				
				const p = form.map(item => item.pos)
				if(myMath.checkClockWise(p) <= 0){ continue; }
				
				//const trueDir = this.getCheckDir(form);
				//if(!trueDir) continue;				
				
				arrF.push(form);
				
				break; 
			}
		}
		
		//console.log(111, arrF);
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


	// получаем массив оптимизированных контуров
	calcForms_2(points, crossP)
	{		
		const arrF = [];
		//crossP = true;
		if(crossP)
		{
			for ( let i = 0; i < points.length; i++ )
			{			
				for ( let i2 = 0; i2 < points[i].pO.length; i2++ )
				{	
					//if(points[i].pO.length !== 2) continue;
					const form = this.getContour_2([points[i]], points[i].pO[i2], 0); 						 
					console.log('------------');
					if(form[0].id !== form[form.length - 1].id){ continue; }					
					if(this.detectEqualForm({arrF, points: form})){ continue; }
									
					const p = form.map(item => item.pos)
					if(myMath.checkClockWise(p) <= 0){ continue; }
					
					//const trueDir = this.getCheckDir(form);
					//if(!trueDir) continue;				
					
					arrF.push(form);
					
					break; 
				}
			}
			
		}
		else
		{
			
			if(points.length > 2) arrF.push([...points, points[0]]);
			
		}
		
		//console.log(111, arrF);
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


	// ищем замкнутый контур помещения
	getContour_2(arr, point, count)
	{
		var p2 = arr[arr.length - 1];
		arr[arr.length] = point;		
		
		var dir1 = new THREE.Vector3().subVectors( p2.pos, point.pos ).normalize();	
		
		var arrD = [];
		var n = 0;
		for ( var i = 0; i < point.pO.length; i++ )
		{
			if(point.pO[i].id === p2.id){ continue; }		
			//if(point.pO[i].pO.length < 2){ continue; }
			
			const pS = point.pO[i];
			var dir2 = new THREE.Vector3().subVectors( pS.pos, point.pos ).normalize();
			
			arrD[n] = {};
			arrD[n].pO = pS;
			
			var d = (pS.pos.x - p2.pos.x) * (point.pos.z - p2.pos.z) - (pS.pos.z - p2.pos.z) * (point.pos.x - p2.pos.x);
			
			var angle = dir1.angleTo( dir2 );
			
			if(d > 0){ angle *= -1; }
			
			arrD[n].rad = angle;
			

			let dergree = THREE.Math.radToDeg(dir1.angleTo( dir2 ));
			 

			if(1 === 1)
			{
				const norm1 = myMath.calcNormal2D({p1: p2.pos, p2: point.pos, reverse: true});				
				const norm2 = myMath.calcNormal2D({p1: point.pos, p2: pS.pos, reverse: true});				
				
				let l1 = {};
				l1.start = point.pos.clone().sub(p2.pos).divideScalar( 2 ).add(p2.pos);
				l1.end = l1.start.clone().add(norm1.clone().multiplyScalar( 10 ));
				
				let l2 = {};
				l2.start = pS.pos.clone().sub(point.pos).divideScalar( 2 ).add(point.pos);
				l2.end = l2.start.clone().add(norm2.clone().multiplyScalar( 10 ));				
				
				const cross = myMath.checkCrossLine(l1.start, l1.end, l2.start, l2.end);
				
				if(!cross) 
				{
					dergree = 360 - dergree;					
				}
			}
			
			arrD[n].dergree = dergree;
			
			if(!this.isNumeric(angle)) { return arr; }
			
			n++;
		}	
		
		
		if(arrD.length > 0 && count < 10)
		{ 
			arrD.sort(function (a, b) { return a.dergree - b.dergree; });
			console.log(33333333, [...arr]);
			if(arr[0].id !== arrD[0].pO.id) { return this.getContour_2(arr, arrD[0].pO, count + 1); }
			else { arr[arr.length] = arrD[0].pO; }						

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
			//if(!trueDir) console.log(points[i].id);
			
			if(!trueDir) break;
		}
		
		for (let i = 0; i < points.length - 1; i++) 
		{			
			if(!points[i].dir) continue;
			
			const dir = new THREE.Vector3().subVectors( points[i].pos, points[i + 1].pos ).normalize();			
			
			const trueDir2 = (dir.dot(points[i].dir) > 0.98) ? true : false;
			
			if(trueDir2) continue;
			
			//let helper = new THREE.ArrowHelper(dir, points[i].pos, 0.5, 0x000000);
			//scene.add(helper);			
		}		
		
		if(!trueDir && points.length > 4 && 1===2)
		{
			for (let i = 0; i < points.length - 1; i++) 
			{			
				if(!points[i].dir) continue;
				
				const dir = new THREE.Vector3().subVectors( points[i].pos, points[i + 1].pos ).normalize();			
				
				trueDir = (dir.dot(points[i].dir) > 0.98) ? true : false;
				
				if(trueDir) continue;
				
				//console.log(points, points[i]);
				
				if(points[i].pO.length > 2) continue;
				if(!points[i].pO[0].dir) continue;
				if(!points[i].pO[1].dir) continue;
				
				const a1 = points[i].pO[0].pos;
				const a2 = a1.clone().add(points[i].pO[0].dir);
				const b1 = points[i].pO[1].pos;
				const b2 = b1.clone().add(points[i].pO[1].dir);
				
				const posCross = myMath.intersectionTwoLines_2(a1, a2, b1, b2);
				
				

				if(posCross)
				{
					const box = this.crHelpBox({pos: posCross, size: 0.04, color: 0xff0000});
					this.arrPoints_1.push(box);
					
					points[i].pO[1].pos = posCross;
					trueDir = true;
				}
			}			
			
			console.log('-------');
		}
		
		
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
		// по мимом линий, показываем точки
		if(addPoints)
		{
			for ( let i = 0; i < points.length; i++ )
			{
				const newP = this.crHelpBox({pos: points[i], color});
				newP.position.y = h;
				scene.add(newP);
				this.arrPoints_1.push(newP);
			}				
		}			
		
		points = [...points];
		points.push(points[0]);
		
		for ( let i = 0; i < points.length; i++ )
		{
			points[i] = points[i].clone();
			points[i].y = h;
		}		
		
		const geometry = new THREE.Geometry();
		geometry.vertices = points;
		
		const material = new THREE.LineBasicMaterial({ color });
		
		const line = new THREE.Line( geometry, material );
		scene.add( line );		

		return line;
	}
	

	crHelpBox({pos, size = 0.04, color = 0x0000ff})
	{
		const geometry = new THREE.BoxGeometry( size, size, size );
		const material = new THREE.MeshBasicMaterial({color});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
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

		for ( let i = 0; i < this.arrArrowHelp_1.length; i++ )
		{
			scene.remove(this.arrArrowHelp_1[i]);			
		}			

		this.arrLines_1 = [];
		this.arrLines_2 = [];
		this.arrArrowHelp_1 = [];
	}
}






