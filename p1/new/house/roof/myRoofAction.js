

class MyRoofAction
{

	constructor()
	{
		
	}


	// при клике, определяем попали в крышу или нет
	getRayIntersect()
	{
		const roofs = infProject.scene.array.roof.filter((p) => p.visible);
		
		let ray = rayIntersect( event, roofs, 'arr', true );	

		let rayhit = null;
		
		if(ray.length > 0)
		{   	
			for (let i = 0; i < ray.length; i++)
			{
				if(ray[i].object.userData.roof) continue;
				
				rayhit = ray[i];
				break;
			}
			
			let object = null; 
			
			if(rayhit) { object = getParentObj({obj: rayhit.object}); }
			
			if(!object) { rayhit = null; }
			else { rayhit.object = object;  }
		}

		return rayhit;
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
		const box = obj.userData.roof.box;
		
		obj.scale.set(size.x/box.x, size.y/box.y, size.z/box.z);	
		obj.updateMatrixWorld();	
	}
	

	// пересчет корректных uvs координат
	upDateTextureRoof({obj})
	{
		if(obj.userData.tag !== 'roof') return;
		
		const scaW = obj.getWorldScale(new THREE.Vector3());
		
		obj.children[0].traverse(function(child) 
		{
			if(child.isMesh && child.material.map) 
			{ 
				boxUnwrapUVs(child.geometry, obj.scale)				
			}
		});		
	}

	
	// копируем объект
	copyRoof() 
	{
		const obj = myComposerRenderer.getOutlineObj();		
		if(!obj) return;	
		
		const objClone = obj.clone();
		objClone.material = obj.material.clone()
		
		objClone.children.forEach((child) => {
			child.material = child.material.clone()			
		});		
		
		objClone.userData.id = countId; countId++;
		
		infProject.scene.array.roof.push(objClone); 
		scene.add(objClone);	
	}
	
	
	render()
	{
		renderCamera();
	}
}






