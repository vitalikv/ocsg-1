

class MyUiBlocksSize
{
	container;
	wrapDiv;

	inputSizeX;
	inputSizeY;
	inputSizeZ;
		
	
	init({container})
	{
		this.container = container;
		
		this.wrapDiv = this.crDiv();
		this.container.append(this.wrapDiv);
		this.hide();
		
		this.inputSizeX = this.wrapDiv.querySelector('[nameId="inputSizeObjX"]');
		this.inputSizeY = this.wrapDiv.querySelector('[nameId="inputSizeObjY"]');
		this.inputSizeZ = this.wrapDiv.querySelector('[nameId="inputSizeObjZ"]');
	}
	

	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlWrapBlockSize();
		return div.children[0];	
	}	
	
	
	htmlWrapBlockSize()
	{
		const htmlInputSize = this.htmlInputSize();
		
		const css1 = `display: flex; align-items: center;`;
		
		const html =
		`<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
			<div style="${css1}">
				<div>Размер блока для выделенной стены (мм)</div>						
			</div>
			<div nameId="wrapInputSize">${htmlInputSize}</div>
		</div>`;

		return html;
	}
	
	htmlInputSize()
	{
		const css1 = `pointer-events: none; user-select: none; cursor: default; background-color: #f0f0f0;`;
		
		const html = 
		`<div style="display: -webkit-box; display: flex; margin-top: 20px; font-size: 12px;">
			<div style="display: -webkit-box; display: flex;">
				<div>
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Длина</div>
					<div class="wr_input_1" nameId="wrInputSizeObjX">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjX" value="">
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Высота</div>
					<div class="wr_input_1" nameId="wrInputSizeObjY">
						<div class="flex_1">
							<input type="text" class="input_1" nameId="inputSizeObjY" value="">
						</div>
					</div>
				</div>
				<div style="margin-left: 10px;">							
					<div style="margin: 0 0 2px 2px; color: #4A4A4A; text-align: center;">Ширина</div>
					<div class="wr_input_1" nameId="wrInputSizeObjZ">
						<div class="flex_1">
							<input type="text" style="${css1}" class="input_1" nameId="inputSizeObjZ" disabled value="">
						</div>
					</div>
				</div>					
			</div>						
		</div>`;					

		return html;
	}	
	
	

	// устанавливаем в input размер блоков
	setInputSize({size, type = 'm', callBack})
	{
		const kof = (type === 'm') ? 1000 : 1;
		
		if(size.length) this.inputSizeX.value = size.length * kof;
		if(size.height) this.inputSizeY.value = size.height * kof;
		if(size.width) this.inputSizeZ.value = size.width * kof;
		
		this.initEventSizeBlock({callBack});
	}
	
	
	// события при вводе в input размера блока (при изменении, вызывается callBack и обновляется данные)
	initEventSizeBlock({callBack})
	{		
		// проверка на валидность после ввода в input
		const processInput = ({input, limit}) =>
		{
			let value = input.value.trim();

			// Заменяем запятую на точку (для корректного парсинга)
			value = value.replace(',', '.');

			// Пытаемся преобразовать в число
			const numberValue = parseFloat(value);

			// Проверяем валидность
			if (isNaN(numberValue)) return {success: false, message: 'Введите число!'};

			// Округляем до целого
			const roundedValue = Math.round(numberValue);

			// Проверяем диапазон (Число должно быть от limit[0] до limit[1])
			if (roundedValue < limit[0] || roundedValue > limit[1]) return {success: false, message: `Число должно быть от ${limit[0]} до ${limit[1]}`};

			// Если всё ок — выводим результат
			console.log("Валидное число:", roundedValue);
			input.value = roundedValue; // Заменяем ввод на округлённое значение
			
			return {success: true, value: input.value};
		}

		// если значение не валидное то сбрасываем значение до оригинального
		const resetInput = ({result, input, originalValue}) =>
		{
			input.value = originalValue; 	// сбрасываем значение в input до оригинального
			console.log(result);
		}		
		
		const addEvent = ({input, key, limit}) =>
		{
			let originalValue = '';
			
			input.onfocus = (e) => 
			{
				originalValue = input.value;
			}
			
			input.onkeydown = (e) => 
			{								
				if (e.code === 'Enter') 
				{
					const result = processInput({input, limit});
					if(!result.success) resetInput({result, input, originalValue});
					if(result.success) callBack({result, key});
				}
			}

			input.onblur = (e) => 
			{
				const result = processInput({input, limit});
				if(!result.success) resetInput({result, input, originalValue});
				if(result.success) callBack({result, key});
			}			
		}

		addEvent({input: this.inputSizeX, key: 'length', limit: [300, 1000]});
		addEvent({input: this.inputSizeY, key: 'height', limit: [100, 1000]});				
	}
	
	
	show()
	{
		this.wrapDiv.style.display = '';
	}
	
	hide()
	{
		this.wrapDiv.style.display = 'none';
	}
}







