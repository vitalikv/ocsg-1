
class MyBlocksCamera
{
	arrHideObjs = [];
	
	
	// активировался расчет блоков
	activate()
	{	
		this.hideObjs();
		
		myHouse.myGhostLevel.deleteLevel();	// прячем призрачный этаж
		
		infProject.tools.axis[0].visible = false;
		infProject.tools.axis[1].visible = false;
	}
	
	// деактивировался расчет блоков
	deActivate()
	{
		myCalcBlocks.myBlocksWalls.deleteWalls();
		
		this.showObjs();
		
		changeCamera();
	}
	
	// переключение камеры (когда рассчитаны блоки)
	changeCamera()
	{
		changeDepthColor();
		
		clickO = resetPop.clickO();		
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			myCameraOrbit.cam2D.updateMatrixWorld();
			upPosLabels_1({resize: true});	

			const idActive = myLevels.getIdActLevel();
			
			this.hideBlocks();
			this.showBlocks({idLevel: idActive});

			myCalcBlocks.myBlocksWalls.hideWalls();
			myCalcBlocks.myBlocksWalls.showWalls({idLevel: idActive});			
		}
		
		if(myCameraOrbit.activeCam.userData.isCam3D)
		{
			const allLevel = myBlocksMode.getCalcAllLevel();
			
			if(allLevel)
			{
				this.showBlocks({});				
				myCalcBlocks.myBlocksWalls.showWalls({});				
			}
			else
			{
				const idActive = myLevels.getIdActLevel();
				
				this.hideBlocks();
				this.showBlocks({idLevel: idActive});

				myCalcBlocks.myBlocksWalls.hideWalls();
				myCalcBlocks.myBlocksWalls.showWalls({idLevel: idActive});				
			}
		}
	}
	
	
	// переключение этажа в режиме расчет блоков
	switchLevel({id, posY})
	{
		this.hideObjs();
		
		myHouse.myGhostLevel.deleteLevel();
		
		myCalcBlocks.changePosYLevel({posY});
		myCalcBlocks.myBlocksWalls.changePosYLevel({posY});
		
		this.changeCamera();		
		
		renderCamera();
	}
	
	
	hideBlocks()
	{
		const arr = myCalcBlocks.getAllBlocks({});

		for ( let i = 0; i < arr.length; i++ )
		{		
			arr[i].visible = false;
		}		
	}
	
	showBlocks({idLevel = undefined})
	{
		const arr = myCalcBlocks.getAllBlocks({id: idLevel});
		
		for ( let i = 0; i < arr.length; i++ )
		{		
			arr[i].visible = true;
		}		
	}
	
	// прячем планировку
	hideObjs()
	{
		this.showObjs();	// сначала надо восстановить все видемые объекты или они не попадут в this.arrHideObjs
		//this.arrHideObjs.length = 0;
		
		const setVisible = (obj) =>
		{
			for ( let i = 0; i < obj.length; i++ )
			{	
				if(obj[i].visible) 
				{
					this.arrHideObjs.push(obj[i]);
					obj[i].visible = false;
				}				
			}					
		}
		
		for ( let i = 0; i < myLevels.levels.length; i++ )
		{		
			setVisible(myLevels.levels[i].wall);
			setVisible(myLevels.levels[i].floor);
			setVisible(myLevels.levels[i].door);
			setVisible(myLevels.levels[i].window);
			setVisible(myLevels.levels[i].roof);
			setVisible(myLevels.levels[i].obj);
		}

		renderCamera();
	}
	
	// показываем планировку
	showObjs()
	{		
		for ( let i = 0; i < this.arrHideObjs.length; i++ )
		{		
			this.arrHideObjs[i].visible = true;
		}
		
		this.arrHideObjs.length = 0;
		
		renderCamera();
	}	
}
    
























