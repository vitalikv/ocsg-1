

class MyCatalogList 
{
	container;
	
	constructor()
	{
		this.container = document.querySelector('[list_ui="catalog"]');
		this.container.innerHTML = '<div style="display: grid; grid-template-columns: auto auto;"></div>';
		this.container = this.container.children[0];
		this.init();
		//this.initEvent();
	}
	
	async init()
	{
		const list = this.listObjsCustom();	
		//const list = await this.listObjsDB();
		
		for(let i = 0; i < list.length; i++)
		{
			const elem = this.htmlItem(list[i]);
			this.initEventItem({elem, id: list[i].id});
			
			this.container.append(elem);
		}
	}
	

	listObjsCustom()
	{
		const list = [];
		
		list.push({id: 1, name: 'куб', url: 'primitives/box1/'});
		list.push({id: 2, name: 'сфера', url: 'primitives/sphere/'});
		list.push({id: 3, name: 'цилиндр', url: 'primitives/cylinder/'});
		list.push({id: 21, name: 'дерево', url: 'land/pine/'});
		list.push({id: 22, name: 'диван', url: 'furn/sofa_1/'});
		list.push({id: 23, name: 'стол', url: 'furn/table_1/'});
		list.push({id: 24, name: 'шкаф', url: 'furn/wardrobe/'});
		list.push({id: 25, name: 'ванна', url: 'santeh/bath/'});
		list.push({id: 26, name: 'душевая кабина', url: 'santeh/shower_cabin/'});
		list.push({id: 27, name: 'полки', url: 'furn/shelves_1/'});
		list.push({id: 28, name: 'стул', url: 'furn/stool_1/'});
		list.push({id: 29, name: 'туалет', url: 'furn/toilet_1/'});
		
		return list;
	}
	

	// список названий объектов из бд
	async listObjsDB()
	{
		let data = null;
		
		try 
		{
			const url = infProject.path+'components_2/getListObjSql.php';		
			const response = await fetch(url, 
			{
				method: 'POST',
				body: 'select_list=id, name',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },						
			});
			
			data = await response.json();			
		}
		catch ( error )
		{
			data = null;
		}
		
		if(!data) data = [];
		
		return data;
	}
	
	
	htmlItem(data)
	{
		let preview = '';
		if(data.url)
		{
			preview = `
			<div style="display: flex; width: 100px; height: 100px; margin: auto;">
				<img src="${infProject.path}catalog/objs/${data.url}prev.png">
			</div>`;
		}
		
		const html = 
		'<div class="right_panel_1_1_list_item" add_lotid="'+data.id+'" style="top:0px; left:0px; margin: 4px;">'
			+preview+
			'<div class="right_panel_1_1_list_item_text">'
			+data.name+
			'</div>\
		</div>';

		const div = document.createElement('div');
		div.innerHTML = html;
		const elem = div.children[0];
		
		return elem;
	}


	// кликнули на 
	initEventItem({elem, id})
	{
		elem.onmousedown = (e) => { clickInterface({button: 'add_lotid', value: id}); e.stopPropagation(); }
	}	
}







