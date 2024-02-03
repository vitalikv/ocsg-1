

class MyObjsWfInit
{
	myCalcFormObjWf;
	myListObjsWf;
	myListMaterialsWf;

	
	constructor()
	{
		this.myCalcFormObjWf = new MyCalcFormObjWf();
		
		this.myListObjsWf = new MyListObjsWf();
		this.myListMaterialsWf = new MyListMaterialsWf();
		

	}


	// добавляем объекты в сцену (для теста, чтобы увидить кол-во и как выглядят)
	testListObjs()
	{
		let obj = null;
		let result = null;
		
		result = this.myListObjsWf.getListByType({typeObj: 'radiator_al_1'});
		
		let offset = new THREE.Vector3(1, 1, 0);
		for(let i = 0; i < result.list.length; i++)
		{
			obj = this.getObjWf({typeObj: 'radiator_al_1', lotid: i});
			obj.position.copy(offset);
			offset.z -= 0.2;
		}
		
		
		result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_nn'});
		
		offset = new THREE.Vector3(0, 1, 0);
		for(let i = 0; i < result.list.length; i++)
		{
			obj = this.getObjWf({typeObj: 'shar_kran_nn', lotid: i});
			obj.position.copy(offset);
			offset.z -= 0.1;
		}


		result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_vv'});
		
		offset = new THREE.Vector3(-0.2, 1, 0);
		for(let i = 0; i < result.list.length; i++)
		{
			obj = this.getObjWf({typeObj: 'shar_kran_vv', lotid: i});
			obj.position.copy(offset);
			offset.z -= 0.1;
		}		
	}
	
	
	// добавляем объект в сцену
	getObjWf({typeObj, lotid})
	{
		const obj = this.myListObjsWf.getObjFromListWf({typeObj, lotid});				
		
		if(obj) 
		{
			obj.material.visible = false;
			obj.userData.tag = 'objWf';
			
			// получаем начальные размеры объекта, что потом можно было масштабировать от начальных размеров
			if(1==1)
			{
				obj.geometry.computeBoundingBox();
				var x = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x;
				var y = obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y;
				var z = obj.geometry.boundingBox.max.z - obj.geometry.boundingBox.min.z;	
				obj.userData.box = new THREE.Vector3(x, y, z);
			}			

			//if(!id) { id = countId; countId++; }	
			//obj.userData.id = id;	
		
			//obj.userData.lotid = lotid;
			
			scene.add(obj);

			myWarmFloor.addToArray({obj, type: 'objs', idLevel: null});
		}
		
		return obj;
	}
	
	
	// удаление obj
	deleteObjWf({obj})
	{
		myWarmFloor.deleteFromArray({obj, type: 'objs'}); 
		disposeHierchy({obj});
		scene.remove(obj);
		
		myManagerClick.hideMenuObjUI_2D();
	}	
}







