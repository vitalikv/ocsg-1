

class MyLevelVisible 
{
	showAllLevel;
	wallTransparent;
	showAllRoofs;
	divItemsVis;
	checkBox1;	// input показать все этажи
	checkBox2;	// input прозрачные стены
	checkBox3;	// input отображение крыш
	
	constructor()
	{
		this.showAllLevel = false;
		this.wallTransparent = true;
		this.showAllRoofs = true;
		
		const wrapVisHs = document.querySelector('[nameId="wrapVisHs"]');
		
		const container = this.crDiv();
		wrapVisHs.append(container);
		
		this.divItemsVis = container.querySelector('[nameId="divItemsVis"]');
		this.checkBox1 = container.querySelector('[nameId="item_1"]');
		this.checkBox2 = container.querySelector('[nameId="item_2"]');
		this.checkBox3 = container.querySelector('[nameId="item_3"]');
		
		//this.init();
		this.initEvent();
	}
	
	init()
	{
		//this.setCheckBox({type: 'allLevel'});
		//this.setCheckBox({type: 'wallTransparent'});
	}
	
	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];	
	}

	
	html()
	{
		const css1 = `display: flex; align-items: center;`;
		const css2 = `width: 20px; height: 20px; margin-right: 15px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;`;
		const css3 = `width: 16px; height: 16px; margin: 2px; border-radius: 4px; background: rgb(213, 213, 213);`;
		
		const html =
		`<div style="display: flex; flex-direction: column; margin: 20px 0 0 0; padding: 10px; font-size: 16px; color: #666; border: 1px solid #ccc;">
			<div nameId="divItemsVis" style="display: none;">
				<div style="${css1}">
					<div nameId="item_1" style="${css2}">
						<div style="${css3}"></div>
					</div>
					<div>Показать все этажи</div>
				</div>
				<div style="${css1} margin: 5px 0;">
					<div nameId="item_2" style="${css2}">
						<div style="${css3}"></div>
					</div>
					<div>Прозрачные внешние стены</div>
				</div>			
			</div>

			<div style="${css1}">
				<div nameId="item_3" style="${css2}">
					<div style="${css3}"></div>
				</div>
				<div>Показать крышу</div>
			</div>			
		</div>`;
		
		return html;
	}	
	
	// кликнули на checkBox
	initEvent()
	{
		this.checkBox1.onmousedown = () => { this.switchShowAllLevel(); }
		this.checkBox2.onmousedown = () => { this.switchWallTransparent(); }
		this.checkBox3.onmousedown = () => { this.switchShowAllRoofs(); }
	}
	
	switchShowAllLevel({value} = {value: undefined})
	{
		this.showAllLevel = (value !== undefined) ? value : !this.showAllLevel;
		this.setCheckBox({type: 'allLevel'});		
	}

	switchWallTransparent({value} = {value: undefined})
	{
		this.wallTransparent = (value !== undefined) ? value : !this.wallTransparent;
		this.setCheckBox({type: 'wallTransparent'});
	}
	
	// вкл/выкл показ всех крыш
	switchShowAllRoofs({value} = {value: undefined})
	{
		this.showAllRoofs = (value !== undefined) ? value : !this.showAllRoofs;
		this.setCheckBox({type: 'allRoofs'});
	}	
	
	setCheckBox({type})
	{
		if(type === 'allLevel')
		{
			const elem = this.checkBox1;
			elem.children[0].style.background = (this.showAllLevel) ? 'rgb(213, 213, 213)' : 'none';
			
			myLevels.changeVisibleLevels();		
		}
		
		if(type === 'wallTransparent')
		{
			const elem = this.checkBox2;
			elem.children[0].style.background = (this.wallTransparent) ? 'rgb(213, 213, 213)' : 'none';
			
			if(myCameraOrbit.activeCam.userData.isCam3D)
			{
				getInfoRenderWall();
				if(this.wallTransparent && myCameraOrbit.cam3D.userData.type === 'fly') wallAfterRender_2();
				else showAllWallRender();						
			}
		}
		
		if(type === 'allRoofs')
		{
			this.checkBox3.children[0].style.background = (this.showAllRoofs) ? 'rgb(213, 213, 213)' : 'none';
			
			myLevels.changeVisibleRoofs();		
		}		
	}

	// прячем/показываем div (если 2D - скрываем, 3D - показываем)
	showHideBlock({show})
	{
		const display = (show) ? '' : 'none';
		
		this.divItemsVis.style.display = display;
	}
}







