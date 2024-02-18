
// тройник (пресс-резьба)
class MyMplTroinikPR
{
	
	crObj({ m1, m2, r1, r2, r3, side })
	{
		const { geometry, jointsPos } = this.crGeometry({ m1, m2, r1, r2, r3, side });		
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry});
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.bronz_1, mats.red_1, mats.metal_1, mats.bronz_1_edge, mats.rezba_2];
				
		const object = new THREE.Mesh(geometry, material);
		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos});
		
		return obj;
	}
	
	
	crGeometry({ m1, m2, r1, r2, r3, side })
	{		
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r1});	// левый разъем
		const d3 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r3});	// правый	
		
		let d2 = 0;	
		let matRezba = [];
		let txt = '';
			
		// доп. расчеты	
		if(side === 'v') 
		{ 
			d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r2, side: 'v'});
			txt = '(в)';
			matRezba = [0, 4, 0, 0];
		}
		else 
		{ 
			d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r2, side: 'n'});
			txt = '(н)';
			matRezba = [4, 0, 0, 0];
		}
		
		let dc = d1;
		if(dc.n < d2.n) dc = d2;
		if(dc.n < d3.n) dc = d3;	
		
		let w1 = 0.030 * d1.n * 30;
		const w2 = 0.012;
		let w3 = 0.030 * d3.n * 30;
		
		if(w1 < 0.025) { w1 = 0.025; }
		if(w3 < 0.025) { w3 = 0.025; }
		
		const s1 = (m1/2 - w1)/2;
		const s2 = (m2 - w2)/2;
		const s3 = (m1/2 - w3)/2;
		const w12 = 0.0025;
		const w22 = 0.007;
		
		const h1 = 0.005;
		const h2 = 0.0025;
		
		const tb1 = {};
		const tb2 = {};
		const tb3 = {};
		
		tb1.n = d1.n/2;
		tb1.v = d1.n/2 - (0.005 * d1.n * 30);
		
		tb2.n = d2.n/2;
		tb2.v = d2.v/2;

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
		
		gs[12] = this.crDetail_13({s2, dc, d2});
		gs[13] = this.crDetail_14({s2, d2});
		gs[14] = this.crDetail_15({w22, d2, tb2, s2});
		gs[15] = this.crDetail_16({w2, d2, s2, matRezba});
		
		const jointsPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getArrPosCenterG({arrG: [gs[0], gs[15], gs[11]]});
		
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
		jointsData.push({id: 1, name: '', pos: jointsPos[1], rot: new THREE.Vector3(0, Math.PI, Math.PI/2)});
		jointsData.push({id: 2, name: '', pos: jointsPos[2], rot: new THREE.Vector3(0, 0, 0)});
		
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
		inf.rot = { x: 0, y: Math.PI, z: 0 };			
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
	
	// вертикальная труба
	crDetail_13({s2, dc, d2})
	{
		const inf = { dlina: s2, diameter_nr: dc.n, diameter_vn: dc.v, d_n2: d2.n, d_v2: d2.v };
		inf.pos = { x: 0, y: s2/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: -Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	// вертикальная труба
	crDetail_14({s2, d2})
	{
		const inf = { dlina: s2, diameter_nr: d2.n, diameter_vn: d2.v };
		inf.pos = { x: 0, y: s2/2 + s2, z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// гайка
	crDetail_15({w22, d2, tb2, s2})
	{
		const inf = { dlina: w22, diameter_nr: d2.n + 0.01, diameter_vn: tb2.n, edge_nr: 6, ind: [3, 0, 0, 0] };
		inf.pos = { x: 0, y: s2*2 - w22/2, z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	// резьба
	crDetail_16({w2, d2, s2, matRezba})
	{
		const inf = { dlina: w2, diameter_nr: d2.n, diameter_vn: d2.v, ind: matRezba };
		inf.pos = { x: 0, y: s2*2 + w2/2, z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


}







