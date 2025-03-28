

class MyRadiatorAl
{
	
	crObj({ count, size, r1 })
	{
		const { g1, jointsPos } = this.crGeometry_1({ size, r1 });		
		
		g1.computeBoundingBox();
		const bound = g1.boundingBox;	
		const offsetX = bound.max.x - bound.min.x;
			
		const g2 = this.crGeometry_2({ g1, count, offsetX });
		
		const offsetCenterPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.centerAlignGeometry({geometry: g2});

		const mats = myWarmFloor.myObjsWfInit.myListMaterialsWf.getListmat();
		const material = [mats.metal_white_edge, mats.rezba_1]; 
		
		const object = new THREE.Mesh(g2, material);
				
		const obj = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getBoundObject_1({obj: object});
		
		obj.userData.jointsData = this.crJoint({jointsPos, offsetCenterPos, count, offsetX});
		
		return obj;
	}
	
	
	// создаем одну секцию радиатора
	crGeometry_1({ size, r1 })
	{
		const d1 = myWarmFloor.myObjsWfInit.myCalcFormObjWf.sizeRezba({size: r1, side: 'v'});
		const h1 = size.y;
		
		// доп. расчеты		
		const x_1 = 0.04;
		const x_2 = (size.x - x_1)/2 + 0.001;
		d1.n *= 1.2;
		const t1 = 0.003;		// толщина ребер ал.радиатора 		
				
		
		const gs = [];		
		gs[0] = this.crDetail_1({d1, t1, h1});
		gs[1] = this.crDetail_2({d1, t1, h1});
		gs[2] = this.crDetail_3({d1, t1, h1});
		gs[3] = this.crDetail_4({d1, t1, h1, size});
		gs[4] = this.crDetail_5({d1, t1, h1, size});
		gs[5] = this.crDetail_6({d1, t1, h1, size});
		gs[6] = this.crDetail_7({d1, t1, h1, size});
		gs[7] = this.crDetail_8({d1, t1, h1, size});
		gs[8] = this.crDetail_9({d1, t1, h1, size});
		gs[9] = this.crDetail_10({d1, t1, h1, size});
		
		gs[10] = this.crDetail_11({x_1, x_2, d1, h1});
		gs[11] = this.crDetail_12({x_1, x_2, d1, h1});
		gs[12] = this.crDetail_13({x_1, x_2, d1, h1});
		gs[13] = this.crDetail_14({x_1, x_2, d1, h1});
		gs[14] = this.crDetail_15({x_1, x_2, d1, h1});
		gs[15] = this.crDetail_16({x_1, x_2, d1, h1});
		gs[16] = this.crDetail_17({x_1, x_2, d1, h1});
		
		const jointsPos = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getArrPosCenterG({arrG: [gs[10], gs[15], gs[11], gs[16]]});		

		const geometry = new THREE.Geometry();
		for ( let i = 0; i < gs.length; i++ )
		{
			geometry.merge(gs[i], gs[i].matrix, 0);
		}
		
		return { g1: geometry, jointsPos };
	}
	
	
	// создаем из одной секции одну геометрию радиатора состоящего из нескольких секций
	crGeometry_2({ g1, count, offsetX })
	{
		// offsetX - смещение каждой новой секции в право
		
		const geometry = new THREE.Geometry();
		for ( let i = 0; i < count; i++ )
		{
			const g = g1.clone();
			g.translate(offsetX * i, 0, 0);
			geometry.merge(g, g.matrix, 0);
		}

		return geometry;
	}
	
	
	// инфа для создание стыков(разъемов)
	crJoint({jointsPos, offsetCenterPos, count, offsetX})
	{
		for ( let i = 0; i < jointsPos.length; i++ )
		{
			jointsPos[i].sub(offsetCenterPos);
		}

		// смещаем правые стыки в зависимости от кол-во секций
		jointsPos[2].x += offsetX * (count - 1);
		jointsPos[3].x += offsetX * (count - 1);

		const jointsData = [];
		jointsData.push({id: 0, name: '', pos: jointsPos[0], rot: new THREE.Vector3(0, Math.PI, 0)});
		jointsData.push({id: 1, name: '', pos: jointsPos[1], rot: new THREE.Vector3(0, Math.PI, 0)});
		jointsData.push({id: 2, name: '', pos: jointsPos[2]});
		jointsData.push({id: 3, name: '', pos: jointsPos[3]});

		return jointsData; 						
	}	
	
	
	// центрально ребро сзади
	crDetail_1({d1, t1, h1})
	{
		const p = [];
		p[0] = new THREE.Vector2 ( d1.n/2, -h1/2 );
		p[1] = new THREE.Vector2 ( d1.n/2 + 0.025, -h1/2 );
		p[2] = new THREE.Vector2 ( d1.n/2 + 0.025, h1/2 );
		p[3] = new THREE.Vector2 ( d1.n/2, h1/2 );
		
		const inf = {};
		inf.p = p;
		inf.w1 = t1;
		inf.pos = { x: -t1/2, y: 0, z: 0 };
		inf.rot = { x: 0, y: Math.PI/2, z: 0 };		
	
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);
		
