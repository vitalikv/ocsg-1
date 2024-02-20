

class MyObjsWfInit
{
	myCalcFormObjWf;
	myJointPointWf;
	myListObjsWf;
	myListMaterialsWf;
	
	myTestObjsWf;
	
	
	constructor()
	{
		this.myCalcFormObjWf = new MyCalcFormObjWf();
		this.myJointPointWf = new MyJointPointWf();
		
		this.myListObjsWf = new MyListObjsWf();
		this.myListMaterialsWf = new MyListMaterialsWf();
		
		this.myTestObjsWf = new MyTestObjsWf();
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


			// добавляем к объекту разъемы
			const jointsData = obj.userData.jointsData; 
			if(jointsData)
			{
				for ( let i = 0; i < jointsData.length; i++ )
				{
					this.myJointPointWf.crJointPoint({objParent: obj, ...jointsData[i]});
				}							
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







