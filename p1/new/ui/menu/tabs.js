
// основное окно
class WindTabs 
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
		this.btnAccount = this.container.querySelector('[nameId="btnAccount"]');
		this.btnLoad = this.container.querySelector('[nameId="btnLoad"]');
		this.btnSave = this.container.querySelector('[nameId="btnSave"]');
		this.btnDemo = this.container.querySelector('[nameId="btnDemo"]');
		this.btnReset = this.container.querySelector('[nameId="btnReset"]');
	}
	
	initEvent()
	{
		
	}
	
	initEvent()
	{
		this.btnInfo.onmousedown = () => 
		{ 
			windUI.hideContainers();
			windDivAbout.showVideo();
			windDivAbout.container.style.display = ''; 
		}		
		this.btnAccount.onmousedown = () => 
		{ 
			windUI.hideContainers();
			windDivAccount.switchRegPass({type: 'reg'});			
			windDivAccount.container.style.display = '';			
		}
		this.btnSave.onmousedown = () => 
		{ 
			windUI.hideContainers(); 
			windDivProjectSave.container.style.display = ''; 
		}
		this.btnLoad.onmousedown = () => 
		{ 
			windUI.hideContainers(); 
			windDivProjectLoad.container.style.display = ''; 
		}
		this.btnDemo.onmousedown = () => 
		{ 
			windUI.hideContainers();
			windDivProjectDemo.showDivDemo();
			windDivProjectDemo.container.style.display = ''; 
		}
		this.btnReset.onmousedown = () => 
		{ 
			resetScene(); 
			windUI.closeWin(); 
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
			<div nameId="btnAccount" style="${btnLink}">Учетная запись</div>
			<div nameId="btnLoad" style="${btnLink}">Загрузить</div>
			<div nameId="btnSave" style="${btnLink}">Сохранить</div>
			<div nameId="btnDemo" style="${btnLink}">Демо проекты</div>			
			<div nameId="btnReset" style="${btnLink}">Пустой проект</div>			
		</div>`;

		return html;
	}

}