		return gShape;
	}


	// вверхнее центрально ребро
	crDetail_2({d1, t1, h1})
	{
		const p = [];
		p[0] = new THREE.Vector2 ( d1.n/2 + 0.025, h1/2 );
		
		const resV = myWarmFloor.myObjsWfInit.myCalcFormObjWf.getFormCircle({count: 16, size: d1.n/2, pi: Math.PI});
		
		for ( let i = 0; i < resV.length; i++ )
		{
			p[p.length] = new THREE.Vector2( resV[i].x, resV[i].y + h1/2);
		}

		p[p.length] = new THREE.Vector2 ( -d1.n/2 - 0.025, h1/2 );
		p[p.length] = new THREE.Vector2 ( -d1.n/2 - 0.025, h1/2 + 0.03 );
		p[p.length] = new THREE.Vector2 ( d1.n/2 + 0.010, h1/2 + 0.03 );
		p[p.length] = new THREE.Vector2 ( d1.n/2 + 0.020, h1/2 + 0.02 );
		p[p.length] = new THREE.Vector2 ( d1.n/2 + 0.023, h1/2 + 0.01 );
		p[p.length] = new THREE.Vector2 ( d1.n/2 + 0.025, h1/2 + 0.00 );
		
		const inf = {};
		inf.p = p;
		inf.w1 = t1;
		inf.pos = { x: -t1/2, y: 0, z: 0 };
		inf.rot = { x: 0, y: Math.PI/2, z: 0 };		
	
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;
	}


	// центрально ребро спереди
	crDetail_3({d1, t1, h1})
	{
		const p = [];
		p[0] = new THREE.Vector2 ( -d1.n/2, -h1/2 );
		p[1] = new THREE.Vector2 ( -d1.n/2 - 0.025, -h1/2 );
		p[2] = new THREE.Vector2 ( -d1.n/2 - 0.025, h1/2 );
		p[3] = new THREE.Vector2 ( -d1.n/2, h1/2 );
		
		const inf = {};
		inf.p = p;
		inf.w1 = t1;
		inf.pos = { x: -t1/2, y: 0, z: 0 };
		inf.rot = { x: 0, y: Math.PI/2, z: 0 };		
	
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;
	}
	
	
	// переднее ребро
	crDetail_4({d1, t1, h1, size})
	{
		const offsetY = 0.025;
		const p = [];
		p[0] = new THREE.Vector2 ( size.x/2, -h1/2 );
		p[1] = new THREE.Vector2 ( size.x/2, h1/2 - offsetY );
		p[2] = new THREE.Vector2 ( -size.x/2, h1/2 - offsetY );
		p[3] = new THREE.Vector2 ( -size.x/2, -h1/2 );
		
		const inf = {};
		inf.p = p;
		inf.w1 = t1;
		inf.pos = { x: 0, y: -offsetY, z: d1.n/2 + 0.025 };	 
	
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;
	}
	

	// 1-ое вверхнее переднее ребро под углом
	crDetail_5({d1, t1, h1, size})
	{
		const offsetY = -0.075;
		const p = [];
		p[0] = new THREE.Vector2 ( 0, 0 );
		p[1] = new THREE.Vector2 ( 0.025, 0.05 );
		p[2] = new THREE.Vector2 ( 0.025-t1, 0.05 );
		p[3] = new THREE.Vector2 ( -t1, 0 );

		const inf = {};
		inf.p = p;		
		inf.w1 = size.x;
		inf.pos = { x: size.x/2, y: h1/2 + offsetY, z: d1.n/2 + t1 };	
		inf.rot = { x: 0, y: -Math.PI/2, z: 0 };
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;
	}
	

	// 2-ое вверхнее переднее ребро под углом
	crDetail_6({d1, t1, h1, size})
	{
		const offsetY = -0.05;
		const p = [];
		p[0] = new THREE.Vector2 ( 0, 0 );
		p[1] = new THREE.Vector2 ( 0.025, 0.05 );
		p[2] = new THREE.Vector2 ( 0.025-t1, 0.05 );
		p[3] = new THREE.Vector2 ( -t1, 0 );

		const inf = {};
		inf.p = p;		
		inf.w1 = size.x;
		inf.pos = { x: size.x/2, y: h1/2 + offsetY, z: d1.n/2 + t1 };	
		inf.rot = { x: 0, y: -Math.PI/2, z: 0 };
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;
	}


	// вверхнее ребро
	crDetail_7({d1, t1, h1, size})
	{
		const offsetY = -0.025;
		const p = [];
		p[p.length] = new THREE.Vector2 ( 0, 0 );
		p[p.length] = new THREE.Vector2 ( 0.025, 0.05 );
		p[p.length] = new THREE.Vector2 ( 0.025, 0.05+0.005 );
		p[p.length] = new THREE.Vector2 ( -d1.n/2 - 0.010, 0.05+0.005 );
		p[p.length] = new THREE.Vector2 ( -d1.n/2 - 0.010, 0.05+0.005-t1 );
		p[p.length] = new THREE.Vector2 ( 0.025-t1, 0.05+0.005-t1 );
		p[p.length] = new THREE.Vector2 ( 0.025-t1, 0.05 );
		p[p.length] = new THREE.Vector2 ( -t1, 0 );
		
		const inf = {};
		inf.p = p;		
		inf.w1 = size.x;
		inf.pos = { x: size.x/2, y: h1/2 + offsetY, z: d1.n/2 + t1 };	
		inf.rot = { x: 0, y: -Math.PI/2, z: 0 };
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;		
	}


	// заднее ребро
	crDetail_8({d1, t1, h1, size})
	{
		const p = [];
		p[0] = new THREE.Vector2 ( size.x/2, -h1/2 );
		p[1] = new THREE.Vector2 ( size.x/2, h1/2 );
		p[2] = new THREE.Vector2 ( -size.x/2, h1/2 );
		p[3] = new THREE.Vector2 ( -size.x/2, -h1/2 );
		
		const inf = {};
		inf.p = p;
		inf.w1 = t1;
		inf.pos = { x: 0, y: 0, z: -d1.n/2 - 0.025 };	
	
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;		
	}
	
	
	// 1-ое верхнее заднее ребро под углом (ближе к центру) 
	crDetail_9({d1, t1, h1, size})
	{		
		const p = [];
		p[0] = new THREE.Vector2 ( -d1.n/2 - 0.025, h1/2 );
		p[1] = new THREE.Vector2 ( -d1.n/2 - 0.023, h1/2 + 0.01 );
		p[2] = new THREE.Vector2 ( -d1.n/2 - 0.020, h1/2 + 0.02 );
		p[3] = new THREE.Vector2 ( -d1.n/2 - 0.010, h1/2 + 0.03 );
		
		p[4] = new THREE.Vector2 ( -d1.n/2 - 0.010 + t1, h1/2 + 0.03 );
		p[5] = new THREE.Vector2 ( -d1.n/2 - 0.020 + t1, h1/2 + 0.02 );
		p[6] = new THREE.Vector2 ( -d1.n/2 - 0.023 + t1, h1/2 + 0.01 );
		p[7] = new THREE.Vector2 ( -d1.n/2 - 0.025 + t1, h1/2 );
		
		const inf = {};
		inf.p = p;		
		inf.w1 = size.x;
		inf.pos = { x: size.x/2, y: 0, z: d1.n/2 + t1 };	
		inf.rot = { x: 0, y: -Math.PI/2, z: 0 };
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;			
	}


	// 2-ое верхнее заднее ребро под углом (примыкает к заднему ребру)
	crDetail_10({d1, t1, h1, size})
	{		
		const p = [];
		p[0] = new THREE.Vector2 ( -d1.n/2 - 0.025, h1/2 );
		p[1] = new THREE.Vector2 ( -d1.n/2 - 0.023, h1/2 + 0.01 );
		p[2] = new THREE.Vector2 ( -d1.n/2 - 0.020, h1/2 + 0.02 );
		p[3] = new THREE.Vector2 ( -d1.n/2 - 0.010, h1/2 + 0.03 );
		
		p[4] = new THREE.Vector2 ( -d1.n/2 - 0.010 + t1, h1/2 + 0.03 );
		p[5] = new THREE.Vector2 ( -d1.n/2 - 0.020 + t1, h1/2 + 0.02 );
		p[6] = new THREE.Vector2 ( -d1.n/2 - 0.023 + t1, h1/2 + 0.01 );
		p[7] = new THREE.Vector2 ( -d1.n/2 - 0.025 + t1, h1/2 );
		
		const inf = {};
		inf.p = p;		
		inf.w1 = size.x;
		inf.pos = { x: size.x/2, y: 0, z: 0 };	
		inf.rot = { x: 0, y: -Math.PI/2, z: 0 };
		
		const gShape = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crShape(inf);

		return gShape;		
	}
	
	
	// вверхняя резьба (левая)
	crDetail_11({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_2, diameter_nr: d1.n, diameter_vn: d1.v, ind: [0, 1, 0, 0] };
		inf.pos = { x: -x_1/2 - x_2/2, y: h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry;		
	}


	// вверхняя резьба (правая)
	crDetail_12({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_2, diameter_nr: d1.n, diameter_vn: d1.v, ind: [0, 1, 0, 0] };
		inf.pos = { x: x_1/2 + x_2/2, y: h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry;
	}


	// вверхняя труба горизонтальная
	crDetail_13({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: 0, y: h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry;													
	}


	// вертикальная труба 
	crDetail_14({x_1, x_2, d1, h1})
	{
		const inf = { dlina: h1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: 0, y: 0, z: 0 };
		inf.rot = { x: 0, y: 0, z: -Math.PI/2 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry;					
	}


	// нижняя труба горизонтальная
	crDetail_15({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_1, diameter_nr: d1.n, diameter_vn: d1.v };
		inf.pos = { x: 0, y: -h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry													
	}

	// нижняя резьба (левая)
	crDetail_16({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_2, diameter_nr: d1.n, diameter_vn: d1.v, ind: [0, 1, 0, 0] };
		inf.pos = { x: -x_1/2 - x_2/2, y: -h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry				
	}

	// нижняя резьба (правая)
	crDetail_17({x_1, x_2, d1, h1})
	{
		const inf = { dlina: x_2, diameter_nr: d1.n, diameter_vn: d1.v, ind: [0, 1, 0, 0] };
		inf.pos = { x: x_1/2 + x_2/2, y: -h1/2, z: 0 };
		
		const geometry = myWarmFloor.myObjsWfInit.myCalcFormObjWf.crFormSleeve(inf);

		return geometry				
	}	
}







