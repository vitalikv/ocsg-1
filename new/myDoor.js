

class MyDoors 
{
	constructor()
	{
		this.initBtn();
	}
	
	initBtn()
	{
		const data = 
		[
			{name: 'дверь', src: 'img/icon/door/1.png', func: () => { clickInterface({button:'create_wd_2'}) } },
			{name: 'проем', src: 'img/icon/door/2.png', func: () => { clickInterface({button:'create_wd_1'}) } },
		];
		
		// создаем модальное окно, со списком объектов
		const btnDropList = new BtnDropList({containerId: 'list_btn_door', name: 'Дверь/проём', data});	
	}
		

}

const myDoors = new MyDoors()





