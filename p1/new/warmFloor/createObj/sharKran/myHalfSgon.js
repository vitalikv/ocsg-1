
// полу сгон
class MyHalfSgon
{
	
	crObj({ m1, r1, r2 })
	{
		const geometry = this.getGeometry({ m1, r1, r2 });		
		
		geometry.computeBoundingBox();
		const bound = geometry.boundingBox;	
		const offsetX = bound.max.x - bound.min.x;
		
		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.metal_1, mats.rezba_1, mats.metal_1_edge];
		
		const group = [];		
		const object = new THREE.Mesh(geometry, material);
		group.push(object);
		
		//poM3.pos.x += offsetX;
		//poM4.pos.x += offsetX;

		
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: group});
		
		return obj;
	}
	
	
	getGeometry({ m1, r1, r2 })
	{
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r1, side: 'v'});
		const d2 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r2, side: 'n'});	
		
		// доп. расчеты 
		const x_1 = 0.02 * d1.n*20;
		const x_2 = 0.02 * d2.n*20;
		
		const x_3 = 0.002;	// тольщина кольца
		const x_4 = 0.002;	// тольщина кольца
		const x_5 = x_2 * 1.3;
		
		const x_1L = -(x_4 + 0.001);
		const x_1R = m1 - x_2 - x_5 - x_4;
		
		const w2 = d1.n+ 0.236 * d1.n;	// толщина гайки			
		
	
		const gs = [];		
		gs[0] = this.crDetail_1({x_1, d1, w2, x_3, x_1L});
		gs[1] = this.crDetail_2({x_1, d1, x_1L, x_3, w2});
		gs[2] = this.crDetail_3({d2, x_3, x_1L, w2});
		gs[3] = this.crDetail_4({x_4, d1, d2});
		gs[4] = this.crDetail_5({x_4, x_1R, d2});
		gs[5] = this.crDetail_6({x_4, x_5, x_1R, d2});
		gs[6] = this.crDetail_7({x_2, x_4, x_5, x_1R, d2});
		

		const geometry = new THREE.Geometry();		
		for ( let i = 0; i < gs.length; i++ )
		{
			geometry.merge(gs[i], gs[i].matrix, 0);
		}

		return geometry;
	}	
	
	
	// гайка с резьбой (в)
	crDetail_1({x_1, d1, w2, x_3, x_1L})
	{
		const inf = { dlina: x_1, diameter_nr: w2, diameter_vn: d1.v, edge_nr: 6, ind: [2, 1, 0, 0] };
		inf.pos = { x: -(x_1L + x_3 + x_1/2 + x_1/2), y: 0, z: 0 };
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}


	// гайка без резьбы
	crDetail_2({x_1, d1, x_1L, x_3, w2})
	{
		const inf = { dlina: x_1/2, diameter_nr: w2, diameter_vn: d1.v, edge_nr: 6, ind: [2, 0, 0, 0] };
		inf.pos = { x: -(x_1L + x_3 + x_1/2/2), y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	
	// задняя часть гайки (крышка с отверстием)
	crDetail_3({d2, x_3, x_1L, w2})
	{		
		const inf = { dlina: x_3, diameter_nr: w2, diameter_vn: d2.n + 0.001, edge_nr: 6, ind: [2, 0, 0, 0] };
		inf.pos = { x: -(x_1L + x_3/2), y: 0, z: 0 };					
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}

	// труба 1 часть
	crDetail_4({x_4, d1, d2})
	{		
		const inf = { dlina: x_4, diameter_nr: d1.v, diameter_vn: d2.v - 0.001 };
		inf.pos = { x: x_4/2, y: 0, z: 0 };				
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	
	// труба 2 часть
	crDetail_5({x_4, x_1R, d2})
	{		
		const inf = { dlina: x_1R, diameter_nr: d2.n, diameter_vn: d2.v };
		inf.pos = { x: x_4 + x_1R/2, y: 0, z: 0 };			
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	


	// резьба (н) 1 часть
	crDetail_6({x_4, x_5, x_1R, d2})
	{		
		const inf = { dlina: x_5, diameter_nr: d2.n, diameter_vn: d2.v, ind: [1, 0, 0, 0] };
		inf.pos = { x: x_4 + x_1R + x_5/2, y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}
	
	// резьба (н) 2 часть
	crDetail_7({x_2, x_4, x_5, x_1R, d2})
	{		
		const inf = { dlina: x_2, diameter_nr: d2.n, diameter_vn: d2.v, ind: [1, 0, 0, 0] };
		inf.pos = { x: x_4 + x_1R + x_5 + x_2/2, y: 0, z: 0 };		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);			

		return geometry;		
	}	

}







