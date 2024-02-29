

class MyGridPointWf 
{
	geomPoint;
	matPoint;
	
	constructor()
	{
		this.geomPoint = new THREE.SphereGeometry( 0.1, 16, 16 );
		this.matPoint = new THREE.MeshStandardMaterial({ color: 0x222222, lightMap: lightMap_1 });
	}
	

	crPoints({arrPos, grid})
	{
		const arrP = [];
		
		for ( let i = 0; i < arrPos.length; i++ ) 
		{  
			const obj = this.crPoint({pos: new THREE.Vector3(arrPos[i].x, arrPos[i].y, arrPos[i].z), grid});
			arrP.push(obj);
			console.log(arrPos[i]);
		}

		return arrP;
	}
	
	crPoint({pos, grid})
	{
		const obj = new THREE.Mesh( this.geomPoint, this.matPoint ); 

		obj.userData.tag = 'gridPointWf';
		obj.userData.grid = grid;
		
		obj.position.copy(pos);		
		scene.add( obj );

		return obj;
	}
	
	
	// получаем стеку относящуюся к этой точке
	getGrid({obj})
	{
		return obj.userData.grid;
	}
	

	
	render()
	{
		renderCamera();
	}
}







