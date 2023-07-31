
// вкладка этажи
class TabLevel 
{
	itemsLevel = [];
	
	constructor()
	{
		const elBlock = document.querySelector('[nameId="wrap_level"]');

		// div где находится кнопка и input
		const div1 = elBlock.querySelector('[nameId="div_level_1"]');
		const div2 = elBlock.querySelector('[nameId="div_level_2"]');
		const div3 = elBlock.querySelector('[nameId="div_level_3"]');
		const div4 = elBlock.querySelector('[nameId="div_level_4"]');
		
		// кнопки переключения этажей
		const btn1 = elBlock.querySelector('[nameId="btn_level_1"]');
		const btn2 = elBlock.querySelector('[nameId="btn_level_2"]');
		const btn3 = elBlock.querySelector('[nameId="btn_level_3"]');
		const btn4 = elBlock.querySelector('[nameId="btn_level_4"]');

		// input изменения высоты этажа
		const input1 = elBlock.querySelector('[nameId="rp_level_1_h2"]');
		const input2 = elBlock.querySelector('[nameId="rp_level_2_h2"]');
		const input3 = elBlock.querySelector('[nameId="rp_level_3_h2"]');
		const input4 = elBlock.querySelector('[nameId="rp_level_4_h2"]');	
	
		this.itemsLevel[0] = { div: div1, btn: btn1, input: input1 };
		this.itemsLevel[1] = { div: div2, btn: btn2, input: input2 };
		this.itemsLevel[2] = { div: div3, btn: btn3, input: input3 };
		this.itemsLevel[3] = { div: div4, btn: btn4, input: input4 };
		
		this.setStartInputValue();
		this.initElemsEvent();
	}
	
	initElemsEvent()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => { myLevels.switchLevel(i); }
			this.itemsLevel[i].input.onkeyup = (event) => this.changeInputHeight(event, i);
		}		
	}
	
	// при старте/загрузке установить в input значения по дефолту/из файла
	setStartInputValue()
	{
		const level = myLevels.levels;		

		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].input.value = level[i].height;
		}
	}
	
	// меняем фон item/блока этажа
	levelBackground_UI({id}) 
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].div.style.background = 'none';
			if(i === id) this.itemsLevel[i].div.style.background = '#d5d5d5';
		}
	}
	
	// меняем высоту этажа и сдвигаем все остальные этажы
	changeInputHeight(event, id) 
	{
		if (event.keyCode !== 13) return;
		
		const level = myLevels.levels[id];
		
		const value = checkNumberInput({ value: event.target.value, unit: 1, limit: {min: 0.1, max: 5} });

		if(!value) 
		{
			event.target.value = Math.round(level.height * 100) / 100;
			return;
		}	
		
		event.target.value = value.num; 
		
		myLevels.setHeightWallLevel({value: value.num, id});  
	}	
}







