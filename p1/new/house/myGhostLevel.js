


class MyGhostLevel 
{
	constructor()
	{
		this.arr = {point: [], wall: [], window: [], door: []};
		this.material = {};
		let m = new THREE.MeshStandardMaterial( { color : 0xe3e3e5 } );
		this.material.wall = [m, m, m, m];
		this.material.dw = new THREE.MeshStandardMaterial( { color : 0xd1d1d1 } );
		this.material.point = new THREE.MeshStandardMaterial({ color : 0xcccccc });
		
		this.offsetY = -0.1;	// смещение призрочного этажа вниз относительно нуля
	}
	
	// показываем призрачный этаж
	createLevel()
	{
		this.deleteLevel();
		
		const idActLevel = myLevels.getIdActLevel() - 1;
		if(idActLevel < 0) return;
		
		// получаем данные нижнего этажа, чтобы построить призрачный этаж
		const { walls, points, doors, windows } = myLevels.getDestructObject(idActLevel);

		let point2 = [];
		let wall2 = [];
		let window2 = [];
		let door2 = [];
		
		for ( let i = 0; i < points.length; i++ )
		{ 
			const p = this.crGhostPoint({pos: points[i].position.clone()});
			point2.push(p);
		}		
		
		for ( let i = 0; i < walls.length; i++ )
		{ 				
			walls[i].updateMatrixWorld();
			let pw = [];
			pw[0] = walls[i].localToWorld( walls[i].userData.wall.v[0].clone() ); 
			pw[1] = walls[i].localToWorld( walls[i].userData.wall.v[2].clone() ); 
			pw[2] = walls[i].localToWorld( walls[i].userData.wall.v[4].clone() ); 
			pw[3] = walls[i].localToWorld( walls[i].userData.wall.v[10].clone() ); 
			pw[4] = walls[i].localToWorld( walls[i].userData.wall.v[8].clone() ); 
			pw[5] = walls[i].localToWorld( walls[i].userData.wall.v[6].clone() );

			wall2[wall2.length] = this.crForm({arrP: pw, y: 0.02, material: this.material.wall});
		}
		
		for ( let i = 0; i < windows.length; i++ )
		{ 	
			windows[i].updateMatrixWorld();
			let pw = [];
			pw[0] = windows[i].localToWorld( windows[i].geometry.vertices[0].clone() ); 
			pw[1] = windows[i].localToWorld( windows[i].geometry.vertices[3].clone() ); 
			pw[2] = windows[i].localToWorld( windows[i].geometry.vertices[7].clone() ); 
			pw[3] = windows[i].localToWorld( windows[i].geometry.vertices[6].clone() );
			
			window2[window2.length] = this.crForm({arrP: pw, y: 0.03, material: this.material.dw});
		}
		
		for ( let i = 0; i < doors.length; i++ )
		{ 	
			doors[i].updateMatrixWorld();
			let pw = [];
			pw[0] = doors[i].localToWorld( doors[i].geometry.vertices[0].clone() ); 
			pw[1] = doors[i].localToWorld( doors[i].geometry.vertices[3].clone() ); 
			pw[2] = doors[i].localToWorld( doors[i].geometry.vertices[7].clone() ); 
			pw[3] = doors[i].localToWorld( doors[i].geometry.vertices[6].clone() );
			
			door2[door2.length] = this.crForm({arrP: pw, y: 0.03, material: this.material.dw});
		}		
		
		this.arr = {wall: wall2, point: point2, window: window2, door: door2};
		
		renderCamera();		
	}
	


	// точка для призрочного этажа
	crGhostPoint({pos})
	{
		const geometry = myHouse.myPoint.getGeometryPoint();
		
		const obj = new THREE.Mesh(geometry, this.material.point);
		obj.position.copy(pos);
		obj.position.y = this.offsetY;
		scene.add(obj);	

		return obj;
	}
	
	// создаем призрачный этаж (стены, окна, двери)
	crForm({arrP, y, material})
	{
		let t = [];
		for ( let i = 0; i < arrP.length; i++ ) t[i] = new THREE.Vector2 ( arrP[i].x, arrP[i].z );	 

		let geometry = new THREE.ExtrudeGeometry( new THREE.Shape( t ), { bevelEnabled: false, depth: 0.01 } )
		geometry.rotateX(Math.PI / 2);
		
		let obj = new THREE.Mesh( geometry, material );
		obj.position.y = this.offsetY + y;
		scene.add(obj);
		
		return obj;
	}
	
	// удаляем призрачный этаж
	deleteLevel()
	{
		this.deleteObjs(this.arr.point);
		this.deleteObjs(this.arr.wall);
		this.deleteObjs(this.arr.window);
		this.deleteObjs(this.arr.door);

		this.arr.point = [];
		this.arr.wall = [];
		this.arr.window = [];
		this.arr.door = [];
	}
	
	deleteObjs(arrO)
	{
		for ( let i = 0; i < arrO.length; i++ )
		{			
			scene.remove( arrO[i] );
			arrO[i].geometry.dispose();
		}		
	}
}














