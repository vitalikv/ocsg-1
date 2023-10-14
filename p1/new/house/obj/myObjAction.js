

class MyObjAction
{

	constructor()
	{
		
	}
	
	// получаем размер объекта BoundingBox
	getObjSize({obj})
	{	
		obj.geometry.computeBoundingBox();
		
		const minX = obj.geometry.boundingBox.min.x;
		const maxX = obj.geometry.boundingBox.max.x;
		const minY = obj.geometry.boundingBox.min.y;
		const maxY = obj.geometry.boundingBox.max.y;	
		const minZ = obj.geometry.boundingBox.min.z;
		const maxZ = obj.geometry.boundingBox.max.z;

		const x = Math.abs( (maxX - minX) * obj.scale.x );
		const y = Math.abs( (maxY - minY) * obj.scale.y );
		const z = Math.abs( (maxZ - minZ) * obj.scale.z );	
		
		return new THREE.Vector3(x, y, z);	
	}

	// устанавливаем размер объекта
	setObjSize({obj, size})
	{	
		const box = obj.userData.obj3D.box;
		
		obj.scale.set(size.x/box.x, size.y/box.y, size.z/box.z);	
		obj.updateMatrixWorld();	
	}
	
	
	// копируем объект или группу
	copyObj() 
	{
		const obj = myComposerRenderer.getOutlineObj();		
		if(!obj) return;	
		
		const objClone = obj.clone();
		objClone.material = obj.material.clone()
		objClone.children[0].material = obj.children[0].material.clone()
		
		objClone.userData.id = countId; countId++;
		
		infProject.scene.array.obj.push(objClone); 
		scene.add(objClone);	
	}
	
	
	render()
	{
		renderCamera();
	}
}






