
import * as Build from '../../index.js';
import * as MGeom from '../../modifierGeometry.js'


export class UItrnInput
{
	constructor()
	{
		this.elem = null;
		this.wrTr_1 = null;
		this.divTr_1 = null;
		this.warningTr_1 = null;
		this.warningTr_2 = null;
		
		this.init();
	}
	
	
	init()
	{		
		let div = document.createElement('div');
		div.innerHTML = this.html();
		this.elem = div.firstChild;		
		document.body.querySelector('[nameId="divModGeom"]').prepend(this.elem);
		
		this.wrTr_1 = this.elem.querySelector('[nameId="wr_triangles_1"]');
		this.divTr_1 = this.elem.querySelector('[nameId="div_triangles_1"]');		
		this.warningTr_1 = this.elem.querySelector('[nameId="div_warning_tr_1"]');
		this.warningTr_2 = this.elem.querySelector('[nameId="div_warning_tr_2"]');
	}
	
	html()
	{
		let html = 
		`<div nameId="wrap_slider_geom" style="padding-bottom: 12px; border: 1px solid #F0F0F0;">
			<div style="margin-top: 8px; font-size: 12px; color: #4A4A4A;">
				<div style="margin-left: 21px;">
					${infProject.text.rp.tri}
				</div>
				
				<div style="display: flex; align-items: center;">						
					<div nameId='wr_triangles_1' class="wr_triangles_1" style="margin-left: 18px; font-size: 14px;">
						<div nameId='div_triangles_1' style="margin: 0 6px; color: #4A4A4A; overflow: hidden;">0</div>
					</div>


					<div nameId="div_warning_tr_1" style="display: none; align-items: center; height: 20px; margin-left: 10px; border-radius: 10px; background: #FF894D;">
						<img src="img/i_warning.png" style="margin-left: 6px;">
						<div style="margin: 0 8px 0 4px; font-size: 12px; line-height: 14px; color: #FFFFFF;">
							${infProject.text.pp.muchtri_1}
						</div>
					</div>
					
					<div nameId="div_warning_tr_2" style="display: none; align-items: center; height: 20px; margin-left: 10px; border-radius: 10px; background: #0BB70B;">
						<img src="img/svg/vector.svg" style="margin-left: 6px;">
						<div style="margin: 0 8px 0 4px; font-size: 12px; line-height: 14px; color: #FFFFFF;">
							${infProject.text.pp.muchtri_2}
						</div>
					</div>					
				</div>						
			</div>
			
			<div nameId="blockDivUpdateGeom"></div>
		</div>`;					
					
		return html;
	}
	

	
	initEvent()
	{
		//this.elem.onmousedown = (e) => { this.buttonClick(); e.stopPropagation(); } 					
	}


	// подсчет полигонов при загрузки модели
	getStartCountTr()
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;

		let triangles = 0;
		
		obj.traverse(function(child) 
		{
			if (child.isMesh && child.geometry && child.geometry.attributes  && child.geometry.attributes.position) 
			{ 
				triangles += child.geometry.attributes.position.count/3; 
			}
		});	

		this.wrTr_1.style.border = '';
		this.divTr_1.innerText = Math.round(triangles);			
		this.warningTr_1.style.display = (triangles > Build.infProg.limitTr) ? 'flex' : 'none';
		this.warningTr_2.style.display = 'none';
		
		if(triangles > Build.infProg.limitTr) Build.infProg.class.rPanel.elem.gmod.actBtn();
	}

	
	// подсчет полигонов при удалении частей, reset
	getCountTr_1()
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;

		let triangles = 0;
		
		obj.traverse(function(child) 
		{
			if (child.isMesh && child.geometry && child.geometry.attributes  && child.geometry.attributes.position) 
			{ 
				triangles += child.geometry.attributes.position.count/3; 
			}
		});	

		this.wrTr_1.style.border = '';
		this.divTr_1.innerText = Math.round(triangles);			
		this.warningTr_1.style.display = (triangles > Build.infProg.limitTr) ? 'flex' : 'none';
		this.warningTr_2.style.display = 'none';
		
	}


	// подсчет полигонов после оптимизации модели
	getCountTr_2()
	{
		if(!Build.infProg.scene) return;
		
		let obj = Build.infProg.scene;

		let triangles = 0;
		
		obj.traverse(function(child) 
		{
			if (child.isMesh && child.geometry && child.geometry.attributes  && child.geometry.attributes.position) 
			{ 
				triangles += child.geometry.attributes.position.count/3; 
			}
		});	

		this.wrTr_1.style.border = '';
		this.divTr_1.innerText = Math.round(triangles);					
		this.warningTr_1.style.display = 'none';
		this.warningTr_2.style.display = 'none';
		
		
		if(triangles < Build.infProg.limitTr)
		{
			this.warningTr_2.style.display = 'flex';
			this.wrTr_1.style.border = '1px solid #0BB70B';
		}
		else
		{
			this.warningTr_1.style.display = 'flex';
		}
	}	
}





