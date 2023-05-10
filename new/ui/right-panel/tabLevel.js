
// вкладка этажи
class TabLevel 
{
	itemsLevel = [];
	
	constructor()
	{
		const elBlock = document.querySelector('[nameId="wrap_level"]');
		
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
	
		this.itemsLevel[0] = { btn: btn1, input: input1 };
		this.itemsLevel[1] = { btn: btn2, input: input2 };
		this.itemsLevel[2] = { btn: btn3, input: input3 };
		this.itemsLevel[3] = { btn: btn4, input: input4 };
		
		this.setStartInputValue();
		this.initElemsEvent();
	}
	
	initElemsEvent()
	{
		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].btn.onmousedown = () => { switchLevel(i); }
			this.itemsLevel[i].input.onkeyup = (event) => changeHeightWallLevel(event, i);
		}		
	}
	
	// при старте/загрузке установить в input значения по дефолту/из файла
	setStartInputValue()
	{
		const level = infProject.jsonProject.level;		

		for ( let i = 0; i < this.itemsLevel.length; i++ )
		{
			this.itemsLevel[i].input.value = level[i].height;
		}
	}
}







