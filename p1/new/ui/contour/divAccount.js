
// основное окно
class WindDivAccount
{
	container;
	elTitleReg;
	elReg;
	elResetPass;
	elUser;
	divSubsUser;
	divSubsTariff;
	
	init()
	{
		this.container = this.crContainer();
		this.elTitleReg = this.container.querySelector('[nameId="titleReg"]');
		
		this.elReg = this.crWindReg();
		this.elResetPass = this.crWindResetPass();
		this.elUser = this.crWindUser();
		this.divSubsUser = this.elUser.querySelector('[nameId="divSubsUser"]');
		this.divSubsTariff = this.elUser.querySelector('[nameId="divSubsTariff"]');
		
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
		const btnUserExit = this.elUser.querySelector('[nameId="btnUserExit"]');		// кнопка дективация авторизации
		
		btn1.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_1'}); }
		btn2.onmousedown = () => { this.changeMainMenuRegistMenuUI({type: 'reg_2'}); }		
		btnResPass.onmousedown = () => { this.switchRegPass({type: 'resetPass'}); }
		
		btnSendReg.onmousedown = () => { this.checkRegDataIU(); }
		btnSendReset.onmousedown = () => { this.resetPassRegIU(); }

		btnUserExit.onmousedown = () => { this.userExit(); }
	}

	html()
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
		`<div nameId="reg_content_2" style="display: block;">
			<div nameId="titleReg" style="${css1}"></div>
			<div nameId="contentReg"></div>		
		</div>`;																								
								

