
// ColorPicker
class MyColorPicker
{
	wrap;
	container;
	planeColor;
	divColor;
	divLineGradient;
	arrowsLineG;
	dataLineG = {height: 180, width: 20, Hue: 0};
	currentObj = null;
	oldColor = null;
	divObjColor = null;
	
	
	constructor()
	{
		this.wrap = this.crDiv({type: 1});
		document.body.append(this.wrap);
		
		this.container = this.crDiv({type: 2});		
		this.wrap.prepend(this.container);	
		
		this.planeColor = this.container.querySelector('[nameId="planeColor"]');
		this.divColor = this.container.querySelector('[nameId="divColor"]');
		this.arrowsLineG = this.container.querySelector('[nameId="arrows"]');
		this.circle = this.container.querySelector('[nameId="circle"]');
		this.line = this.container.querySelector('[nameId="line"]');		
		
		this.divLineGradient = this.crLineGradient();		
		this.line.append(this.divLineGradient);
				
		this.V = 100;
		this.S = 0;
		
		this.init();
	}
	
	init()
	{
		this.initEventPlaneGradient();
		this.initEventLineGradient();
		this.initEvent();
	}

	crDiv({type})
	{
		const div = document.createElement('div');
		
		let html = '';
		
		if(type === 1) html = this.html_1();
		if(type === 2) html = this.html_2();
		
		div.innerHTML = html;
		
		return div.children[0];	
	}
	
	
	html_1()
	{
		const cssWrap =
		`display: none;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		font-family: arial, sans-serif;
		background: rgba(0, 0, 0, 0.0);
		user-select: none;`;

		const html = `<div style="${cssWrap}"></div>`;

		return html;
	}
	
	
	html_2()
	{
		const html = 
		`<div nameId="pickerColor" style="position: absolute; width: 230px; top: 30%; left: 40%; padding: 4px; border: solid 1px #b3b3b3; background: #f5f5f5; z-index: 4; opacity: 1;">
			<div style="position: relative;">
				<div nameId="line" style="position: absolute; left: 197px; cursor: pointer;">
					<div nameId="arrows" style="position: absolute; top: 0; margin-top: -4px; left: -11px; width: 40px; cursor: pointer;">
						<div class="left_arrow" style="width:0; height:0; position:absolute; border-bottom:6px solid transparent; border-left:10px solid black; border-top:6px solid transparent; border-right:8px solid transparent; cursor: pointer;"></div>
						<div class="right_arrow" style="width:0; height:0; left:23px; position:absolute; border-bottom:6px solid transparent; border-left:10px solid transparent; border-top:6px solid transparent; border-right:10px solid black; cursor: pointer;"></div>
					</div>
				</div>

				<div nameId="planeColor" style="background: red; height: 180px; width: 180px; cursor: pointer;">
					<img src="${infProject.path}img/colorPicker/bgGradient.png" style="width:180px;">
					<div nameId="circle" style="width:8px; height:8px; border:1px solid black; border-radius:50%; position:absolute; left:0; top:0;"></div>
				</div>

				<div nameId="divColor" style="height: 20px; background: #FFF; border: solid 1px #b3b3b3; margin-top: 10px;"></div>
				
				<div style="display: flex; margin-top: 10px; justify-content: space-between;">
				
					<div nameId="btnOk" style="text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
						применить
					</div>

					<div nameId="btnCancel" style="margin-left: 10px; text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
						отменить
					</div>
				</div>			
			</div>
		</div>`;

		return html;
	}


