

class MyUlitkaWf
{
	helpPoints = [];
	helpCountPoints = -1;
	helpAddPoints = true;
	arrRoom = [];
	
	arrLines_1 = [];
	linesScene = []; // потом удалить
	
	constructor()
	{
		this.initKeyboard();
	}
	
	drawFrom({points})
	{
		points = [...points];		
		
		const result = myMath.checkClockWise(points);	// проверяем последовательность построения точек (по часовой стрелке или нет)
		if(result < 0) points.reverse();	// если по часовой стрелки, то разворачиваем массив, чтобы был против часовой
		
		let arrFroms = [points];
		
		while (arrFroms.length > 0) 
		{
			arrFroms = this.loopFroms({oldFormPoints: arrFroms});
			//arrFroms = [];
		}

		return this.arrLines_1;
	}
	
	loopFroms({oldFormPoints})
	{
		const arrFroms = [];
		const arrLines = [];
		
		for ( let i = 0; i < oldFormPoints.length; i++ )
		{
			const newFormPoints = myMath.offsetForm({points: oldFormPoints[i], offset: -0.2});
			const forms = this.calcForm(newFormPoints, oldFormPoints[i]);			
			arrFroms.push(...forms);
			
			this.crLines_1({newFormPoints});	// линии пола после смещения, без оптимизации
			this.crLines_2({forms});	// линии пола после смещения и оптимизации
		}
		
		return arrFroms;
	}


	crLines_1({newFormPoints})
	{
		const geometryOffset = new THREE.Geometry();
		geometryOffset.vertices = newFormPoints;
		const materialOffset = new THREE.LineBasicMaterial( { color: 'red' } );
		const lineOffset = new THREE.Line( geometryOffset, materialOffset );
		scene.add( lineOffset );
		this.arrLines_1.push(lineOffset);		
	}

	crLines_2({forms})
	{
		for ( let i2 = 0; i2 < forms.length; i2++ )
		{
			const p = forms[i2];
			
			const color = new THREE.Color( 0xffffff );
			color.setHex( Math.random() * 0xffffff );
			
			for ( let i3 = 0; i3 < p.length; i3++ )
			{
				const h = 2;
				
				const newP = this.crHelpBox2({pos: p[i3]});
				newP.visible = true;
				newP.position.y = h;
				newP.material = newP.material.clone();
				newP.material.color.copy(color)
				scene.add(newP)
				//console.log(p[i3].userData.id);
				
				if(i3 < p.length - 1)
				{
					const geometryOffset = new THREE.Geometry();
					const p1 = p[i3];
					const p2 = p[i3+1];
					p1.y = h;
					p2.y = h;
					geometryOffset.vertices = [p1, p2];
					const materialOffset = new THREE.LineBasicMaterial( { color } );
					const lineOffset = new THREE.Line( geometryOffset, materialOffset );			
					scene.add( lineOffset );

					this.linesScene.push(lineOffset);
				}
			}		
			
		}
		
	}
	
	
	
	calcForm(arrPos, arrOldPos, clear = true)
	{
		if(clear) 
		{
			this.helpPoints = [];
			this.helpCountPoints = -1;
			this.helpAddPoints = true;
		}
		
		arrPos = [...arrPos];
		arrOldPos = [...arrOldPos];
		
		arrPos.splice(arrPos.length - 1, 1); // удаляем последний элем., потому приходит массив, где последний элем. - копия нулевого элем.
		arrOldPos.splice(arrOldPos.length - 1, 1);
		

		const arrLine = [];
		for ( let i = 0; i < arrPos.length - 1; i++ )
		{
			const dir = new THREE.Vector3().subVectors( arrOldPos[i], arrOldPos[i + 1] ).normalize();
			arrLine.push({start: arrPos[i], end: arrPos[i + 1], startId: i, endId: i + 1, dir, crossLines: [], crossPoints: []});
		}
		const dir = new THREE.Vector3().subVectors( arrOldPos[arrOldPos.length - 1], arrOldPos[0] ).normalize();
		arrLine.push({start: arrPos[arrPos.length - 1], end: arrPos[0], startId: arrPos.length - 1, endId: 0, dir, crossLines: [], crossPoints: []});
		
		
		const arrPos2 = this.calcCrossLine({arrLine});
		
		const result = this.calcPath({arrLine, arrPos, arrPos2});
		
		return result;
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
		
		const points2 = [];
		for ( let i = 0; i < points.length; i++ )
		{
			const ind = points2.findIndex((o) => o.id === points[i].id);
			
			if(ind === -1) points2.push(points[i]);
			else
			{				
				points2[ind].p.push(...points[i].p);
				if(points[i].dir) points2[ind].dir = points[i].dir;
			}
		}
		
		
		for ( let i = 0; i < points2.length; i++ )
		{
			const point = this.crHelpBox2({pos: points2[i].pos});
			point.userData = {id: points2[i].id, pIds: points2[i].p, dir: points2[i].dir, p: []};
			point.p = [];
			point.visible = false;
			this.helpPoints.push(point);
		}

		for ( let i = 0; i < this.helpPoints.length; i++ )
		{
			const p = [];
			for ( let i2 = 0; i2 < this.helpPoints[i].userData.pIds.length; i2++ )
			{
				const id = this.helpPoints[i].userData.pIds[i2];
				const ind = this.helpPoints.findIndex((o) => o.userData.id === id);
				p.push(this.helpPoints[ind]);
			}
			this.helpPoints[i].p = p;
			//console.log(this.helpPoints[i].userData.id, this.helpPoints[i].userData.pIds);
		}		
		
		//console.log(points2);
		
		return this.calcRoomZone(this.helpPoints)
	}


