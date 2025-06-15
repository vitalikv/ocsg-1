
// информациионые точки для стен
class MyBlocksInfoPoints
{
	pointsInfo = [];
	
	// вкл режим когда (произошел подсчет линий и построение фековых стен)
	crPoints({arr})
	{
		const pointsInfo = [];
		
		for ( let i = 0; i < arr.length; i++ )
		{			
			const obj = this.crPoint();
			//obj.material.map = this.crTexture({text: i + 1});
			obj.material.map = this.crTexture({text: arr[i].userData.id});
			
			obj.position.copy(arr[i].position.clone());
			obj.position.y = 3;
			//obj.renderOrder = 2;
			
			pointsInfo.push(obj);
		}
		
		this.setPointsInfo({points: pointsInfo});
	}
	
	
	crPoint()
	{
		const geometry = new THREE.CircleGeometry( 0.15, 32 );
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, lightMap: lightMap_1 });

		const obj = new THREE.Mesh( geometry, material );
		obj.userData.tag = 'blockPointInfo';
		obj.rotation.x = -Math.PI/2;
		scene.add( obj );
		
		return obj;
	}
	
	
	crTexture({text})
	{
		
		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');	

		canvas.width = 1024;
		canvas.height = 1024;

		
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fillRect(0, 0, canvas.width, canvas.height);		
		
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/2, 1024/2, 0, 2*Math.PI, false);
		context.fillStyle = 'rgba(255,255,255,1)';
		context.fill();
		context.lineWidth = canvas.width * 0.1;
		context.strokeStyle = 'rgba(34, 34, 34,1)';
		context.stroke();	

		context.font = '420pt Arial';
		context.fillStyle = 'rgba(34, 34, 34,1)';
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(text, canvas.width / 2, canvas.height / 2 );	
		
		let texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;		
		
		return texture;
	}	
	

	setPointsInfo({points})
	{
		this.pointsInfo = points;
	}
	
	getPointsInfo()
	{
		return this.pointsInfo;
	}
	
	
	// получаем точки одной группы
	getPointsFromGroup({group})
	{
		const points = [];
		
		const arr1 = group.arrOrderIds;
		const arr2 = [];

		// получаем все точки линий
		for ( let i = 0; i < group.lines2.length; i++ )
		{
			const pObjs = group.lines2[i].pObjs;
			
			const p1 = pObjs[0];
			const p2 = pObjs[pObjs.length - 1];
			
			arr2.push(p1, p2);
		}
		
		
		const arr2Map = new Map(); // Создаем Map для быстрого поиска объектов по id

		// Заполняем Map: сохраняем только первое вхождение каждого id из arr2
		for (const obj of arr2) 
		{
			const id = obj.userData.id;
			if (!arr2Map.has(id)) 
			{
				arr2Map.set(id, obj);
			}
		}

		// Проходим по arr1 и собираем объекты в порядке arr1
		for (const id of arr1) 
		{
			if (arr2Map.has(id)) 
			{
				points.push(arr2Map.get(id));
				arr2Map.delete(id); // Удаляем, чтобы избежать повторений (если arr1 имеет дубликаты)
			}
		}			
		
		return points;
	}
	
	
	// удаляем инфо точки
	deletePointsInfo()
	{
		const points = this.getPointsInfo();
		
		for (let i = 0; i < points.length; i++)
		{
			const point = points[i];
			
			disposeNode(point);
			scene.remove(point);
		}

		this.setPointsInfo({points: []});
	}
}







