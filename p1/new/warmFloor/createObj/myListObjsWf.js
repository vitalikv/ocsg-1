

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
		
		this.getListObjsRadiatorAl();
	}
	
	getListObjsRadiatorAl()
	{
		const arr2 = [0.2, 0.35, 0.5, 0.6, 0.7, 0.8];	// высота радиатора

		for(let i = 0; i < arr2.length; i++)
		{
			var arr = [];
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

		const obj = this.myRadiatorAl.crObj({ count: 5, size: {x: 0.08, y: arr2[4], z: 0.08}, r1: '1' });
		
		myWarmFloor.addToArray({obj, type: 'objs', idLevel: null});
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







