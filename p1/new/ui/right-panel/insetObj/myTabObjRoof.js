

class MyTabObjRoof 
{
	constructor()
	{
		this.init();
	}
	
	init()
	{
		const container = myPanelR.myContentObj.divContentInfo;
		
		const div = this.crDiv();
		container.append(div);
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
		`<div nameId="bl_roof_3d" style="display: none;">  
			
			<div class="button1 button_gradient_1" nameId="btn_copy_roof" style="font-size: 14px; font-weight: normal; width: 140px; height: auto; padding: 5px; margin: 10px auto;">
				копировать крышу	
			</div>
			
			<div>
				<div class="rp_1_1_list">
					<div class="rp_1_2_list" nameId="color_roof_1">

					</div>				 							
				</div>						
			</div>					
		</div>`;
		

		return html;
	}
		
}







