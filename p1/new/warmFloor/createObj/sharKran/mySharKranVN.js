
// шаровой кран (в-н)
class MySharKranVN
{
	
	crObj({ m1, t1, r1 })
	{
		const { geometry, jointsPos } = this.crGeometry({ m1, t1, r1 });		
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry});
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.metal_1, mats.rezba_1, mats.metal_1_edge, mats.red_1];
				
		const object = new THREE.Mesh(geometry, material);
		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos});
		
		return obj;
	}


	crGeometry({ m1, t1, r1 })
	{
		// t1 - длина бабочки
		
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r1, side: 'v'});
		const d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r1, side: 'n'});		
		
		// доп. расчеты 
		let x_1 = 0.02 * d1.n*20;
		if(x_1 < 0.012) { x_1 = 0.012; }
		
		const x_2 = 0.01 * d1.n*20;
		
		const x_1L = (m1/2 - x_1)/2;
		const x_2L = x_1L;
		const x_1R = 0.002;
		const x_2R = m1/2 - x_1R - x_2 - x_1;
		
		let h1 = 0.015 * d1.n*20;			// высота штекира на кором находится бабочка
		if(h1 < 0.015) { h1 = 0.015; }
		h1 += 0.015;
		
		const w1 = 0.005;					// толщина бабочки
		const w2 = d1.n+ 0.236 * d1.n;		// толщина гайки		
		
	
		const gs = [];		
		gs[0] = this.crDetail_1({x_1, d1, x_1L, x_2L});
		gs[1] = this.crDetail_2({x_1, d1, x_1L, x_2L, w2});
		gs[2] = this.crDetail_3({d1, x_1L, x_2L});
		gs[3] = this.crDetail_4({d1, x_1L, x_2L});
		gs[4] = this.crDetail_5({d1, h1});
		gs[5] = this.crDetail_6({d1, h1});
		gs[6] = this.crDetail_7({d1, h1});
		gs[7] = this.crDetail_8({d1, h1});
		gs[8] = this.crDetail_9({d1, x_1R});
		gs[9] = this.crDetail_10({d1, x_1R, x_2R});
		gs[10] = this.crDetail_11({x_1, x_2, d1: d2, x_1R, x_2R, w2});
		gs[11] = this.crDetail_12({x_1, x_2, d1: d2, x_1R, x_2R});
		gs[12] = this.crDetail_13({d1, t1, h1, w1});
		
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
	
	
	// резьба (в)
	crDetail_1({x_1, d1, x_1L, x_2L})
	{
		const inf = { dlina: x_1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [0, 1, 0, 0] };
		inf.pos = { x: -(x_1L + x_2L+ x_1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// гайка
	crDetail_2({x_1, d1, x_1L, x_2L, w2})
	{
		const inf = { dlina: x_1, diameter_nr: w2, diameter_vn: d1.v+0.001, edge_nr: 6, ind: [2, 0, 0, 0] };
		inf.pos = { x: -(x_1L + x_2L+ x_1/2), y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// труба левая часть 1
	crDetail_3({d1, x_1L, x_2L})
	{		
		const inf = { dlina: x_2L, diameter_nr: d1.n+0.01, diameter_vn: d1.v };
		inf.pos = { x: -(x_1L + x_2L/2), y: 0, z: 0 };					
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// труба левая часть 2
	crDetail_4({d1, x_1L, x_2L})
	{		
		const inf = { dlina: x_1L, diameter_nr: d1.n+0.01, diameter_vn: d1.v };
		inf.pos = { x: -x_1L/2, y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// вертикальная труба часть 1
	crDetail_5({d1, h1})
	{		
		const inf = { dlina: h1/2, diameter_nr: 0.015, diameter_vn: 0.000 };
		inf.pos = { x: 0, y: d1.v/2 + h1/2/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: -Math.PI/2 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// вертикальная труба часть 2
	crDetail_6({d1, h1})
	{		
		const inf = { dlina: h1/2, diameter_nr: 0.01, diameter_vn: 0.000 };
		inf.pos = { x: 0, y: d1.v/2 + h1/2 + h1/2/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: -Math.PI/2 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// вертикальная труба часть 3
	crDetail_7({d1, h1})
	{		
		const inf = { dlina: 0.01, diameter_nr: 0.013, diameter_vn: 0.011, d_n2: 0.021, d_v2: 0.019, ind: [3, 3, 3, 3] };
		inf.pos = { x: 0, y: d1.v/2 + h1 - 0.01/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: Math.PI/2 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// вертикальная труба часть 4
	crDetail_8({d1, h1})
	{		
		const inf = { dlina: 0.006, diameter_nr: 0.021, diameter_vn: 0.019, ind: [3, 3, 3, 3] };
		inf.pos = { x: 0, y: d1.v/2 + h1 - 0.01 - 0.006/2, z: 0 };
		inf.rot = { x: 0, y: 0, z: Math.PI/2 };	
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	
	
	// труба правая часть 1
	crDetail_9({d1, x_1R})
	{		
		const inf = { dlina: x_1R, diameter_nr: d1.n+0.015, diameter_vn: d1.v, d_n2: d1.n+0.01, d_v2: d1.v };
		inf.pos = { x: x_1R/2, y: 0, z: 0 };				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// труба правая часть 2
	crDetail_10({d1, x_1R, x_2R})
	{		
		const inf = { dlina: x_2R, diameter_nr: d1.n+0.015, diameter_vn: d1.v };
		inf.pos = { x: x_1R + x_2R/2, y: 0, z: 0 };				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	


	// гайка
	crDetail_11({x_1, x_2, d1, x_1R, x_2R, w2})
	{		
		const inf = { dlina: x_2, diameter_nr: w2, diameter_vn: d1.v+0.001, edge_nr: 6, ind: [2, 0, 0, 0] };
		inf.pos = { x: (x_1R + x_2R+ x_2/2), y: 0, z: 0 }; 				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	// резьба (н)
	crDetail_12({x_1, x_2, d1, x_1R, x_2R})
	{		
		const inf = { dlina: x_1, diameter_nr: d1.n, diameter_vn: d1.v, ind: [1, 0, 0, 0] };
		inf.pos = { x: (x_1R + x_2R+ x_2+ x_1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	
	

	// бабочка для шарового крана
	crDetail_13({d1, t1, h1, w1})
	{
		const p = [];
		p[0] = new THREE.Vector2 ( 0, 0 );
		p[1] = new THREE.Vector2 ( 1, 0 );
		p[2] = new THREE.Vector2 ( 1, 0.6 );
		p[3] = new THREE.Vector2 ( 0.8, 0.6 );
		p[4] = new THREE.Vector2 ( 0, 0.3 );
		p[5] = new THREE.Vector2 ( -0.8, 0.6 );
		p[6] = new THREE.Vector2 ( -1, 0.6 );
		p[7] = new THREE.Vector2 ( -1, 0 );			
		
		const inf = {};
		inf.p = p;
		inf.w1 = w1;
		inf.pos = { x: 0, y: (d1.v/2 + h1 - 0.01 - 0.006/2), z: -w1/2 };	
		inf.scale = t1/2;
		inf.matIndex = 3;
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);
		
		return gShape;
	}

}







