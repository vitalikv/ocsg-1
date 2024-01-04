
// класс для интерфейса вкладки Дом
class TabPlan
{
	container;
	inputs = {};
	
	constructor()
	{
		this.init();
		
		this.startSetInputValue();
		
		this.addBtnTube();
	}
	
	init()
	{
		this.container = document.querySelector('[nameId="wrap_plan"]');
		
		// x - длина, y - высота, z - толщина,  h1 - высота над полом
		this.inputs.wall = {z: null};
		this.inputs.door = {x: null, y: null};
		this.inputs.wind = {x: null, y: null, h1: null};
		this.inputs.gate = {x: null, y: null};
		this.inputs.roof = {x: null, z: null};
		
		this.inputs.wall.z = this.container.querySelector('[nameId="rp_wall_width_1"]');
		
		this.inputs.door.x = this.container.querySelector('[nameId="rp_door_length_1"]');
		this.inputs.door.y = this.container.querySelector('[nameId="rp_door_height_1"]');
		
		this.inputs.wind.x = this.container.querySelector('[nameId="rp_wind_length_1"]');
		this.inputs.wind.y = this.container.querySelector('[nameId="rp_wind_height_1"]');
		this.inputs.wind.h1 = this.container.querySelector('[nameId="rp_wind_above_floor_1"]');
		
		this.inputs.gate.x = this.container.querySelector('[nameId="rp_gate_length_1"]');
		this.inputs.gate.y = this.container.querySelector('[nameId="rp_gate_height_1"]');
		
		this.inputs.roof.x = this.container.querySelector('[nameId="rp_roof_length_1"]');
		this.inputs.roof.z = this.container.querySelector('[nameId="rp_roof_width_1"]');				
	}
	
	initEvent()
	{
				
	}

	// устанавливаем значения в input для вкладки план (окно/дверь/толщина стены/высота этажа)
	startSetInputValue()
	{		
		this.inputs.wall.z.value = infProject.settings.wall.width;
		
		this.inputs.door.x.value = infProject.settings.door.width;
		this.inputs.door.y.value = infProject.settings.door.height;
		
		this.inputs.wind.x.value = infProject.settings.wind.width;
		this.inputs.wind.y.value = infProject.settings.wind.height;
		this.inputs.wind.h1.value = infProject.settings.wind.h1;
		
		this.inputs.gate.x.value = infProject.settings.gate.width;
		this.inputs.gate.y.value = infProject.settings.gate.height;

		this.inputs.roof.x.value = infProject.settings.roof.width;
		this.inputs.roof.z.value = infProject.settings.roof.length;	
	}

	addBtnTube()
	{
		const cssBtn =
		`width: auto;
		height: 20px; 
		margin: 30px 10px 10px 10px;
		text-decoration:none; 
		text-align:center; 
		padding:11px; 
		border:solid 1px #b3b3b3;   
		font-size:15px; 
		font-weight:bold; 
		color:#737373; 
		cursor: pointer;`;
		
		const html = 
		`<div style="margin: 0 auto; font-size: 15px; text-align:center;">
			<div nameId="btnTube" class="button_gradient_1" style="${cssBtn}">
				Труба
			</div>		
		</div>`;

		let btn = document.createElement('div');
		btn.innerHTML = html;
		btn = btn.children[0];	
		
		this.container.append(btn);
		
		btn.onmousedown = () => { console.log(22222); clickInterface({button: 'add_pointWf'}); }
	}
}







