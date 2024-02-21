

class MyObjInit 
{
	
	initObj({obj, lotid, nameRus = 'объект'})
	{
		// копираем материал, чтобы при можно было менять текстуру, цвета и это не влияло на другой такой же объект
		obj.traverse(function(child) 
		{
			if(child.isMesh && child.material && child.material.visible) 
			{ 
				child.material = child.material.clone();
			}
		});	
		
		
		obj.userData.tag = 'obj';
		obj.userData.id = 0;
		obj.userData.obj3D = {};
		obj.userData.obj3D.lotid = lotid;
		obj.userData.obj3D.nameRus = nameRus;
		obj.userData.obj3D.typeGroup = '';
		obj.userData.obj3D.helper = null;
		
		obj.userData.material = {};
		obj.userData.material.img = null;
		
		obj.userData.obj3D.ur = {};
		obj.userData.obj3D.ur.pos = new THREE.Vector3();
		obj.userData.obj3D.ur.q = new THREE.Quaternion();
		
		
		// получаем начальные размеры объекта, что потом можно было масштабировать от начальных размеров
		obj.geometry.computeBoundingBox();
		var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
		var y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
		var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
		obj.userData.obj3D.box = new THREE.Vector3(x, y, z);	
		
		obj.material.visible = false;


		if(obj.userData.obj3D.lotid < 4)	// примитивы из каталога с нужным материалом
		{
			myTexture.setImage({obj: obj.children[0], material: { img: 'img/load/beton.jpg' } });	
		}		
	}
	
	setObjParams({obj, id = null, pos = null, q = null, scale = null, material = null})
	{
		if(!id) { id = countId; countId++; }
		obj.userData.id = id;	


		if(pos){ obj.position.copy(pos); }
		else	// объект по кнопки из каталога
		{ 
			if(!obj.geometry.boundingBox) obj.geometry.computeBoundingBox();
			const y = (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2;
			
			obj.position.y = y;
			planeMath.position.y = y; 
			planeMath.rotation.set(-Math.PI/2, 0, 0);
			planeMath.updateMatrixWorld(); 
		}
		
						
		if(q){ obj.quaternion.set(q.x, q.y, q.z, q.w); }
		
		
		if(scale)
		{ 
			obj.scale.set(scale.x, scale.y, scale.z);
			upDateTextureObj3D({obj, force: true});
		}
		
		
		if(material && material.img)
		{
			myTexture.setImage({obj: obj.children[0], material: { img: material.img } });
		}
	
	}
}






