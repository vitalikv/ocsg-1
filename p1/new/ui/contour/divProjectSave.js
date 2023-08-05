
// основное окно
class WindDivProjectSave
{
	container;
	elInfoReg;
	btnAccount;
	
	constructor()
	{
		this.container = this.createDiv();
		this.elInfoReg = this.container.querySelector('[nameId="infoReg"]');
		
		this.getBtn();
	}
	
	createDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];		
	}
	
	getBtn()
	{
		this.btnAccount = this.container.querySelector('[nameId="btnAccount"]');
	}	
	
	html_1()
	{
		const html = 
		`<div wwm_1="button_load_1" style="display: none;"> 
			<div class="window_main_menu_content_1_h1">
				Сохранить
			</div>
			<div nameId="infoReg">
				<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
					Чтобы  сохранить или загрузить проект, вам нужно авторизоваться. 
				
					<div style="max-width: 350px; margin: auto;">
						<div nameId="btnAccount" class="window_main_menu_button_reg_1 button_gradient_1">
							Авторизоваться
						</div>	
					</div>	
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
}







