
import * as THREE from '../../../../node_modules/three/build/three.module.js';
import * as Build from '../../../index.js';
import * as Pcolor from '../../../pickerColor.js';
import { BtnChildSettingMap } from './btn-setting-map.js';
import { DivChildTrnGeom } from './input-mod-geom.js';
import { BtnAddTexture } from './btn-add-texture.js';
import { BtnDelTexture } from './btn-del-texture.js';
import { changeColorTexture_2 } from '../../../settMat.js';


export class ItemMesh
{
	constructor({container, obj, material, gclone, f})
	{
		this.elem = null;
		
		this.f = f;
		this.clTrnGeom = null;
		
		this.creatItem({container});
		this.initEvent({obj, material, gclone});
	}
		

	htmlItem()
	{
		let html = `
		<div style="display: flex; height: 90px; border-bottom: 1px solid #D1D1D1;">
			<div style="display: flex; width: 100%; height: 100%; box-sizing: border-box; border: 1px solid #F0F0F0;">
				<div style="display: -webkit-box; display: flex; justify-content: space-between; width: 100%; margin: auto 16px;">		

					<div style="display: -webkit-box; display: flex; flex-direction: column; justify-content: space-between; width: 115px; overflow: hidden;">
						<div style="user-select: none;">
							<div nameId="name_geometry" style="margin: 0; font-size: 12px; line-height: 14px; color: #4A4A4A; cursor: pointer;">
								Geometry			
							</div>
							
							<div nameId="name_material" style="margin: 4px 0 0 0; font-size: 12px; line-height: 14px; color: #9E9E9E;">
								Material			
							</div>
						</div>
										
						<div nameId="item_trn"></div>
					</div>
					
					<div style="display: -webkit-box; display: flex;">
						<div nameId="item_1" style="display: flex; align-items: flex-end;"></div>
						
						<div style="display: -webkit-box; display: flex; flex-direction: column; justify-content: space-between;">
							<div nameId="colorPick_2" class="matColorPick"></div>
							
							<div style="width: 28px; height: 28px; cursor: pointer;">
								<img nameId="matSvg" src="" style="width: 100%; height: 100%;">
							</div>				
						</div>
						
						<div nameId="itemTexture" style="display: flex; position: relative;"></div>				
					</div>
				
				</div>
			</div>
		</div>	
		`;			
		
		return html;
	}
	
	
	
	creatItem({container})
	{		
		let div = document.createElement('div');			
		div.innerHTML = this.htmlItem();
		this.elem = div.children[0];

		container.append(this.elem);
	}
	
	

	initEvent({obj, material, gclone})
	{
		let el = this.elem;
		
		let elNameMat = el.querySelector('[nameId="name_material"]');
		let elNameGeom = el.querySelector('[nameId="name_geometry"]');
		let elColor = el.querySelector('[nameId="colorPick_2"]');
		let elTypeM = el.querySelector('[nameId="matSvg"]');
		
		elNameGeom.innerText = material.userData.meshName;
		elNameMat.innerText = material.userData.name;
		
		
		let clAddT = new BtnAddTexture({elem: el, material});
		let clDelT = new BtnDelTexture({elem: el, material, clAddT});
		clAddT.clDelT = clDelT;
		
		new BtnChildSettingMap({elem: el, material});
		this.clTrnGeom = new DivChildTrnGeom({elem: el, obj, gclone});
								
		
		Build.infProg.class.rPanel.typeMat.getSrcTypeMaterial({type: material.userData.type, el: elTypeM});
		
		changeColorTexture_2({material: material, el: elColor, value: '#'+material.color.getHexString()});							

		elTypeM.onmousedown = (e) => { Build.infProg.class.rPanel.typeMat.openModal({material: material, el: elTypeM}); e.stopPropagation(); }			
		elColor.onmousedown = (e) => { Pcolor.openPickerColor({material: material, elColor: elColor}); }

		
		elNameGeom.onmousedown = () => { this.f.selectItemFromUI({el, obj}); }
	}
	
	
	deleteElemItem()
	{
		this.elem.remove();
	}
}










