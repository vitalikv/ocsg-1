
// основное окно
class WindTabs 
{
	container;
	btnLoad;
	btnSave;
	
	
	constructor()
	{
		this.crTabs();
		this.getBtn();
	}
	
	crTabs()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		this.container = div.children[0];
	}
	
	getBtn()
	{
		this.btnAccount = this.container.querySelector('[nameId="btnAccount"]');
		this.btnLoad = this.container.querySelector('[nameId="btnLoad"]');
		this.btnSave = this.container.querySelector('[nameId="btnSave"]');
	}

	html()
	{
		const wrapTabs = `
		display: flex;
		flex-direction: column;`;
		
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
		
		
		const html = 
		`<div style='${wrapTabs}'>
			<div nameId="btnAccount" style='${btnLink}'>Учетная запись</div>
			<div nameId="btnLoad" style='${btnLink}'>Загрузить</div>
			<div nameId="btnSave" style='${btnLink}'>Сохранить</div>
			
			<div nameId="reset_scene_1" style='${btnLink} margin-top: 30px;'>Пустой проект</div>
			<a href="/" style='${btnLink}'>На главную</a>
		</div>`;

		return html;
	}

}







