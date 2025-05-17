
// режимы отображения и т.д.
class MyBlocksMode
{
	isActiveMode = false;
	isAllLevel = true;
	isUserSize = true;
	
	
	// вкл режим когда можно делать расчеты блоков
	enableMode({showAllLevel})
	{
		myMouse.clearClick();
		myComposerRenderer.outlineRemoveObj();
		
		this.setActiveMode({value: true});
		
		this.setCalcAllLevel({value: showAllLevel});
		const value1 = this.getCalcAllLevel();
		myPanelWidgetsBlocks.changeStateCheckBox1({value: value1});
		
		this.setUserSize({value: false});
		myPanelWidgetsBlocks.changeStateCheckBox2({value: false});		
	}
	
	// выкл
	disableMode()
	{
		myCalcBlocks.myBlocksCamera.deActivate();
		myCalcBlocks.clearResultBlocks();

		this.setActiveMode({value: false});
	}
	
	
	// вкл/выкл режим расчета блоков (активна/деактивна правая панель для расчета)
	setActiveMode({value})
	{
		this.isActiveMode = value;
	}	
	
	getActiveMode()
	{
		return this.isActiveMode;
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

}







