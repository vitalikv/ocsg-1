

class Tabs 
{
	currentTabId = -1;
	items = [];
	
	constructor()
	{
		const container = document.querySelector('[nameId="panel_catalog_1"]');
		
		// кнопки переключения вкладок
		const btn1 = container.querySelector('[nameId="button_wrap_level"]');
		const btn2 = container.querySelector('[nameId="button_wrap_plan"]');
		const btn3 = container.querySelector('[nameId="button_wrap_object"]');
		const btn4 = container.querySelector('[nameId="button_wrap_catalog"]');
		
		// блоки 
		const div1 = container.querySelector('[nameId="wrap_level"]');
		const div2 = container.querySelector('[nameId="wrap_plan"]');		
		const div3 = container.querySelector('[nameId="wrap_object"]');
		const div4 = container.querySelector('[nameId="wrap_catalog"]');
		
		// альтернативные блоки для 3д
		const div2_3d = container.querySelector('[nameId="wrap_plan_3d"]');
		
		this.items[0] = { btn: btn1, div: div1 };
		this.items[1] = { btn: btn2, div: div2, div3D: div2_3d };
		this.items[2] = { btn: btn3, div: div3 };
		this.items[3] = { btn: btn4, div: div4 };
		
		this.initEvent();
		this.activeTab({id: 0});
	}
	
	initEvent()
	{
		this.items[0].btn.onmousedown = () => { this.activeTab({id: 0}); };
		this.items[1].btn.onmousedown = () => { this.activeTab({id: 1}); };
		this.items[2].btn.onmousedown = () => { this.activeTab({id: 2}); };
		this.items[3].btn.onmousedown = () => { this.activeTab({id: 3}); };		
	}
	
	// переключаем вкладки правой панели 
	activeTab({id})
	{
		this.currentTabId = id;
		
		for ( let i = 0; i < this.items.length; i++ )
		{
			this.items[i].div.style.display = 'none';
			if(this.items[i].div3D) this.items[i].div3D.style.display = 'none';
		}					 
		
		// если есть блок для 3D, то показываем его в режиме 3D
		if(this.items[id].div3D)
		{
			if(myCameraOrbit.activeCam.userData.isCam3D) { this.items[id].div3D.style.display = ''; }
			else { this.items[id].div.style.display = ''; }
		}
		else
		{
			this.items[id].div.style.display = '';
		}		
	}

	
	// обновляем текущую вкладку, например при переключении 2D/3D
	upCurrentTab()
	{
		if(this.currentTabId === -1) return;
		
		this.activeTab({id: this.currentTabId});
	}
}







