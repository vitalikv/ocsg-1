

class MyTabObjObject 
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
		`<div nameId="bl_object_3d" style="display: none;">							
			
			<div class="button1 button_gradient_1" nameId="button_copy_obj" style="font-size: 14px; font-weight: normal; width: 140px; height: auto; padding: 5px; margin: 10px auto;">
				копировать объект	
			</div>																
			

			<div>
				<div class="rp_1_1_list" style="max-height: 550px;">
					<div class="rp_1_2_list" nameId="catalog_texture_obj">

					</div>				 							
				</div>						
			</div>	
			
			<div nameId="sp_block_drt" style="display:none">

			</div> 
		</div>`;
		

		return html;
	}
		
}







