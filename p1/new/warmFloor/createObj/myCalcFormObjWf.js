

class MyCalcFormObjWf
{

	// произвольная форма с выдавливанием
	crShape({p, w1, pos = new THREE.Vector3(), rot = new THREE.Vector3(), scale = 1, matIndex = 0})
	{
		// p - массив точек для построение формы
		// w1 - глубина выдавливания
		// pos - смещение geometry относительно 0
		// rot - поворот геометрии
		// matIndex - индекс материала, который нужно присвоить форме
		
		
		for ( let i = 0; i < p.length; i++ ) 
		{  
			p[i].x *= scale;
			p[i].y *= scale; 
		}		
		
		
		const shape = new THREE.Shape( p );
		const gShape = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: w1 } );
		gShape.rotateX(rot.x); 
		gShape.rotateY(rot.y); 
		gShape.rotateZ(rot.z);		
		gShape.translate(pos.x, pos.y, pos.z);

		for(let i = 0; i < gShape.faces.length; i++){ gShape.faces[i].materialIndex = matIndex; }

		return gShape;
	}
	
	// радиус окружности из дюймов в м (резьба)
	sizeRezba(cdm)
	{
		var size = cdm.size;
		var side = cdm.side;
		
		// d диаметр трубы
		// t толщина стенки

		var inf = {n: 0, v: 0};
		var d = 0;
		var t = 0;
		
		if (size == "1/4") { d = 13.5; t = 2.2; }
		else if (size == "3/8") { d = 17.0; t = 2.2; }
		else if (size == "1/2") { d = 21.3; t = 2.7; }
		else if (size == "3/4") { d = 26.8; t = 2.8; }
		else if (size == "1") { d = 33.5; t = 3.2; }
		else if (size == "1 1/4") { d = 42.3; t = 3.2; }
		else if (size == "1 1/2") { d = 48.0; t = 3.5; }
		else if (size == "2") { d = 60.0; t = 3.5; }
		else if (size == "2 1/2") { d = 75.5; t = 4; }
		else if (size == "3") { d = 88.5; t = 4; }
		else if (size == "3 1/2") { d = 101.3; t = 4; }
		else if (size == "4") { d = 114.0; t = 4.5; }
		else if (size == "5") { d = 140.0; t = 4.5; }
		else if (size == "6") { d = 165.0; t = 4.5; }


		if (side == "n")	
		{
			inf.n = (d - t);		// нр. резьба (диаметр)
			inf.v = (d - t*2);		// вн. стенка (диаметр)
		}
		else
		{
			inf.n = d;			// нр. стенка (диаметр)
			inf.v = (d - t);	// вн. резьба (диаметр)
		}

		inf.n = Math.round(inf.n * 10) / 10000;
		inf.v = Math.round(inf.v * 10) / 10000;
		
		return inf;
	}


	// размер металлопластиковой трубы
	sizeTubeMP({size})
	{
		// d диаметр трубы
		// t толщина стенки

		var inf = {n: 0, v: 0};
		var d = 0;
		var t = 0.5;
		
		if (size == "16") { d = 16; }
		else if (size == "20") { d = 20; }
		else if (size == "26") { d = 26; }
		else if (size == "32") { d = 32; }
		else if (size == "40") { d = 40; }		


		inf.n = (d + t*1.4);	// нр. (диаметр)
		inf.v = d;				// вн. (диаметр)


		inf.n = Math.round(inf.n * 10) / 10000;
		inf.v = Math.round(inf.v * 10) / 10000;
		
		return inf;
	}


	// получаем форму круга (или полукруга)
	getFormCircle({count, size, pi = Math.PI * 2})
	{
		const circle = [];
		const g = pi / count;
		
		for ( let i = 0; i < count+1; i++ )
		{
			const angle = g * i;
			circle[i] = new THREE.Vector2();
			circle[i].y = Math.sin(angle) * size;
			circle[i].x = Math.cos(angle) * size;
		}

		return circle;
	}
	
	
	// втулка
	crFormSleeve(cdm) 
	{
		const geometry = new THREE.Geometry();
		
		var pos = (cdm.pos) ? cdm.pos : { x: 0, y: 0, z: 0 };
		var rot = (cdm.rot) ? cdm.rot : { x: 0, y: 0, z: 0 };
		if(cdm.pos1) { var pos1 = cdm.pos1; }
			
		var dlina = cdm.dlina;  
		var d_n1 = (cdm.diameter_nr) ? cdm.diameter_nr : false;
		var d_v1 = (cdm.diameter_vn) ? cdm.diameter_vn : false;
		var d_n2 = (cdm.d_n2) ? cdm.d_n2 : false;
		var d_v2 = (cdm.d_v2) ? cdm.d_v2 : false;	
		var edge_nr = (cdm.edge_nr) ? cdm.edge_nr : 32;
		var edge_vn = (cdm.edge_vn) ? cdm.edge_vn : 32;
		var rezba_nr = cdm.rezba_nr;
		var rezba_vn = cdm.rezba_vn;
		
		var ind = [0, 0, 0, 0];	
		if(cdm.ind) ind = cdm.ind; 	

		var arrG = [];
		
		// фтулка наружная
		{
			var infO = {r1: d_n1/2, length: dlina, edge: edge_nr, geom: {rotateZ: -Math.PI/2} };
			if(d_n2) { infO.r2 = d_n2/2; }
			arrG[0] = this.crCild_2( infO );
			
			if(pos1) arrG[0].translate(pos1.x, pos1.y, pos1.z);
		}	

		// фтулка внутринняя 
		{		
			var infO = {r1: d_v1/2, length: dlina, edge: edge_vn, geom: {rotateZ: -Math.PI/2} };
			if(d_v2) { infO.r2 = d_v2/2; }
			arrG[1] = this.crCild_2( infO );

			if(pos1) arrG[1].translate(pos1.x, pos1.y, pos1.z);
		}
		
		// круг с отверстием (начало)
		{
			var infO = {radius_nr: d_n1/2, radius_vn: d_v1/2, edge_nr: edge_nr, edge_vn: edge_vn};
			if(d_n2) { infO.radius_nr = d_n2/2; infO.radius_vn = d_v2/2; }
			arrG[2] = this.crCircle_2(infO);
			
			arrG[2].rotateZ(Math.PI/2);
			arrG[2].rotateY(Math.PI/2);
			arrG[2].translate(-dlina/2, 0, 0);

			if(pos1) arrG[2].translate(pos1.x, pos1.y, pos1.z);
		}

		// круг с отверстием (конец)
		{
			var infO = {radius_nr: d_n1/2, radius_vn: d_v1/2, edge_nr: edge_nr, edge_vn: edge_vn};		
			arrG[3] = this.crCircle_2(infO);
			
			arrG[3].rotateZ(Math.PI/2);
			arrG[3].rotateY(Math.PI/2);
			arrG[3].translate(dlina/2, 0, 0);

			if(pos1) arrG[3].translate(pos1.x, pos1.y, pos1.z);
		}
		
		
		for ( var i = 0; i < arrG.length; i++ )
		{
			arrG[i].rotateX(rot.x); 
			arrG[i].rotateY(rot.y); 
			arrG[i].rotateZ(rot.z);		
			arrG[i].translate(pos.x, pos.y, pos.z);	
		}
		
		
		//arrG[0].computeBoundingSphere();
		//var posC = arrG[0].boundingSphere.center.clone()	
			
		
		geometry.merge(arrG[0], arrG[0].matrix, ind[0]);
		geometry.merge(arrG[1], arrG[1].matrix, ind[1]);
		geometry.merge(arrG[2], arrG[2].matrix, ind[2]);
		geometry.merge(arrG[3], arrG[3].matrix, ind[3]);

		return geometry;
	}



	// цилиндр
	crCild_2(cdm)
	{
		var r1 = cdm.r1;
		var r2 = (cdm.r2) ? cdm.r2 : r1;
		var length = cdm.length;
		var edge = cdm.edge;
		var geom = (cdm.geom) ? cdm.geom : {};
		var BufferG = (geom.BufferG) ? true : false;	
		
		//----------
		
		var geometry = new THREE.CylinderGeometry( r1, r2, length, edge, 1, true );
		
		if(geom.rotateX) { geometry.rotateX(geom.rotateX); }
		if(geom.rotateY) { geometry.rotateY(geom.rotateY); }
		if(geom.rotateZ) { geometry.rotateZ(geom.rotateZ); }
		
		this.upUvs_5(geometry);
		
		if(BufferG && 1==2)
		{
			obj.geometry.dispose();
			obj.geometry = new THREE.BufferGeometry().fromGeometry(obj.geometry);			
		}

		return geometry;
	}


	// кольцо
	crRing_2(cdm)
	{
		var radius_nr = cdm.radius_nr;
		var radius_vn = (cdm.radius_vn) ? cdm.radius_vn : 0;	// отверстие
		var edge = cdm.edge;
		var geom = (cdm.geom) ? cdm.geom : {};
		var BufferG = (geom.BufferG) ? true : false;
		var material = cdm.material;
		
		 
		var geometry = new THREE.RingGeometry( radius_vn, radius_nr, edge, 1 );

		if(geom.rotateX) { geometry.rotateX(geom.rotateX); }
		if(geom.rotateY) { geometry.rotateY(geom.rotateY); }
		if(geom.rotateZ) { geometry.rotateZ(geom.rotateZ); }		
	 
		
		var obj = new THREE.Mesh( geometry, material );	
		upUvs_4( obj );
		
		if(BufferG)
		{
			obj.geometry.dispose();
			obj.geometry = new THREE.BufferGeometry().fromGeometry(obj.geometry);			
		}	
			
		return obj;
	}


	// круг с отверстием или без отверстия
	crCircle_2(cdm)
	{
		var radius_nr = cdm.radius_nr;
		var radius_vn = (cdm.radius_vn) ? cdm.radius_vn : {};	// отверстие
		var edge_nr = cdm.edge_nr;
		var edge_vn = cdm.edge_vn;	
		var geom = (cdm.geom) ? cdm.geom : {};
		
		function createCircle_2(cdm)
		{
			var count = cdm.count;
			var circle = [];
			var g = (Math.PI * 2) / count;
			
			for ( var i = 0; i < count; i++ )
			{
				var angle = g * i;
				circle[i] = new THREE.Vector2();
				circle[i].x = Math.sin(angle) * cdm.size;
				circle[i].y = Math.cos(angle) * cdm.size;
			}

			return circle;
		}

		// geometry
		{
			var arcShape = new THREE.Shape( createCircle_2({size: radius_nr, count: edge_nr}) );
			
			// отверстие
			if(radius_vn)
			{
				var holePath = new THREE.Shape( createCircle_2({size: radius_vn, count: edge_vn}) );
				arcShape.holes.push( holePath );				
			}
			
			var geometry = new THREE.ShapeGeometry( arcShape );
			
			if(geom.rotateX) { geometry.rotateX(geom.rotateX); }
			if(geom.rotateY) { geometry.rotateY(geom.rotateY); }
			if(geom.rotateZ) { geometry.rotateZ(geom.rotateZ); }		
		}
			
		return geometry;
	}


	// сфера или полусфера
	crSphere_2({r = 1, cutRad = 0, rotX = 0, rotY = 0, rotZ = 0, matIndex = 0})
	{		
		const geometry = new THREE.SphereGeometry( r, 32, 32, 0, cutRad );
		
		if(rotX) { geometry.rotateX(rotX); }
		if(rotY) { geometry.rotateY(rotY); }
		if(rotZ) { geometry.rotateZ(rotZ); }

		for(let i = 0; i < geometry.faces.length; i++){ geometry.faces[i].materialIndex = matIndex; }

		return geometry;	
	}


	upUvs_5( geometry )
	{	
		geometry.faceVertexUvs[0] = [];
		var faces = geometry.faces;
		
		for (var i = 0; i < faces.length; i++) 
		{		
			var components = ['x', 'y', 'z'].sort(function(a, b) {			
				return Math.abs(faces[i].normal[a]) - Math.abs(faces[i].normal[b]);
			});	


			var v1 = geometry.vertices[faces[i].a];
			var v2 = geometry.vertices[faces[i].b];
			var v3 = geometry.vertices[faces[i].c];				

			geometry.faceVertexUvs[0].push([
				new THREE.Vector2(v1[components[0]], v1[components[1]]),
				new THREE.Vector2(v2[components[0]], v2[components[1]]),
				new THREE.Vector2(v3[components[0]], v3[components[1]])
			]);
		}

		geometry.uvsNeedUpdate = true;
		geometry.elementsNeedUpdate = true; 
	}	


	// выровнить geometry по центру
	centerAlignGeometry({geometry})
	{
		const offsetCenterPos = this.getPosCenterG({geometry});		// смещение
		geometry.translate(-offsetCenterPos.x, -offsetCenterPos.y, -offsetCenterPos.z);

		return offsetCenterPos;
	}

	// получаем габариты объекта и строим box-форму и вставляем в нее объекты
	getBoundObject_1({obj})
	{
		if(!obj) return;
		
		const arrObj = (!Array.isArray(obj)) ? [obj] : obj;
		
		const arr = [];
		
		for ( let i = 0; i < arrObj.length; i++ )
		{
			arrObj[i].updateMatrixWorld(true);
			
			arrObj[i].traverse(function(child) 
			{
				if (child instanceof THREE.Mesh)
				{
					if(child.geometry) { arr[arr.length] = child; }
				}
			});			
		}
		
		let v = [];
		let bound;
		
		for ( let i = 0; i < arr.length; i++ )
		{		
			arr[i].geometry.computeBoundingBox();	
			arr[i].geometry.computeBoundingSphere();

			bound = arr[i].geometry.boundingBox;
			
			//console.log(111111, arr[i], bound);

			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.min.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );

			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.max.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.min.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
			v[v.length] = new THREE.Vector3(bound.max.x, bound.max.y, bound.min.z).applyMatrix4( arr[i].matrixWorld );
		}
		
		bound = { min : { x : Infinity, y : Infinity, z : Infinity }, max : { x : -Infinity, y : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }
			if(v[i].y < bound.min.y) { bound.min.y = v[i].y; }
			if(v[i].y > bound.max.y) { bound.max.y = v[i].y; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}		

		const centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), ((bound.max.y - bound.min.y)/2 + bound.min.y), ((bound.max.z - bound.min.z)/2 + bound.min.z));
		const x = (bound.max.x - bound.min.x);
		const y = (bound.max.y - bound.min.y);
		const z = (bound.max.z - bound.min.z);	

		let geometry = new THREE.BoxGeometry(x, y, z);
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);
		const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.7, depthTest: false });
		
		const box = new THREE.Mesh( geometry, material ); 	
		
		//box.updateMatrixWorld();
		box.geometry.computeBoundingBox();	
		box.geometry.computeBoundingSphere();	
		
		for ( let i = 0; i < arrObj.length; i++ )
		{
			//arrObj[i].position.sub(centerPos); 
			box.add(arrObj[i]);
		}  
		
		return box;	
	}



	// получаем массив geometry и получаем их центр
	getArrPosCenterG({arrG})
	{
		const arrPos = [];
		
		for ( let i = 0; i < arrG.length; i++ )
		{
			arrPos[i] = this.getPosCenterG({geometry: arrG[i]});
		}

		return arrPos;
	}
	
	// получаем центр у геометрии
	getPosCenterG({geometry})
	{
		geometry.computeBoundingSphere();
		const center = geometry.boundingSphere.center.clone();

		return center;
	}
		
}







