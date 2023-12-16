
// стартовое окно (с выбором что делать, показать демо проект, открыть пустой и т.д.)
class StartWind 
{
	elMain;
	wrapBtnsTitle;
	wrapBtnsProject;
	wrapVideo;
	
	
	constructor()
	{
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elMain = div.children[0];
		document.body.prepend(this.elMain);
		
		this.initEvent();
	}
	
	initEvent()
	{
		const btnClose = this.elMain.querySelector('[nameId="button_close_main_menu"]');
		btnClose.onmousedown = () => { this.closeWin(); }		
		this.elMain.onmousedown = (e) => { this.closeWinOnWrap(e); }		

		this.wrapBtnsTitle = this.elMain.querySelector('[nameId="btnsTitle"]');
		this.wrapBtnsProject = this.elMain.querySelector('[nameId="btnsProject"]');
		this.wrapVideo = this.elMain.querySelector('[nameId="wrapVideo"]');		
		
		this.initEventBtnsTitle();
	}
	
	
	// главные стартовые кнопки
	initEventBtnsTitle()
	{
		const btn1 = this.elMain.querySelector('[nameId="strw_1"]');
		const btn2 = this.elMain.querySelector('[nameId="strw_2"]');
		const btn3 = this.elMain.querySelector('[nameId="strw_3"]');
		const btn4 = this.elMain.querySelector('[nameId="strw_4"]');
		
		btn1.onmousedown = () => { this.closeWin(); }
		btn2.onmousedown = () => { this.closeWin(); windUI.showWin(); windUI.showTabProjectLoad(); }
		btn3.onmousedown = () => { this.hideBtnsTitle(); this.showBtnsProject(); }
		btn4.onmousedown = () => { this.hideBtnsTitle(); this.showVideo(); }		
	}
	
	
	// кнопки загрузки демо проектов
	initEventBtnsProject()
	{
		const btnBack1 = this.wrapBtnsProject.querySelector('[nameId="btnBack_1"]');
		btnBack1.onmousedown = () => { this.hideBtnsProject(); this.showBtnsTitle(); }		
		
		const btnPr1 = this.wrapBtnsProject.querySelector('[nameId="strPr_1"]');
		const btnPr2 = this.wrapBtnsProject.querySelector('[nameId="strPr_2"]');
		const btnPr3 = this.wrapBtnsProject.querySelector('[nameId="strPr_3"]');
		const btnPr4 = this.wrapBtnsProject.querySelector('[nameId="strPr_4"]');
		
		btnPr1.onmousedown = () => { this.closeWin(); loadFile({json: 'demo/1.json'}); }
		btnPr2.onmousedown = () => { this.closeWin(); loadFile({json: 'demo/2.json'}); }
		btnPr3.onmousedown = () => { this.closeWin(); loadFile({json: 'demo/3.json'}); }
		btnPr4.onmousedown = () => { this.closeWin(); loadFile({json: 'demo/4.json'}); }		
	}
	
	
	html()
	{
		const wrapWind = `
		display: flex;
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
		width: 800px;
		height: 500px;		
		background: white;
		box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);
		display: -webkit-box;
		display: flex;
		flex-direction: column;`;
		
		const btnClose = `
		position: absolute;
		width: 20px;
		height: 20px;
		top: 10px;
		right: 10px;
		transform: rotate(-45deg);
		font-family: arial,sans-serif;
		font-size: 30px;
		text-align: center;
		text-decoration: none;
		line-height: 0.6em;
		color: #666;
		cursor: pointer;`;
		

		const header = `
		height: 40px;
		min-height: 40px;
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
		font-family: arial,sans-serif;
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
		
		const htmlBtn_1 = this.html_1({text: 'Новый проект', nameId: 'strw_1'});
		const htmlBtn_2 = this.html_1({text: 'Загрузить свой проект', nameId: 'strw_2'});
		const htmlBtn_3 = this.html_1({text: 'Загрузить демо проект', nameId: 'strw_3'});
		const htmlBtn_4 = this.html_1({text: 'Видеообзор программы', nameId: 'strw_4'});
		
		const html = 
		`<div nameId="background_main_menu" style="${wrapWind}">
			<div nameId="window_main_menu" style="${divWind}">
				<div nameId="button_close_main_menu" style="${btnClose}">
					+
				</div>
				<div style="${header}">
					<div style="${divH1}">
						Планировщик дома
					</div>					
				</div>
				<div nameId="body" style="${body}">					
					<div nameId="btnsTitle" style="display: flex; flex: 1 1 100%; align-items: center; justify-content: center;">
						${htmlBtn_1}
						${htmlBtn_2}
						${htmlBtn_3}
						${htmlBtn_4}
					</div>
					
					<div nameId="btnsProject" style="display: none; margin: auto;"></div>
					
					<div nameId="wrapVideo" style="display: none; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;"></div>
				</div>
				<div style="${footer}"></div>
			</div>				
		</div>`;

		return html;
	}
	
	// кнопка стартового раздела
	html_1({text = '', nameId = ''})
	{
		const css = `
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		margin: auto 5px;
		width: 150px;
		height: 150px;
		font-family: arial,sans-serif;
		font-size: 16px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
		background-color: #f1f1f1;
		cursor: pointer;`;
		
		
		const html = 
		`<div style="${css}" nameId="${nameId}">
			<div>${text}</div>			
		</div>`;

		return html;
	}	


	// кнопка демо проекта
	html_2({text = '', nameId = '', src = ''})
	{
		const css = `
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		margin: auto 5px;
		width: 150px;
		height: 150px;
		font-family: arial,sans-serif;
		font-size: 16px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
		background-color: #f1f1f1;
		cursor: pointer;`;
		

		const cssImg = `
		display: block;
		width: 140px;
		height: 110px;
		margin: auto;`;
  
		const html = 
		`<div style="${css}" nameId="${nameId}">
			<img src="${infProject.path}${src}" style="${cssImg}">
			<div style="margin: auto;">${text}</div>			
		</div>`;

		return html;
	}
	

	// кнопка назад
	htmlBtnBack({text = '', nameId = ''})
	{
		const css = `
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		margin: 0 0 55px 5px;
		width: 150px;
		height: 30px;
		font-family: arial,sans-serif;
		font-size: 16px;
		color: #666;
		text-decoration: none;
		text-align: center;
		border: 1px solid #b3b3b3;
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #fff;
		background-color: #f1f1f1;
		cursor: pointer;`;
		
		
		const html = `
		<div style="position: absolute; top: 50px;">
			<div style="${css}" nameId="${nameId}">${text}</div>
		</div>`;

		return html;
	}
	

	// показываем кнопки со стартового окна
	showBtnsTitle()
	{
		this.wrapBtnsTitle.style.display = 'flex';
	}	
	
	// скрываем кнопки со стартового окна
	hideBtnsTitle()
	{
		this.wrapBtnsTitle.style.display = 'none';
	}

	// показываем кнопки с демо проектами
	showBtnsProject()
	{
		// первое открытие
		if(this.wrapBtnsProject.innerHTML === '')
		{
			const htmlPr_1 = this.html_2({text: 'Гараж', nameId: 'strPr_1', src: 'demo/demo_1.jpg'});
			const htmlPr_2 = this.html_2({text: 'Одноэтажный дом', nameId: 'strPr_2', src: 'demo/demo_2.jpg'});
			const htmlPr_3 = this.html_2({text: 'Двухэтажный дом', nameId: 'strPr_3', src: 'demo/demo_3.jpg'});
			const htmlPr_4 = this.html_2({text: 'Трехэтажный дом', nameId: 'strPr_4', src: 'demo/demo_4.jpg'});					
			const htmlBtnBack_1 = this.htmlBtnBack({text: 'назад', nameId: 'btnBack_1'});			
			
			
			this.wrapBtnsProject.innerHTML = 
			`${htmlBtnBack_1}
			<div style="display: flex;">
				${htmlPr_1}
				${htmlPr_2}
				${htmlPr_3}
				${htmlPr_4}
			</div>`;

			this.initEventBtnsProject();
		}		
		
		this.wrapBtnsProject.style.display = '';
	}	
	
	// скрываем кнопки  демо проектами
	hideBtnsProject()
	{
		this.wrapBtnsProject.style.display = 'none';
	}	


	// показываем видео (обзор на программу)
	showVideo()
	{
		// первое открытие
		if(this.wrapVideo.innerHTML === '')
		{
			const ht = `https:/`;
			const video = `${ht}/www.youtube.com/embed/1hV98LTygwk`;
			this.wrapVideo.innerHTML = `<iframe width="100%" height="100%" src="${video}" frameborder="0" allowfullscreen></iframe>`;			
		}
		
		this.wrapVideo.style.display = '';
	}
	
	
	hideVideo()
	{
		this.wrapVideo.style.display = 'none';
	}
	
	
	// закрываем окно
	closeWin()
	{
		this.elMain.style.display = 'none';
		
		this.elMain.innerHTML = '';
	}
	
	// закрываем окно кликнув в пустоту (в серый фон)
	closeWinOnWrap = (event) =>
	{ 
		if (this.elMain === event.target) 
		{ 			 
			this.closeWin()
		}
	}	
	
}







