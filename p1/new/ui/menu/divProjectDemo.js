
// окно демо проектами
class WindDivProjectDemo
{
	container;
	content;
	wrapDemo;
	
	init()
	{
		this.container = this.createDiv();
		this.content = this.container.querySelector('[nameId="content"]');
		this.wrapDemo = this.content.querySelector('[nameId="wrapDemo"]');
	}
	
	createDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html_1();
		return div.children[0];		
	}	
	
	html_1()
	{
		const cssHeader = 
		`display: flex; 
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 17px;
		color: #666;`;

		const cssContent = 
		`width: 700px;
		height: 400px;`;
		
		const cssInfo = 
		`display: grid; 
		grid-template-columns: auto auto auto;
		justify-content: center;
		align-items: center;`;		
		
		const html = 
		`<div style="display: none;"> 
			<div style="${cssHeader}">Демо проекты</div>
			<div nameId="content" style="${cssContent}">
				<div nameId="wrapDemo" style="width: 100%; height: 100%; ${cssInfo}"></div>
			</div>
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
		margin: 35px;
		width: 150px;
		height: 150px;
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
			 
	
	// кнопки загрузки демо проектов
	initEvent()
	{		
		const btnPr1 = this.wrapDemo.querySelector('[nameId="strPr_1"]');
		const btnPr2 = this.wrapDemo.querySelector('[nameId="strPr_2"]');
		const btnPr3 = this.wrapDemo.querySelector('[nameId="strPr_3"]');
		const btnPr4 = this.wrapDemo.querySelector('[nameId="strPr_4"]');
		
		btnPr1.onmousedown = () => { windUI.closeWin(); loadFile({json: 'demo/1.json'}); }
		btnPr2.onmousedown = () => { windUI.closeWin(); loadFile({json: 'demo/2.json'}); }
		btnPr3.onmousedown = () => { windUI.closeWin(); loadFile({json: 'demo/3.json'}); }
		btnPr4.onmousedown = () => { windUI.closeWin(); loadFile({json: 'demo/4.json'}); }		
	}	

	// показываем демо проекты
	showDivDemo()
	{
		// первое открытие
		if(this.wrapDemo.innerHTML === '')
		{
			const htmlPr_1 = this.html_2({text: 'Гараж', nameId: 'strPr_1', src: 'demo/demo_1.jpg'});
			const htmlPr_2 = this.html_2({text: 'Одноэтажный дом', nameId: 'strPr_2', src: 'demo/demo_2.jpg'});
			const htmlPr_3 = this.html_2({text: 'Двухэтажный дом', nameId: 'strPr_3', src: 'demo/demo_3.jpg'});
			const htmlPr_4 = this.html_2({text: 'Трехэтажный дом', nameId: 'strPr_4', src: 'demo/demo_4.jpg'});											
			
			this.wrapDemo.innerHTML = 
			`${htmlPr_1}
			${htmlPr_2}
			${htmlPr_3}
			${htmlPr_4}`;

			this.initEvent();
		}		
	}		
}







