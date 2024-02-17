
// угол (пресс)
class MyMplUgolP
{
	
	crObj({ m1, r1 })
	{
		const { geometry, jointsPos } = this.crGeometry({ m1, r1 });		
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry});
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.bronz_1, mats.red_1, mats.bronz_1_edge, mats.rezba_2, mats.metal_1];
				
		const object = new THREE.Mesh(geometry, material);
		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos});
		
		return obj;
	}
	
	
	crGeometry({ m1, r1 })
	{		
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeTubeMP({size: r1});	
		
		// доп. расчеты		
		let w1 = 0.030 * d1.n * 30;	
		if(w1 < 0.025) { w1 = 0.025; }

		const s1 = m1 - w1;

		const w12 = 0.0025;	
		const h1 = 0.005;
		const h2 = 0.0025;	
		
		const tb1 = {};
		tb1.n = d1.n/2;
		tb1.v = d1.n/2 - (0.005 * d1.n * 30);				
	
		const gs = [];		
		gs[0] = this.crDetail_1({w1, d1, s1});
		gs[1] = this.crDetail_2({w1, tb1, s1});
		gs[2] = this.crDetail_3({w12, d1, tb1, s1, h1});
		gs[3] = this.crDetail_4({w12, d1, tb1, s1, h2});
		gs[4] = this.crDetail_5({s1, d1});
		gs[5] = this.crDetail_6({s1, d1});		
		gs[6] = this.crDetail_7({w12, d1, tb1, s1, h2});		
		gs[7] = this.crDetail_8({w12, d1, tb1, s1, h1});		
		gs[8] = this.crDetail_9({w1, tb1, s1});		
		gs[9] = this.crDetail_10({w1, d1, s1});
		gs[10] = this.crDetail_11({d1});
		gs[11] = this.crDetail_12({d1});
		
		const jointsPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getArrPosCenterG({arrG: [gs[0], gs[9]]});
		
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
		jointsData.push({id: 0, name: '', pos: jointsPos[0], rot: new THREE.Vector3(0, Math.PI, Math.PI/2)});
		jointsData.push({id: 1, name: '', pos: jointsPos[1], rot: new THREE.Vector3(0, 0, 0)});

		return jointsData; 						
	}	
	
	
	// соединитель (правая часть)
	crDetail_1({w1, d1, s1})
	{
		const inf = { dlina: w1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [4, 4, 4, 4] };
		inf.pos = { x: (s1 + w1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// соединитель (правая часть)
	crDetail_2({w1, tb1, s1})
	{
		const inf = { dlina: w1, diameter_nr: tb1.n, diameter_vn: tb1.v };
		inf.pos = { x: (s1 + w1/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// красная заглушка 1 (правая часть)
	crDetail_3({w12, d1, tb1, s1, h1})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h1, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: (s1 + w12 + w12/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// красная заглушка 2 (правая часть)
	crDetail_4({w12, d1, tb1, s1, h2})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h2, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: (s1 + w12/2), y: 0, z: 0 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// труба горизонтальная 
	crDetail_5({s1, d1})
	{		
		const inf = { dlina: s1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: s1/2, y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

	// труба вертикальная
	crDetail_6({s1, d1})
	{		
		const inf = { dlina: s1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: 0, y: s1/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: -Math.PI/2 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
			

	// красная заглушка 1 (вверхняя часть)
	crDetail_7({w12, d1, tb1, s1, h2})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h2, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: 0, y: (s1 + w12/2), z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// красная заглушка 2 (вверхняя часть)
	crDetail_8({w12, d1, tb1, s1, h1})
	{		
		const inf = { dlina: w12, diameter_nr: d1.n + h1, diameter_vn: tb1.n, ind: [1, 1, 1, 1] };
		inf.pos = { x: 0, y: (s1 + w12 + w12/2), z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// соединитель (вверхняя часть)
	crDetail_9({w1, tb1, s1})
	{
		const inf = { dlina: w1, diameter_nr: tb1.n, diameter_vn: tb1.v };
		inf.pos = { x: 0, y: (s1 + w1/2), z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// соединитель (вверхняя часть)
	crDetail_10({w1, d1, s1})
	{
		const inf = { dlina: w1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [4, 4, 4, 4] };
		inf.pos = { x: 0, y: (s1 + w1/2), z: 0 };
		inf.rot = { x: 0, y: Math.PI, z: Math.PI/2 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// полусфера для угла (н)
	crDetail_11({d1})
	{
		const inf = {r: d1.n/2, cutRad: THREE.Math.degToRad( 90 ), rotX: Math.PI/2};
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crSphere_2(inf);
		
		return geometry;
	}

	
	// полусфера для угла (в)
	crDetail_12({d1})
	{
		const inf = {r: d1.v/2, cutRad: THREE.Math.degToRad( 90 ), rotX: Math.PI/2};
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crSphere_2(inf);
		
		return geometry;		
	}		
	
}







