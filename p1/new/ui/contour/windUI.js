
// основное окно
class WindUI 
{
	elMain;
	windTabs;
	windDivAccount;
	windDivProjectSave;
	windDivProjectLoad;
	
	constructor()
	{
		this.css();
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elMain = div.children[0];
		document.body.prepend(this.elMain);
		
		this.init();
		this.initEvent();
	}
	
	init()
	{
		const elBody = this.elMain.querySelector('[nameId="body"]');
		
		this.windTabs = new WindTabs();
		elBody.children[0].append(this.windTabs.container);
		
		
		this.windDivAccount = new WindDivAccount();
		this.windDivProjectSave = new WindDivProjectSave();
		this.windDivProjectLoad = new WindDivProjectLoad();
		
		elBody.children[1].append(this.windDivAccount.container);
		elBody.children[1].append(this.windDivProjectSave.container);
		elBody.children[1].append(this.windDivProjectLoad.container);
	}
	
	initEvent()
	{
		const btnMenu = document.querySelector('[nameId="btn_menu"]');
		btnMenu.onmousedown = () => { this.showWin(); }
		
		const btnClose = this.elMain.querySelector('[nameId="button_close_main_menu"]');
		btnClose.onmousedown = () => { this.closeWin(); }
		
		this.windTabs.btnAccount.onmousedown = () => 
		{ 
			this.hideContainers();
			this.windDivAccount.switchRegPass({type: 'reg'});			
			this.windDivAccount.container.style.display = '';			
		}
		this.windTabs.btnSave.onmousedown = () => { this.hideContainers(); this.windDivProjectSave.container.style.display = ''; }
		this.windTabs.btnLoad.onmousedown = () => { this.showTabProjectLoad(); }
		
		this.windDivProjectSave.btnAccount.onmousedown = () => 
		{ 
			this.hideContainers();
			this.windDivAccount.switchRegPass({type: 'reg'});			
			this.windDivAccount.container.style.display = '';			
		}
		
		this.windDivProjectLoad.btnAccount.onmousedown = () => 
		{ 
			this.hideContainers();
			this.windDivAccount.switchRegPass({type: 'reg'});			
			this.windDivAccount.container.style.display = '';			
		}		
	}
	
	showTabProjectLoad()
	{
		this.hideContainers(); 
		this.windDivProjectLoad.container.style.display = '';
	}
	
	// скрываем все блоки к контентом
	hideContainers()
	{
		this.windDivAccount.container.style.display = 'none';
		this.windDivProjectSave.container.style.display = 'none';
		this.windDivProjectLoad.container.style.display = 'none';
	}
	
	
	// user авторизовался, скрываем лишние блоки и показываем проекты
	enterUser({id})
	{
		this.windDivAccount.elReg.style.display = 'none';
		this.windDivAccount.elUser.style.display = '';
		this.windDivAccount.elTitleReg.textContent = 'Вход выполнен';

		this.windDivProjectSave.elInfoReg.innerHTML = '';
		this.windDivProjectLoad.elInfoReg.innerHTML = '';
		
		this.getListProject({id});
	}

	showWin()
	{
		this.elMain.style.display = 'flex';
	}
	
	closeWin()
	{
		this.elMain.style.display = 'none';
	}
	
