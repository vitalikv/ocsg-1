

class MyUiBlocksStats
{
	container;
	wrapBtn;
	wrapPanel;
	divInfo;
	
	
	init({container})
	{
		this.container = container;
		
		this.wrapBtn = this.crDiv({html: this.htmlBtn()});
		this.container.append(this.wrapBtn);

		
		this.wrapPanel = this.crDiv({html: this.htmlWrapPanel()});
		this.container.append(this.wrapPanel);
		
		this.divInfo = this.wrapPanel.querySelector('[nameId="divInfo"]');
		
		this.initEvent();
		
		this.hide();
	}
	

	crDiv({html})
	{
		const div = document.createElement('div');
		div.innerHTML = html;
		return div.children[0];	
	}	
	
	
	htmlBtn()
	{
		const cssBtn = 
		`margin: 0 10px 10px 10px;
		padding: 5px;
		font-size: 15px;
		color: #666;
		text-align: center;
		border: 1px solid #b3b3b3;
		background: #fff;
		cursor: pointer;
		user-select: none;`;
		
		const html = `<div nameId="btnStats" style="${cssBtn}">статистика</div>`;

		return html;
	}
	

	htmlWrapPanel()
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
				<div style="${divH1}">📊 Расчёт блоков</div>					
			</div>
			<div nameId="content" style="${body}">
				<div nameId="wrapInfo">
					<div style="display: flex; flex-direction: column; gap: 20px;">
						<div nameId="divInfo" style="display: flex; flex-direction: column; gap: 30px;"></div>
					</div>
				</div>
			</div>
			<div style="${footer}"></div>
		</div>`;

		return html;
	}

	initEvent()
	{
		this.wrapPanel.onmousedown = (e) => { this.closeWinOnWrap(e); }
		
		this.wrapBtn.onmousedown = () => { this.showWin(); }
		
		const btnClose = this.wrapPanel.querySelector('[nameId="btnCloseContent"]');
		btnClose.onmousedown = () => { this.closeWin(); }			
	}


	// закрываем окно кликнув в пустоту (в серый фон)
	closeWinOnWrap = (event) =>
	{ 
		if (this.wrapPanel === event.target) 
		{ 			 
			this.closeWin();
		}
	}

	showWin()
	{
		this.wrapPanel.style.display = 'flex';
	}
	
	closeWin()
	{
		this.wrapPanel.style.display = 'none';
	}
	
	
	show()
	{
		this.wrapBtn.style.display = '';
		//this.divInfo.innerHTML = '';
	}
	
	hide()
	{
		this.wrapBtn.style.display = 'none';
		this.divInfo.innerHTML = '';
		this.closeWin();
	}


	renderBlockStats({idLevel, statsByType}) 
	{
		const container = this.divInfo;

		const html = `<div style="display: flex; align-items: center; justify-content: center; height: 40px; font-size: 20px; color: #666; border: 1px solid #ccc; background: #f2f2f2;">Этаж ${idLevel+1}</div>`;
		const div = this.crDiv({html});	
		container.appendChild(div);
		
		
		statsByType.forEach((stat, index) => 
		{
			// Создаем контейнер для каждого типа блока
			const blockContainer = document.createElement("div");
			blockContainer.style.display = "flex";
			//blockContainer.style.gap = "20px";
			blockContainer.style.flexWrap = "wrap";
			blockContainer.style.borderBottom = "1px solid #eee";
			blockContainer.style.paddingBottom = "20px";

			// Добавляем заголовок с типом блока
			const title = document.createElement("div");
			title.textContent = `Блоки ${stat.type.length * 1000}×${stat.type.height * 1000}×${stat.type.width * 1000} [д×в×ш]`;
			title.style.cssText= 'width: 100%; font-size: 18px; color: #666;';
			blockContainer.appendChild(title);

			// Таблица для текущего типа блока
			const tableDiv = document.createElement("div");
			tableDiv.style.flex = "1 1 50%";
			tableDiv.style.minWidth = "300px";
			tableDiv.innerHTML = `
			<table style="width:100%;border-collapse:collapse;margin-top:10px;">
			<thead>
				<tr>
					<th style="border:1px solid #ccc;padding:8px;background:#f2f2f2;text-align:left;">Показатель</th>
					<th style="border:1px solid #ccc;padding:8px;background:#f2f2f2;">Кол-во (шт.)</th>
					<th style="border:1px solid #ccc;padding:8px;background:#f2f2f2;">Объём (м³)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td style="border:1px solid #ccc;padding:8px;">Всего блоков</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${stat.usedCount} шт.</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${Number(stat.totalVolume.toFixed(2))} м³</td>
				</tr>
				<tr>
					<td style="border:1px solid #ccc;padding:8px;">Целые блоки</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${stat.fullBlocks} шт.</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${Number(stat.fullVolume.toFixed(2))} м³</td>
				</tr>
				<tr>
					<td style="border:1px solid #ccc;padding:8px;">Целые блоки потраченные на обрезки</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${stat.usedFromLeftovers} шт.</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${Number(stat.usedFromLeftoversVolume.toFixed(2))} м³</td>
				</tr>
				<tr>
					<td style="border:1px solid #ccc;padding:8px;">Фрагменты (остатки)</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${stat.leftoverCount} шт.</td>
					<td style="border:1px solid #ccc;padding:8px;text-align:center;">${Number(stat.leftoverVolume.toFixed(2))} м³</td>
				</tr>
			</tbody>
			</table>`;
			blockContainer.appendChild(tableDiv);

			// Диаграмма для текущего типа блока
			const chartDiv = document.createElement("div");
			chartDiv.style.flex = "1 1 45%";
			chartDiv.style.minWidth = "300px";
			chartDiv.innerHTML = `
			<div style="display: flex; flex-direction: column; align-items: center;">
			<h4 style="margin: 0 0 10px 0;">Распределение объёма</h4>
			<canvas nameId="pie-chart" width="100" height="100"></canvas>
			<div nameId="legend" style="display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin-top:10px;"></div>
			</div>
			`;
			blockContainer.appendChild(chartDiv);

			container.appendChild(blockContainer);

			// Рисуем диаграмму для текущего типа блока
			this.renderPieChartForBlock(stat, chartDiv);
		});
	}

	
	renderPieChartForBlock(stat, chartDiv) 
	{
		const canvas = chartDiv.querySelector('[nameId="pie-chart"]');
		const ctx = canvas.getContext("2d");

		// Размеры canvas
		const width = canvas.width;
		const height = canvas.height;
		const centerX = width / 2;
		const centerY = height / 2;
		const radius = Math.min(width, height) / 2 * 0.8;

		// Очищаем canvas
		ctx.clearRect(0, 0, width, height);

		// Данные для диаграммы
		const data = [
			{ label: "Целые блоки", value: stat.fullVolume, color: "#4e79a7" },
			{ label: "Целые блоки на обрезки", value: stat.usedFromLeftoversVolume, color: "#f28e2b" },
			{ label: "Остатки", value: stat.leftoverVolume, color: "#e15759" }
		];

		const total = data.reduce((sum, item) => sum + item.value, 0);
		let startAngle = 0;

		const legendDiv = chartDiv.querySelector('[nameId="legend"]');
		legendDiv.innerHTML = "";

		data.forEach(item => 
		{
			if (item.value === 0) return; // Пропускаем нулевые значения

			const slice = (item.value / total) * 2 * Math.PI;

			// Рисуем сектор
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, startAngle, startAngle + slice);
			ctx.closePath();
			ctx.fillStyle = item.color;
			ctx.fill();

			// Легенда
			const legendItem = document.createElement("div");
			legendItem.style.display = "flex";
			legendItem.style.alignItems = "center";
			legendItem.style.gap = "5px";

			legendItem.innerHTML = `
			<span style="width:15px;height:15px;display:inline-block;background:${item.color};"></span>
			${item.label}: ${(item.value * 100 / total).toFixed(1)}% (${Number(item.value.toFixed(2))} м³)
			`;
			legendDiv.appendChild(legendItem);

			startAngle += slice;
		});
	}


}







