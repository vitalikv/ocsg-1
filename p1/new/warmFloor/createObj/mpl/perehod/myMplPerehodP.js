
// переход (пресс)
class MyMplPerehodP
{
	
	crObj({ m1, r1, r3 })
	{
		const { geometry, jointsPos } = this.crGeometry({ m1, r1, r3 });		
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry});
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.bronz_1, mats.red_1, mats.metal_1];
				
		const object = new THREE.Mesh(geometry, material);
		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos});
		
		return obj;
	}
	
	
	crGeometry({ m1, r1, r3 })
	{
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r1});	// левый разъем
		const d3 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r3});	// правый
		
		let dc = d1;
		if(dc.n < d3.n) dc = d3;	
	
		// доп. расчеты		
		let w1 = 0.030 * d1.n * 30;
		let w3 = 0.030 * d3.n * 30;
		
		if(w1 < 0.025) { w1 = 0.025; }
		if(w3 < 0.025) { w3 = 0.025; }
		
		const s1 = (m1/2 - w1)/2;
		const s3 = (m1/2 - w3)/2;
		const w12 = 0.0025;
		
		const h1 = 0.005;
		const h2 = 0.0025;
		
		const tb1 = {};
		const tb3 = {};
		
		tb1.n = d1.n/2;
		tb1.v = d1.n/2 - (0.005 * d1.n * 30);

		tb3.n = d3.n/2;
		tb3.v = d3.n/2 - (0.005 * d3.n * 30);			
		
	
		const gs = [];		
		gs[0] = this.crDetail_1({w1, d1, s1});
		gs[1] = this.crDetail_2({w1, tb1, s1});
		gs[2] = this.crDetail_3({w12, d1, tb1, s1, h1});
		gs[3] = this.crDetail_4({w12, d1, tb1, s1, h2});
		gs[4] = this.crDetail_5({s1, d1});
		gs[5] = this.crDetail_6({s1, d1, dc});
		gs[6] = this.crDetail_7({s3, d3, dc});
		gs[7] = this.crDetail_8({s3, d3});
		gs[8] = this.crDetail_9({w12, d3, tb3, s3, h2});
		gs[9] = this.crDetail_10({w12, d3, tb3, s3, h1});
		gs[10] = this.crDetail_11({w3, tb3, s3});
		gs[11] = this.crDetail_12({w3, d3, s3});
		
		const jointsPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getArrPosCenterG({arrG: [gs[0], gs[11]]});
		
		const geometry = new THREE.Geometry();		
		for ( let i = 0; i < gs.length; i++ )
		{
			geometry.merge(gs[i], gs[i].matrix, 0);
		}

		return { geometry, jointsPos };
	}


	// инфа для создание стыков(разъемов)
	crJoint({jointsPos, offsetCenterPos})
	{
		for ( let i = 0; i < jointsPos.length; i++ )
		{
			jointsPos[i].sub(offsetCenterPos);
		}

		const jointsData = [];
		jointsData.push({id: 0, name: '', pos: jointsPos[0], rot: new THREE.Vector3(0, Math.PI, 0)});
		jointsData.push({id: 1, name: '', pos: jointsPos[1], rot: new THREE.Vector3(0, 0, 0)});

		return jointsData; 						
	}	
	
	
	// соединитель (левая часть)
	crDetail_1({w1, d1, s1})
	{
		const inf = { dlina: w1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [2, 2, 2, 2] };
		inf.pos = { x: -(s1*2 + w1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// соединитель (левая часть)
	crDetail_2({w1, tb1, s1})
	{
		const inf = { dlina: w1, diameter_nr: tb1.n, diameter_vn: tb1.v };
		inf.pos = { x: -(s1*2 + w1/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// красная заглушка 1 (левая часть)
	crDetail_3({w12, d1, tb1, s1, h1})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h1, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: -(s1*2 + w12 + w12/2), y: 0, z: 0 };				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// красная заглушка 2 (левая часть)
	crDetail_4({w12, d1, tb1, s1, h2})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h2, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: -(s1*2 + w12/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// труба горизонтальная 1 часть
	crDetail_5({s1, d1})
	{		
		const inf = { dlina: s1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: -(s1 + s1/2), y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// труба горизонтальная 2 часть
	crDetail_6({s1, d1, dc})
	{		
		const inf = { dlina: s1, diameter_nr: dc.n, diameter_vn: dc.v, d_n2: d1.n, d_v2: d1.v };
		inf.pos = { x: -s1/2, y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	// труба горизонтальная 3 часть
	crDetail_7({s3, d3, dc})
	{		
		const inf = { dlina: s3, diameter_nr: dc.n, diameter_vn: dc.v, d_n2: d3.n, d_v2: d3.v };
		inf.pos = { x: s3/2, y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// труба горизонтальная 4 часть
	crDetail_8({s3, d3})
	{		
		const inf = { dlina: s3, diameter_nr: d3.n, diameter_vn: d3.v };
		inf.pos = { x: (s3 + s3/2), y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}		

	// красная заглушка 1 (правая часть)
	crDetail_9({w12, d3, tb3, s3, h2})
	{		
		const inf = { dlina: w12, diameter_nr: d3.n + h2, diameter_vn: tb3.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: (s3*2 + w12/2), y: 0, z: 0 };				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// красная заглушка 2 (правая часть)
	crDetail_10({w12, d3, tb3, s3, h1})
	{		
		const inf = { dlina: w12, diameter_nr: d3.n + h1, diameter_vn: tb3.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: (s3*2 + w12 + w12/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	// соединитель (правая часть)
	crDetail_11({w3, tb3, s3})
	{
		const inf = { dlina: w3, diameter_nr: tb3.n, diameter_vn: tb3.v };
		inf.pos = { x: (s3*2 + w3/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	// соединитель (правая часть)
	crDetail_12({w3, d3, s3})
	{
		const inf = { dlina: w3, diameter_nr: d3.n, diameter_vn: d3.v, ind: [2, 2, 2, 2] };
		inf.pos = { x: (s3*2 + w3/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
}






