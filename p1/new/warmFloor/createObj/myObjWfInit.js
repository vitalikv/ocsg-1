

class MyObjsWfInit
{
	myCalcFormObjWf;
	myListObjsWf;
	myListMaterialsWf;
	myRadiatorAl;
	mySharKranNN;
	
	constructor()
	{
		this.myCalcFormObjWf = new MyCalcFormObjWf();
		
		this.myListObjsWf = new MyListObjsWf();
		this.myListMaterialsWf = new MyListMaterialsWf();
		
		this.myRadiatorAl = new MyRadiatorAl();
		this.mySharKranNN = new MySharKranNN();
	}


	// добавляем объекты в сцену (для теста, чтобы увидить кол-во и как выглядят)
	testListObjs()
	{
		let obj = this.getObjWf({lotid: 1});
		obj.position.set(1, 1, 0);
		
		obj = this.getObjWf({lotid: 2});
		obj.position.set(0, 1, 0);
		
	}
	
	
	// добавляем объект в сцену
	getObjWf({lotid})
	{
		let obj = null;
		
		if(lotid === 1)
		{
			const list = this.myListObjsWf.getListObjsRadiatorAl();
			
			obj = this.myRadiatorAl.crObj(list[45]);
		}
		
		if(lotid === 2)
		{
			const list = this.myListObjsWf.getListObjsSharKranNN();
			
			obj = this.mySharKranNN.crObj(list[2]);
		}		
		
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







