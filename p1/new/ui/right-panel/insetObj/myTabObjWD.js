

class MyTabObjWD 
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
		`<div class="flex_column_1" nameId="rp_menu_wd" style="display: none;">
			<div class="flex_1">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						длина
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-length" value="0">
				</div>
			</div>
			
			<div class="flex_1">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						высота
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px;" nameId="size-wd-height" value="0">
				</div>
			</div>	

			<div class="flex_1" nameId="rp_item_wd_h1">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						над полом
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px;" nameId="rp_wd_h1" value="0">
				</div>
			</div>					
			
			<div class="flex_1" style="margin: 15px auto;">						
				<div class="button1 button_gradient_1" nameId="sw_dw_1" style="width: 30px; height: 30px; margin: 5px; padding: 5px;">
					<svg width="100%" height="100%" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
					 <g>
					  <path id="svg_25" d="m8.636221,26.014259l18.863752,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
					  <path transform="rotate(-180, 27.4995, 41.2721)" id="svg_23" d="m8.635712,53.719929l18.863752,-24.89781l18.863752,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
					 </g>
					</svg>	
				</div>	
				<div class="button1 button_gradient_1" nameId="sw_dw_2" style="width: 30px; height: 30px; margin: 5px; padding: 5px;">
					<svg width="100%" height="100%" viewBox="0 0 55 55" xmlns="http://www.w3.org/2000/svg">
					 <g>
					  <path transform="rotate(90, 41.4493, 27.5012)" id="svg_25" d="m22.585522,39.94907l18.86375,-24.89781l18.863754,24.89781z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
					  <path transform="rotate(-90, 13.6147, 27.4983)" id="svg_23" d="m-5.249556,39.948669l18.863752,-24.897808l18.863754,24.897808z" opacity="0.5" fill-opacity="null" stroke-opacity="null" stroke-width="0.5" stroke="#000" fill="#595959"/>
					 </g>
					</svg>	
				</div>							
			</div>					
		</div>`;
		

		return html;
	}
		
}







