
// переход (пресс и резьба)
class MyMplPerehodPR
{
	
	crObj({ m1, r1, r2, side })
	{
		const { geometry, jointsPos } = this.crGeometry({ m1, r1, r2, side });		
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry});
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.bronz_1, mats.red_1, mats.bronz_1_edge, mats.rezba_2, mats.metal_1];
				
		const object = new THREE.Mesh(geometry, material);
		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos});
		
		return obj;
	}
	
	
	crGeometry({ m1, r1, r2, side })
	{		
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r1});	// правый		
		let d2 = 0;	
		let matRezba = [];
		let txt = '(в)';
		
		// доп. расчеты		
		if(side == 'v') 
		{ 
			d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r2, side: 'v'});
			txt = '(в)';
			matRezba = [0, 3, 0, 0];
		}
		else 
		{ 
			d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r2, side: 'n'});
			txt = '(н)';
			matRezba = [3, 0, 0, 0];
		}	
		
		let w1 = 0.030 * d1.n * 30;
		if(w1 < 0.020) { w1 = 0.020; } 
		
		const w2 = 0.015;	
		const w12 = 0.0025;
		
		let s1 = (m1/2 - w1);
		const s2 = (m1/2 - w2);
		const s3 = s2 - w12;
		
		if(s1 < 0.001) { s1 = 0.001; w1 = (m1/2 - s1); }
		
		const tb1 = {};
		tb1.n = d1.n/2;
		tb1.v = d1.n/2 - (0.005 * d1.n * 30);
		
		const tb2 = {};
		tb2.n = d2.n/2;
		tb2.v = d2.n/2 - (0.005 * d2.n * 30);		
		
	
		const gs = [];		
		gs[0] = this.crDetail_1({w1, d1, s1});
		gs[1] = this.crDetail_2({w1, tb1, s1});
		gs[2] = this.crDetail_3({w12, d1, tb1, s1});
		gs[3] = this.crDetail_4({w12, d1, tb1, s1});
		gs[4] = this.crDetail_5({s1, d1});
		gs[5] = this.crDetail_6({w12, d2, tb2});
		gs[6] = this.crDetail_7({s3, d2, tb2, w12});
		gs[7] = this.crDetail_8({w2, d2, s2, matRezba});
		
		const jointsPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getArrPosCenterG({arrG: [gs[0], gs[7]]});
		
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
		const inf = { dlina: w1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [4, 4, 4, 4] };
		inf.pos = { x: -(s1 + w1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// соединитель (левая часть)
	crDetail_2({w1, tb1, s1})
	{
		const inf = { dlina: w1, diameter_nr: tb1.n, diameter_vn: tb1.v };
		inf.pos = { x: -(s1 + w1/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// красная заглушка 1 (левая часть)
	crDetail_3({w12, d1, tb1, s1})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + 0.005, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: -(s1 + w12 + w12/2), y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// красная заглушка 2 (левая часть)
	crDetail_4({w12, d1, tb1, s1})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + 0.0025, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: -(s1 + w12/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// труба горизонтальная 
	crDetail_5({s1, d1})
	{		
		const inf = { dlina: s1, diameter_nr: d1.n, diameter_vn: d1.v, d_n2: d1.n, d_v2: d1.v };
		inf.pos = { x: -s1/2, y: 0, z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// гайка 1 часть
	crDetail_6({w12, d2, tb2})
	{		
		const inf = { dlina: w12, diameter_nr: d2.n + 0.0025, diameter_vn: tb2.n, ind: [2, 0, 0, 0] };
		inf.pos = { x: (0 + w12/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	// гайка 2 часть
	crDetail_7({s3, d2, tb2, w12})
	{		
		const inf = { dlina: s3, diameter_nr: d2.n + 0.01, diameter_vn: tb2.n, edge_nr: 6, ind: [2, 0, 0, 0] };
		inf.pos = { x: (0 + w12 + s3/2), y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// резьба
	crDetail_8({w2, d2, s2, matRezba})
	{		
		const inf = { dlina: w2, diameter_nr: d2.n, diameter_vn: d2.v, ind: matRezba };
		inf.pos = { x: (s2 + w2/2), y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}		


}