	// создаем градиент линии
	crLineGradient()
	{
		const width = this.dataLineG.width;
		const height = this.dataLineG.height;
		
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		canvas.style.cssText = `position: absolute; z-index: 1;`;
		const ctx = canvas.getContext("2d");

		const gradient = ctx.createLinearGradient(width/2, height, width/2, 0);

		const hue = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]];

		for (let i=0; i <= 6;i++)
		{
			const color = 'rgb('+hue[i][0]+','+hue[i][1]+','+hue[i][2]+')';
			gradient.addColorStop(i*1/6, color);
		};
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0, width ,height);
		
		return canvas;
	}

	
	initEvent()
	{
		this.wrap.onmousedown = (e) => { this.closeWinOnWrap(e); }
		
		const btnOk = this.container.querySelector('[nameId="btnOk"]');
		const btnCancel = this.container.querySelector('[nameId="btnCancel"]');
		
		btnOk.onmousedown = () => 
		{ 
			this.divObjColor.style.background = this.divColor.style.background;
			this.showHidePicker({show: false}); 
		}
		
		btnCancel.onmousedown = () => 
		{ 
			this.changeColorObj({color: this.oldColor});
			this.showHidePicker({show: false}); 
		}

		// отменяем событие выбора цвета
		this.wrap.onmouseup = () => { this.wrap.onmousemove = null; }
	}
	
	// событие по линии градиента
	initEventLineGradient()
	{
		this.divLineGradient.onmousedown = (e1) =>
		{
			this.lineGradientMove(e1);
			this.wrap.onmousemove = (e2) => { this.lineGradientMove(e2); }
		}	
	}

	// событие по плоскости градиента
	initEventPlaneGradient()
	{
		this.planeColor.onmousedown = (e1) =>
		{ 
			this.circlePickerMove(e1);
			this.wrap.onmousemove = (e2) => { this.circlePickerMove(e2); }
		}
		
		this.planeColor.ondragstart = () => { return false; }
		this.planeColor.onselectstart = () => { return false; }		
	}
	

	// перетаскиваем курсор по линии градиента
	lineGradientMove(e)
	{
		const height = this.dataLineG.height;
		
		let top = e.pageY - this.divLineGradient.getBoundingClientRect().top;
		top = (top < 0 )? 0 : top;
		top = (top > height )? height : top;

		this.arrowsLineG.style.top = top-2 +"px";
		let t =  Math.round(top /(height/ 360));
		t = Math.abs(t - 360);
		t = (t == 360)? 0 : t;

		this.dataLineG.Hue = t;

		this.planeColor.style.background = "rgb("+this.hsv_rgb(t,100,100)+")";
		this.divColor.style.background = "rgb("+this.hsv_rgb(t, this.S, this.V)+")";
		
		this.changeColorObj({color: this.divColor.style.background});
	}
	
	
	// перетаскиваем курсор по плоскости градиента
	circlePickerMove(e)
	{
		const planeColor = this.planeColor;
		const circle = this.circle;

		const bound1 = planeColor.getBoundingClientRect();
		
		const cW = circle.offsetWidth ;
		const cH = circle.offsetHeight;
		const bWi = planeColor.offsetWidth - cW;
		const bHe = planeColor.offsetHeight - cH;
		const pxY = bHe / 100; 
		const pxX = bWi / 100;		
		const bPstX = bound1.left;
		const bPstY = bound1.top;	
	
		let left = e.pageX - bPstX  - cW/2;
		left = (left < 0) ? 0 : left;
		left = (left > bWi) ? bWi  : left;

		let top = e.pageY  - bPstY - cH/2;
		top = (top > bHe) ? bHe : top;
		top = (top < 0) ? 0 : top;
		
		circle.style.left = left + "px";
		circle.style.top = top + "px";
		
		const S = Math.ceil(left /pxX);
		const V = Math.ceil(Math.abs(top / pxY - 100));
					 
		if (V < 50) circle.style.borderColor = "#fff";
		else circle.style.borderColor = "#000";
		
		this.S = S;
		this.V = V;

		this.divColor.style.background = "rgb("+this.hsv_rgb(this.dataLineG.Hue, S, V)+")";

		this.changeColorObj({color: this.divColor.style.background});
	}

	
	// конвертация цвета 
	hsv_rgb(H,S,V)
	{	 
		let f , p, q , t, lH;
		let R, G, B;
		
		S /=100;
		V /=100;

		lH = Math.floor(H / 60);

		f = H/60 - lH;
		p = V * (1 - S); 
		q = V *(1 - S*f);
		t = V* (1 - (1-f)* S);

		switch (lH)
		{
			case 0: R = V; G = t; B = p; break;
			case 1: R = q; G = V; B = p; break;
			case 2: R = p; G = V; B = t; break;
			case 3: R = p; G = q; B = V; break;
			case 4: R = t; G = p; B = V; break;
			case 5: R = V; G = p; B = q; break;
		}

		return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
	}
	
	
	// меняем цвет у выделенного объекта
	changeColorObj({color})
	{
		if(!this.currentObj) return;
		
		const obj = this.currentObj;
		
		if(obj.userData.tag === 'tubeWf')
		{
			myWarmFloor.myTubeWf.changeColorTube({tube: obj, color});
		}		
	}
		
	// скрываем/показываем colorPicker
	showHidePicker({show, div = null})
	{
		if(show) 
		{ 
			this.wrap.style.display = '';
			this.resetObj();
			this.openColorPicker({div});
			this.setPosModal({el: div});
		}
		else 
		{ 
			this.wrap.style.display = 'none';
			this.resetObj();			
		}
	}

	// закрываем окно кликнув в пустоту 
	closeWinOnWrap = (event) =>
	{ 
		if (this.wrap === event.target) 
		{ 
			this.changeColorObj({color: this.oldColor});
			this.showHidePicker({show: false});
		}
	}

	// при открытие ColorPicker устанавливаем цвета в нужные положения
	openColorPicker({div})
	{
		const obj = myComposerRenderer.getOutlineObj();
		if(!obj) return;
		
		let color = null;
		
		if(obj.userData.tag === 'tubeWf')
		{
			color = myWarmFloor.myTubeWf.getColorTube({tube: obj});
		}
		
		if(!color) return;
		
		const colorStr = '#'+ color.clone().getHexString();
		
		this.setObj({obj, color: colorStr, div});
				
		this.divColor.style.background = colorStr;
			
		const hsv = this.rgb2hsv(color.r, color.g, color.b);
		
		this.arrowsLineG.style.top = (Math.abs(hsv.h - 360) * (this.dataLineG.height/ 360) - 2) + 'px';		
		this.planeColor.style.backgroundColor = "rgb("+this.hsv_rgb(hsv.h,100,100)+")";		

		const bound1 = this.planeColor.getBoundingClientRect();		
		const cW = this.circle.offsetWidth ;
		const cH = this.circle.offsetHeight;
		const bWi = this.planeColor.offsetWidth - cW;
		const bHe = this.planeColor.offsetHeight - cH;
		const pxY = bHe / 100; 
		const pxX = bWi / 100;
		
		this.circle.style.top = Math.ceil(Math.abs((hsv.v - 100) * pxY)) + "px";
		this.circle.style.left = Math.ceil(hsv.s * pxX)   + "px";
		
		if (hsv.v < 50) this.circle.style.borderColor = "#fff";
		else this.circle.style.borderColor = "#000";

		this.dataLineG.Hue = hsv.h;
		this.S = hsv.s;
		this.V = hsv.v;			
	}

	rgb2hsv(r, g, b) 
	{
		let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
		rabs = r;
		gabs = g;
		babs = b;
		v = Math.max(rabs, gabs, babs),
		diff = v - Math.min(rabs, gabs, babs);
		diffc = c => (v - c) / 6 / diff + 1 / 2;
		percentRoundFn = num => Math.round(num * 100) / 100;
		
		if (diff == 0) 
		{
			h = s = 0;
		} 
		else 
		{
			s = diff / v;
			rr = diffc(rabs);
			gg = diffc(gabs);
			bb = diffc(babs);

			if (rabs === v) {
				h = bb - gg;
			} else if (gabs === v) {
				h = (1 / 3) + rr - bb;
			} else if (babs === v) {
				h = (2 / 3) + gg - rr;
			}
			if (h < 0) {
				h += 1;
			}else if (h > 1) {
				h -= 1;
			}
		}
		
		return { h: Math.round(h * 360), s: percentRoundFn(s * 100), v: percentRoundFn(v * 100) };
	}


	// устанавливаем ColorPicker рядом с элементом/кнопкой на которую кликнули 
	setPosModal({el})
	{		
		const rect = el.getBoundingClientRect();
		
		let top = (rect.top + rect.height/2 - this.container.clientHeight);		
		if(top < 10) { top = 10; }
		this.container.style.top = top+'px';
		this.container.style.left = (rect.left - 20 - this.container.clientWidth)+'px';		
	}
	
	// при открытии записываем данные
	setObj({obj, color, div})
	{
		this.currentObj = obj;
		this.oldColor = color;
		this.divObjColor = div;
	}
	
	// при закрытии сбрасываем данные
	resetObj()
	{
		this.currentObj = null;
		this.oldColor = null;
		this.divObjColor = null;
	}
}







