
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
		const css1 = 
		`display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		background-color:#f1f1f1;
		font-size: 24px;
		color: #666;`;
		
		const html = 
		`<div wwm_1="button_load_1" style="display: none;"> 
			<div style="${css1}">Сохранить</div>
			<div nameId="infoReg"></div>
		</div>`;

		return html;
	}
	
	htmlStartInfo()
	{
		const css1 =
		`background-color:#ffffff;
		border:solid 1px #b3b3b3;  
		border-radius: 3px;`;

		const css2 =
		`margin: 30px auto 0 auto;
		width:70%;
		padding: 40px;`;

		const cssBtn =
		`width: auto;
		height: 20px; 
		margin: 10px;
		margin-top: 40px;
		text-decoration:none; 
		text-align:center; 
		padding:11px 11px; 
		border:solid 1px #b3b3b3;  
		border-radius: 3px; 
		font-size:18px; 
		font-weight:bold; 
		color:#737373; 
		cursor: pointer;`;
		
		const html = 
		`<div style="${css1} ${css2} font-size: 17px; text-align:center;">
			Чтобы  сохранить или загрузить проект, вам нужно авторизоваться. 
		
			<div style="max-width: 350px; margin: auto;">
				<div nameId="btnAccount" class="button_gradient_1" style="${cssBtn}">
					Авторизоваться
				</div>	
			</div>	
		</div>`;

		return html;		
	}	
	
	
	// кликнули на кнопку сохранить проекта
	async clickButtonSaveProjectUI(el)
	{
		var result = await saveFile({id: el.attributes.projectid.value, upUI: true}); 
		
		if(!result) return;
		
		//infProject.elem.mainMenu.g.style.display = 'none';
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