		return html;
	}


	htmlReg1()
	{
		const css1 =
		`display: block;
		width:80%;
		margin: auto;		
		border-radius: 3px;	
		font-size: 17px;
		color: #666;		
		line-height: 2em;
		padding: 0 10px;`;

		const css2 =
		`background-color:#ffffff;
		border:solid 1px #b3b3b3;  
		border-radius: 3px;`;

		const css3 =
		`margin: 30px auto 0 auto;
		padding: 20px;`;		
					
		const css4 =
		`height: 30px;
		width: auto;	
		border: 1px solid #ccc;
		border-bottom: none;
		background-color:#fff;
		cursor: pointer;`;
		
		const css5 =
		`margin:0.5em 15px;
		font-size: 14px;
		color: #666;
		text-align:center;`;

		const css6 =
		`position: relative;
		display: flex;
		margin: 10px;
		margin-bottom: 50px;
		border-bottom: 1px solid #ccc;`;	

		const css7 =
		`display: flex; 
		align-items: center;
		justify-content: center;
		width: 100px;
		font-size: 18px;
		color: #666;`;

		const css8 =
		`margin: 35px auto;
		max-width: 450px;			
		border: 1px solid #b3b3b3; 
		border-radius: 10px;
		background-color:#f1f1f1;`;

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
		`<div nameId="divReg" style="${css8}">
			<div style="${css6}">
				<div nameId="button_check_reg_1" style="${css4}">
					<div style="${css5}">
						вход
					</div>	
				</div>
				<div nameId="button_check_reg_2" style="${css4}">
					<div style="${css5}">
						регистрация
					</div>	
				</div>			
			</div>	
			
			<div style="display: flex; padding: 10px;">
				<div style="${css7}">
					почта
				</div>											
				<input style="${css1}" type="text" nameId="input_reg_mail" value="" placeholder="почта">
			</div>
			<div style="display: flex; padding: 10px;">
				<div style="${css7}">
					пароль
				</div>											
				<input style="${css1}" type="password" nameId="input_reg_pass" value="" placeholder="пароль">
			</div>
			
			<div style="display: flex; padding: 10px;">
				<div nameId="info_reg_1" style="display: none; ${css1} ${css2} ${css3} font-size: 17px; text-align:center;">
					<div nameId="info_reg_1_1" style="display: none;">
						Почта указана
					</div>
					<div nameId="info_reg_1_2" style="display: none;">
						Пароль указан
					</div>													
				</div>
			</div>
			
			<div nameId="btnResPass" style="margin: auto; width: 200px; text-align: center; font-size: 14px; color: #666; cursor: pointer; text-decoration: underline;">
				забыли пароль ?
			</div>
			
			<div nameId="act_reg_1" b_type="reg_1" class="button_gradient_1" style="${cssBtn}">
				Войти
			</div>
		</div>`;

		
		return html;
	}


	// html блок, когда авторизовались
	htmlReg2()
	{
		const css1 =
		`background-color:#ffffff;
		border:solid 1px #b3b3b3;  
		border-radius: 3px;`;
		
		const css2 =
		`margin: 30px auto 0 auto;
		width:70%;
		padding: 40px;
		font-size: 17px;`;		
		
		const btnLink = ` 
		margin: 5px 20px;
		padding: 10px 0;
		width: 250px;
		font-family: arial,sans-serif;
		font-size: 18px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		border-radius: 3px;
		background-color: #f1f1f1;
		cursor: pointer;`;		
  
		const html = `
		<div nameId="divUser" style="display: none;">												
			<div style="display: flex; flex-direction: column; align-items: center; ${css1} ${css2} font-size: 17px; text-align:center;">
				<div>Вы авторизовались.<br><br>Теперь вам доступно сохранение и загрузка проектов.</div> 
				
				<div nameId="divSubsUser"></div>
				
				<div nameId="divSubsTariff"></div>
				
				<div style="margin-top: 30px;">
					<div nameId="btnUserExit" style='${btnLink}'>Выйти</div>
				</div>				
			</div>
		</div>`;

		return html;
	}

	htmlResetPass()
	{
		const css1 =
		`display: block;
		width:80%;
		margin: auto;		
		border-radius: 3px;	
		font-size: 17px;
		color: #666;		
		line-height: 2em;
		padding: 0 10px;`;
		
		const css2 =
		`background-color:#ffffff;
		border:solid 1px #b3b3b3;  
		border-radius: 3px;`;		

		const css3 =
		`margin: 30px auto 0 auto;
		padding: 20px;`;
		
		const css4 =
		`display: flex; 
		align-items: center;
		justify-content: center;
		width: 100px;
		font-size: 18px;
		color: #666;`;	
		
		const css5 =
		`margin: 35px auto;
		max-width: 450px;			
		border: 1px solid #b3b3b3; 
		border-radius: 10px;
		background-color:#f1f1f1;`;
		
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
		
		const html = `
		<div nameId="divResetPass" class="window_main_menu_form_reg" style="display: none;">
			<div style="${css5}">
				
				<div style="display: flex; padding: 10px;">
					<div style="${css4}">
						почта
					</div>											
					<input style="${css1}" type="text" nameId="input_reset_pass" value="">
				</div>	

				<div style="display: flex; padding: 10px;">
					<div nameId="info_reset_pass_1" style="display: none; ${css2} ${css3} font-size: 17px; text-align:center;">
						<div nameId="info_reset_pass_1_1" style="display: none;">
							Почта указана
						</div>												
					</div>
				</div>												
				
				<div nameId="act_reset_pass" class="button_gradient_1" style="${cssBtn}">
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
					const token = data.info.token;
					const subs = data.subs;

					this.elReg.style.display = 'none';
					this.elUser.style.display = '';
					this.elTitleReg.textContent = 'Вход выполнен';
		
					windUI.enterUser({id: infProject.user.id});
					
					//myCookie.setCookie({token});
					
					this.crDivSubsUser({subs, token});
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
					inf_str_1.innerHTML = "на вашу почту отправлено письмо<br>зайдите в вашу почту и подтвердите регистрацию<br>(если письмо не пришло посмотрите в папке спам)";
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


	showUser()
	{
		this.elUser.style.display = '';
	}
	
	
	// если у пользователя была или есть подписка отображаем кол-во дней
	crDivSubsUser({subs, token})
	{
		this.divSubsUser.innerHTML = '';
		this.divSubsTariff.innerHTML = '';
		
		if(!subs) return;
		if(!token) return;
		
		const days = subs.days;
		
		this.divSubsUser.innerHTML = `<div style="margin-top: 40px;">Подписка оформлена на: ${days} (дней)</div>`;
		
		const divTariff = windDivSubs.crDivSubsTariff({token});
		this.divSubsTariff.append(divTariff); 
	}
	
	
	// дективация авторизации
	userExit()
	{
		//myCookie.deleteCookie();
		this.resetInfoUser();
		
		this.elUser.style.display = 'none';
		
		this.changeMainMenuRegistMenuUI({type: 'reg_1'});
		this.switchRegPass({type: 'reg'});
		
		windDivProjectLoad.showDivStartLoad();
		windDivProjectSave.showDivStartSave();
	}
	
	
	// сбрасываем настройки
	resetInfoUser()
	{
		infProject.user.id = null;
		infProject.user.mail = null;
		infProject.user.pass = null;
		infProject.user.status = null;
	}
}







