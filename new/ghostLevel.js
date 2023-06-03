


class GhostLevel 
{
	constructor()
	{
		this.arr = {point: [], wall: [], window: [], door: []};
		this.material = {};
		this.material.point = new THREE.MeshStandardMaterial( { color : 0xcccccc } );
		let m = new THREE.MeshStandardMaterial( { color : 0xe3e3e5 } );
		this.material.wall = [m, m, m, m];
		this.material.dw = new THREE.MeshStandardMaterial( { color : 0xd1d1d1 } );
	}
	
	// показываем призрачный этаж
	createLevel()
	{
		this.deleteLevel();
		
		let result = this.getLevel();
		if(result === undefined) return;
		
		let point = result.point;
		let wall = result.wall;
		let window = result.window;
		let door = result.door;

		let point2 = [];
		let wall2 = [];
		let window2 = [];
		let door2 = [];
		
		for ( let i = 0; i < point.length; i++ )
		{ 
			const p = myHouse.myPoint.createGhostPoint({pos: new THREE.Vector3(point[i].position.x, 0, point[i].position.z)});
			point2.push(p);
		}		
		
		for ( let i = 0; i < wall.length; i++ )
		{ 				
			wall[i].updateMatrixWorld();
			let pw = [];
			pw[0] = wall[i].localToWorld( wall[i].userData.wall.v[0].clone() ); 
			pw[1] = wall[i].localToWorld( wall[i].userData.wall.v[2].clone() ); 
			pw[2] = wall[i].localToWorld( wall[i].userData.wall.v[4].clone() ); 
			pw[3] = wall[i].localToWorld( wall[i].userData.wall.v[10].clone() ); 
			pw[4] = wall[i].localToWorld( wall[i].userData.wall.v[8].clone() ); 
			pw[5] = wall[i].localToWorld( wall[i].userData.wall.v[6].clone() );

			wall2[wall2.length] = this.crForm({arrP: pw, y: 0.02, material: this.material.wall});
		}
		
		for ( let i = 0; i < window.length; i++ )
		{ 	
			window[i].updateMatrixWorld();
			let pw = [];
			pw[0] = window[i].localToWorld( window[i].geometry.vertices[0].clone() ); 
			pw[1] = window[i].localToWorld( window[i].geometry.vertices[3].clone() ); 
			pw[2] = window[i].localToWorld( window[i].geometry.vertices[7].clone() ); 
			pw[3] = window[i].localToWorld( window[i].geometry.vertices[6].clone() );
			
			window2[window2.length] = this.crForm({arrP: pw, y: 0.03, material: this.material.dw});
		}
		
		this.arr = {wall: wall2, point: point2, window: window2, door: door2};
		
		renderCamera();		
	}
	
	// получаем данные нижнего этажа, чтобы построить призрачный этаж
	getLevel()
	{
		const id = myLevels.activeId - 1;
		const level = myLevels.levels;
		
		if(id < 0) return;

		const wall = level[id].wall;
		const point = level[id].point;
		const window = level[id].window;
		const door = level[id].door;
		const height = level[id].height;
		
		return {wall, point, window, door};
	}

	// создаем призрачный этаж
	crForm({arrP, y, material})
	{
		let t = [];
		for ( let i = 0; i < arrP.length; i++ ) t[i] = new THREE.Vector2 ( arrP[i].x, arrP[i].z );	 

		let geometry = new THREE.ExtrudeGeometry( new THREE.Shape( t ), { bevelEnabled: false, depth: 0.01 } )
		geometry.rotateX(Math.PI / 2);
		
		let obj = new THREE.Mesh( geometry, material );
		obj.position.y = y;
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

let ghostLevel = new GhostLevel();












