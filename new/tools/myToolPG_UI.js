



class MyToolPG_UI 
{
		
	constructor({container})
	{
		this.el = null;	
		this.init({container});
	}
	
	init({container})
	{
		let div = document.createElement('div');			
		div.innerHTML = this.html();
		this.el = div.children[0];
		
		container.append(this.el);
		
		this.initEvent();			
	}
	
	initEvent()
	{
		//this.el.addEventListener('mousedown', function(e) { e.stopPropagation(); });
		//this.el.addEventListener('mousemove', function(e) { e.stopPropagation(); });
		//this.el.addEventListener('mouseup', function(e) { e.stopPropagation(); });	
	}
	
	html()
	{
		const css1 = `position: absolute; left: 10px; bottom: 0; height: 80px;`;
		
		let str = 
		`<div nameId="block_pos" class="block_pos" ui_1="">
			<div style="display: flex;">
				<div style="display: flex; align-items: center;">
					<div class="button1 button_gradient_1" nameId="select_pivot">
						<img src="${infProject.path}/img/move_1.png">
					</div>	
					
					<div class="flex_1 input_rotate">
						<input type="text" nameId="object_pos_X" value="0">
						<input type="text" nameId="object_pos_Y" value="0">
						<input type="text" nameId="object_pos_Z" value="0">
					</div>	
				</div>
				
				<div style="display: flex; align-items: center; margin-left: 40px;">
					<div class="button1 button_gradient_1" nameId="select_gizmo">
						<img src="${infProject.path}/img/rotate_1.png">	
					</div>	

					<div class="flex_1 input_rotate">
						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_X_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_X" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_X_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>
						
						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_Y" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Y_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>

						<div class="flex_1" style="position: relative; margin: 0 5px;">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90m" style="position: absolute; left: 0; width: 10px;">-</div>
							<input type="text" nameId="object_rotate_Z" value="0">
							<div class="button1 button_gradient_1" nameId="obj_rotate_Z_90" style="position: absolute; right: 0; width: 10px;">+</div>
						</div>									
						
					</div>	

					<div class="flex_1">
						<div style="width: 20px; height: 2px; background: rgb(247, 72, 72);"></div>
						<div style="width: 20px; height: 2px; background: rgb(17, 255, 0);"></div>
						<div style="width: 20px; height: 2px; background: rgb(72, 116, 247);"></div>
					</div>
										
				
					<div class="button1 button_gradient_1" nameId="obj_rotate_reset">
						сбросить	
					</div>											
				</div>
				
			</div>
		</div>`;					
		
		return str;
	}


}



