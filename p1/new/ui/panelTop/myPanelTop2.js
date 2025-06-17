
// верхняя панель с кнопками переключения режимов (планировка, отопление и т.д.)
class MyPanelTop2
{
	container;
	divP;
	stateCheckBox;
	
	// панель для платных пользователей
	addPaidPanel({panel = null})
	{
		this.container = document.querySelector('[nameId="wrapP1"]');
		
		let list = [];
		if(panel && panel === 'otop') list = ['plan', 'otop'];
		if(panel && panel === 'calcBlock') list = ['plan', 'calcBlock'];
		
		this.divP = this.crDivP({list});
		this.container.append(this.divP);
		
		this.eventStop({div: this.divP});
		this.initEvent();
		
		if(panel && panel === 'otop') 
		{
			myPanelWF.addPaidContent();
			
			this.showPanelROtop();
			myPanelWF.showTabOtop();
		}
				
	}

	// верхняя панель с режимами (теплый пол, отопление и т.д.)
	crDivP({list})
	{
		const div = document.createElement('div');
		div.innerHTML = this.html({list});
		return div.children[0];	
	}

	// блокируем действия на 3д сцене, когда курсор находится на div
	eventStop({div})
	{
		const arrEvent = ['onmousedown', 'onwheel', 'onmousewheel', 'onmousemove', 'ontouchstart', 'ontouchend', 'ontouchmove'];

		arrEvent.forEach((events) => 
		{
			div[events] = (e) => { e.stopPropagation(); }					
		});			
	}	
	
	initEvent()
	{
		const btnPl = this.divP.querySelector('[nameId="plan"]');
		const btnOt = this.divP.querySelector('[nameId="otop"]');
		const btnCalcBlock = this.divP.querySelector('[nameId="calcBlock"]');
		
		btnPl.onmousedown = () => { this.showPanelRPlan(); }
		if(btnOt) btnOt.onmousedown = () => { this.showPanelROtop(); }
		if(btnCalcBlock) btnCalcBlock.onmousedown = () => { this.showPanelRWBlocks(); }
	}


	html({list})
	{
		const css1 = 
		`position: relative;
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 41px;
		margin: 0;
		border: 1px solid #b3b3b3;
		border-top: none;
		background: #f1f1f1;`;

		const cssTab = 
		`margin: auto 10px;
		padding: 5px;
		font-size: 15px;
		color: #666;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #fff;
		cursor: pointer;
		user-select: none;`;		
		
		
		let divs = ``;
		for ( let i = 0; i < list.length; i++ )
		{
			if(list[i] === 'plan') divs += `<div nameId="plan" style="${cssTab}">планировка</div>`;
			if(list[i] === 'otop') divs += `<div nameId="otop" style="${cssTab}">отопление</div>`;
			if(list[i] === 'calcBlock') divs += `<div nameId="calcBlock" style="${cssTab}">расчет блоков</div>`;
		}
		
		const html = 
		`<div ui_1="" style="${css1}">			
			${divs}
		</div>`;

		return html;
	}

	
	// показываем правую панель с планировкой
	showPanelRPlan()
	{
		myCalcBlocks.myBlocksMode.disableMode();
		
		const state = this.getStateCheckBox();
		if(state) this.changeStateCheckBox(state);
		
		myPanelWF.showHidePanel({show: false});
		myCalcBlocks.myUiBlocksMain.showHidePanel({show: false});
		myPanelR.divPanel_1.style.display = ''; 		
	}
	
	showPanelROtop()
	{
		myPanelR.divPanel_1.style.display = 'none'; 
		myPanelWF.showHidePanel({show: true});
	}
	
	// показываем правую панель с расчетом блоков (активируем режим)
	showPanelRWBlocks()
	{
		myLevels.switchLevel(0);
		
		this.setStateCheckBox();
		const state = this.getStateCheckBox();
		this.changeStateCheckBox({showAllLevel: state.showAllLevel, wallTransparent: false, showAllRoofs: state.showAllRoofs});
		
		myCalcBlocks.myBlocksMode.enableMode({showAllLevel: state.showAllLevel});
		
		myPanelR.divPanel_1.style.display = 'none'; 
		myCalcBlocks.myUiBlocksMain.showHidePanel({show: true});
		
		myCalcBlocks.myUiBlocksMain.setStartBtnLevel();
		myCalcBlocks.myUiBlocksMain.setStartInputValue();		
	}


	setStateCheckBox()
	{
		this.stateCheckBox = myPanelR.myLevelVisible.getStateCheckBox();		
	}
	
	getStateCheckBox()
	{
		return this.stateCheckBox;		
	}

	changeStateCheckBox({showAllLevel, wallTransparent, showAllRoofs})
	{
		//myPanelR.myLevelVisible.switchShowAllLevel({value: showAllLevel});
		myPanelR.myLevelVisible.switchWallTransparent({value: wallTransparent});
		//myPanelR.myLevelVisible.switchShowAllRoofs({value: showAllRoofs});
	}
}







