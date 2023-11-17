
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as SettMat from './settMat.js';


let mouse=
{
	pageX:function(b){var a,c,d;d=b||event;return null==d.pageX&&null!=d.clientX?(a=document.body,c=document.documentElement,b=c.scrollLeft||a&&a.scrollLeft||0,b=d.clientX+b-(c.clientLeft||a.clientLeft||0))/document.body.style.zoom:d.pageX/document.body.style.zoom},
	
	pageY:function(b){var a,c,d;d=b||event;return null==d.pageX&&null!=d.clientX?(a=document.body,c=document.documentElement,b=c.scrollTop||a&&a.scrollTop||0,b=d.clientY+b-(c.clientTop||a.clientTop||0))/document.body.style.zoom:d.pageY/document.body.style.zoom}
};

let Obj = 
{
	positX:function(b)
	{
		var a,c;
		a=0;
		c=b.getBoundingClientRect();
		b=document.body;
		a=document.documentElement;
		a=c.left+(a.scrollLeft||b&&b.scrollLeft||0)/document.body.style.zoom-(a.clientLeft||b.sclientLeft||0)/document.body.style.zoom;
		return Math.round(a)
	},

	positY:function(b)
	{
		var a,c;
		a=0;
		c=b.getBoundingClientRect();
		b=document.body;
		a=document.documentElement;
		a=c.top+(a.scrollTop||b&&b.scrollTop||0)/document.body.style.zoom-(a.clientTop||b.sclientTop||0)/document.body.style.zoom;
		return Math.round(a)
	}
};





export class PickerCn
{
	constructor()
	{
		this.V = 100;
		this.S = 100;
		this.lineSize = {h:180, w:20};
		this.status = false;
		this.el = {wrap: document.querySelector('[nameId="pickerColor"]'), buttOk: document.querySelector('[nameId="colorOk"]'), buttNo: document.querySelector('[nameId="colorStop"]')};
		
		let elPickColor = this.el.wrap;
		
		this.block = elPickColor.querySelector('[nameId="block_picker"]');
		this.th = elPickColor.querySelector('[nameId="arrows"]');
		this.circle = elPickColor.querySelector('[nameId="circle"]');
		this.line = elPickColor.querySelector('[nameId="line"]');
		this.out_color = document.querySelector('[nameId="out_color"]');
		
		this.cW = this.circle.offsetWidth ;
		this.cH = this.circle.offsetHeight;
		this.bWi = this.block.offsetWidth - this.cW;
		this.bHe = this.block.offsetHeight - this.cH;
		this.pxY = this.bHe / 100; 
		this.pxX = this.bWi / 100;		

		this.bPstX = 0;
		this.bPstY = 0;
		
		this.init();	
	}
	
	
	init()
	{
		Line.init({h: this.lineSize.h, w: this.lineSize.w, th: this.th, block: this.block, line: this.line});	//отрисовка линий hue и привязка событий

		this.actionBlockPicker();
		
		this.el.wrap.style.display = 'none';
		this.el.wrap.style.opacity = 1;
	}
	
	actionBlockPicker()
	{
		let block = this.block;
		let cPos = this.cPos.bind(this);
		
		
		block.onclick = function(e){ cPos(e); }
		block.onmousedown  = function ()
		{
			document.onmousemove = function (e)
			{
				cPos(e);
			}
		}

		document.onmouseup = function() { document.onmousemove = null; }
	}

	cPos(e)
	{
		let block = this.block;
		let circle = this.circle;
		let cW = this.cW;
		let cH = this.cH;
		let bWi = this.bWi;
		let bHe = this.bHe;
		let pxY = this.pxY; 
		let pxX = this.pxX;		
		let bPstX = this.bPstX;
		let bPstY = this.bPstY;

		bPstX = Obj.positX(block);
		bPstY = Obj.positY(block);		
	
		var top, left, S, V;
		
		document.ondragstart = function() { return false; }

		document.body.onselectstart = function() { return false; }

		left = mouse.pageX(e) - bPstX  - cW/2;
		left = (left < 0) ? 0 : left;
		left = (left > bWi) ? bWi  : left;

		circle.style.left = left + "px"; 

		S = Math.ceil(left /pxX) ;

		top = mouse.pageY(e)  - bPstY - cH/2;
		top = (top > bHe) ? bHe : top;
		top = (top < 0) ? 0 : top;
		circle.style.top = top + "px";
		V = Math.ceil(Math.abs(top / pxY - 100));
					 
		if (V <50) circle.style.borderColor = "#fff";
		else circle.style.borderColor = "#000";
		
		var picker = Build.infProg.picker;
		
		picker.S = S;
		picker.V = V;

		picker.out_color.style.backgroundColor = "rgb("+hsv_rgb(Line.Hue,S,V)+")";
		//var _res = hsv_rgb(Line.Hue,S,V);
		//_res = _res[0].toString(16)+""+_res[1].toString(16)+""+_res[2].toString(16);
		//console.log( _res );

		SettMat.changeColorTexture_2({ material: picker.mat, value: picker.out_color.style.backgroundColor });
	}	
}





