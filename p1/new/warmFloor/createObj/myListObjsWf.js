

class MyListObjsWf
{
	myCalcFormObjWf;
	myRadiatorAl;
	
	constructor()
	{
		
	}
	
	init()
	{
		this.myCalcFormObjWf = new MyCalcFormObjWf();
		
		this.myRadiatorAl = new MyRadiatorAl();
		
		this.getObjWf({lotid: 1});
	}
	
	getListObjsRadiatorAl()
	{
		const arr = [];
		const arr2 = [0.2, 0.35, 0.5, 0.6, 0.7, 0.8];	// высота радиатора

		for(let i = 0; i < arr2.length; i++)
		{
			
			arr[arr.length] = { count: 1, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };	
			arr[arr.length] = { count: 2, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 3, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 4, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 5, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 6, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 7, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 8, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 9, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 10, size: {x: 0.08, y: arr2[i], z: 0.08}, r1: '1' };
		}
		
		return arr;
	}
	
	
	getObjWf({lotid})
	{
		let obj = null;
		
		if(lotid === 1)
		{
			const list = this.getListObjsRadiatorAl();
			
			obj = this.myRadiatorAl.crObj(list[45]);
		}
		
		if(obj) myWarmFloor.addToArray({obj, type: 'objs', idLevel: null});
		
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