	crHelpBox({pos})
	{
		const geometry = new THREE.BoxGeometry( 0.04, 0.04, 0.04 );
		const material = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
	}
	
	crHelpBox2({pos})
	{
		const geometry = new THREE.BoxGeometry( 0.04, 0.04, 0.04 );
		const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.copy(pos);
		scene.add( mesh );

		return mesh;
	}
	
	
	helpAnimePoints({visible})
	{
		let id = this.helpCountPoints;
		
		if(visible && !this.helpAddPoints) id--;
		if(!visible && this.helpAddPoints) id++;
		
		if(visible && id + 1 < this.helpPoints.length) id++;
		if(!visible && id - 1 > -1) id--;
		this.helpAddPoints = visible;
		
		if(id > -1 && id < this.helpPoints.length) this.helpPoints[id].visible = visible;
		
		this.helpCountPoints = id;
		console.log(id, this.helpPoints[id].userData);
	}
	
	initKeyboard()
	{
		document.addEventListener("keydown", (e)=> 
		{
			if(e.code === 'KeyS') this.helpAnimePoints({visible: false});
			if(e.code === 'KeyD') this.helpAnimePoints({visible: true});
		});			
	}



	calcRoomZone(obj_point)
	{		
		this.arrRoom = [];
		
		for ( let i = 0; i < obj_point.length; i++ )
		{			
			for ( let i2 = 0; i2 < obj_point[i].p.length; i2++ )
			{													
				const p = this.getRoomContour([obj_point[i]], obj_point[i].p[i2]); 						 
				
				if(p[0] !== p[p.length - 1]){ continue; }	
				
				const trueDir = this.getCheckDir(p);
				if(!trueDir) continue;

				if(this.detectEqualForm( p )){ continue; }
				
				this.arrRoom.push(p);
				
				break; 
			}
		}
		
		
		const newV = [];
		for ( let i = 0; i < this.arrRoom.length; i++ )
		{
			const v = [];
			
			for ( let i2 = 0; i2 < this.arrRoom[i].length; i2++ )
			{
				v.push(this.arrRoom[i][i2].position.clone());
			}
			
			newV.push(v);
		}
		
		return newV;
	}

	// ищем замкнутый контур помещения
	getRoomContour(arr, point)
	{
		var p2 = arr[arr.length - 1];
		arr[arr.length] = point;		
		
		var dir1 = new THREE.Vector3().subVectors( point.position, p2.position ).normalize();	
		
		var arrD = [];
		var n = 0;
		for ( var i = 0; i < point.p.length; i++ )
		{
			if(point.p[i] == p2){ continue; }		
			if(point.p[i].p.length < 2){ continue; }
			
			var dir2 = new THREE.Vector3().subVectors( point.p[i].position, point.position ).normalize();
			
			arrD[n] = [];
			arrD[n][1] = point.p[i];
			
			var d = (point.p[i].position.x - p2.position.x) * (point.position.z - p2.position.z) - (point.p[i].position.z - p2.position.z) * (point.position.x - p2.position.x);
			
			var angle = dir1.angleTo( dir2 );
			
			if(d > 0){ angle *= -1; }
			
			arrD[n][0] = angle;
			if(!this.isNumeric(angle)) { return arr; }
			//console.log([point.p[i].tag_2, d, angle * 180 / Math.PI]);
			
			n++;
		}	
		
		
		if(arrD.length > 0)
		{ 
			arrD.sort(function (a, b) { return a[0] - b[0]; });
			
			for ( var i = 0; i < arrD.length; i++ )
			{			
				if(arr[0] != arrD[i][1]) { return this.getRoomContour(arr, arrD[i][1]); }
				else { arr[arr.length] = arrD[i][1]; break; }						
			}
		}
		
		return arr;
	}

	getCheckDir(points)
	{
		let trueDir = true;
		
		let txt = '';
		for (let i = 0; i < points.length; i++) txt += ' ' + points[i].userData.id;
		//console.log(txt);
		
		for (let i = 0; i < points.length - 1; i++) 
		{			
			if(!points[i].userData.dir) continue;
			
			const dir = new THREE.Vector3().subVectors( points[i].position, points[i + 1].position ).normalize();
			
			
			trueDir = (dir.dot(points[i].userData.dir) > 0.98) ? true : false;
			//console.log(points[i].userData.id, points[i].userData.dir, dir, trueDir);
			
			if(!trueDir) break;
		}
		//console.log('-------');
		return trueDir;
	}


	// проверяем если зона с такими же точками
	detectEqualForm( arrP )
	{
		let flag = false;
		
		for ( let i = 0; i < this.arrRoom.length; i++ )
		{
			let ln = 0;
			
			if(this.arrRoom[i].length != arrP.length) { continue; }
				
			for ( let i2 = 0; i2 < this.arrRoom[i].length - 1; i2++ )
			{
				for ( let i3 = 0; i3 < arrP.length - 1; i3++ )
				{
					if(this.arrRoom[i][i2] === arrP[i3]) { ln++; }
				}
			}
			
			if(ln == arrP.length - 1) { flag = true; break; }
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
		
}






