
// основное окно
class WindDivProjectSave
{
	container;
	elInfoReg;
	
	init()
	{
		this.container = this.createDiv();
		this.elInfoReg = this.container.querySelector('[nameId="infoReg"]');
		
		this.showDivStartSave()
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
		font-size: 17px;
		color: #666;`;

		const cssInfo = 
		`display: grid; 
		grid-template-columns: auto auto auto;
		justify-content: center;
		align-items: center;`;
		
		const html = 
		`<div style="display: none;"> 
			<div style="${cssHeader}">Сохранить</div>
			<div nameId="infoReg" style="${cssInfo}"></div>
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
	
	
	// кликнули на кнопку сохранить проекта
	async clickButtonSaveProjectUI({projectId})
	{
		const result = await saveFile({id: projectId, upUI: true}); 
		
		return result;
	}


	// обновляем div и создаем событие для btn
	showDivStartSave()
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







