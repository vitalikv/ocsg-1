
// основное окно
class WindDivProjectLoad
{
	container;
	btnAccount;
	
	constructor()
	{
		this.container = this.createDiv();
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
				Загрузить
			</div>
			<div nameId="wm_list_load">
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
}







