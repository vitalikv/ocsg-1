

class MyLevels 
{
	levels = [];
	activeId = 0;
	activeLevel = null;
	
	constructor()
	{
		this.initLevels();
		this.activeId = 0;
		this.activeLevel = this.levels[this.activeId];
	}
	
	initLevels()
	{
		const count = 4;
		
		for ( let i = 0; i < count; i++ )
		{
			this.levels[i] = {};
			this.levels[i].wall = [];
			this.levels[i].point = [];
			this.levels[i].window = [];
			this.levels[i].door = [];		
			this.levels[i].floor = [];
			this.levels[i].ceiling = [];
			this.levels[i].obj = [];
			this.levels[i].roof = [];
			this.levels[i].height = 2.8;		
		}
	}
	
	// полчаем id активного этажа
	getIdActLevel()
	{
		return this.activeId;
	}
	
	// делаем выбранный этаж основным
	activateLevel(id)
	{
		this.activeId = id;
		
		this.updateArrScene(id);

		getInfoRenderWall();
		if(myCameraOrbit.activeCam.userData.isCam2D)  
		{
			showAllWallRender();
		}
		else if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			if(myPanelR.myLevelVisible.wallTransparent && myCameraOrbit.activeCam.userData.type === 'fly') wallAfterRender_2();
			else showAllWallRender();
		}
		
		if(myCameraOrbit.activeCam.userData.isCam2D) upPosLabels_1({resize: true});

