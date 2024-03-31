
// верхняя панель с кнопками переключения режимов (планировка, отопление и т.д.)
class MyPanelTop2
{
	container;
	divP;
	
	// панель для платных пользователей
	addPaidPanel({panel = null})
	{
		this.container = document.querySelector('[nameId="wrapP1"]');
		
		this.divP = this.crDivP();
		this.container.append(this.divP);
		
		myPanelWF.addPaidContent();
		
		this.initEvent();
		
		if(panel && panel === 'otop') 
		{
			this.showPanelROtop();
			myPanelWF.showTabOtop();
		}
	}

	// верхняя панель с режимами (теплый пол, отопление и т.д.)
	crDivP()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];	
	}		
	
	initEvent()
	{
		const btnPl = this.divP.querySelector('[nameId="plan"]');
		const btnOt = this.divP.querySelector('[nameId="otop"]');
		
		btnPl.onmousedown = () => { myPanelWF.showHidePanel({show: false}); myPanelR.divPanel_1.style.display = ''; }
		btnOt.onmousedown = () => { this.showPanelROtop(); }			
	}


	html()
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
		
		const html = 
		`<div ui_1="" style="${css1}">			
			<div nameId="plan" style="${cssTab}">планировка</div>
			<div nameId="otop" style="${cssTab}">отопление</div>
		</div>`;

		return html;
	}


	showPanelROtop()
	{
		myPanelR.divPanel_1.style.display = 'none'; 
		myPanelWF.showHidePanel({show: true});
	}
}







