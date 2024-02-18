
// класс с параметрами объект и классами их создания
class MyListObjsWf
{
	listParams = [];
	
	myHalfSgon;
	
	constructor()
	{
		this.myHalfSgon = new MyHalfSgon();
		
		this.listParams.push(this.getRadiatorAl({typeObj: 'radiator_al_1'}));
		this.listParams.push(this.getSharKranNN({typeObj: 'shar_kran_nn'}));
		this.listParams.push(this.getSharKranVV({typeObj: 'shar_kran_vv'}));
		this.listParams.push(this.getSharKranVN({typeObj: 'shar_kran_vn'}));
		this.listParams.push(this.getSharKranSgon({typeObj: 'shar_kran_sgon'}));
		this.listParams.push(this.getHalfSgon({typeObj: 'half_sgon'}));
		this.listParams.push(this.getMplPerehodP({typeObj: 'mpl_perehod_p'}));
		this.listParams.push(this.getMplPerehodPR({typeObj: 'mpl_perehod_pr'}));
		this.listParams.push(this.getMplTroinikP({typeObj: 'mpl_troinik_p'}));
		this.listParams.push(this.getMplTroinikPR({typeObj: 'mpl_troinik_pr'}));
		this.listParams.push(this.getMplUgolP({typeObj: 'mpl_ugol_p'}));
		this.listParams.push(this.getMplUgolPR({typeObj: 'mpl_ugol_pr'}));
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
				result.typeObj = this.listParams[i].typeObj;
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
	
	// шаровой кран 
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

	// шаровой кран
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
	
	// шаровой кран
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

	// шаровой кран
	getSharKranSgon({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '1/2', r2: '3/4', m1: 0.055, m2: 0.026, t1: 0.053 };
		arr[arr.length] = { r1: '3/4', r2: '1', m1: 0.059, m2: 0.03, t1: 0.053 };
		arr[arr.length] = { r1: '1', r2: '1 1/4', m1: 0.065, m2: 0.037, t1: 0.060 };		
		arr[arr.length] = { r1: '1 1/4', r2: '1 1/2', m1: 0.075, m2: 0.045, t1: 0.060 };	
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Шаровой кран с полусгоном '+arr[i].r1;
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MySharKranSgon()};
	}

