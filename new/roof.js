

class Roof 
{
	constructor()
	{
		this.obj = [];
		this.material = new THREE.MeshStandardMaterial( { color : 0xff0000 } );	//side: THREE.DoubleSide
		this.material2 = new THREE.MeshStandardMaterial( { color : 0x0000ff } );
		this.initBtn();
	}
	
	initBtn()
	{
		let elBlock = document.querySelector('[nameId="wrap_plan"]');
		let btn = elBlock.querySelector('[nameId="roof"]');
		btn.onmousedown = () => { this.crRoof_2(); }
	}
	
	crRoof_2()
	{
		console.log(222, infProject.scene.array.obj);
		
		let obj = infProject.scene.array.obj[0];
		
		this.getVertices( obj );
		return;
		
		
		geometry = new THREE.BufferGeometry().fromGeometry(obj.geometry);
		
		this.meshBSP(infProject.scene.array.obj[0]);
		
		renderCamera();		
	}
	
	crRoof()
	{
		let g1 = this.crGeomRoof();
		//g1.rotateX(Math.PI/4);
		//g1.rotateY(Math.PI/2);
		//g1.translate(-6, 0, 0);		
		this.obj[0] = new THREE.Mesh( g1, this.material2 );
		this.obj[0].scale.set(0.5, 0.5, 0.5);
		this.obj[0].position.x = -6;
		this.obj[0].rotation.set(Math.PI/2, Math.PI/4, 0);
		scene.add( this.obj[0] );
		
		let g2 = this.crGeomRoof();		//new THREE.BoxGeometry( 10, 0.2, 10 );
		//g2.rotateX(Math.PI/4);
		//g2.rotateY(Math.PI/2);
		this.obj[1] = new THREE.Mesh( g2, this.material );
		this.obj[1].rotation.set(Math.PI/2, -Math.PI/4, 0);
		scene.add( this.obj[1] );

this.obj[0].position.y += 0.5;
this.obj[1].position.y += 0.5;
		this.meshBSP(this.obj[0]);
		this.meshBSP(this.obj[1]);
		
		console.log(111, this.obj[0]);
		renderCamera();
		
		this.obj[0].userData.tag = 'obj';
		
		let id = infProject.jsonProject.actLevel;
		infProject.jsonProject.level[id].obj.push(this.obj[0]);
		infProject.scene.array.obj.push(this.obj[0]);
	}

	crGeomRoof()
	{
		let x = 10;
		let xSub = 10/2;		
		let z = 10;
		let zSub = 10/2;
		
		let point = [];
		point[0] = new THREE.Vector2(0 - xSub, 0 - zSub); 
		point[1] = new THREE.Vector2(0 - xSub, z - zSub);
		point[2] = new THREE.Vector2(x - xSub, z - zSub);
		point[3] = new THREE.Vector2(x - xSub, 0 - zSub);
		
		let shape = new THREE.Shape( point );
		
		let geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.5 } );
		
		return geometry;
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
		
		//obj.visible = false;
		
	}


	getVertices( obj )
	{ 
		
		obj.updateMatrixWorld(true);
		let g = obj.children[0].children[0].geometry;
		
		let geometry = new THREE.Geometry().fromBufferGeometry(g);
		
		geometry.computeFaceNormals();		
		
		var faces = geometry.faces;		
		
		console.log(geometry);
		
		let arrV = [];
		for (var i = 0; i < faces.length; i++) 
		{		
			if(faces[i].normal.z < 0.8) continue;


			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];				
			

			
			arrV[faces[i].a] = v1;
			arrV[faces[i].b] = v2;
			arrV[faces[i].c] = v3;
		}
		
		let n = arrV.length;
		
		for (var i = 0; i < geometry.vertices.length; i++)
		{
			for (var i2 = 0; i2 < arrV.length; i2++)
			{
				if(!arrV[i2]) continue;
				
				if(i2 === i) continue;
				//if(arrV[i2].pos.length() !== geometry.vertices[i].length()) continue;
				
				if(geometry.vertices[i].distanceTo( arrV[i2] ) < 0.001)
				{
					//if(infProject.tools.pg.arrO.findIndex(o => o == obj) > -1)
					console.log(i, i2);
					arrV[i] = geometry.vertices[i];
				}
			}			
		}
		
		
		for (var i = 0; i < arrV.length; i++)
		{
			if(!arrV[i]) continue;
			arrV[i].z += 5; 		
		}
		
		//geometry.vertices = v;
		geometry.verticesNeedUpdate = true; 
		geometry.elementsNeedUpdate = true;	

		let obj2 = new THREE.Mesh( geometry, this.material2 );
		obj2.position.copy(obj.position);
		obj2.rotation.copy(obj.children[0].children[0].rotation);
		obj2.position.y = +0;
		scene.add( obj2 );		
	}	
}

let clRoof = new Roof();








