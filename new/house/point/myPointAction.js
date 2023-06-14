
// класс для определения действий с выбранной точкой, создание стены, перетаскивание, разделение стены и т.д.
class MyPointAction 
{
	sObj = null;
	
	constructor()
	{
		
	}
	
	// если point.userData.point.type != null , то добавляем точку/создаем стену
	clickCreateWall(point) 
	{
		this.sObj = point;
		const obj = point.userData.point.cross;
		
		if(!obj) return this.sObj;
		
		if(point.userData.point.type == 'create_wall')
		{ 
			if(obj.userData.tag == 'planeMath') { this.addPoint_6( point ); } 
			else if(obj.userData.tag == 'point') { this.addPoint_4( point ); }
			else if(obj.userData.tag == 'wall') { this.addPoint_5( obj, point ); } 
		}
		else if(point.userData.point.type == 'continue_create_wall') 
		{ 
			if(obj.userData.tag == 'planeMath') { this.addPoint_4( point ); }
			else if(obj.userData.tag == 'wall') { this.addPoint_5( obj, point ); }
			else if(obj.userData.tag == 'point') { this.addPoint_4( point ); }
		}	
		else if(point.userData.point.type == 'add_point')
		{  
			if(obj.userData.tag == 'wall') { this.addPoint_5( obj, point ); } 
		}
		else
		{   
			if(!turnBackPosPoint(point))
			{ 
				if(obj.userData.tag == 'planeMath') { movePointWallPlaneMath(point); }
				else if(obj.userData.tag == 'point') { this.addPoint_4( point ); }
				else if(obj.userData.tag == 'wall') { this.addPoint_5( obj, point ); }	 		
			}
		}
		
		point.userData.point.cross = null;
		
		return this.sObj;
	}
	
	
	
	 
	// активная точка пересеклась с другой точкой или с сама собой
	addPoint_4( point )
	{ 	
		if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { movePointWallPlaneMath(point); return; }
		
		// 1. кликнули на точку, создаем новую стену из этой точки (создаем стену: от точки)
		if(point.userData.point.type == 'create_wall')			
		{		 	
			var wall = myHouse.myWall.createWall({ p: [point, point.userData.point.cross] }); 		 
			point.userData.point.type = 'continue_create_wall';
			point.userData.point.cross.userData.point.last.cdm = 'new_wall_from_point';
			this.sObj = point;
			clickMovePoint_BSP( point.userData.point.cross.w );	
			console.log('1. кликнули на точку, создаем новую стену из этой точки');
		}
		
		// 2. продолжаем создавать новую стену
		else if(point.userData.point.type == 'continue_create_wall') 
		{ 
			
			// 2.1 добавляем стену и продолжаем новую стену
			if(point.userData.point.cross == planeMath)		
			{	
				if(crossLineOnLine_1(point)) return; 	// произошло пересечение с другой стеной			
				
				point.userData.point.type = null; 			
				var point2 = myHouse.myPoint.createPoint( point.position, 0 );			
				var wall = myHouse.myWall.createWall({ p: [point, point2] }); 			
				this.sObj = point2;
				upLabelPlan_1( point.p[0].w );			
				point2.userData.point.type = 'continue_create_wall'; 

				if(point.p[0].userData.point.last.cdm == 'new_point_1' || point.p[0].userData.point.last.cdm == 'new_wall_from_point')
				{
					clickPointUP_BSP( point.p[0].w );				
				}			
				upUvs_1( point.p[0].w[0] );
				console.log('2.1. продолжаем создавать новую стену');
			} 
			
			// 2.2 заканчиваем создание новой точки на пересекающейся точки
			if(point.userData.point.cross.userData.tag == 'point')		
			{			
				if(point.userData.point.cross.userData.point.last.cdm == 'new_point_1' && this.sObj.userData.point.cross == point || point.userData.point.cross == point.p[0])
				{ 
					deleteWall_3({wall: point.w[0]});
					this.sObj = null;
					console.log('%c2.2.1 новая точка пересеклась с сама с собой, удалем ее', 'color: #0000ff;');
				}						
				else
				{
					this.sObj = null;
					this.addPointOption_4(point);
					console.log('%c2.2.2 заканчиваем создание новой точки на пересекающейся точки', 'color: #0000ff;');
				}			
			}
		} 
		
		// 4. замыкание старой точки с другой точкой
		else if(!point.userData.point.type) 	// 4
		{ 	
			this.sObj = null;
			this.addPointOption_4(point);		
		}

		param_wall.wallR = point.w;
	}