	// полусгон
	getHalfSgon({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '3/4', r2: '1/2', m1: 0.040 };
		arr[arr.length] = { r1: '1', r2: '3/4', m1: 0.045 };
		arr[arr.length] = { r1: '1 1/4', r2: '1', m1: 0.052 };
		arr[arr.length] = { r1: '1 1/2', r2: '1 1/4', m1: 0.062 };
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Полусгон '+arr[i].r2;
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: this.myHalfSgon};
	}


	// соединитель пресс-пресс (металлопластик)
	getMplPerehodP({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '16', r3: '16', m1: 0.060 };
		arr[arr.length] = { r1: '20', r3: '20', m1: 0.060 };
		arr[arr.length] = { r1: '26', r3: '26', m1: 0.062 };
		arr[arr.length] = { r1: '32', r3: '32', m1: 0.063 };
		arr[arr.length] = { r1: '40', r3: '40', m1: 0.079 };
		
		arr[arr.length] = { r1: '20', r3: '16', m1: 0.060 };
		arr[arr.length] = { r1: '26', r3: '16', m1: 0.061 };
		arr[arr.length] = { r1: '26', r3: '20', m1: 0.061 };
		arr[arr.length] = { r1: '32', r3: '16', m1: 0.062 };
		arr[arr.length] = { r1: '32', r3: '20', m1: 0.062 };
		arr[arr.length] = { r1: '32', r3: '26', m1: 0.063 };
		
		for(let i = 0; i < arr.length; i++) 
		{
			arr[i].nameRus = (arr[i].r1===arr[i].r3) ? 'Соединитель '+arr[i].r1 : 'Соединитель '+arr[i].r1+'x'+arr[i].r3;
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplPerehodP()};
	}


	// соединитель пресс-резьба (металлопластик)
	getMplPerehodPR({typeObj})
	{
		const arr = [];
		arr[arr.length] = { side: 'n', r1: '16', r2: '1/2', m1: 0.048 };
		arr[arr.length] = { side: 'n', r1: '16', r2: '3/4', m1: 0.049 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '1/2', m1: 0.048 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '3/4', m1: 0.049 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '3/4', m1: 0.050 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '1', m1: 0.052 };
		arr[arr.length] = { side: 'n', r1: '32', r2: '1', m1: 0.052 };
		arr[arr.length] = { side: 'n', r1: '32', r2: '1 1/4', m1: 0.057 };
		arr[arr.length] = { side: 'n', r1: '40', r2: '1', m1: 0.060 };
		arr[arr.length] = { side: 'n', r1: '40', r2: '1 1/4', m1: 0.060 };
		
		arr[arr.length] = { side: 'v', r1: '16', r2: '1/2', m1: 0.048 };
		arr[arr.length] = { side: 'v', r1: '16', r2: '3/4', m1: 0.049 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '1/2', m1: 0.048 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '3/4', m1: 0.049 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '3/4', m1: 0.050 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '1', m1: 0.052 };
		arr[arr.length] = { side: 'v', r1: '32', r2: '1', m1: 0.052 };
		arr[arr.length] = { side: 'v', r1: '32', r2: '1 1/4', m1: 0.057 };
		arr[arr.length] = { side: 'v', r1: '40', r2: '1', m1: 0.060 };
		arr[arr.length] = { side: 'v', r1: '40', r2: '1 1/4', m1: 0.060 };
		
		for(let i = 0; i < arr.length; i++) 
		{
			const vh = (arr[i].side === 'v') ? '(в)' : '(н)';
			arr[i].nameRus = 'Соединитель '+arr[i].r1+'x'+arr[i].r2+vh;
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplPerehodPR()};
	}


	// тройник пресс (металлопластик)
	getMplTroinikP({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '16', r2: '20', r3: '16', m1: 0.088, m2: 0.044 };
		arr[arr.length] = { r1: '16', r2: '16', r3: '20', m1: 0.088, m2: 0.044 };
		arr[arr.length] = { r1: '20', r2: '16', r3: '20', m1: 0.088, m2: 0.044 };
		arr[arr.length] = { r1: '16', r2: '20', r3: '20', m1: 0.088, m2: 0.044 };
		arr[arr.length] = { r1: '20', r2: '26', r3: '20', m1: 0.096, m2: 0.049 };
		
		arr[arr.length] = { r1: '26', r2: '16', r3: '26', m1: 0.097, m2: 0.046 };
		arr[arr.length] = { r1: '26', r2: '16', r3: '20', m1: 0.096, m2: 0.047 };
		arr[arr.length] = { r1: '26', r2: '20', r3: '20', m1: 0.097, m2: 0.048 };
		arr[arr.length] = { r1: '26', r2: '26', r3: '20', m1: 0.097, m2: 0.048 };
		arr[arr.length] = { r1: '26', r2: '20', r3: '16', m1: 0.097, m2: 0.048 };
		arr[arr.length] = { r1: '26', r2: '20', r3: '26', m1: 0.097, m2: 0.048 };
		
		arr[arr.length] = { r1: '32', r2: '16', r3: '32', m1: 0.104, m2: 0.051 };
		arr[arr.length] = { r1: '32', r2: '20', r3: '32', m1: 0.104, m2: 0.051 };
		arr[arr.length] = { r1: '32', r2: '26', r3: '26', m1: 0.104, m2: 0.052 };
		arr[arr.length] = { r1: '32', r2: '26', r3: '32', m1: 0.104, m2: 0.052 };		
		
		arr[arr.length] = { r1: '32', r2: '32', r3: '26', m1: 0.104, m2: 0.052 };
		arr[arr.length] = { r1: '32', r2: '32', r3: '20', m1: 0.104, m2: 0.052 };
		arr[arr.length] = { r1: '32', r2: '20', r3: '26', m1: 0.104, m2: 0.051 };
		arr[arr.length] = { r1: '26', r2: '32', r3: '26', m1: 0.104, m2: 0.052 };		

		arr[arr.length] = { r1: '16', r2: '16', r3: '16', m1: 0.083, m2: 0.083/2 };
		arr[arr.length] = { r1: '20', r2: '20', r3: '20', m1: 0.088, m2: 0.088/2 };
		arr[arr.length] = { r1: '26', r2: '26', r3: '26', m1: 0.097, m2: 0.097/2 };
		arr[arr.length] = { r1: '32', r2: '32', r3: '32', m1: 0.112, m2: 0.112/2 };	
		
		for(let i = 0; i < arr.length; i++) 
		{
			arr[i].nameRus = (arr[i].r1===arr[i].r2 && arr[i].r1===arr[i].r3) ? 'Тройник '+arr[i].r1 : 'Тройник '+arr[i].r1+'x'+arr[i].r2+'x'+arr[i].r3;
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplTroinikP()};
	}		


	// тройник пресс (металлопластик)
	getMplTroinikPR({typeObj})
	{
		const arr = [];		
		arr[arr.length] = { side: 'n', r1: '16', r2: '1/2', r3: '16', m1: 0.083, m2: 0.028 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '1/2', r3: '20', m1: 0.088, m2: 0.029 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '3/4', r3: '20', m1: 0.088, m2: 0.032 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '1/2', r3: '26', m1: 0.097, m2: 0.032 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '3/4', r3: '26', m1: 0.097, m2: 0.034 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '1', r3: '26', m1: 0.097, m2: 0.037 };		
		arr[arr.length] = { side: 'n', r1: '32', r2: '3/4', r3: '32', m1: 0.104, m2: 0.035 };
		arr[arr.length] = { side: 'n', r1: '32', r2: '1', r3: '32', m1: 0.104, m2: 0.039 };		

		arr[arr.length] = { side: 'v', r1: '16', r2: '1/2', r3: '16', m1: 0.083, m2: 0.028 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '1/2', r3: '20', m1: 0.088, m2: 0.029 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '3/4', r3: '20', m1: 0.088, m2: 0.032 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '1/2', r3: '26', m1: 0.097, m2: 0.032 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '3/4', r3: '26', m1: 0.097, m2: 0.034 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '1', r3: '26', m1: 0.097, m2: 0.037 };		
		arr[arr.length] = { side: 'v', r1: '32', r2: '3/4', r3: '32', m1: 0.104, m2: 0.035 };
		arr[arr.length] = { side: 'v', r1: '32', r2: '1', r3: '32', m1: 0.104, m2: 0.039 };	
		arr[arr.length] = { side: 'v', r1: '32', r2: '1 1/4', r3: '32', m1: 0.122, m2: 0.046 };
		arr[arr.length] = { side: 'v', r1: '40', r2: '1', r3: '40', m1: 0.124, m2: 0.046 };
		
		for(let i = 0; i < arr.length; i++) 
		{
			const vh = (arr[i].side === 'v') ? '(в)' : '(н)';
			arr[i].nameRus = 'Тройник '+arr[i].r1+'x'+arr[i].r2+vh+'x'+arr[i].r3;
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplTroinikPR()};
	}		


	// угол пресс-пресс (металлопластик)
	getMplUgolP({typeObj})
	{
		const arr = [];
		arr[arr.length] = { r1: '16', m1: 0.042 };
		arr[arr.length] = { r1: '20', m1: 0.044 };
		arr[arr.length] = { r1: '26', m1: 0.049 };
		arr[arr.length] = { r1: '32', m1: 0.052 };
		arr[arr.length] = { r1: '40', m1: 0.063 };
		
		for(let i = 0; i < arr.length; i++) arr[i].nameRus = 'Угол '+arr[i].r1;
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplUgolP()};
	}
	
	
	// угол пресс-резьба (металлопластик)
	getMplUgolPR({typeObj})
	{
		const arr = [];
		arr[arr.length] = { side: 'n', r1: '16', r2: '1/2', m1: 0.042, m2: 0.028 };		
		arr[arr.length] = { side: 'n', r1: '16', r2: '3/4', m1: 0.043, m2: 0.030 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '1/2', m1: 0.044, m2: 0.029 };
		arr[arr.length] = { side: 'n', r1: '20', r2: '3/4', m1: 0.044, m2: 0.032 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '3/4', m1: 0.049, m2: 0.034 };
		arr[arr.length] = { side: 'n', r1: '26', r2: '1', m1: 0.049, m2: 0.037 };
		arr[arr.length] = { side: 'n', r1: '32', r2: '1', m1: 0.051, m2: 0.039 };

		arr[arr.length] = { side: 'v', r1: '16', r2: '1/2', m1: 0.042, m2: 0.028 };		
		arr[arr.length] = { side: 'v', r1: '16', r2: '3/4', m1: 0.043, m2: 0.030 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '1/2', m1: 0.044, m2: 0.029 };
		arr[arr.length] = { side: 'v', r1: '20', r2: '3/4', m1: 0.044, m2: 0.032 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '3/4', m1: 0.049, m2: 0.034 };
		arr[arr.length] = { side: 'v', r1: '26', r2: '1', m1: 0.049, m2: 0.037 };
		arr[arr.length] = { side: 'v', r1: '32', r2: '1', m1: 0.051, m2: 0.039 };
		
		for(let i = 0; i < arr.length; i++) 
		{
			const vh = (arr[i].side === 'v') ? '(в)' : '(н)';
			arr[i].nameRus = 'Угол '+arr[i].r1+'x'+arr[i].r2+vh;
		}
		
		for(let i = 0; i < arr.length; i++) arr[i].typeObj = typeObj;	
		
		
		return {typeObj, list: arr, method: new MyMplUgolPR()};
	}

}