		myPanelR.myContentLevel.levelBackground_UI({id});	// меняем фон у UI item этажа
	}
	
	// обновляем данные для активного этажа, передаем от scene.array к this.levels[id]
	updateArrLevel()
	{
		const arr = {};
		arr.wall = infProject.scene.array.wall;
		arr.point = infProject.scene.array.point;
		arr.window = infProject.scene.array.window;
		arr.door = infProject.scene.array.door;
		arr.obj = infProject.scene.array.obj;
		arr.floor = infProject.scene.array.floor;
		arr.ceiling = infProject.scene.array.ceiling;
		arr.roof = infProject.scene.array.roof;	
		arr.height = infProject.settings.height;
		
		this.levels[this.activeId] = arr;	
	}

	// обновляем данные для выбранного этажа, передаем от this.levels[id] к scene.array
	updateArrScene(id)
	{
		const arr = this.levels[id];
		
		obj_point = arr.point;
		room = arr.floor;
		ceiling = arr.ceiling;

		infProject.scene.array.wall = arr.wall;
		infProject.scene.array.point = arr.point;
		infProject.scene.array.window = arr.window;
		infProject.scene.array.door = arr.door;	
		infProject.scene.array.floor = arr.floor;
		infProject.scene.array.ceiling = arr.ceiling;
		infProject.scene.array.obj = arr.obj;
		infProject.scene.array.roof = arr.roof;
		infProject.settings.height = arr.height;	
	}

	// деактивируем этаж и обновляем данные для этого этажа
	deactiveLevel()
	{
		getInfoRenderWall();
		showAllWallRender();
		changeDepthColor222();
		
		this.updateArrLevel();
		
		resetArrScene()
	}


	// переключения одного этажа на другой
	switchLevel(id)
	{	
		if(this.activeId === id) return;
		
		myComposerRenderer.outlineRemoveObj();
		myMouse.clearClick();
		
		const posY = this.getLevelPos0({lastId: this.activeId, newId: id});
		
		this.deactiveLevel();
		
		this.activateLevel(id);
		
		for ( let i = 0; i < this.levels.length; i++ )
		{
			this.changePosYLevel(posY, i);
		}
		
		changeDepthColor();	
		
		this.changeVisibleLevels();
		
		if(myCameraOrbit.activeCam.userData.isCam2D) 
		{
			myHouse.myGhostLevel.createLevel();	// показываем призрачный этаж
			this.visibleLevelCam2D(id, true);
		}
		
		if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			this.visibleLevelCam3D(id, true);
		}		
	}


	// меняем высоту этажа и сдвигаем все остальные этажы
	setHeightWallLevel({value, id}) 
	{	
		const level = this.levels;
		const posY = level[id].height - value; 

		level[id].height = value;
		
		if(this.activeId === id) infProject.settings.height = value;
		
		// меняем высоту текщего этажа и поднимаем потолок и крышу
		if(1===1)
		{
			clickMovePoint_BSP( level[id].wall );
			
			for ( let i = 0; i < level[id].wall.length; i++ )
			{
				let v = level[id].wall[i].geometry.vertices;
				
				v[1].y = value;
				v[3].y = value;
				v[5].y = value;
				v[7].y = value;
				v[9].y = value;
				v[11].y = value;
				level[id].wall[i].geometry.verticesNeedUpdate = true;
				level[id].wall[i].geometry.elementsNeedUpdate = true;
				
				level[id].wall[i].userData.wall.height_1 = value;
			}
			
			upLabelPlan_1( level[id].wall );
			clickPointUP_BSP( level[id].wall );

			const floor = level[id].floor;
			const ceiling = level[id].ceiling;
			const roof = level[id].roof;
			
			for ( let i = 0; i < floor.length; i++ ) ceiling[i].position.set( 0, floor[i].position.y + value, 0 );
			//for ( let i = 0; i < roof.length; i++ ) roof[i].position.set( 0, roof[i].position.y + value, 0 );
		}
		
		if(this.activeId > id)
		{
			for ( let i = 0; i < level.length; i++ )
			{
				if(i > id) continue;					
				this.changePosYLevel(-posY, i);
			}		
		}
		else
		{
			for ( let i = 0; i < level.length; i++ )
			{
				if(i <= id) continue;			
				this.changePosYLevel(posY, i);
			}				
		}
		
		renderCamera();
	}


	// получаем значение, на который нужно сдвинуть этажи, чтобы текущий этаж был на нулевом уровне
	getLevelPos0({lastId, newId})
	{
		const level = this.levels;
		let sumY1 = 0;
		let sumY2 = 0;
		
		for ( let i = 0; i < level.length; i++ )
		{
			if(i === lastId) break;
			sumY1 += level[i].height;		
		}
		
		for ( let i = 0; i < level.length; i++ )
		{
			if(i === newId) break;
			sumY2 += level[i].height;		
		}
		
		const posY = sumY2 - sumY1;

		return posY;
	}


	// меняем высоту этажей, самый первый ставим на 0, id - номер этажа
	changePosYLevel(posY, id)
	{
		const { walls, points, floors, ceilings, objs, roofs, otop } = this.getDestructObject(id);

		for ( let i = 0; i < walls.length; i++ )
		{		
			walls[i].position.y = walls[i].position.y - posY;
			
			for ( var i2 = 0; i2 < walls[i].userData.wall.arrO.length; i2++ )
			{
				walls[i].userData.wall.arrO[i2].position.y = walls[i].userData.wall.arrO[i2].position.y - posY;
			}
		}
		if(id === 0) infProject.scene.grid.position.y = infProject.scene.grid.position.y - posY;
		for ( let i = 0; i < points.length; i++ ) points[i].position.y = points[i].position.y - posY;	
		for ( let i = 0; i < floors.length; i++ ) floors[i].position.y = floors[i].position.y - posY;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].position.y = ceilings[i].position.y - posY;
		for ( let i = 0; i < objs.length; i++ ) objs[i].position.y = objs[i].position.y - posY;
		for ( let i = 0; i < roofs.length; i++ ) roofs[i].position.y = roofs[i].position.y - posY;
		
		
		for ( let i = 0; i < otop.points.length; i++ ) otop.points[i].position.y = otop.points[i].position.y - posY;
		for ( let i = 0; i < otop.tubes.length; i++ ) otop.tubes[i].position.y = otop.tubes[i].position.y - posY;
	}


	// меняем видимость неактивных этажей
	changeVisibleLevels()
	{
		for ( let i = 0; i < this.levels.length; i++ )
		{		
			if(myCameraOrbit.activeCam.userData.isCam3D && this.activeId !== i) 
			{
				this.visibleLevelCam3D(i, myPanelR.myLevelVisible.showAllLevel);
			}
			if(myCameraOrbit.activeCam.userData.isCam2D && this.activeId !== i) 
			{
				this.visibleLevelCam2D(i, false);
			}		
		}
		
		this.changeVisibleRoofs();
		
		if(myCameraOrbit.activeCam.userData.isCam2D) upPosLabels_1({resize: true});	// поправляем размеры и svg
	}


	visibleLevelCam2D(id, visible)
	{
		const { walls, points, doors, windows, floors, ceilings, objs, roofs, otop } = this.getDestructObject(id);
		
		for ( let i = 0; i < points.length; i++ ) points[i].visible = visible;		
		for ( let i = 0; i < walls.length; i++ ) walls[i].visible = visible;	
		
		for ( let i = 0; i < doors.length; i++ )
		{  
			if(!doors[i].userData.door.obj3D) continue;
			doors[i].userData.door.obj3D.visible = visible;		
		}	

		for ( let i = 0; i < windows.length; i++ )
		{ 
			if(!windows[i].userData.door.obj3D) continue;
			windows[i].userData.door.obj3D.visible = visible;		
		}
		
		showHideArrObj(doors, visible);		
		showHideArrObj(windows, visible);		
			
		for ( let i = 0; i < floors.length; i++ ) floors[i].visible = visible;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].visible = visible;
		for ( let i = 0; i < objs.length; i++ ) objs[i].visible = visible;
		//for ( let i = 0; i < roofs.length; i++ ) roofs[i].visible = visible;
		
		//for ( let i = 0; i < otop.points.length; i++ ) otop.points[i].visible = visible;
		for ( let i = 0; i < otop.tubes.length; i++ ) otop.tubes[i].visible = visible;		
	}
	
	visibleLevelCam3D(id, visible)
	{
		const { walls, points, doors, windows, floors, ceilings, objs, roofs, otop } = this.getDestructObject(id);
		
		for ( let i = 0; i < points.length; i++ ) points[i].visible = false;		
		for ( let i = 0; i < walls.length; i++ ) walls[i].visible = visible;	
		
		for ( let i = 0; i < doors.length; i++ )
		{  
			if(!doors[i].userData.door.obj3D) continue;
			doors[i].userData.door.obj3D.visible = visible;		
		}	

		for ( let i = 0; i < windows.length; i++ )
		{ 
			if(!windows[i].userData.door.obj3D) continue;
			windows[i].userData.door.obj3D.visible = visible;		
		}
		
		
		showHideArrObj(doors, false);		
		showHideArrObj(windows, false);
			
		for ( let i = 0; i < floors.length; i++ ) floors[i].visible = visible;
		for ( let i = 0; i < ceilings.length; i++ ) ceilings[i].visible = visible;
		for ( let i = 0; i < objs.length; i++ ) objs[i].visible = visible;
		//for ( let i = 0; i < roofs.length; i++ ) roofs[i].visible = visible;
		
		//for ( let i = 0; i < otop.points.length; i++ ) otop.points[i].visible = visible;
		for ( let i = 0; i < otop.tubes.length; i++ ) otop.tubes[i].visible = visible;		
	}


	// меняем видимость всех крыш в зависимости от флага showAllRoofs (показывать или скрывать крыши)
	changeVisibleRoofs() 
	{
		const showRoof = myPanelR.myLevelVisible.showAllRoofs;
		const showLevel = myPanelR.myLevelVisible.showAllLevel;
		
		const is2D = myCameraOrbit.activeCam.userData.isCam2D;
		const is3D = myCameraOrbit.activeCam.userData.isCam3D;
		
		const arrActRoofs = [];		// все крыши активного этажа
		const arrNotActRoofs = [];	// все крыши НЕактивного этажа
		
		for ( let i = 0; i < this.levels.length; i++ )
		{		
			const { roofs } = this.getDestructObject(i);
			
			if(this.activeId === i) { arrActRoofs.push(...roofs); }
			else { arrNotActRoofs.push(...roofs); }
		}
		
		if(is2D)
		{
			for ( let i = 0; i < arrActRoofs.length; i++ ) arrActRoofs[i].visible = showRoof;
			for ( let i = 0; i < arrNotActRoofs.length; i++ ) arrNotActRoofs[i].visible = false;
		}
		
		if(is3D)
		{
			for ( let i = 0; i < arrActRoofs.length; i++ ) arrActRoofs[i].visible = showRoof;
			
			const show3D = (!showLevel) ? false : showRoof;
			for ( let i = 0; i < arrNotActRoofs.length; i++ ) arrNotActRoofs[i].visible = show3D;
		}

		// если скрываем крышу и если это крыша выделана, то снимаем выделение
		if(!showRoof)
		{
			const obj = myComposerRenderer.getOutlineObj();
			
			if(obj && obj.userData.tag === 'roof')
			{
				const ind = arrActRoofs.findIndex((o) => o === obj);
				if(ind > -1) myManagerClick.hideMenuObjUI_2D();
			}
			
		}
	}	

	getDestructObject(id)
	{
		const level = this.levels;
		
		const walls = level[id].wall;
		const points = level[id].point;
		const doors = level[id].door;
		const windows = level[id].window;
		const floors = level[id].floor;
		const ceilings = level[id].ceiling;
		const objs = level[id].obj;
		const roofs = level[id].roof;
		
		const otop = myWarmFloor.getObjsActLevel(id);

		return { walls, points, doors, windows, floors, ceilings, objs, roofs, otop };
	}
	
	
	// удалем все этажи
	deleteAllLevels()
	{
		for ( let i = 0; i < this.levels.length; i++ )
		{
			this.deleteOneLevel(i);
		}	
	}
	

	// удаляем один этаж
	deleteOneLevel(id)
	{
		myMouse.clearClick();
		
		let { walls: wall, points: point, doors: door, windows: window, floors: floor, ceilings: ceiling, objs: obj, roofs: roof } = this.getDestructObject(id);
		
		for ( let i = 0; i < wall.length; i++ )
		{ 		
			if(wall[i].userData.wall.html.label)
			{
				for ( let i2 = 0; i2 < wall[i].userData.wall.html.label.length; i2++ )
				{
					deleteValueFromArrya({arr: infProject.html.label, o: wall[i].userData.wall.html.label[i2]});
					wall[i].userData.wall.html.label[i2].remove();
				}
			}					
			
			wall[i].userData.wall.p = [];
			
			disposeHierchy({obj: wall[i]});
			scene.remove(wall[i]); 
		}
		
		for ( let i = 0; i < point.length; i++ )
		{ 
			disposeHierchy({obj: point[i]});
			scene.remove(point[i]); 
		}	
		
		for ( let i = 0; i < window.length; i++ )
		{ 
			deleteSvgWD({obj: window[i]});	
			disposeHierchy({obj: window[i]});   
			scene.remove(window[i]); 
		}
		
		for ( let i = 0; i < door.length; i++ )
		{ 
			deleteSvgWD({obj: door[i]});
			disposeHierchy({obj: door[i]}); 
			scene.remove(door[i]); 
		}	
		
		
		for ( let i = 0; i < floor.length; i++ )
		{		
			disposeHierchy({obj: floor[i]});
			disposeHierchy({obj: ceiling[i]});
			
			deleteValueFromArrya({arr: infProject.html.label, o: floor[i].userData.room.html.label});
			floor[i].userData.room.html.label.remove(); 
			
			scene.remove(floor[i]); 
			scene.remove(ceiling[i]);	
		}
		
		for ( let i = 0; i < obj.length; i++ )
		{ 
			disposeHierchy({obj: obj[i]});
			scene.remove(obj[i]);
		}

		for ( let i = 0; i < roof.length; i++ )
		{ 
			disposeHierchy({obj: roof[i]});
			scene.remove(roof[i]);
		}
		
		this.clearLevel(id)	
	}

	
	// очищаем массив
	clearLevel(id)
	{
		const level = this.levels;
		
		level[id].wall = [];
		level[id].point = [];
		level[id].door = [];
		level[id].window = [];
		level[id].floor = [];
		level[id].ceiling = [];
		level[id].obj = [];
		level[id].roof = [];
		//level[id].height = 2.8;
	}
}




function resetArrScene()
{
	obj_point = [];
	room = [];
	ceiling = [];
	
	infProject.scene.array.wall = [];
	infProject.scene.array.point = [];
	infProject.scene.array.window = [];
	infProject.scene.array.door = [];	
	infProject.scene.array.floor = [];
	infProject.scene.array.ceiling = [];
	infProject.scene.array.obj = [];
	infProject.scene.array.roof = [];
	
	infProject.scene.array = resetPop.infProjectMySceneArray();	
}




function saveArrLevel(id)
{	
	myLevels.activeId = id;
	myLevels.updateArrLevel();	
	
 	changeDepthColor222();
	resetArrScene();
	
	console.log(id, myLevels.levels[id]);
}







