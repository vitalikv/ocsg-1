
// основное окно
class WindUI 
{
	elMain;


	init()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elMain = div.children[0];
		document.body.prepend(this.elMain);
		
		const elBody = this.elMain.querySelector('[nameId="body"]');
		
		
		elBody.children[0].append(windTabs.container);		
		
		elBody.children[1].append(windDivAbout.container);
		elBody.children[1].append(windDivAccount.container);
		elBody.children[1].append(windDivProjectLoad.container);
		elBody.children[1].append(windDivProjectSave.container);		
		elBody.children[1].append(windDivProjectDemo.container);
		
		this.initEvent();
		
		this.hideContainers();
		windDivProjectDemo.showDivDemo();
		windDivProjectDemo.container.style.display = ''; 	
	}
	
	initEvent()
	{
		this.elMain.onmousedown = (e) => { this.closeWinOnWrap(e); }
		
		const btnMenu = document.querySelector('[nameId="btn_menu"]');
		btnMenu.onmousedown = () => { this.showWin(); }
		
		const btnClose = this.elMain.querySelector('[nameId="button_close_main_menu"]');
		btnClose.onmousedown = () => { this.closeWin(); }			
	}
	
	showTabProjectLoad()
	{
		this.hideContainers(); 
		windDivProjectLoad.container.style.display = '';
	}
	
	// скрываем все блоки к контентом
	hideContainers()
	{
		windDivAbout.container.style.display = 'none';
		windDivAccount.container.style.display = 'none';
		windDivProjectSave.container.style.display = 'none';
		windDivProjectLoad.container.style.display = 'none';
		windDivProjectDemo.container.style.display = 'none';
	}
	
	
	// user авторизовался, скрываем лишние блоки и показываем проекты
	enterUser({id})
	{
		windDivProjectSave.elInfoReg.innerHTML = '';
		windDivProjectLoad.elInfoReg.innerHTML = '';
		
		this.getListProject({id, typeInfo: 'load'});
	}
	

	showWin()
	{
		this.elMain.style.display = 'flex';
	}
	
	closeWin()
	{
		this.elMain.style.display = 'none';
	}

	// закрываем окно кликнув в пустоту (в серый фон)
	closeWinOnWrap = (event) =>
	{ 
		if (this.elMain === event.target) 
		{ 			 
			this.closeWin();
		}
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
		font-family: arial,sans-serif;
		color: #666;
		z-index: 100;`;
		
		const divWind = ` 
		position: relative;
		margin: auto;
		width: 900px;
		height: 600px;			
		background: white;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;`;
		
		const btnClose = `
		position: absolute;
		width: 20px;
		height: 20px;
		top: 10px;
		right: 10px;
		transform: rotate(-45deg);
		font-size: 30px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;`;
		

		const header = `
		height: 40px;
		background: #e8e8e8;
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
		padding-left: 20px;
		font-size: 18px;
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

	
	crDiv({html})
	{
		let div = document.createElement('div');
		div.innerHTML = html;

		return div.children[0];
	}

	// получаем с сервера список проектов принадлежащих пользователю
	async getListProject({id, typeInfo = 'load'})
	{ 
		this.infoWaitMessage({typeInfo});
		
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
		
		const arr = [];
		let count = 1;
		
		if(infProject.user.status){ if(infProject.user.status == 'admin'){ count = 5; } }
		
		for(let i = 0; i < count; i++)
		{
			if(json[i]) { arr[arr.length] = json[i]; }
			else { arr[arr.length] = {id: 0, name: 'Пустой проект'}; }	
		}

		const css1 = 
		`display: flex; 
		align-items: center; 
		justify-content: space-between;
		flex-direction: column;
		position: relative;		
		margin: 35px;
		width: 150px;	
		height: 150px;
		font-size: 14px;
		color: #666;
		text-decoration: none;
		text-align: center;			
		border: 1px solid #b3b3b3; 
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
		background:#f1f1f1;
		cursor: pointer;`;

		const cssName = `margin: 20px auto 0 auto;`;
		const cssBtn = `margin: 0 auto 20px auto; padding: 10px; border: 1px solid #b3b3b3; cursor: pointer; user-select: none;`;
		
		windDivProjectLoad.elInfoReg.innerHTML = '';
		windDivProjectSave.elInfoReg.innerHTML = '';	
		
		for(let i = 0; i < arr.length; i++)
		{
			let src_1 = `<div style="${cssName}">${arr[i].name}</div><div class="button_gradient_1" style="${cssBtn}">сохранить</div>`;
			let src_2 = `<div style="${cssName}">${arr[i].name}</div><div class="button_gradient_1" style="${cssBtn}">загрузить</div>`;

			const htmlBtnSave = `<div style="${css1} background: #f0ebd1;">${src_1}</div>`;	
			const htmlBtnLoad = `<div style="${css1} background: #d1d9f0;">${src_2}</div>`;
			
			const divBtnSave = this.crDiv({html: htmlBtnSave});
			const divBtnLoad = this.crDiv({html: htmlBtnLoad});

			// событие когда кликнули кнопку сохранить проект
			divBtnSave.onmousedown = async () => 
			{
				const data = await windDivProjectSave.clickButtonSaveProjectUI({projectId: arr[i].id});
				this.infoSaveProject({data});
				
				this.getListProject({id: infProject.user.id, typeInfo: 'save'});  // обновляем меню сохрание проектов
				//this.closeWin();
			}
			
			// событие когда кликнули кнопку загрузить проект
			divBtnLoad.onmousedown = () => 
			{
				windDivProjectLoad.clickButtonLoadProjectUI({projectId: arr[i].id});
				this.closeWin();
			}			
			
			windDivProjectSave.elInfoReg.append(divBtnSave);
			windDivProjectLoad.elInfoReg.append(divBtnLoad);
		}		
	}

	// пока не загрузился список проектов, выводим информационный блок (что нужно подождать)
	infoWaitMessage({typeInfo = 'load'})
	{
		const cssInf =
		`margin: 30px auto 0 auto;
		width: 70%;
		padding: 40px;
		font-size: 17px;
		text-align: center;
		border: solid 1px #b3b3b3;`;
		
		let textInfo = 'Подождите, идет загрузка списка проектов.';
		if(typeInfo === 'save') textInfo = 'Подождите, идет сохранение проекта.';
	
		windDivProjectLoad.elInfoReg.innerHTML = `<div style="${cssInf}">${textInfo}</div>`;
		windDivProjectSave.elInfoReg.innerHTML = `<div style="${cssInf}">${textInfo}</div>`;		
	}
	
	// сообщение после сохранения проекта (удачно или нет)
	infoSaveProject({data})
	{
		let result = false;
		if(data && data.success) result = true;
		
		if(result)
		{
			console.log(data, 'успех');
		}
		else
		{
			console.log(data, 'ошибка');
		}
	}
}







