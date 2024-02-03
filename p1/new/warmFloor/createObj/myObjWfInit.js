

class MyObjsWfInit
{
	myCalcFormObjWf;
	myRadiatorAl;
	mySharKranNN;
	
	constructor()
	{
		this.myCalcFormObjWf = new MyCalcFormObjWf();
		
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
			const list = myWarmFloor.myListObjsWf.getListObjsRadiatorAl();
			
			obj = this.myRadiatorAl.crObj(list[45]);
		}
		
		if(lotid === 2)
		{
			const list = myWarmFloor.myListObjsWf.getListObjsSharKranNN();
			
			obj = this.mySharKranNN.crObj(list[2]);
		}		
		
		if(obj) 
		{
			myWarmFloor.addToArray({obj, type: 'objs', idLevel: null});
			
			obj.material.visible = false;
			obj.userData.tag = 'objWf';

			//if(!id) { id = countId; countId++; }	
			//obj.userData.id = id;	
		
			//obj.userData.lotid = lotid;
			
			scene.add(obj);			
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







