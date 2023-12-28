
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
		const html = 
		`<div wwm_1="button_load_1" style="display: none;"> 
			<div class="window_main_menu_content_1_h1">
				Загрузить
			</div>
			<div nameId="infoReg"></div>
		</div>`;

		return html;
	}
	
	htmlStartInfo()
	{
		const html = 
		`<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
			Чтобы  сохранить или загрузить проект, вам нужно авторизоваться. 
		
			<div style="max-width: 350px; margin: auto;">
				<div nameId="btnAccount" class="window_main_menu_button_reg_1 button_gradient_1">
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







