
// ColorPicker
class MyColorPicker
{
	wrap;
	container;
	planeColor;
	currentColor;
	divLineGradient;
	arrowsLineG;
	dataLineG = {height: 180, width: 20, Hue: 0};
	
	constructor()
	{
		this.wrap = this.crDiv({type: 1});
		document.body.append(this.wrap);
		
		this.container = this.crDiv({type: 2});		
		this.wrap.prepend(this.container);	
		
		this.planeColor = this.container.querySelector('[nameId="planeColor"]');
		this.currentColor = this.container.querySelector('[nameId="currentColor"]');
		this.arrowsLineG = this.container.querySelector('[nameId="arrows"]');
		this.circle = this.container.querySelector('[nameId="circle"]');
		this.line = this.container.querySelector('[nameId="line"]');		

		
		this.divLineGradient = this.crLineGradient();		
		this.line.append(this.divLineGradient);
		
		this.cW = this.circle.offsetWidth ;
		this.cH = this.circle.offsetHeight;
		this.bWi = this.planeColor.offsetWidth - this.cW;
		this.bHe = this.planeColor.offsetHeight - this.cH;
		this.pxY = this.bHe / 100; 
		this.pxX = this.bWi / 100;		
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
		`display: block;
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		font-family: arial, sans-serif;
		background: rgba(0, 0, 0, 0.5);
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

				<div nameId="currentColor" style="height: 20px; background: #FFF; border: solid 1px #b3b3b3; margin-top: 10px;"></div>
				
				<div style="display: flex; margin-top: 10px; justify-content: space-between;">
				
					<div nameId="btnOk" style="text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
						применить
					</div>

					<div nameId="btnClose" style="margin-left: 10px; text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
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
		const btnClose = this.container.querySelector('[nameId="btnClose"]');
		
		btnOk.onmousedown = () => { this.showHidePicker({show: false}); }
		btnClose.onmousedown = () => { this.showHidePicker({show: false}); }

		// отменяем событие выбора цвета
		this.wrap.onmouseup = () => { this.wrap.onmousemove = null; }
	}
	
	
	initEventLineGradient()
	{
		this.divLineGradient.onmousedown = () =>
		{
			this.wrap.onmousemove = (e) => { this.lineGradientMove(e); }
		}	
	}


	initEventPlaneGradient()
	{
		this.planeColor.onmousedown = () =>
		{
			this.wrap.onmousemove = (e) =>
			{
				this.circlePickerMove(e);
			}
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
		this.currentColor.style.background = "rgb("+this.hsv_rgb(t, this.S, this.V)+")";
		
		//SettMat.changeColorTexture_2({ material: picker.mat, value: picker.out_color.style.backgroundColor });
	}
	
	
	// перетаскиваем курсор по плоскости градиента
	circlePickerMove(e)
	{
		const planeColor = this.planeColor;
		const circle = this.circle;
		const cW = this.cW;
		const cH = this.cH;
		const bWi = this.bWi;
		const bHe = this.bHe;
		const pxY = this.pxY; 
		const pxX = this.pxX;		

		const bPstX = planeColor.getBoundingClientRect().left;
		const bPstY = planeColor.getBoundingClientRect().top;		
	
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

		this.currentColor.style.background = "rgb("+this.hsv_rgb(this.dataLineG.Hue, S, V)+")";

		//SettMat.changeColorTexture_2({ material: picker.mat, value: picker.out_color.style.backgroundColor });
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
	
		
	// скрываем/показываем colorPicker
	showHidePicker({show})
	{
		if(show) { this.wrap.style.display = ''; }
		else { this.wrap.style.display = 'none'; }
	}

	// закрываем окно кликнув в пустоту 
	closeWinOnWrap = (event) =>
	{ 
		if (this.wrap === event.target) 
		{ 			 
			this.showHidePicker({show: false});
		}
	}	
}





