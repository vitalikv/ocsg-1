
// класс для интерфейса вкладки Дом
class TabPlan
{
	container;
	inputs = {};
	
	constructor()
	{
		this.init();
		this.initEvent();
		this.startSetInputValue();
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
		const btnWall = this.container.querySelector('[nameId="wall"]');
		btnWall.onmousedown = () => { clickInterface({button: 'point_1'}); }
		
		const btnGate1 = this.container.querySelector('[nameId="create_gate_1"]');
		btnGate1.onmousedown = () => { clickInterface({button: 'create_gate_1'}); }						
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
}







