

class MyUiBlocksOffset
{
	container;
	wrapDiv;
	
	inputOffset;
	
	inputSizeX;
	inputSizeY;
		
	
	init({container})
	{
		this.container = container;
		
		this.wrapDiv = this.crDiv();
		this.container.append(this.wrapDiv);
		
		this.inputOffset = this.wrapDiv.querySelector('[nameId="inputOffset"]');
		
		this.inputSizeX = this.wrapDiv.querySelector('[nameId="inputSizeObjX"]');
		this.inputSizeY = this.wrapDiv.querySelector('[nameId="inputSizeObjY"]');
		
		this.initEvents();
	}
	

	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlOffset();
		return div.children[0];	
	}	


	initEvents()
	{
		this.initEventOffsetBlock();
		this.initEventSizeBlockAllWalls();
	}
	

	htmlOffset()
	{
		const htmlDivOffset = 
		`<div style="display: -webkit-box; display: flex; margin: auto; font-size: 12px;">
			<div style="display: -webkit-box; display: flex;">
				<div class="wr_input_1">
					<div class="flex_1">
						<input type="text" class="input_1" style="margin: auto; width: 120px;" nameId="inputOffset" value="10">
					</div>
				</div>
			</div>						
		</div>`;

		const htmlWrapBlockSize = this.htmlWrapBlockSize();
		
		const html = 
		`<div>
			<div style="display: flex; align-items: center; padding: 10px 10px 0 10px; font-size: 16px; color: #666;">Параметры для всех стен</div>
			<div style="display: flex; flex-direction: column; margin: 10px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
				<div style="display: flex; align-items: center;">
					<div>Толщина слоя<br>раствора (мм)</div>
					${htmlDivOffset}				
				</div>			
			</div>
			${htmlWrapBlockSize}
		</div>`;	

		return html;
	}
	
	
	htmlWrapBlockSize()
	{
		const htmlInputSize = this.htmlInputSize();
		
		const css1 = `display: flex; align-items: center;`;
		
		const html =
		`<div style="display: flex; flex-direction: column; margin: 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
			<div style="${css1}">
				<div>Размер блока (мм)</div>						
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
			</div>						
		</div>`;					

		return html;
	}	
	
	

	// устанавливаем в input размер блоков
	setInputSize({value, key, type = 'm'})
	{
		const paramsBlock = {};
		paramsBlock[key] = value;
		
		const kof = (type === 'm') ? 1000 : 1;
		
		if(key === 'length') this.inputSizeX.value = paramsBlock[key] * kof;
		if(key === 'height') this.inputSizeY.value = paramsBlock[key] * kof;		
		
		console.log(3333, paramsBlock);
		myCalcBlocks.myBlocksObjs.setAllWallsParamsBlocks({paramsBlock, key, type});		
	}
	
	
	// события при вводе в input размера блока для всех стен
	initEventSizeBlockAllWalls()
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
					if(result.success) this.setInputSize({value: result.value, key, type: 'mm'});
				}
			}

			input.onblur = (e) => 
			{
				const result = processInput({input, limit});
				if(!result.success) resetInput({result, input, originalValue});
				if(result.success) this.setInputSize({value: result.value, key, type: 'mm'});
			}			
		}

		addEvent({input: this.inputSizeX, key: 'length', limit: [300, 1000]});
		addEvent({input: this.inputSizeY, key: 'height', limit: [100, 1000]});				
	}
	


	// меняем в input толщину клея (+ передаем толщину клея в основной класс для расчета блоков)
	setInputOffsetBlock({value, type = 'm'})
	{
		const kof = (type === 'm') ? 1000 : 1;
		
		this.inputOffset.value = value * kof;
		
		myCalcBlocks.myBlocksObjs.setOffsetBlock({value, type});
	}


	// события при вводе в input толщины клея
	initEventOffsetBlock()
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
		
		const addEvent = ({input, limit}) =>
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
					if(result.success) this.setInputOffsetBlock({value: result.value, type: 'mm'});
				}
			}

			input.onblur = (e) => 
			{
				const result = processInput({input, limit});
				if(!result.success) resetInput({result, input, originalValue});
				if(result.success) this.setInputOffsetBlock({value: result.value, type: 'mm'});
			}			
		}

		addEvent({input: this.inputOffset, limit: [1, 50]});			
	}


}