	// 1. разбиваем стену (вкл режим резбить стену)
	// 2. заканчиваем создание стены пересекаясь с другой стеной, отключаем режим создания стены 
	// 3. создаем новую стену: от стены
	// 4. перетаскиваем старую стену и соединяем с другой стеной
	addPoint_5( wall, point )
	{ 
		if(Math.abs(point.position.y - point.userData.point.cross.position.y) > 0.3) { movePointWallPlaneMath(point); return; }
		
		if(point.userData.point.type == 'add_point')			// 1 
		{    
			this.sObj = null;
			this.addPoint_1( wall, point ); 
			console.log('создали точку');
		}
		else if(point.userData.point.type == 'continue_create_wall')			// 2
		{
			console.log('заканчиваем создание стены на стене');				 

			point.userData.point.last.cdm = 'new_point_2'; 
			
			var arrW = splitWalls( wall, point );
			
			// для undo/redo и для отмены правой кнопкой 
			point.userData.point.last.cross = 
			{ 
				walls : 
				{ 
					old : wall.userData.id,  
					new : 
					[ 
						{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
						{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
					] 
				} 
			};			
			
			point.userData.point.type = null; 		
			
			this.sObj = null; 		
		}
		else if(point.userData.point.type == 'create_wall')		// 3
		{	
			console.log('создаем новую стену: от стены');
			point.userData.point.type = null;
			point.userData.point.last.cdm = 'new_point_1'; 
			var point1 = point;		
			var point2 = myHouse.myPoint.createPoint( point.position.clone(), 0 );			 							
			
			point2.userData.point.cross = point1;
			
			var newWall = myHouse.myWall.createWall({p: [point1, point2] }); 
			var arrW = splitWalls( wall, point1 );
			
			// для undo/redo и для отмены правой кнопкой 
			point.userData.point.last.cross = 
			{ 
				walls : 
				{ 
					old : wall.userData.id,  
					new : 
					[ 
						{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
						{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
					] 
				} 
			};			
			
			clickMovePoint_BSP( point1.w );

			this.sObj = point2;
			point2.userData.point.type = 'continue_create_wall'; 				 
		}
		else if(!point.userData.point.type)		// 4
		{		
			console.log('перетаскиваем старую точку и соединяем с другой стеной'); 			
			
			var p1 = point.p[0];
			var selectWall = point.w[0];
			
			point.userData.point.last.cdm = 'new_point';
			
			var arrW = splitWalls( wall, point );		 
			
			var arrW2 = p1.w;
			
			for ( var i = 0; i < p1.w.length; i++ ) 
			{ 
				var flag = true;
				
				for ( var i2 = 0; i2 < arrW2.length; i2++ ) 
				{
					if(p1.w[i] == arrW2[i2]) { flag = false; break; }
				}
				
				if(flag) arrW2[arrW2.length] = p1.w[i];
			}
			
			clickPointUP_BSP( arrW2 );	

			// для undo/redo и для отмены правой кнопкой 
			point.userData.point.last.cross = 
			{ 
				walls : 
				{ 
					old : wall.userData.id,  
					new : 
					[ 
						{ id : arrW[0].userData.id, p2 : { id : arrW[0].userData.wall.p[0].userData.id } }, 
						{ id : arrW[1].userData.id, p2 : { id : arrW[1].userData.wall.p[1].userData.id }  } 
					] 
				} 
			};		  	  
			
			this.sObj = null;
		}

		param_wall.wallR = point.w;
	}



	//создаем стену: в любом месте (не на стене и не на точке)
	addPoint_6( point1 )
	{  		
		point1.userData.point.type = null;		
		var point2 = myHouse.myPoint.createPoint( point1.position.clone(), 0 );			
		point2.userData.point.type = 'continue_create_wall';
		
		var wall = myHouse.myWall.createWall({ p: [point1, point2] });		
		
		this.sObj = point2; 
		
		param_wall.wallR = [wall];
	}


	// добавляем точку на стену (разбиваем стену)
	addPoint_1( wall, point )
	{	 							
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;																
		  
		point.userData.point.last.cdm = 'add_point';
		
		var walls = splitWalls( wall, point );	

		point.userData.point.type = null; 

		return point;
	}


	addPointOption_4(point)
	{	
		if(turnBackPosPoint(point)) { return; }		// стена пересекласть с другой стеной				

		clickMovePoint_BSP( point.userData.point.cross.w );
		
		var wall = point.w[0];
		var point1 = point.userData.point.cross;
		var point2 = point.p[0];								

		var m = point1.p.length; 
		point1.p[m] = point2;
		point1.w[m] = wall;
		point1.start[m] = point.start[0];
		
		var m = point2.p.length; 
		point2.p[m] = point1;
		point2.w[m] = wall;
		point2.start[m] = (point.start[0] == 0) ? 1 : 0;
				
		var m = (wall.userData.wall.p[0] == point) ? 0 : 1;	
		wall.userData.wall.p[m] = point1;
		
		deleteOneOnPointValue(point2, wall);			
		deletePointFromArr(point);
		scene.remove(point);

		upLineYY_2(point1);
		upLabelPlan_1( point1.w ); 

		splitZone(wall);   
		
		if(!point.userData.point.type) 
		{ 
			console.log('4. замыкание старой точки с другой точкой'); 		
			
			if(wall.userData.wall.p[0] == point1) { var p1 = [point1, point2]; var p2 = [point, point2]; }
			else { var p1 = [point2, point1]; var p2 = [point2, point]; }							 
		} 
		else if(point.userData.point.cross.userData.tag == 'point') 
		{ 
			console.log('3. заканчиваем создание новой стены на точке (от точки к точке)'); 
		}	
		
		var arrW = [];
		for ( var i = 0; i < point1.w.length; i++ ) { arrW[arrW.length] = point1.w[i]; }
		
		//if(!point.userData.point.type)
		if(1==1)	
		{
			for ( var i = 0; i < point2.w.length; i++ ) 
			{ 
				var flag = true;
				
				for ( var i2 = 0; i2 < arrW.length; i2++ ) 
				{
					if(point2.w[i] == arrW[i2]) { flag = false; break; }
				}
				
				if(flag) arrW[arrW.length] = point2.w[i];
			}		
		}
		
		clickPointUP_BSP( arrW );
	}

	
}







