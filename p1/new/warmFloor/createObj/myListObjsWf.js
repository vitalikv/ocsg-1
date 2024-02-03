

class MyListObjsWf
{
	
	// список параметров для создания радиатора (алюм.)
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
		
		for(let i = 0; i < arr.length; i++)
		{
			arr[i].nameObj = 'al_radiator_1';
		}
		
		
		return arr;
	}
	
	
	getListObjsSharKranNN()
	{
		const arr = [];
		arr[arr.length] = { r1: '1/2', m1: 0.063, t1: 0.053 };
		arr[arr.length] = { r1: '3/4', m1: 0.070, t1: 0.053 };
		arr[arr.length] = { r1: '1', m1: 0.076, t1: 0.060 };
		arr[arr.length] = { r1: '1 1/4', m1: 0.085, t1: 0.064 };
		arr[arr.length] = { r1: '1 1/2', m1: 0.096, t1: 0.070 };
		arr[arr.length] = { r1: '2', m1: 0.111, t1: 0.070 };		
		
		for(let i = 0; i < arr.length; i++)
		{
			arr[i].nameObj = 'shar_kran_n_1';
		}		
		
		return arr;
	}		
}







