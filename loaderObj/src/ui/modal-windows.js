
import * as THREE from '../../node_modules/three/build/three.module.js';
import * as Build from '../index.js';
import { UItutorial } from './wrap-tutorial.js';
import { UIwrapExit } from './wrap-exit.js';
import * as BloadPrev from './wrap-load-prev.js';
import * as BloadErr from './wrap-load-err.js';
import { UIwrapHelper } from './wrap-helper.js';
import * as Bpreview from './wrap-preview.js';
import * as Bwimport from './wrap-wait-import.js';
import * as Bmodgeom from './wrap-wait-mod-geom.js';
import * as WindAttention from './window-attention.js';



export class ModalWind
{
	constructor()
	{
		this.elem = {};
		this.init();
	}
	
	init()
	{
		this.elem.tut = new UItutorial();									// окно с tutorial
		this.elem.exit = new UIwrapExit();									// окно выхода из приложения
		this.elem.loading = new BloadPrev.UIwrapLoadPrev();					// окно svg planoplan, что идет загрузка модели loading...
		this.elem.helper = new UIwrapHelper();								// окно с ютубом и ифно о загрузчике
		new Bpreview.UIwrapPreview();										// окно перед отправкой на импорт с Preview
		this.elem.err = new BloadErr.UIwrapLoadErr();						// окно с ошибкой, если модель не смогла загрузится
		this.elem.atten = new WindAttention.UIwindowAttention();			// окно с ифной, что габарита объекта больше лимитов или число треугольников превышено
		this.elem.import = new Bwimport.UIwrapImportModel();				// окно svg planoplan, что идет импорт модели
		this.elem.modgeom = new Bmodgeom.UIwrapModGeom();					// окно svg planoplan, что идет модификация геометрии
	}
	

}


