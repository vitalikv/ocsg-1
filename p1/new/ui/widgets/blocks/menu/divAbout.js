
// окно с обзором программы
class MyUIBlocksWindDivAbout
{
	container;
	content;
	
	init()
	{
		this.container = this.createDiv();
		//this.content = this.container.querySelector('[nameId="content"]');
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

		const cssVideo = 
		`width: 700px;
		height: 400px;`;
		
		const html = 
		`<div style="display: none;"> 
			<div style="${cssHeader}"><strong>3D калькулятор блоков с учетом обрезков</strong></div>

<section style="
  max-width: 900px;
  margin: 10px auto;
  padding: 0 30px 30px 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  color: #333;">

  <p style="
    font-size: 16px;
    line-height: 1.7;
    color: #555;
    margin-bottom: 20px;">
    Онлайн-сервис для точного расчета строительных блоков при возведении стен, с учётом окон, дверей и других проёмов.
    Сервис учитывает не только стандартные блоки, но и возможность повторного использования обрезков.
  </p>

  <!-- Таблица: Возможности -->
  <h3 style="${cssHeader}">
    Основные возможности
  </h3>
  <table style="
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
    font-size: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
    
    <thead style="background-color: #f2f2f2; color: #333;">
      <tr>
        <th style="padding: 12px; border-right: 1px solid #ddd; text-align: left;">Возможность</th>
        <th style="padding: 12px; text-align: left;">Описание</th>
      </tr>
    </thead>

    <tbody style="color: #555;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📐 Расчёт по проектным данным</strong></td>
        <td style="padding: 12px;">Ввод размеров стен, окон, дверей</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>🧱 Поддержка нескольких типов блоков</strong></td>
        <td style="padding: 12px;">Например: 0.6×0.3×0.3 м, 0.5×0.3×0.25 м и др.</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>✂️ Учет обрезанных блоков</strong></td>
        <td style="padding: 12px;">При резке блока остаётся кусок — он может быть использован в другом месте</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>♻️ Повторное использование обрезков</strong></td>
        <td style="padding: 12px;">Сервис старается использовать остатки вместо новых блоков</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📊 Отчет по каждому типу блока</strong></td>
        <td style="padding: 12px;">Сколько взято, сколько использовано полностью, из обрезков, осталось</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📈 Круговая диаграмма</strong></td>
        <td style="padding: 12px;">Визуализация использования объёмов (полностью / из обрезков / остатки)</td>
      </tr>
      <!--<tr>
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📄 Экспорт данных</strong></td>
        <td style="padding: 12px;">Таблицы и диаграммы можно сохранить в PDF или Excel</td>
      </tr>-->
    </tbody>
  </table>

  <!-- Таблица: Преимущества -->
  <h3 style="${cssHeader}">
    Преимущества сервиса
  </h3>
  <table style="
    width: 100%;
    border-collapse: collapse;
    font-size: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);">

    <thead style="background-color: #f2f2f2; color: #333;">
      <tr>
        <th style="padding: 12px; border-right: 1px solid #ddd; text-align: left;">Преимущество</th>
        <th style="padding: 12px; text-align: left;">Почему это важно</th>
      </tr>
    </thead>

    <tbody style="color: #555;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📉 Снижение отходов</strong></td>
        <td style="padding: 12px;">За счет учета обрезков и их повторного использования</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>💰 Экономия бюджета</strong></td>
        <td style="padding: 12px;">Меньше закупок, меньше отходов — ниже общая стоимость проекта</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📦 Гибкость</strong></td>
        <td style="padding: 12px;">Работа с разными типами блоков</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>🖥️ Онлайн-доступ</strong></td>
        <td style="padding: 12px;">Не нужно устанавливать программу — работает в браузере</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📊 Наглядность</strong></td>
        <td style="padding: 12px;">Таблицы + диаграммы показывают результаты сразу</td>
      </tr>
      <!--<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>🛠️ Интеграция с CSG (опционально)</strong></td>
        <td style="padding: 12px;">Можно подключить к 3D-моделям стен и проемов</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-right: 1px solid #ddd;"><strong>📁 Экспорт и печать</strong></td>
        <td style="padding: 12px;">Просто подготовить отчет для заказчика или бригады</td>
      </tr>-->
    </tbody>
  </table>

  <!-- Информационный блок -->
  <div style="
    margin-top: 30px;
    padding: 15px 20px;
    background-color: #ecf7ff;
    border-left: 5px solid #4e79a7;
    font-size: 15px;
    color: #333;">
    💡 Сервис рассчитает не только количество, но и объемы: целые блоки, обрезки, использованные из остатков, и непримененные куски.
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
}







