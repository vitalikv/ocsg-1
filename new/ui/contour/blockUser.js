
// основное окно
class WindBlockUser
{
	elDiv;
	elTitleReg;
	elReg;
	
	
	
	constructor()
	{
		this.elDiv = this.crBlock();
		this.elTitleReg = this.elDiv.querySelector('[nameId="titleReg"]');
		this.elReg = this.crWindReg();
		
		this.elTitleReg.textContent = 'Войдите или зарегистрируйтесь';
		
		this.addElemes();
		this.initEventElem();
	}
	
	crBlock()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];
	}
	
	crWindReg()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlReg1();
		return div.children[0];
	}

	addElemes()
	{
		const div = this.elDiv.querySelector('[nameId="blockReg"]');
		div.append(this.elReg);
	}
	
	initEventElem()
	{
		const btn1 = this.elReg.querySelector('[nameId="button_check_reg_1"]');
		const btn2 = this.elReg.querySelector('[nameId="button_check_reg_2"]');
		
		btn1.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_1'}); }
		btn2.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_2'}); }
	}

	html()
	{
		const wrapTabs = `
		display: flex;
		flex-direction: column;`;
					
		
		const html = 
		`<div nameId="reg_content_2" style="display: block;">
			<div nameId="titleReg" class="window_main_menu_content_1_h1"></div>
			<div nameId="blockReg" class="window_main_menu_form_reg"></div>		
		</div>`;																								
								

		return html;
	}


	htmlReg1()
	{
		const html =		
		`<div class="window_main_menu_form_reg_block_1">
			<div class="window_main_menu_form_reg_top_1">
				<div class="window_main_menu_form_reg_top_1_block" nameId="button_check_reg_1">
					<div class="window_main_menu_form_reg_top_1_block_text">
						вход
					</div>	
				</div>
				<div class="window_main_menu_form_reg_top_1_block" nameId="button_check_reg_2">
					<div class="window_main_menu_form_reg_top_1_block_text">
						регистрация
					</div>	
				</div>			
			</div>	
			
			<div class="window_main_menu_form_reg_block_1_1">
				<div class="window_main_menu_form_reg_block_1_label">
					почта
				</div>											
				<input class="input_form_reg" type="text" nameId="input_reg_mail" value="" placeholder="почта">
			</div>
			<div class="window_main_menu_form_reg_block_1_1">
				<div class="window_main_menu_form_reg_block_1_label">
					пароль
				</div>											
				<input class="input_form_reg" type="password" nameId="input_reg_pass" value="" placeholder="пароль">
			</div>
			
			<div class="window_main_menu_form_reg_block_1_1">
				<div nameId="info_reg_1" class="wm_reg_12 wm_reg_border_1 wm_reg_text_1" style="display: none;">
					<div nameId="info_reg_1_1" style="display: none;">
						Почта указана
					</div>
					<div nameId="info_reg_1_2" style="display: none;">
						Пароль указан
					</div>													
				</div>
			</div>

			<div class="button_reset_pass_1" nameId="button_reset_pass_1">
				забыли пароль ?
			</div>
			
			<div class="window_main_menu_button_reg_1 button_gradient_1" b_type="reg_1" nameId="act_reg_1">
				Войти
			</div>
		</div>`;

		
		return html;
	}


	// переключаем в главном меню в форме регистрация кнопки: вход/регистрация
	changeMainMenuRegistMenuUI({type})
	{
		const inf_block = this.elReg.querySelector('[nameId="info_reg_1"]');
		const inf_str_1 = this.elReg.querySelector('[nameId="info_reg_1_1"]');
		const inf_str_2 = this.elReg.querySelector('[nameId="info_reg_1_2"]');
		
		inf_block.style.display = 'none';
		inf_str_1.style.display = 'none';
		inf_str_2.style.display = 'none';		

		const el = this.elReg.querySelector('[nameId="act_reg_1"]');
		
		if(type === "reg_1") 
		{
			el.innerText = 'Войти';
			el.setAttribute("b_type", "reg_1"); 
		}
		if(type === "reg_2") 
		{
			el.innerText = 'Зарегистрироваться';
			el.setAttribute("b_type", "reg_2");
		}	
	}
}







