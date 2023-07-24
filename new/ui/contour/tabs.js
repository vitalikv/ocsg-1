
// основное окно
class WindTabs 
{
	elTabs;
	
	constructor()
	{
		this.crTabs();
	}
	
	crTabs()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		this.elTabs = div.children[0];
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
			<div nameId="button_main_menu_reg_1" style='${btnLink}'>Учетная запись</div>
			<a href="/" style='${btnLink}'>Главная страница</a>
			<div nameId="reset_scene_1" style='${btnLink}'>Пустой проект</div>
			<div nameId="button_load_1" style='${btnLink}'>Загрузить</div>
			<div nameId="button_save_1" style='${btnLink}'>Сохранить</div>
			<div nameId="button_help" style='${btnLink}'>Видеоинструкция</div>
			<div nameId="button_contact" style='${btnLink}'>Контакты</div>
		</div>`;

		return html;
	}

}







