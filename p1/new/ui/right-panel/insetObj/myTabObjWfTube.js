

class MyTabObjWfTube 
{
	inputLength;
	inputDiameter;
	
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		const container = myPanelR.myContentObj.divContentInfo;
		
		const div = this.crDiv();
		container.append(div);
		
		this.inputLength = div.querySelector('[nameId="tube-wf-length"]');
		this.inputDiameter = div.querySelector('[nameId="tube-wf-diameter"]');
		
		this.initEvent();
	}
	
	initEvent()
	{
		this.inputDiameter.onkeydown = (e) => 
		{
			if (e.code === 'Enter') 
			{
				this.changeInputDiameter({diameter: Number(e.target.value)});
			}
		};		
		
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
		`<div class="flex_column_1" nameId="bl_tubeWf" style="display: none;">
			<div class="flex_1">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						длина
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px; background: #eee; cursor: default;" nameId="tube-wf-length" value="0" readonly>
				</div>
			</div>
			
			<div class="flex_1">
				<div class="flex_1 align_items">
					<div class="rp_label_plane">
						диаметр
					</div>
				</div>
				<div class="flex_1 align_items" style="width: auto;">
					<input type="text" style="width: 90%; margin:5px 5px;" nameId="tube-wf-diameter" value="0">
				</div>
			</div>						
								
		</div>`;
		

		return html;
	}
	
	
	// ставим длину трубы
	setInputLength({length})
	{
		this.inputLength.value = length;
	}
	
	// ставим диаметр трубы
	setInputDiameter({diameter})
	{
		diameter *= 1000;		
		diameter = Math.round(diameter * 100)/100;
		
		this.inputDiameter.value = diameter;
	}
	
	// в input поменяли диаметр трубы
	changeInputDiameter({diameter})
	{
		const obj = myComposerRenderer.getOutlineObj();		
		if(!obj) return;
		if(obj.userData.tag !== 'tubeWf') return;
		
		// проверка на правильный ввод числа
		const result = checkNumberInput({ value: diameter, unit: 1, abs: true, limit: {min: 10, max: 1000} });
		
		if(!result)
		{
			diameter = myWarmFloor.myTubeWf.getDiameterTube({tube: obj});
			diameter *= 1000;		
			diameter = Math.round(diameter * 100)/100;			
		}
		else
		{
			diameter = result.num;
		}

		myWarmFloor.myTubeWf.changeDiameterTube({tube: obj, diameter: diameter/1000});
		
		this.setInputDiameter({diameter: diameter/1000});
	}
}







