

class Roof 
{
	constructor()
	{
		this.obj = [];
		this.material = new THREE.MeshStandardMaterial( { color : 0xff0000 } );	//side: THREE.DoubleSide
		
		//this.crRoof();
	}
	
	crRoof()
	{
		let g1 = new THREE.BoxGeometry( 10, 0.2, 10 );
		g1.rotateX(Math.PI/4);
		g1.rotateY(-Math.PI/2);
		g1.translate(-6, 0, 0);
		this.obj[0] = new THREE.Mesh( g1, this.material );
		scene.add( this.obj[0] );
		
		let g2 = new THREE.BoxGeometry( 10, 0.2, 10 );
		g2.rotateX(Math.PI/4);
		g2.rotateY(Math.PI/2);
		this.obj[1] = new THREE.Mesh( g2, this.material );
		scene.add( this.obj[1] );

				
		//this.crRoof_2();
		this.meshBSP(this.obj[0]);
		this.meshBSP(this.obj[1]);
		
		renderCamera();
	}


	meshBSP(obj)
	{  
		let w = infProject.scene.array.wall;
		var wdClone = obj;
		wdClone.updateMatrixWorld();
		
		for ( var i = 0; i < w.length; i++ )
		{
			let wall = w[i];
			wall.updateMatrixWorld();
			var wallClone = wall;
 
			//wdClone.position.copy( wd.position );
			var wdBSP = new ThreeBSP( wdClone );
			
			var wallBSP = new ThreeBSP( wallClone ); 			// копируем выбранную стену	
			var newBSP = wallBSP.subtract( wdBSP );				// вычитаем из стены объект нужной формы
			
			
			wallClone.geometry.dispose();
			wall.geometry.dispose();	
			
			wall.geometry = newBSP.toGeometry();
			//wall.geometry.computeVertexNormals();			
			wall.geometry.computeFaceNormals();	

			
			for ( var i2 = 0; i2 < wall.geometry.faces.length; i2++ )
			{
				wall.geometry.faces[i2].normal.normalize();
				if(wall.geometry.faces[i2].normal.z == 1) { wall.geometry.faces[i2].materialIndex = 1; }
				else if(wall.geometry.faces[i2].normal.z == -1) { wall.geometry.faces[i2].materialIndex = 2; }
				else if(wall.geometry.faces[i2].normal.x == 1) { wall.geometry.faces[i2].materialIndex = 0; }
				else if(wall.geometry.faces[i2].normal.x == -1) { wall.geometry.faces[i2].materialIndex = 0; }
				else { wall.geometry.faces[i2].materialIndex = 3; }
			}			
		}
		
		obj.visible = false;
		
	}	
}

let clRoof = new Roof();








