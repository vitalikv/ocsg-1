

class MyUiBlocksCount
{
	container;
	wrapDiv;
	divList;
	
	
	init({container})
	{
		this.container = container;
		
		this.wrapDiv = this.crDiv();
		this.container.append(this.wrapDiv);
		this.hide();
		
		this.divList = this.wrapDiv.querySelector('[nameId="infoCount"]');
	}


	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.htmlInfoSum();
		return div.children[0];	
	}	
	
	
	htmlInfoSum()
	{
		const css1 =	
		`display: block;
		position: absolute;
		left: 0;
		right: 0;
		top: 40px;
		bottom: 60px;
		margin: auto 10px;
		border: 1px solid #ccc;
		border-radius: 3px;
		background-color: #fff;
		box-shadow: 0px 0px 2px #bababa, inset 0px 0px 2px rgba(154, 147, 140, 0.5);
		overflow: auto;`;
		
		const css2 = `font-size: 15px; color: #666;`;
		
		const html = 
		`<div style="position: relative; height: 500px;">
			<div style="${css1} ${css2}">
				<div nameId="infoCount" style="margin: 0px;">
				</div>
			</div>				
		</div>`;					

		return html;
	}
	
	
	// старый способ, когда считаются целые блоки без остатков
	upInfoCountBlocks2({data})
	{
		this.clearInfoCountBlocks();
		

		const css1 = `display: flex; align-items: center; padding: 10px; margin: 3px 0; border: 1px solid #ccc; cursor: pointer;`;
		

		const svg1 = 
		`<div nameid="shCp_1" style="margin-right: 15px; width: 10px; height: 20px;">				
			<svg height="100%" width="100%" viewBox="0 0 100 100">					
				<polygon points="0,0 100,0 50,100" style="stroke:#222222; stroke-width:4; fill: #fff;"></polygon>				
			</svg>
		</div>`;	

		
		for ( let i = 0; i < data.length; i++ )
		{
			const idLevel = data[i].idLevel;
			const group = data[i].group;
			const lines = data[i].lines;
			
			// общее кол-во блоков на этаже (по группам)
			let htmlTotal = ``;			
			for ( let i2 = 0; i2 < group.length; i2++ )
			{
				const paramsBlock = group[i2].paramsBlock;
				const txtSizeBlock = `(${paramsBlock.length * 1000} х ${paramsBlock.height * 1000} х ${paramsBlock.width * 1000})`;
				
				htmlTotal += `<div>${group[i2].totalCount} шт ${txtSizeBlock}</div>`;
			}
			

			// собираем все вместе для текущего этажа
			const html = 
			`<div>
				<div nameId="level" style="${css1}">
					${svg1}
					<div>
						<div style="font-weight: bold;">${idLevel+1} этаж общее кол-во:</div>
						${htmlTotal}
					</div>
				</div>
				<div nameId="items" style="display: none;"></div>
			</div>`;

			let div = document.createElement('div');
			div.innerHTML = html;
			div = div.children[0];

			this.divList.append(div);
			
			const btn = div.querySelector('[nameId="level"]');
			const divItems = div.querySelector('[nameId="items"]');
			
			btn.onmousedown = () => 
			{
				const value = (divItems.style.display === 'none') ? '' : 'none';
				divItems.style.display = value;
			}
			
			this.crDivItems({container: divItems, data: lines});
		}
	}	


	upInfoCountBlocks({data})
	{
		this.clearInfoCountBlocks();
		

		const css1 = `display: flex; align-items: center; padding: 10px; margin: 3px 0; border: 1px solid #ccc; cursor: pointer;`;
		

		const svg1 = 
		`<div nameid="shCp_1" style="margin-right: 15px; width: 10px; height: 20px;">				
			<svg height="100%" width="100%" viewBox="0 0 100 100">					
				<polygon points="0,0 100,0 50,100" style="stroke:#222222; stroke-width:4; fill: #fff;"></polygon>				
			</svg>
		</div>`;	

		
		for ( let i = 0; i < data.length; i++ )
		{
			const idLevel = data[i].idLevel;
			const statsByType = data[i].statsByType;
			const lines = data[i].lines;
			
			// общее кол-во блоков на этаже (по группам)
			let htmlTotal = ``;	
			statsByType.forEach(stat => {
			  htmlTotal += `<div style="margin-top: 10px;">📦 Тип блока: (${stat.type.length * 1000}x${stat.type.height * 1000}x${stat.type.width * 1000})</div>`;
			  htmlTotal += `<div>Всего: ${stat.usedCount} шт., ${stat.totalVolume.toFixed(2)} м³</div>`;
			});			

			// собираем все вместе для текущего этажа
			const html = 
			`<div>
				<div nameId="level" style="${css1}">
					${svg1}
					<div>
						<div style="font-weight: bold;">${idLevel+1} этаж общее кол-во:</div>
						${htmlTotal}
					</div>
				</div>
				<div nameId="items" style="display: none;"></div>
			</div>`;

			let div = document.createElement('div');
			div.innerHTML = html;
			div = div.children[0];

			this.divList.append(div);
			
			const btn = div.querySelector('[nameId="level"]');
			const divItems = div.querySelector('[nameId="items"]');
			
			btn.onmousedown = () => 
			{
				const value = (divItems.style.display === 'none') ? '' : 'none';
				divItems.style.display = value;
			}
			
			this.crDivItems({container: divItems, data: lines});
		}
	}	
		
	
	// создаем список блоков на одной стене (для текущего этажа)
	crDivItems({container, data})
	{
		const cssItem = `padding: 5px 10px; margin: 1px 0; border: 1px solid #ccc; cursor: pointer;`;
		
		for ( let i = 0; i < data.length; i++ )
		{
			//const count = data[i].count;
			const count = data[i].countFloat;
			const paramsBlock = data[i].paramsBlock;
			const wallsClone = data[i].wallsClone;
			
			
			const txtSizeBlock = `(${paramsBlock.length * 1000} х ${paramsBlock.height * 1000} х ${paramsBlock.width * 1000})`;
			const html = `${i+1}. стена: ${count} шт ${txtSizeBlock}`;

			const divItem = document.createElement('div');
			divItem.innerHTML = html;
		
			divItem.setAttribute('style', cssItem);
			
			divItem.userData = { wallsClone };
			
			container.append(divItem);
			
			divItem.onmousedown = () => 
			{
				this.clickItem({item: divItem});
			}			
		}		
	}
	
	
	clickItem({item})
	{
		this.setColorDefAllItems();

		this.setColorActItem({item});
		
		const wallsClone = item.userData.wallsClone;
		myComposerRenderer.outlineAddObj({arr: wallsClone});
	}
	
	
	// убираем выделение со всех items (после клика)
	setColorDefAllItems()
	{
		const items = this.divList.querySelectorAll('div[nameid="items"] div');
		
		for (const item of items) 
		{
			item.style.background = 'none';
		}		
	}
	
	// выделяем выбранный item
	setColorActItem({item})
	{
		item.style.background = '#d5d5d5';
	}
	
	
	// когда в 3d кликнули на стену, показываем в ui списке эту стену
	scrollToItem({wallClone}) 
	{
		const items = this.divList.querySelectorAll('div[nameid="items"] div');

		for (const item of items) 
		{
			const ind = item.userData.wallsClone.findIndex((wall) => wall === wallClone);
			
			if (ind > -1)
			{
				item.parentElement.style.display = '';	// раскрываем группу, если была закрыта
				
				this.setColorDefAllItems();
				this.setColorActItem({item});
				
				item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				
				break;
			}
		}
	}

	show()
	{
		this.wrapDiv.style.display = '';
	}
	
	hide()
	{
		this.wrapDiv.style.display = 'none';
	}


	// очищаем список
	clearInfoCountBlocks()
	{
		this.divList.innerHTML = '';
	}	
}







