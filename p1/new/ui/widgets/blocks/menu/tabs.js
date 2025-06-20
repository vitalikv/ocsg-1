
// основное окно
class MyUIBlocksWindTabs 
{
	container;
	btnInfo;
	btnAccount;
	btnLoad;
	btnSave;
	btnDemo;
	btnReset;
	
	
	init()
	{
		this.crTabs();
		this.getBtn();
		this.initEvent();
	}
	
	crTabs()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		this.container = div.children[0];
	}
	
	getBtn()
	{
		this.btnInfo = this.container.querySelector('[nameId="btnInfo"]');
		this.btnInstruction = this.container.querySelector('[nameId="btnInstruction"]');
		this.btnDemo = this.container.querySelector('[nameId="btnDemo"]');
		
		if(1===2)
		{
			this.btnAccount = this.container.querySelector('[nameId="btnAccount"]');
			this.btnLoad = this.container.querySelector('[nameId="btnLoad"]');
			this.btnSave = this.container.querySelector('[nameId="btnSave"]');		
			this.btnReset = this.container.querySelector('[nameId="btnReset"]');			
		}
	}
	
	initEvent()
	{
		
	}
	
	initEvent()
	{
		this.btnInfo.onmousedown = () => 
		{ 
			myUIBlocksWindMain.hideContainers();
			myUIBlocksWindMain.myUIBlocksWindDivAbout.show(); 
		}			
		this.btnInstruction.onmousedown = () => 
		{ 
			myUIBlocksWindMain.hideContainers();
			myUIBlocksWindMain.myUIBlocksWindInstruction.show();
		}
		this.btnDemo.onmousedown = () => 
		{ 
			myUIBlocksWindMain.hideContainers();
			myUIBlocksWindMain.myUIBlocksWindDivProjectDemo.showDivDemo();
			myUIBlocksWindMain.myUIBlocksWindDivProjectDemo.container.style.display = ''; 
		}
		
		
		if(1===2)
		{
			this.btnAccount.onmousedown = () => 
			{ 
				myUIBlocksWindMain.hideContainers();
				myUIBlocksWindMain.myUIBlocksWindDivAccount.switchRegPass({type: 'reg'});			
				myUIBlocksWindMain.myUIBlocksWindDivAccount.container.style.display = '';			
			}
			this.btnSave.onmousedown = () => 
			{ 
				myUIBlocksWindMain.hideContainers(); 
				myUIBlocksWindMain.myUIBlocksWindDivProjectSave.container.style.display = ''; 
			}
			this.btnLoad.onmousedown = () => 
			{ 
				myUIBlocksWindMain.hideContainers(); 
				myUIBlocksWindMain.myUIBlocksWindDivProjectLoad.container.style.display = ''; 
			}
			this.btnReset.onmousedown = () => 
			{ 
				resetScene(); 
				myUIBlocksWindMain.closeWin(); 
			}			
		}
	}	

	html()
	{
		const wrapTabs = `
		display: flex;
		flex-direction: column;`;
		
		const btnLink = ` 
		margin: 5px 20px;
		padding: 5px 0;
		width: 150px;
		font-size: 15px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #f1f1f1;
		cursor: pointer;
		user-select: none;`;		
		
		
		const html = 
		`<div style="${wrapTabs}">
			<a href="/" style="${btnLink} margin-top: 20px;">На главную</a>
			<div nameId="btnInfo" style="${btnLink}">О программе</div>
			<div nameId="btnInstruction" style="${btnLink}">Инструкция</div>
			<div nameId="btnDemo" style="${btnLink}">Демо проекты</div>			
		</div>`;

		return html;
	}

}







