
// окно с обзором программы
class MyUIBlocksWindInstruction
{
	container;
	content;
	
	init()
	{
		this.container = this.createDiv({html: this.html_1()});
		this.content = this.container.querySelector('[nameId="content"]');
		
		this.initEvent();
	}
	
	createDiv({html})
	{
		const div = document.createElement('div');
		div.innerHTML = html;
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
		
const html = 
`<div style="display: none;">
    <div style="${cssHeader}">
        <strong>Инструкция</strong>
    </div>

    <section nameId="content" style="color: #444; padding: 0 25px 25px; max-width: 800px; margin: auto; line-height: 1.6;">

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">1</span>
                Создание проекта
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Перейдите во вкладку <strong style="color: #404040;">«Планировка»</strong></li>
                <li>Создайте схему помещения или здания</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameId="" src="${infProject.path}img/widgets/blocks/menu/1.png" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 1 - Интерфейс модуля планировки</div>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">2</span>
                Переход к расчету блоков
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li>После создания проекта выберите в меню вкладку <strong style="color: #404040;">«Расчет блоков»</strong></li>
            </ul>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">3</span>
                Настройка параметров
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">В правой панели откройте вкладку <strong style="color: #404040;">«Настройки»</strong>:</li>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li style="margin-bottom: 5px;">Укажите типоразмеры блоков (единые для всех стен или индивидуальные)</li>
                    <li>Задайте толщину растворного шва (учитывается для всех стен)</li>
                </ul>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameId="" src="${infProject.path}img/widgets/blocks/menu/2.png" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 2 - Панель параметров расчета</div>
        </div>

        <div style="margin-top: 25px; border-bottom: 1px solid #e1e1e1; padding-bottom: 15px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">4</span>
                Выполнение расчета
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Перейдите во вкладку <strong style="color: #404040;">«Расчет»</strong></li>
                <li style="margin-bottom: 6px;">Нажмите кнопку <strong style="color: #404040;">«Рассчитать»</strong></li>
                <li>Система визуализирует блоки в 3D-модели</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameId="" src="${infProject.path}img/widgets/blocks/menu/3.png" style="max-width: 100%; height: auto; cursor: pointer;">
			<img nameId="" src="${infProject.path}img/widgets/blocks/menu/4.png" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 3 - Визуализация результатов расчета</div>
        </div>

        <div style="margin-top: 25px;">
            <div style="font-weight: 600; color: #333; font-size: 17px; margin-bottom: 12px; display: flex; align-items: center;">
                <span style="background: #505050; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 14px;">5</span>
                Анализ результатов
            </div>
            <ul style="padding-left: 20px; margin: 10px 0 0 0;">
                <li style="margin-bottom: 6px;">Для детальной информации нажмите <strong style="color: #404040;">«Статистика»</strong>:</li>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li style="margin-bottom: 5px;">Таблицы с количеством блоков по категориям</li>
                    <li>Графики и дополнительные метрики расхода материалов</li>
                </ul>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0; background: #fafafa; padding: 15px; border: 1px solid #eaeaea;">
            <img nameId="" src="${infProject.path}img/widgets/blocks/menu/5.png" style="max-width: 100%; height: auto; cursor: pointer;">
            <div style="font-size: 13px; color: #777; margin-top: 8px;">Рис. 4 - Детальная статистика материалов</div>
        </div>

        <div style="margin-top: 30px; background: #f5f5f5; padding: 20px; border-radius: 2px; text-align: center; border-left: 4px solid #505050;">
            <div style="font-weight: 600; color: #333; font-size: 16px;">Расчет завершен</div>
            <p style="margin: 10px 0 0; color: #555;">Теперь вы можете использовать точные данные для закупки материалов и строительства</p>
        </div>

    </section>
</div>`;

		return html;
	}
	

	// показываем (обзор на программу)
	show()
	{
		this.container.style.display = '';
	}


	initEvent()
	{
		const imgs = this.content.querySelectorAll('img[nameId]');

		imgs.forEach(img => {
			this.crEventClickOnImg({img});
		});
		
		console.log(222, imgs);
	}
	

	htmlWrapBigImg()
	{
		const css1 =	
		`display: flex;
		position: fixed;
		inset: 0px;
		background-color: rgba(0, 0, 0, 0.5);
		font-family: arial, sans-serif;
		color: rgb(102, 102, 102);
		z-index: 100;`;

		const htmlDivPanel = this.htmlDivPanel();
		
		const html = `<div nameId="wrapPanel" style="${css1}">${htmlDivPanel}</div>`;
		
		return html;
	}


	htmlDivPanel() 
	{
		const wrapWind = `
		display: none;
		position: fixed;
		left: 0; right: 0; top: 0; bottom: 0;
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
		box-shadow: 0 4px 10px 0 rgba(0,0,0,0.5);
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
		height: 100%;
		padding: 10px;`;

		const footer = `	
		height: 10px;
		min-height: 10px;
		background: #e8e8e8;
		border-top: 2px solid #f2f2f2;`;

		// === Две колонки: таблица слева, диаграмма справа
		const html = `
		<div style="${divWind}">
			<div nameId="btnCloseContent" style="${btnClose}">+</div>
				<div style="${header}">
				<div style="${divH1}">Изображение</div>					
			</div>
			<div nameId="content" style="${body}">
				
			</div>
			<div style="${footer}"></div>
		</div>`;

		return html;
	}	


	crEventClickOnImg({img})
	{
		const closeWin = (wind) =>
		{
			document.body.removeChild(wind);
		}		
		
		// закрываем окно кликнув в пустоту (в серый фон)
		const closeWinOnWrap = (event, wind) =>
		{ 
			if (wind === event.target) 
			{ 			 
				closeWin(wind);
			}
		}		
		
		img.onmousedown = (e) => 
		{ 
			const wind = this.createDiv({html: this.htmlWrapBigImg()});
			document.body.append(wind);

			wind.onmousedown = (e) => { closeWinOnWrap(e, wind); }
			
			const btnClose = wind.querySelector('[nameId="btnCloseContent"]');
			btnClose.onmousedown = () => { closeWin(wind); }			
			
			const wrapImg = wind.querySelector('[nameId="content"]');
			wrapImg.innerHTML = `<img nameId="" src="${img.src}" style="max-width: 100%; height: auto; cursor: pointer;">`;
		}		
	}
}







