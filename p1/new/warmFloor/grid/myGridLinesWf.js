
// линии для сетки
class MyGridLinesWf 
{
	matLines;
	
	constructor()
	{
		this.matLines = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1.0, depthTest: false });
	}

	// линии для сетки
	crLinesGrid({x, z, centerPos})
	{
		const geometry = this.crGeometryLinesGrid({x, z, centerPos});

		const objLines = new THREE.Mesh( geometry, this.matLines );
		scene.add( objLines );
		
		
		return objLines;
	}
	
	// создаем geometry сетки
	crGeometryLinesGrid({x, z, centerPos})
	{
		let size = 0.2;	// размер ячейки
		
		const countX = Math.floor(x/size);
		const countZ = Math.floor(z/size);
		
		const ofssetX = (countX * size) / 2;
		const ofssetZ = (countZ * size) / 2;
		
		const geomX = new THREE.BoxGeometry(z, 0.01, 0.01);
		const geomZ = new THREE.BoxGeometry(x, 0.01, 0.01);
		
		const geometry = new THREE.Geometry();

		for ( let i = 0; i <= countX; i ++ ) 
		{
			let lineX = geomX.clone();
			lineX.rotateY(90 * Math.PI / 180);
			lineX.translate(( i * size ) - ofssetX, 0, 0);
			lineX.translate(centerPos.x, centerPos.y, centerPos.z);				
			geometry.merge(lineX);
		}
		
		for ( let i = 0; i <= countZ; i ++ ) 
		{
			let lineZ = geomZ.clone();
			lineZ.translate(0, 0, ( i * size ) - ofssetZ);
			lineZ.translate(centerPos.x, centerPos.y, centerPos.z);
			geometry.merge(lineZ);
		}

		return geometry;
	}
	

	// получаем прямоугольник в который полностью попадает grid (для построения сетки)
	getBoundBox({obj})
	{
		obj.geometry.computeBoundingBox();	
		let bound = obj.geometry.boundingBox;
		
		const v = [];
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.max.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.min.x, 0, bound.min.z).applyMatrix4( obj.matrixWorld );
		v[v.length] = new THREE.Vector3(bound.max.x, 0, bound.min.z).applyMatrix4( obj.matrixWorld );

		bound = { min : { x : Infinity, z : Infinity }, max : { x : -Infinity, z : -Infinity } };
		
		for(let i = 0; i < v.length; i++)
		{
			if(v[i].x < bound.min.x) { bound.min.x = v[i].x; }
			if(v[i].x > bound.max.x) { bound.max.x = v[i].x; }			
			if(v[i].z < bound.min.z) { bound.min.z = v[i].z; }
			if(v[i].z > bound.max.z) { bound.max.z = v[i].z; }		
		}

		const centerPos = new THREE.Vector3(((bound.max.x - bound.min.x)/2 + bound.min.x), 0, ((bound.max.z - bound.min.z)/2 + bound.min.z));
		const x = (bound.max.x - bound.min.x);
		const y = 0.5;
		const z = (bound.max.z - bound.min.z);	

		if(1===2)
		{
			const geometry = new THREE.BoxGeometry(x, y, z);
			const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, depthTest: false });
			material.visible = false;
			
			const box = new THREE.Mesh( geometry, material );
			box.position.add(centerPos);
			scene.add(box);			
		}
		
		return {x, z, centerPos};
	}

	
	// обновляем geometry линий сетки
	upGeometryGridLines({obj})
	{
		const result = this.getBoundBox({obj});
		const geometry = this.crGeometryLinesGrid({x: result.x, z: result.z, centerPos: result.centerPos});

		obj.userData.objLines.geometry.dispose();
		obj.userData.objLines.geometry = geometry;
	}
	
}