	css()
	{
		var styles = `
		.window_main_menu_content_1
		{	
			position: relative;
			margin: 30px auto 0 0;
		}


		.window_main_menu_content_1_row
		{
			display: -webkit-box;
			display: flex;
		}

		.window_main_menu_content_1_column
		{
			display: -webkit-box;
			display: flex;
			flex-direction: column;
			-webkit-flex-direction: column;
		}

		.window_main_menu_content_1_column:nth-child(2) 
		{
			display: block;
			flex: 1 1 100%;
			/*background: orange;*/
		}

		.window_main_menu_content_1_item
		{
			margin: 5px 20px;
			padding: 10px 0;
			width: 250px;	
			
			font-family: arial,sans-serif;
			font-size: 18px;
			color: #666;
			text-decoration: none;
			text-align:  center;	
			
			border: 1px solid #b3b3b3; 
			border-radius: 3px;
			background-color:#f1f1f1;
			cursor: pointer;
		}


		.window_main_menu_content_1_h1
		{
			display: flex; /* Флексы */
			align-items: center; /* Выравнивание текста по вертикали */
			justify-content: center; /* Выравнивание текста по горизонтали */
			height: 50px;
			background-color:#f1f1f1;

			font-family: arial,sans-serif;
			font-size: 24px;
			color: #666;	
		}

		.window_main_menu_content_1_wrap_1
		{
			display: -webkit-box;
			display: flex;	
			
			position: absolute;
			right: 0;
			left: 0;	
		}


		.wm_save_inf_project
		{
			display: flex;
			flex-direction: column;
			-webkit-flex-direction: column;	
			align-items: center;
			justify-content: center;
			margin: 35px auto 0 auto;
			width: 300px;
			height: 180px;
			font-family: arial,sans-serif;
			font-size: 18px;
			color: #666;
			text-decoration: none;
			text-align: center;
		}


		.window_main_menu_content_block_1
		{
			display: flex; /* Флексы */
			align-items: center; /* Выравнивание текста по вертикали */
			justify-content: center; /* Выравнивание текста по горизонтали */
			flex-direction: column;
			-webkit-flex-direction: column;	
			
			position: relative;
			
			margin: 35px auto;
			width: 300px;	
			height: 280px;
			
			font-family: arial,sans-serif;
			font-size: 18px;
			color: #666;
			text-decoration: none;
			text-align:  center;	
			
			border: 1px solid #b3b3b3; 
			border-radius: 6px;
			box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
			background-color:#f1f1f1;
			cursor: pointer;
		}


		.window_main_menu_content_block_2
		{
			display: flex; /* Флексы */
			align-items: center; /* Выравнивание текста по вертикали */
			justify-content: center; /* Выравнивание текста по горизонтали */
			
			position: relative;
			
			margin: 35px auto;
			padding: 10px;
			width: 300px;	
			height: auto;
			
			font-family: arial,sans-serif;
			font-size: 18px;
			color: #666;
			text-decoration: none;
			text-align:  center;	
			
			border: 1px solid #b3b3b3; 
			border-radius: 6px;
			box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
			background-color:#f1f1f1;
			cursor: pointer;
		}


		.window_main_menu_form_reg_block_1
		{
			margin: 35px auto;
			max-width: 450px;
			
			border: 1px solid #b3b3b3; 
			border-radius: 10px;
			background-color:#f1f1f1;	
		}


		.window_main_menu_form_reg_top_1
		{
			position: relative;
			display: -webkit-box;
			display: flex;
			margin: 10px;
			margin-bottom: 50px;
			border-bottom: 1px solid #ccc;	
		}

		.window_main_menu_form_reg_top_1_block
		{
			height: 30px;
			width: auto;	
			border: 1px solid #ccc;
			border-bottom: none;
			background-color:#fff;
			cursor: pointer;
		}


		.window_main_menu_form_reg_top_1_block_text
		{
			margin:0.5em 15px;
			
			font-family: arial,sans-serif;
			font-size: 14px;
			color: #666;
			text-align:center;
		}


		.window_main_menu_form_reg_block_1_1
		{
			display: -webkit-box;
			display: flex;
			padding: 10px 10px;
		}

		.window_main_menu_form_reg_block_1_label
		{
			display: flex; /* Флексы */
			align-items: center; /* Выравнивание текста по вертикали */
			justify-content: center; /* Выравнивание текста по горизонтали */
			width: 100px;
			
			font-family: arial,sans-serif;
			font-size: 18px;
			color: #666;	
		}

		.input_form_reg
		{
			display: block;
			width:80%;
			margin: auto;
			
			border-radius: 3px;	
			font-family: arial,sans-serif;
			font-size: 17px;
			color: #666;
			
			line-height: 2em;
			padding: 0 10px;
		}

		.wm_reg_text_1
		{
			font:15px Arial, Helvetica, sans-serif;
			text-align:center;	
		}


		.wm_reg_12
		{
			margin: 30px auto 0 auto;
			padding: 20px;		
		}


		.wm_reg_13
		{
			margin: 30px auto 0 auto;
			width:70%;
			padding: 40px;
			font-size: 17px;
		}


		.wm_reg_border_1
		{
			background-color:#ffffff;
			border:solid 1px #b3b3b3; 
			-webkit-border-radius:3px;
			-moz-border-radius:3px; 
			border-radius: 3px;	
		}




		.window_main_menu_button_reg_1
		{
			width: auto;
			height: 20px; 
			margin: 10px;
			margin-top: 40px;
			text-decoration:none; 
			text-align:center; 
			padding:11px 11px; 
			border:solid 1px #b3b3b3; 
			-webkit-border-radius:3px;
			-moz-border-radius:3px; 
			border-radius: 3px; 
			font:18px Arial, Helvetica, sans-serif; 
			font-weight:bold; 
			color:#737373; 

			cursor: pointer;
		}

		.inf_butt_youtube_1
		{
			position: relative;
			width: 50px;	
		}

		.inf_contact
		{
			margin: 50px auto;
			
			max-width: 550px;
			height: 250px;		
			
			border: 1px solid #b3b3b3; 
			border-radius: 3px;
		}


		.inf_contact_text
		{
			display: flex; /* Флексы */
			align-items: center; /* Выравнивание текста по вертикали */
			justify-content: center; /* Выравнивание текста по горизонтали */

			margin: auto;
			width: 80%;
			height: 100%;
			
			font-family: arial,sans-serif;
			font-size: 25px;
			color: #666;	
		}


		.button_reset_pass_1
		{
			margin: auto;
			width: 200px;
			text-align: center;
			font-size: 14px;
			color: #666;
			font-family: arial,sans-serif;
			cursor: pointer;
			text-decoration: underline;	
		}


		@media screen and (max-width:850px), screen and (max-device-width:850px) 
		{
			.window_main_menu_content_1_item
			{
				width: 150px;
				font-size: 16px;
			}
			
			.window_main_menu_content_1_h1
			{
				font-size: 18px;	
			}
			
			.inf_contact
			{
				height: 150px;
				width: 90%;
			}	
			
			.inf_contact_text
			{
				font-size: 18px;	
			}	
		}`;

		var styleSheet = document.createElement("style")
		styleSheet.innerText = styles
		document.head.appendChild(styleSheet)		
	}

