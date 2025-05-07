
// режимы отображения и т.д.
class MyBlocksMode
{
	isAllLevel = true;
	isUserSize = true;
	arrHideObjs = [];
	
	init({showAllLevel})
	{
		this.setCalcAllLevel({value: showAllLevel});
		const value1 = this.getCalcAllLevel();
		myPanelWidgetsBlocks.changeStateCheckBox1({value: value1});
		
		this.setUserSize({value: false});
		myPanelWidgetsBlocks.changeStateCheckBox2({value: false});
	}
	
	setCalcAllLevel({value})
	{
		this.isAllLevel = value;
	}

	getCalcAllLevel()
	{
		return this.isAllLevel;
	}
	
	setUserSize({value})
	{
		this.isUserSize = value;
	}

	getUserSize()
	{
		return this.isUserSize;
	}


	
	hideObjs()
	{
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







