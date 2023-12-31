
// основное окно
class WindDivProjectLoad
{
	container;
	elInfoReg;
	
	init()
	{
		this.container = this.createDiv();
		this.elInfoReg = this.container.querySelector('[nameId="infoReg"]');
		
		this.showDivStartLoad();
	}
	
	createDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];		
	}	
	
	html_1()
	{
		const cssHeader = 
		`display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		background-color:#f1f1f1;
		font-size: 17px;
		color: #666;`;
		
		const html = 
		`<div wwm_1="button_load_1" style="display: none;"> 
			<div style="${cssHeader}">Загрузить</div>
			<div nameId="infoReg"></div>
		</div>`;

		return html;
	}
	
	htmlStartInfo()
	{
		const cssBtn =
		`width: auto;
		height: 20px; 
		margin: 30px 10px 10px 10px;
		text-decoration:none; 
		text-align:center; 
		padding:11px; 
		border:solid 1px #b3b3b3;   
		font-size:15px; 
		font-weight:bold; 
		color:#737373; 
		cursor: pointer;`;
		
		const html = 
		`<div style="margin: 0 auto; font-size: 15px; text-align:center;">
			Чтобы  сохранить или загрузить проект, вам нужно авторизоваться. 
		
			<div style="max-width: 200px; margin: auto;">
				<div nameId="btnAccount" class="button_gradient_1" style="${cssBtn}">
					Авторизоваться
				</div>	
			</div>	
		</div>`;

		return html;		
	}

		
	// кликнули на кнопку загрузки проекта
	clickButtonLoadProjectUI(el)
	{
		loadFile({id: el.getAttribute("projectId")}); 
		
		//infProject.elem.mainMenu.g.style.display = 'none';
	}

	
	// обновляем div и создаем событие для btn
	showDivStartLoad()
	{
		this.elInfoReg.innerHTML = this.htmlStartInfo();		
		this.initEventBtn();
	}
	
	// нажали на btn Авторизоваться (когда еще не вошли, как user)
	initEventBtn()
	{
		const btnAccount = this.container.querySelector('[nameId="btnAccount"]');
		
		btnAccount.onmousedown = () => 
		{ 
			windUI.hideContainers();
			windDivAccount.switchRegPass({type: 'reg'});			
			windDivAccount.container.style.display = '';			
		}		
	}	
}







