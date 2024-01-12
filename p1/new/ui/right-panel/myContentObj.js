

class MyContentObj
{
	container;
	inputName;
	divContentInfo;
	divs = {};
	myTabObjWall;
	myTabObjRoom;
	myTabObjWD;
	myTabObjRoof;
	myTabObjObject;
	myTabObjWfPoint;
	myTabObjWfTube;
	
	
	constructor()
	{
		const wrapDiv = myPanelR.divPanelR.querySelector('[nameId="contObjR"]');		
		
		const div = this.crDiv();
		wrapDiv.append(div);
		
		this.container = div.querySelector('[nameId="wrap_object_1"]');		

		this.inputName = this.container.querySelector('[nameId="rp_obj_name"]');
		this.divContentInfo = this.container.querySelector('[nameId="contentInfo"]');
	}
	
	init()
	{
		this.myTabObjWall = new MyTabObjWall();
		this.myTabObjRoom = new MyTabObjRoom();
		this.myTabObjWD = new MyTabObjWD();
		this.myTabObjRoof = new MyTabObjRoof();
		this.myTabObjObject = new MyTabObjObject();
		this.myTabObjWfPoint = new MyTabObjWfPoint();
		this.myTabObjWfTube = new MyTabObjWfTube();
		
		this.divs.wall = this.container.querySelector('[nameId="rp_menu_wall"]');
		this.divs.wd = this.container.querySelector('[nameId="rp_menu_wd"]');
		this.divs.floor = this.container.querySelector('[nameId="rp_menu_room"]');
		this.divs.roof = this.container.querySelector('[nameId="bl_roof_3d"]');
		this.divs.obj = this.container.querySelector('[nameId="bl_object_3d"]');

		this.divs.pointWf = this.container.querySelector('[nameId="bl_pointWf"]');
		this.divs.tubeWf = this.container.querySelector('[nameId="bl_tubeWf"]');
	}
	
	initEvent()
	{
				
	}


	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div.children[0];	
	}

	
	html()
	{
		const html =
		`<div nameId="wrap_object">		
			<div class="right_panel_1_1_h">Объект</div>
			
			<div class="flex_column_1" nameId="wrap_object_1" style="display: none; margin-top: 10px;">								
				<div class="rp_obj_name">
					<input type="text" nameId="rp_obj_name" value="Название">					
				</div>								
								
				<div nameId="contentInfo" style="margin-top: 20px;"></div>				
			</div>	
		</div>`;

		
		return html;
	}
	

	// кликнули на obj, wd (показываем нужное меню и заполняем input)
	activeObjRightPanelUI_1({obj, side} = {}) 
	{
		this.container.style.display = 'none'; 
		
		this.inputName.value = '';
		
		this.divs.wall.style.display = 'none';
		this.divs.wd.style.display = 'none';
		this.divs.floor.style.display = 'none';
		this.divs.roof.style.display = 'none';
		this.divs.obj.style.display = 'none';
		this.divs.pointWf.style.display = 'none';
		this.divs.tubeWf.style.display = 'none';
		
		
		if(!obj) return;
		
		let txtName = '';
		
		if(obj.userData.tag === 'point')
		{
			txtName = 'точка';
		}	
		else if(obj.userData.tag === 'wall')
		{
			txtName = 'стена';
			
			this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = 'none';
			this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = 'none';
			
			if(side)
			{
				this.divs.wall.querySelector('[nameId="rp_catalog_texture_1"]').style.display = '';
			}
			else
			{
				this.divs.wall.querySelector('[nameId="rp_button_side_texture_1"]').style.display = '';
				this.divs.wall.querySelector('[nameId="but_back_catalog_texture_1"]').style.display = '';
				
				showHideMenuTexture_1({type: 1});
				
				myTexture.changeTextureWall_UI_1({obj: obj});			

				if(obj.userData.wall.html.label)
				{
					obj.userData.wall.html.label[0].textContent = 'A';
					obj.userData.wall.html.label[1].textContent = 'B';
								
					upPosLabels_2({elem: obj.userData.wall.html.label[0]});
					upPosLabels_2({elem: obj.userData.wall.html.label[1]});
				}			
			}
			
			this.divs.wall.style.display = '';
			this.divs.wall.querySelector('[nameId="size_wall_width_1"]').value = obj.userData.wall.width;			
		}
		else if(obj.userData.tag === 'door')
		{
			txtName = obj.userData.door.nameRus;
			showTableWD( obj );
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'window')
		{
			txtName = obj.userData.door.nameRus;
			showTableWD( obj );
			this.divs.wd.style.display = '';
		}
		else if(obj.userData.tag === 'controll_wd')
		{
			const wd = obj.userData.controll_wd.obj;
			txtName = wd.userData.door.nameRus;
			showTableWD( wd );
			this.divs.wd.style.display = '';
		}		
		else if(obj.userData.tag === 'room')
		{
			txtName = 'пол';
			this.divs.floor.style.display = '';
		}
		else if(obj.userData.tag === 'roof')
		{		
			txtName = obj.userData.roof.nameRus;		
			this.divs.roof.style.display = '';
		}		
		else if(obj.userData.tag === 'obj')
		{			
			txtName = obj.userData.obj3D.nameRus;		
			this.divs.obj.style.display = '';
			
			const display = (obj.userData.obj3D.lotid < 4) ? '' : 'none';
			this.divs.obj.children[1].style.display = display;
			
			if( isCheckExsistFunction(window['getInfObjFromBD']) ) { getInfObjFromBD({obj: obj}); };
		}
		else if(obj.userData.tag === 'pointWf')
		{
			txtName = 'точка';
			
			this.divs.pointWf.style.display = '';
		}
		else if(obj.userData.tag === 'tubeWf')
		{
			txtName = 'труба';
			
			const length = myWarmFloor.myTubeWf.getLengthTube({tube: obj});
			this.myTabObjWfTube.setInputLength({length});
			
			const diameter = myWarmFloor.myTubeWf.getDiameterTube({tube: obj});
			this.myTabObjWfTube.setInputDiameter({diameter});
			
			this.divs.tubeWf.style.display = '';
		}		

		this.inputName.value = txtName;
		
		this.container.style.display = ''; 			
	}
}







