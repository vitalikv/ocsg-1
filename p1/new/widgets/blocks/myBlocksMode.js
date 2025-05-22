
// режимы отображения и т.д.
class MyBlocksMode
{
	isActiveMode = false;
	isActiveBlocks = false;	// расчет произошел или нет
	isAllLevel = true;
	typeTab = '';
	
	
	// вкл режим когда (произошел подсчет линий и построение фековых стен)
	enableMode({showAllLevel})
	{
		myMouse.clearClick();
		myComposerRenderer.outlineRemoveObj();
		
		this.setActiveMode({value: true});
		
		this.setCalcAllLevel({value: showAllLevel});
		const value1 = this.getCalcAllLevel();
		myCalcBlocks.myPanelWidgetsBlocks.changeStateCheckBox1({value: value1});	
		
		myCalcBlocks.enableWalls();				
	}
	
	// выкл
	disableMode()
	{
		myCalcBlocks.disableWalls();
		this.setActiveMode({value: false});
	}
	
	
	// вкл расчет блоков
	enableBlocks()
	{
		myCalcBlocks.enableBlocks();
		this.setActiveBlocks({value: true});
	}	
	
	disableBlocks()
	{
		myCalcBlocks.disableBlocks();
		this.setActiveBlocks({value: false});
	}
	
	
	changeTab({type})
	{
		this.setTab({type});
		
		let mode = 'def';
		if(type === 'setting') mode = 'select';
		
		myCalcBlocks.myBlocksWalls.changeColorWalls({mode});

		
		if(this.getActiveBlocks())
		{
			if(type === 'setting')
			{
				myCalcBlocks.myBlocksCamera.hideBlocks();
			}
			else
			{
				myCalcBlocks.myBlocksCamera.changeCamera();
			}			
		}
		
		renderCamera();
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

	// вкл/выкл когда произошел расчет блоков
	setActiveBlocks({value})
	{
		this.isActiveBlocks = value;
	}
	
	getActiveBlocks()
	{
		return this.isActiveBlocks;
	}
	
	setCalcAllLevel({value})
	{
		this.isAllLevel = value;
	}

	getCalcAllLevel()
	{
		return this.isAllLevel;
	}


	setTab({type})
	{
		this.typeTab = type;
		console.log(type);
	}
	
	getTab()
	{
		return this.typeTab;
	}	
}