	html()
	{
		const wrapWind = `
		display: none;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;		
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;`;
		
		const divWind = ` 
		position: relative;
		margin: auto;
		width: 95%;
		height: 95%;			
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
		display: -webkit-box;
		display: flex;
		flex-direction: column;`;
		
		const btnClose = `
		position: absolute;
		width: 40px;
		height: 40px;
		top: 15px;
		right: 20px;
		transform: rotate(-45deg);
		font-family: arial,sans-serif;
		font-size: 70px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;`;
		

		const header = `
		height: 70px;
		min-height: 70px;
		background: #e8e8e8;
		border-radius: 8px 8px 0 0;
		border-bottom: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;`;


		const divH1 = `		
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 29px;
		margin-top: 0.3em;
		padding-left: 60px;
		font-family: arial,sans-serif;
		font-size: 24px;
		color: #666;`;

		const body = `
		position: relative;
		flex-grow: 1;
		display: flex;
		overflow: auto;
		height: 100%;`;
	
		const footer = `	
		height: 10px;
		min-height: 10px;
		background: #e8e8e8;
		border-radius: 0 0 8px 8px;
		border-top: 2px solid #f2f2f2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 30px;`;
		
		
		const html = 
		`<div nameId="background_main_menu" style="${wrapWind}">
			<div nameId="window_main_menu" style="${divWind}">
				<div nameId="button_close_main_menu" style="${btnClose}">
					+
				</div>
				<div style="${header}">
					<div style="${divH1}">
						Меню
					</div>					
				</div>
				<div nameId="body" style="${body}">
					<div></div>
					<div style="flex: 1 1 100%; flex-direction: column;"></div>
				</div>
				<div style="${footer}"></div>
			</div>				
		</div>`;

		return html;
	}



	// получаем с сервера список проектов принадлежащих пользователю
	async getListProject({id})
	{ 

		const url = infProject.path+'components/loadListProject.php';			
		
		const response = await fetch(url, 
		{
			method: 'POST',
			body: 'id='+id,
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});	

		if(!response.ok) return;
		const json = await response.json();
		
		
		let html_load = '';
		let html_save = '';
		
		const arr = [];
		let count = 1;
		
		if(infProject.user.status){ if(infProject.user.status == 'admin'){ count = 5; } }
		
		for(let i = 0; i < count; i++)
		{
			if(json[i]) { arr[arr.length] = json[i]; }
			else { arr[arr.length] = {id: 0, name: 'Пустой проект'}; }	
		}
		
		for(let i = 0; i < arr.length; i++)
		{
			let src_1 = `<div><div>${arr[i].name}</div><div style='margin-top: 10px;'>сохранить</div></div>`;
			let src_2 = `<div><div>${arr[i].name}</div><div style='margin-top: 10px;'>загрузить</div></div>`;
			
			if(arr[i].preview) 
			{
				src_1 = `			 
				<div style='margin: auto;'>${arr[i].name}</div>
				<img src="${arr[i].preview}" style="display: block; width: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;">
				<div style='margin: auto;'>сохранить</div>
				`;
				
				src_2 = `
				<div style='margin: auto;'>${arr[i].name}</div>
				<img src="${arr[i].preview}" style="display: block; width: 100%; margin: auto; -o-object-fit: contain; object-fit: contain;"> 			
				<div style='margin: auto;'>загрузить</div>
				`;			
			}


			html_save += `<div class="window_main_menu_content_block_1" style='background: #f0ebd1;' projectId="${arr[i].id}" nameId="save_pr_1">${src_1}</div>`;	
			html_load += `<div class="window_main_menu_content_block_1" style='background: #d1d9f0;' projectId="${arr[i].id}" nameId="load_pr_1">${src_2}</div>`;
		}		
		
		this.windDivProjectLoad.elInfoReg.innerHTML = html_load;
		this.windDivProjectSave.elInfoReg.innerHTML = html_save;

		const arrLoadEl = this.windDivProjectLoad.elInfoReg.querySelectorAll('[nameId="load_pr_1"]');
		const arrSaveEl = this.windDivProjectSave.elInfoReg.querySelectorAll('[nameId="save_pr_1"]');

		arrLoadEl.forEach((el)=> 
		{
			el.onmousedown = () => 
			{
				this.windDivProjectLoad.clickButtonLoadProjectUI(el);
				this.closeWin();
			}
		});	

		arrSaveEl.forEach((el)=> 
		{
			el.onmousedown = () => 
			{
				this.windDivProjectSave.clickButtonSaveProjectUI(el);
				this.getListProject({id: infProject.user.id});  // обновляем меню сохрание проектов
				this.closeWin();
			}
		});	
	}


}







