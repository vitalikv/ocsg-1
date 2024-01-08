
// контент дом в правой панели
class MyContentPlan
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
		const container = document.querySelector('[nameId="panelPlan"]');
		const wrapDiv = container.querySelector('[nameId="contPlanR"]');		
		
		const div = this.crDiv();
		wrapDiv.append(div);
		
		this.container = div.querySelector('[nameId="wrap_plan"]');
		
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


	crDiv()
	{
		const div = document.createElement('div');
		div.innerHTML = this.html();
		return div;	
	}
	

	html()
	{
		const html =
		`<div class="flex_column_1" nameId="wrap_plan_3d" style="display: none; overflow: auto;">
			<div class="right_panel_1_1_h">Дом</div>
			<div class="right_panel_1_1_h">Работает только в 2D</div>
		</div>
		
		<div class="flex_column_1" nameId="wrap_plan" style="display: none; overflow: auto;">
			<div class="right_panel_1_1_h">Дом</div>
			
			
			<div class="flex_column_1 rp_item_plane">			
				<div class="flex_1">
					<div class="flex_column_1">
						<div nameId="wall" class="button2 button_gradient_1" style="font-size: 14px; font-weight: normal;"><div>стена</div></div>
					</div>		
					
					<div class="flex_1 align_items">
						<div class="rp_label_plane">
							толщина
						</div>
					</div>
					<div class="flex_1 align_items" style="width: auto;">
						<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wall_width_1" value="0">
					</div>
				</div>							
			</div>				
			
			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_column_1">
						<div nameId="list_btn_door" style="width: 80px; margin: auto;">
						
						</div>							
					</div>	

					<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_length_1" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_door_height_1" value="0">
							</div>
						</div>				
					</div>			
				</div>

			</div>

			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_column_1">						
						<div nameId="list_btn_wind" style="width: 80px; margin: auto;">
						
						</div>						
					</div>

					<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_length_1" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_height_1" value="0">
							</div>
						</div>	

						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									над полом
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wind_above_floor_1" value="0">
							</div>
						</div>
					</div>
					
				</div>			
			</div>	

			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_column_1">
						<div nameId='create_gate_1' class="button2 button_gradient_1" style="font-size: 14px; font-weight: normal;">ворота</div>
					</div>
				
					<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_gate_length_1" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									высота
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_gate_height_1" value="0">
							</div>
						</div>									
					</div>
				</div>
			</div>
			


			<div class="flex_column_1 rp_item_plane">
				<div class="flex_1">
					<div class="flex_column_1">
						<div nameId="list_btn_roof" style="width: 80px; margin: auto;">
						
						</div>						
					</div>
					
					<div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									ширина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_roof_width_1" value="0">
							</div>
						</div>
						
						<div class="flex_1">
							<div class="flex_1 align_items">
								<div class="rp_label_plane">
									длина
								</div>
							</div>
							<div class="flex_1 align_items" style="width: auto;">
								<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_roof_length_1" value="0">
							</div>
						</div>									
					</div>
				</div>
			</div>			
						
		</div>`;

		
		return html;
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







