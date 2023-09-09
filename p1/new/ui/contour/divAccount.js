
// основное окно
class WindDivAccount
{
	container;
	elTitleReg;
	elReg;
	elResetPass;
	elUser;
	
	constructor()
	{
		this.container = this.crContainer();
		this.elTitleReg = this.container.querySelector('[nameId="titleReg"]');
		
		this.elReg = this.crWindReg();
		this.elResetPass = this.crWindResetPass();
		this.elUser = this.crWindUser();
		
		this.addElemes();
		this.initEventElem();
		
		this.changeMainMenuRegistMenuUI({type: 'reg_1'})
	}
	
	// создаем контейнер
	crContainer()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];
	}
	
	// создаем блок с авторизацией/регистрацией
	crWindReg()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlReg1();
		return div.children[0];
	}
	
	// создаем блок с восстановлением пароля
	crWindResetPass()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlResetPass();
		return div.children[0];
	}	

	// создаем блок когда прошла авторизация
	crWindUser()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlReg2();
		return div.children[0];
	}	
	
	// добавляем созданные элементы в контейнер
	addElemes()
	{
		const div = this.container.querySelector('[nameId="contentReg"]');
		div.append(this.elReg);
		div.append(this.elResetPass);
		div.append(this.elUser);
	}
	
	// события для кнопок
	initEventElem()
	{
		const btn1 = this.elReg.querySelector('[nameId="button_check_reg_1"]');	// вкладка авторизация
		const btn2 = this.elReg.querySelector('[nameId="button_check_reg_2"]');	// вкладка регистрация нового пользователя
		const btnResPass = this.elReg.querySelector('[nameId="btnResPass"]');	// кнопка показать div восстановление пароля
		const btnSendReg = this.elReg.querySelector('[nameId="act_reg_1"]');	// кнопка формы войти/регистрация
		const btnSendReset = this.elResetPass.querySelector('[nameId="act_reset_pass"]');		// кнопка формы восстановление пароля
		
		
		btn1.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_1'}); }
		btn2.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_2'}); }		
		btnResPass.onmousedown = () => { this.switchRegPass({type: 'resetPass'}); }
		
		btnSendReg.onmousedown = () => { this.checkRegDataIU(); }
		btnSendReset.onmousedown = () => { this.resetPassRegIU(); }		
	}

	html()
	{
		const wrapTabs = `
		display: flex;
		flex-direction: column;`;
					
		
		const html = 
		`<div nameId="reg_content_2" style="display: block;">
			<div nameId="titleReg" class="window_main_menu_content_1_h1"></div>
			<div nameId="contentReg"></div>		
		</div>`;																								
								

		return html;
	}


	htmlReg1()
	{
		const html =		
		`<div nameId="divReg" class="window_main_menu_form_reg_block_1">
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

			<div nameId="btnResPass" class="button_reset_pass_1">
				забыли пароль ?
			</div>
			
			<div nameId="act_reg_1" class="window_main_menu_button_reg_1 button_gradient_1" b_type="reg_1">
				Войти
			</div>
		</div>`;

		
		return html;
	}


	htmlReg2()
	{
		const html = `
		<div nameId="divUser" style="display: none;">												
			<div class="wm_reg_13 wm_reg_border_1 wm_reg_text_1">
				Вы авторизовались.<br><br>Теперь вам доступно сохранение и загрузка проектов. 
			</div>											
		</div>`;

		return html;
	}

	htmlResetPass()
	{
		const html = `
		<div nameId="divResetPass" class="window_main_menu_form_reg" style="display: none;">
			<div class="window_main_menu_form_reg_block_1">
				
				<div class="window_main_menu_form_reg_block_1_1">
					<div class="window_main_menu_form_reg_block_1_label">
						почта
					</div>											
					<input class="input_form_reg" type="text" nameId="input_reset_pass" value="">
				</div>	

				<div class="window_main_menu_form_reg_block_1_1">
					<div nameId="info_reset_pass_1" class="wm_reg_12 wm_reg_border_1 wm_reg_text_1" style="display: none;">
						<div nameId="info_reset_pass_1_1" style="display: none;">
							Почта указана
						</div>												
					</div>
				</div>												
				
				<div class="window_main_menu_button_reg_1 button_gradient_1" nameId="act_reset_pass">
					Восстановить
				</div>
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
			
			this.elTitleReg.textContent = 'Авторизация';		
		}
		if(type === "reg_2") 
		{
			el.innerText = 'Зарегистрироваться';
			el.setAttribute("b_type", "reg_2");
			
			this.elTitleReg.textContent = 'Регистрация';
		}	
	}
	
	// переключение блоков авторизация/регистрация и восстановление пароля
	switchRegPass({type})
	{
		if(this.elUser.style.display === '')	// пользователь уже зарегался, показываем только блок "Вход выполнен"
		{
			this.container.style.display = '';
		}
		else if(type === 'reg')
		{
			this.changeMainMenuRegistMenuUI({type: 'reg_1'});
			this.elReg.style.display = '';
			this.elResetPass.style.display = 'none';				
		}
		else if(type === 'resetPass')
		{
			this.elTitleReg.textContent = 'Восстановление пароля';
			this.elReg.style.display = 'none';
			this.elResetPass.style.display = '';			
		}
	}


	

	// вход/регистрация пользователя (проверка правильности ввода данных почта/пароль)
	async checkRegDataIU()
	{
		//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
		var pattern_2 = /^[a-z0-9]{4,20}$/i;
		var mail = this.elReg.querySelector('[nameId="input_reg_mail"]');
		var pass = this.elReg.querySelector('[nameId="input_reg_pass"]');
		
		var inf_block = this.elReg.querySelector('[nameId="info_reg_1"]');
		var inf_str_1 = this.elReg.querySelector('[nameId="info_reg_1_1"]');
		var inf_str_2 = this.elReg.querySelector('[nameId="info_reg_1_2"]');
		
		inf_block.style.display = 'none';
		inf_str_1.style.display = 'none';
		inf_str_2.style.display = 'none';
		
		var flag_1 = false;
		var flag_2 = false;
		
		mail.value = mail.value.trim();	// удаляем пробелы  
		pass.value = pass.value.trim();	// удаляем пробелы 
		
		// проверка почты
		if(mail.value != '')
		{
			if(this.validateEmail(mail.value))
			{
				flag_1 = true;
			}
			else
			{
				inf_str_1.style.display = 'block';
				inf_str_1.innerText = 'Не верно указанна почта';			
			}
		}
		else
		{		
			inf_str_1.style.display = 'block';
			inf_str_1.innerText = 'Укажите e-mail';
		}
		
		
		// проверка пароля
		if(pass.value != '')
		{
			if(pattern_2.test(pass.value))
			{
				flag_2 = true;
			}
			else
			{
				inf_str_2.style.display = 'block';
				inf_str_2.innerHTML = 'Не верно указан пароль<br>(Только цифры и латинские буквы от 4 до 20 знаков)';			
			}
		}		
		else
		{		
			inf_str_2.style.display = 'block';
			inf_str_2.innerText = 'Укажите пароль';
		}
		
		
		// данные введены верно
		if(flag_1 && flag_2)
		{ 
			inf_block.style.display = 'none';
			
			var type = this.elReg.querySelector('[nameId="act_reg_1"]').getAttribute("b_type");
			
		
			var url = infProject.path+'components/regUser.php';					
			var response = await fetch(url, 
			{
				method: 'POST',
				body: 'type='+type+'&mail='+mail.value+'&pass='+pass.value,
				headers: 
				{	
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
				},				
			});	
			if(!response.ok) return;
			var data = await response.json();
		
		
			if(type=='reg_1')	// авторизация пользователя
			{
				if(data.success)
				{
					infProject.user.id = data.info.id;
					infProject.user.mail = data.info.mail;
					infProject.user.pass = data.info.pass;
					infProject.user.status = data.info.status;
					
					windUI.enterUser({id: infProject.user.id});
				}
				else
				{
					if(data.err.desc)
					{
						console.log(data.err.desc);
						inf_str_1.innerHTML = data.err.desc;
						
						inf_block.style.display = 'block';
						inf_str_1.style.display = 'block';
						inf_str_2.style.display = 'none';													
					}
				}
			}
			else if(type=='reg_2')	// регистрация нового пользователя
			{
				if(data.success)
				{
					inf_str_1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)";
					//inf_str_1.innerHTML = "Вы успешно зарегистрировались";						
					
					inf_block.style.display = 'block';
					inf_str_1.style.display = 'block';
					inf_str_2.style.display = 'none';												
				}
				else
				{						
					if(data.err.desc)
					{
						console.log(data.err.desc);
						inf_str_1.innerHTML = data.err.desc;
						
						inf_block.style.display = 'block';
						inf_str_1.style.display = 'block';
						inf_str_2.style.display = 'none';													
					}						
				}
			}				
		
		}
		else	// данные введены НЕ верно
		{  
			inf_block.style.display = 'block';
		}
	};



	// сброс пароля
	async resetPassRegIU()
	{
		//var pattern_1 = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
		var mail = this.elResetPass.querySelector('[nameId="input_reset_pass"]');
		
		var inf_block = this.elResetPass.querySelector('[nameId="info_reset_pass_1"]');
		var inf_str_1 = this.elResetPass.querySelector('[nameId="info_reset_pass_1_1"]');
		
		inf_block.style.display = 'none';
		inf_str_1.style.display = 'none';
		
		var flag_1 = false;
		var flag_2 = false;
		
		mail.value = mail.value.trim();	// удаляем пробелы  
		
		// проверка почты
		if(mail.value != '')
		{
			if(this.validateEmail(mail.value))
			{
				flag_1 = true;
			}
			else
			{
				inf_str_1.style.display = 'block';
				inf_str_1.innerText = 'Не верно указанна почта';			
			}
		}
		else
		{		
			inf_str_1.style.display = 'block';
			inf_str_1.innerText = 'Укажите e-mail';
		}
			
		
		// данные введены верно
		if(flag_1)
		{ 
			inf_block.style.display = 'none';
			
			var url = infProject.path+'components/resetPass_1.php';					
			var response = await fetch(url, 
			{
				method: 'POST',
				body: '&mail='+mail.value,
				headers: 
				{	
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
				},				
			});	
			if(!response.ok) return;
			var data = await response.json();
			
			if(data.success)
			{
				inf_str_1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту чтобы восстановить пароль<br>(если письмо не пришло посмотрите в папке спам)";
				//inf_str_1.innerHTML = "Вы успешно зарегистрировались";						
				
				inf_block.style.display = 'block';
				inf_str_1.style.display = 'block';												
			}
			else
			{						
				if(data.err.desc)
				{
					console.log(data.err.desc);
					inf_str_1.innerHTML = data.err.desc;
					
					inf_block.style.display = 'block';
					inf_str_1.style.display = 'block';												
				}						
			}				
			
		}
		else	// данные введены НЕ верно
		{  
			inf_block.style.display = 'block';
		}
	}
	
	validateEmail(email) 
	{
	  return String(email)
		.toLowerCase()
		.match(
		  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	}	

}







