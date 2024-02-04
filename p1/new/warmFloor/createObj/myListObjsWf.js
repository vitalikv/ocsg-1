

class MyListObjsWf
{
	listParams = [];
	
	constructor()
	{
		this.listParams.push(this.getRadiatorAl({typeObj: 'radiator_al_1'}));
		this.listParams.push(this.getSharKranNN({typeObj: 'shar_kran_nn'}));
		this.listParams.push(this.getSharKranVV({typeObj: 'shar_kran_vv'}));
		this.listParams.push(this.getSharKranVN({typeObj: 'shar_kran_vn'}));
	}
	
	
	// получаем объект
	getObjFromListWf({typeObj, lotid})
	{
		let obj = null;
		
		let result = this.getListByType({typeObj});
		
		if(result)
		{
			const method = result.method;
			const params = result.list[lotid];
			
			obj = result.method.crObj(params);
			
			obj.userData.nameRus = params.nameRus;
			obj.userData.typeObj = params.typeObj;			
		}
		
		return obj;
	}
	
	// получаем список параметров и класс для создания объектов
	getListByType({typeObj})
	{
		let result = null;
		
		for(let i = 0; i < this.listParams.length; i++)			
		{
			if(this.listParams[i].typeObj === typeObj)
			{
				result = {};
				result.list = this.listParams[i].list;
				result.method = this.listParams[i].method;
				break;
			}
		}

		return result;
	}
	
	// список параметров для создания радиатора (алюм.)
	getRadiatorAl({typeObj})
	{
		const arr = [];
		const h = [0.2, 0.35, 0.5, 0.6, 0.7, 0.8];	// высота радиатора

		for(let i = 0; i < h.length; i++)
		{			
			arr[arr.length] = { count: 1, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };	
			arr[arr.length] = { count: 2, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 3, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 4, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 5, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 6, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 7, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 8, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 9, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
			arr[arr.length] = { count: 10, size: {x: 0.08, y: h[i], z: 0.08}, r1: '1' };
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Ал.радиатор h'+arr[i].size.y*1000+ ' ('+arr[i].count+'шт.)';
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;
		
		
		return {typeObj, list: arr, method: new MyRadiatorAl()};
	}
	
	
	getSharKranNN({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '1/2', m1: 0.063, t1: 0.053 };
		arr[arr.length] = { r1: '3/4', m1: 0.070, t1: 0.053 };
		arr[arr.length] = { r1: '1', m1: 0.076, t1: 0.060 };
		arr[arr.length] = { r1: '1 1/4', m1: 0.085, t1: 0.064 };
		arr[arr.length] = { r1: '1 1/2', m1: 0.096, t1: 0.070 };
		arr[arr.length] = { r1: '2', m1: 0.111, t1: 0.070 };		
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Шаровой кран '+arr[i].r1+'(н-н)';
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MySharKranNN()};
	}


	getSharKranVV({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '1/2', m1: 0.0475, t1: 0.053 };
		arr[arr.length] = { r1: '3/4', m1: 0.0555, t1: 0.053 };
		arr[arr.length] = { r1: '1', m1: 0.0625, t1: 0.060 };
		arr[arr.length] = { r1: '1 1/4', m1: 0.0775, t1: 0.064 };
		arr[arr.length] = { r1: '1 1/2', m1: 0.087, t1: 0.070 };
		arr[arr.length] = { r1: '2', m1: 0.101, t1: 0.070 };		
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Шаровой кран '+arr[i].r1+'(в-в)';
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MySharKranVV()};
	}	
	
	
	getSharKranVN({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '1/2', m1: 0.063, t1: 0.053 };
		arr[arr.length] = { r1: '3/4', m1: 0.070, t1: 0.053 };
		arr[arr.length] = { r1: '1', m1: 0.076, t1: 0.060 };
		arr[arr.length] = { r1: '1 1/4', m1: 0.085, t1: 0.064 };
		arr[arr.length] = { r1: '1 1/2', m1: 0.096, t1: 0.070 };
		arr[arr.length] = { r1: '2', m1: 0.111, t1: 0.070 };	
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Шаровой кран '+arr[i].r1+'(в-н)';
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MySharKranVN()};
	}	
}







