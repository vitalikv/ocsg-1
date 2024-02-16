

class MyTestObjsWf
{
	myListObjsWf;
	
	
	// добавляем объекты в сцену (для теста, чтобы увидить кол-во и как выглядят)
	showObjs()
	{
		this.myListObjsWf = myWarmFloor.myObjsWfInit.myListObjsWf;
		
		let result = null;
		
		//result = this.myListObjsWf.getListByType({typeObj: 'radiator_al_1'});
		//this.addObjs({result, offset: new THREE.Vector3(1, 1, 0), offsetZ: 0.2});
		
		
		//result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_nn'});
		//this.addObjs({result, offset: new THREE.Vector3(0, 1, 0), offsetZ: 0.1});
		

		//result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_vv'});
		//this.addObjs({result, offset: new THREE.Vector3(-0.2, 1, 0), offsetZ: 0.1});


		//result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_vn'});
		//this.addObjs({result, offset: new THREE.Vector3(-0.4, 1, 0), offsetZ: 0.1});
		

		//result = this.myListObjsWf.getListByType({typeObj: 'shar_kran_sgon'});
		//this.addObjs({result, offset: new THREE.Vector3(-0.6, 1, 0), offsetZ: 0.1});


		result = this.myListObjsWf.getListByType({typeObj: 'half_sgon'});
		this.addObjs({result, offset: new THREE.Vector3(-0.8, 1, 0), offsetZ: 0.1});

		result = this.myListObjsWf.getListByType({typeObj: 'mpl_perehod_p'});
		this.addObjs({result, offset: new THREE.Vector3(-1, 1, 0), offsetZ: 0.1});		
	}
	
	
	addObjs({result, offset, offsetZ = 0.1})
	{
		for(let i = 0; i < result.list.length; i++)
		{
			let obj = myWarmFloor.myObjsWfInit.getObjWf({typeObj: result.list[i].typeObj, lotid: i});
			obj.position.copy(offset);
			offset.z -= offsetZ;
		}		
	}
}







