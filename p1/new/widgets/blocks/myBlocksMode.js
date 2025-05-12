
// режимы отображения и т.д.
class MyBlocksMode
{
	isAllLevel = true;
	isUserSize = true;
	
	
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

}