export function buttonsEvent(params)
{
	let picker = Build.infProg.picker;
	
	let elColor = params.elColor;
	let buttOk = picker.el.buttOk;
	let buttNo = picker.el.buttNo;
	let elPickColor = picker.el.wrap;
	
	picker.mat = params.material;
	let defColor = '#'+params.material.color.getHexString();
	
	buttOk.onmousedown = function ()
	{
		SettMat.changeColorTexture_2({ material: params.material, el: elColor, value: picker.out_color.style.backgroundColor });
		elPickColor.style.display = 'none';
	}

	buttNo.onmousedown = function ()
	{ 
		SettMat.changeColorTexture_2({ material: params.material, value: defColor });
		elPickColor.style.display = 'none';
	}			
}


var Line =
{	  
	Hue: 0,
	
	init: function (elem)
	{
			
		var canvaLine, cAr, pst, block, t = 0;;

		canvaLine = Line.create(elem.h, elem.w, elem.line, "cLine");

		cAr = elem.th;
		block = elem.block;

		Line.posit = function (e)
		{
			var top = mouse.pageY(e) - pst;
			top = (top < 0 )? 0 : top;
			top = (top > elem.h )? elem.h  : top;

			cAr.style.top = top-2 +"px";
			t =  Math.round(top /(elem.h/ 360));
			t = Math.abs(t - 360);
			t = (t == 360)? 0 : t;

			Line.Hue = t;
			
			var picker = Build.infProg.picker;

			block.style.backgroundColor = "rgb("+hsv_rgb(t,100,100)+")";
			picker.out_color.style.backgroundColor= "rgb("+hsv_rgb(t,picker.S,picker.V)+")";
			
			SettMat.changeColorTexture_2({ material: picker.mat, value: picker.out_color.style.backgroundColor });
		}
		
		// события перемещения по линии
		cAr.onmousedown = function ()
		{
			pst = Obj.positY(canvaLine);
			document.onmousemove = function(e){Line.posit(e);}
		}

		cAr.onclick = Line.posit;
		canvaLine.onclick = function (e){Line.posit(e)};
			   
		canvaLine.onmousedown = function ()
		{
			pst = Obj.positY(canvaLine);
			document.onmousemove = function(e){Line.posit(e);}
		}

		document.onmouseup = function ()
		{
			document.onmousemove = null; 
			cAr.onmousemove = null; 
		}
	},
	
	
	create : function (height, width, line, cN)
	{
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;	
		canvas.className = cN;

		line.appendChild(canvas);

		Line.grd(canvas, height, width);

		return canvas;
	},
	
	grd : function (canva, h, w)
	{
		var gradient, hue, color, canva, gradient1;

		canva = canva.getContext("2d");

		gradient = canva.createLinearGradient(w/2,h,w/2,0);

		hue = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]];

		for (var i=0; i <= 6;i++)
		{
			color = 'rgb('+hue[i][0]+','+hue[i][1]+','+hue[i][2]+')';
			gradient.addColorStop(i*1/6, color);
		};
		
		canva.fillStyle = gradient;
		canva.fillRect(0,0, w ,h);	
	}
};


export function openPickerColor(params)
{
	let picker = Build.infProg.picker;

	picker.el.wrap.style.display = 'block';
	
	buttonsEvent({material: params.material, elColor: params.elColor});
	
	picker.out_color.style.backgroundColor = params.elColor.style.backgroundColor;
	
	let colorRGB = new THREE.Color(picker.out_color.style.backgroundColor);
	colorRGB.r *= 255;
	colorRGB.g *= 255;
	colorRGB.b *= 255;
	
	let hsv = rgb2hsv(colorRGB.r, colorRGB.g, colorRGB.b);
	
	Line.Hue = hsv.h;
	
	picker.th.style.top = (Math.abs(hsv.h - 360) * (picker.lineSize.h/ 360) - 2) + 'px';
	
	picker.block.style.backgroundColor = "rgb("+hsv_rgb(hsv.h,100,100)+")";
	

	picker.circle.style.top = Math.ceil(Math.abs((hsv.v - 100) * picker.pxY))   + "px";
	picker.circle.style.left = Math.ceil(hsv.s * picker.pxX)   + "px";
	
	if (hsv.v < 50) picker.circle.style.borderColor = "#fff";
	else picker.circle.style.borderColor = "#000";	
}




function hsv_rgb(H,S,V)
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
	

function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
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
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

