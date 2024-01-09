
// контроллеры для изменения ширины/высоты окна
class MyWDPointsMove
{
	isDown = false;
	isMove = false;
	startPos = new THREE.Vector3();
	dir = new THREE.Vector3();
	sObj = null;		// выделенный объект (точка)
	
	constructor()
	{
		
	}
	
	
	mousedown = ({event, obj}) =>
	{
		this.isDown = false;
		this.isMove = false;				
		
		this.sObj = obj;
		
		planeMath.position.set( 0, obj.position.y, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;
		this.startPos = intersects[0].point;		
		
		const controll = obj;
		const wd = controll.userData.controll_wd.obj;
		const wall = wd.userData.door.wall;
		
		const v = wall.userData.wall.v;
		const z = v[0].z + (v[4].z - v[0].z) / 2;
	
		let pos2 = new THREE.Vector3();
		const id = controll.userData.controll_wd.id;
		if(id === 0) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.min.x, controll.position.y, z) ); }
		if(id === 1) { pos2 = wall.localToWorld( new THREE.Vector3(wd.userData.door.bound.max.x, controll.position.y, z) ); }
		this.dir = new THREE.Vector3().subVectors( controll.position, pos2 ).normalize();
		
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			findOnWallWD(wd);			
			showRulerWD(wd); 	// показываем линейки 							
		}
		
		myComposerRenderer.outlineAddObj({arr: [obj]});
		myPanelR.myContentObj.activeObjRightPanelUI_1({obj: obj}); 	// UI

		this.isDown = true;		
	}
	
	mousemove = (event) =>
	{
		if (myCameraOrbit.activeCam.userData.isCam3D) { return; }
		if (!this.isDown) return;
		this.isMove = true;
		
		const controll = this.sObj;
		const wd = controll.userData.controll_wd.obj;
		const wall = wd.userData.door.wall;
		
		const intersects = rayIntersect(event, planeMath, 'one');
		if (intersects.length === 0) return;

		let dist = this.dir.dot(new THREE.Vector3().subVectors(intersects[0].point, this.startPos));
		let pos = this.startPos.clone().add(new THREE.Vector3().addScaledVector(this.dir, dist));
		
		let offset = new THREE.Vector3().subVectors( pos, this.startPos );
		this.startPos.add( offset );
		
		
		// ограничитель до ближайших окон/дверей/края стены
		if(1==2)
		{		
			var pos2 = wall.worldToLocal( pos.clone() );	

			function discreteShift(pos, pos2)
			{
				var res = Math.floor((pos2 - pos) * 10)/10;
				
				return pos2 - res;
			}		
	 
			if(controll.userData.controll_wd.id == 0)
			{  
				pos2.x = discreteShift(pos2.x, wd.userData.door.wall.controll.arrPos[1].x);
				
				var x_min = wd.userData.door.bound.min.x;  
				if(pos2.x < x_min){ pos2.x = x_min; } 	
				else if(pos2.x > wd.userData.door.wall.controll.arrPos[1].x - 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[1].x - 0.2; }		
			}		
			else if(controll.userData.controll_wd.id == 1)
			{
				pos2.x = discreteShift(pos2.x, wd.userData.door.wall.controll.arrPos[0].x);
				
				var x_max = wd.userData.door.bound.max.x;
				if(pos2.x > x_max){ pos2.x = x_max; }
				else if(pos2.x < wd.userData.door.wall.controll.arrPos[0].x + 0.2){ pos2.x = wd.userData.door.wall.controll.arrPos[0].x + 0.2; }							
			}
			else if(controll.userData.controll_wd.id == 2)
			{
				pos2.y = discreteShift(pos2.y, wd.userData.door.wall.controll.arrPos[3].y);
				
				var y_min = wd.userData.door.bound.min.y + 0.1;
				if(pos2.y < y_min){ pos2.y = y_min; }
				else if(pos2.y > wd.userData.door.wall.controll.arrPos[3].y - 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[3].y - 0.2; }		
			}		
			else if(controll.userData.controll_wd.id == 3)
			{
				pos2.y = discreteShift(pos2.y, wd.userData.door.wall.controll.arrPos[2].y);
				
				var y_max = wd.userData.door.bound.max.y;
				if(pos2.y > y_max){ pos2.y = y_max; }
				else if(pos2.y < wd.userData.door.wall.controll.arrPos[2].y + 0.2){ pos2.y = wd.userData.door.wall.controll.arrPos[2].y + 0.2; }					
			}		
			
			v1 = wall.localToWorld( pos2 );			
		}
		
		pos2 = controll.position.clone().add(offset);  
		controll.position.add( offset ); 	

		const arr = myHouse.myWDPoints.points;
		// обновляем форму окна/двери и с новыми размерами вырезаем отверстие в стене
		{
			const x = arr[0].position.distanceTo(arr[1].position);
			const y = arr[2].position.distanceTo(arr[3].position);
			const posCenter = arr[0].position.clone().sub(arr[1].position).divideScalar( 2 ).add( arr[1].position );			
			сhangeSizePosWD( wd, posCenter, x, y );
		}
		
		// устанавливаем второстепенные контроллеры, в правильное положение			
		if(controll.userData.controll_wd.id == 0 || controll.userData.controll_wd.id == 1)
		{ 
			arr[2].position.add( pos2.clone().divideScalar( 2 ) );
			arr[3].position.add( pos2.clone().divideScalar( 2 ) );
		}
		else if(controll.userData.controll_wd.id == 2 || controll.userData.controll_wd.id == 3)
		{ 
			arr[0].position.add( pos2.clone().divideScalar( 2 ) );
			arr[1].position.add( pos2.clone().divideScalar( 2 ) );
		}	
		
		 // изменяем знаечние ширину/высоту окна в input (при перемещении контроллера)
		showTableWD(wd);
		
		showRulerWD_2D(wd);
		
		calcSvgFormWD({obj: wd});
		
	}
	
	mouseup = () =>
	{
		const obj = this.sObj;
		const isDown = this.isDown;
		const isMove = this.isMove;
		
		this.clear();
		
		if (!isDown) return;
		if (!isMove) return;
		
		const wd = obj.userData.controll_wd.obj;
		const wall = wd.userData.door.wall;
		const wallClone = new THREE.Mesh();
		wallClone.geometry = clickMoveWD_BSP( wd ).geometry.clone(); 
		wallClone.position.copy( wall.position ); 
		wallClone.rotation.copy( wall.rotation );		
		const objsBSP = { wall : wallClone, wd : createCloneWD_BSP( wd ) };				
		MeshBSP( wd, objsBSP );		 

		calcSvgFormWD({obj: wd});
	}
			
	clear()
	{
		this.sObj = null;
		this.isDown = false;
		this.isMove = false;		
	}
}






