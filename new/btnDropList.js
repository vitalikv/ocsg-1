

class BtnDropList 
{
	wrapDiv = null;
	wrapModal = null;
	modalList = null;
	btnItem = null;
	
	constructor({containerId, name, data})
	{
		this.initBtn({containerId, name, data});
	}
	
	initBtn({containerId, name, data})
	{
		const container = document.querySelector('[nameId="'+containerId+'"]');
		
		const div = document.createElement('div');
		div.innerHTML = this.html({name});
		const elem = div.children[0];
		container.append(elem);	
		
		this.wrapDiv = document.querySelector('[nameId="wrapDiv"]');
		
		this.wrapModal = this.initModal({name});
		this.wrapModal.style.display = 'none';
		
		this.modalList = this.wrapModal.querySelector('[nameId="modal_list"]');
		this.initList({data});
		
		this.btnItem = container.querySelector('[nameId="btn_obj_item"]');
		this.initEventClickBtn({name: data[0].name, src: data[0].src, func: data[0].func});
		
		const btnDrop = container.querySelector('[nameId="btn_drop_item"]');
		btnDrop.onmousedown = () => 
		{ 
			if(this.isActive())
			{
				this.showModal({el: btnDrop});
				this.initEventModal();				
			}
		}
	}
	
	
	// создаем кнопку для вызова модального окна
	html({name})
	{
		const html = `
		<div>
			<div style="margin-bottom: 5px; font-size: 14px; color: #737373; text-align: center;">${name}</div>
			<div class="wrap_btn_drop_down_list_1">			
				<div nameId="btn_obj_item" class="item_1"></div>
				<div nameId="btn_drop_item" class="item_2">
					<div style="display: flex; justify-content: center; align-items: center; width: 16px; height: 16px; margin: 3px 3px 3px 0;">
						<img src="${infProject.path}img/svg/input_dropdown.svg" style="width: 16px; height: 16px;">
					</div>							
				</div>
			</div>
		</div>`;

		return html;
	}
	
	// создаем модальное окно
	initModal({name})
	{
		const div = document.createElement('div');
		div.innerHTML = `
		<div class="div_drop_down_modal">
			<div style="margin: 10px auto; text-align: center; font-size: 18px;">${name}</div>
			<div class="div_drop_down_list" nameId="modal_list"></div>
			<div style="margin: 20px;"></div>
		</div>`;
		const elem = div.children[0];
		
		this.wrapDiv.append(elem);

		return elem;
	}
	
	// наполняем список
	initList({data})
	{
		const style = `
		margin: 10px;
		cursor: pointer;
		width: 100px;`;
		
		const style2 = `
		width: 100px;
		height: 100px;
		background: #fff;
		border-radius: 4px;
		border: 1px solid #D1D1D1;`;
		
		const styleImg = `
		display: block;
		width: 95%;
		margin: auto;
		object-fit: contain;`;		

		const styleTxt = `
		margin: 10px auto;`;
		
		for ( let i = 0; i < data.length; i++ )
		{
			const div = document.createElement('div');
			div.innerHTML = `
			<div style="${style}">
				<div style="${style2}">
					<img src="${infProject.path+data[i].src}" style="${styleImg}">
				</div>
				<div style="${styleTxt}">${data[i].name}</div>
			</div>`;
			const elem = div.children[0];
			
			this.modalList.append(elem);

			elem.onmousedown = (event) => 
			{
				if(this.isActive())
				{
					data[i].func();
					this.initEventClickBtn({name: data[i].name, src: data[i].src, func: data[i].func});				
				}

				
				document.removeEventListener('mousedown', this.closeModal);
				this.wrapModal.style.display = 'none';
				this.wrapDiv.style.display = 'none';				
			}				
		}
		
	}
	
	// показываем модальное окно
	showModal({el})
	{
		this.wrapDiv.style.display = 'block';
		
		let rect = el.getBoundingClientRect();
		
		this.wrapModal.style.display = '';
		
		let top = (rect.top + rect.height/2 - this.wrapModal.clientHeight);		
		if(top < 10) { top = 10; }
		this.wrapModal.style.top = top+'px';
		this.wrapModal.style.left = (rect.left + rect.width/2 - this.wrapModal.clientWidth)+'px';		
	}



	closeModal = (event) =>
	{ 
		if (!this.wrapModal.contains(event.target)) 
		{ 			 
			document.removeEventListener('mousedown', this.closeModal);
			this.wrapModal.style.display = 'none';
			this.wrapDiv.style.display = 'none';
		}
	}
	
	// событие закрытие модального окна
	initEventModal()
	{ 		
		document.addEventListener('mousedown', this.closeModal);		
	}	
	
	// создаем событие для основной кнопки 
	initEventClickBtn({src, func})
	{
		const styleImg = `
		display: block;
		height: 95%;
		margin: auto;
		object-fit: contain;`;
		
		this.btnItem.innerHTML = `<img src="${infProject.path+src}" style="${styleImg}">`;
		this.btnItem.onmousedown = () => 
		{ 		
			if(this.isActive()) func();
		}
	}
	
	// если находимся в 2D , то выполняем ф-ции
	isActive()
	{
		return (myCameraOrbit.activeCam.userData.isCam2D) ? true : false;
	}
}














