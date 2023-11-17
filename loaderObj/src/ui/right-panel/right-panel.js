
import * as THREE from '../../../node_modules/three/build/three.module.js';
import { UIbuttonImportCatalog } from './btn-import-catalog.js';
import { UIdivModGeom } from './div-mod-geom.js';
import { UItrnInput } from './div-trn-input.js';
import { UIdivRot } from './div-rotation.js';
import { UIdivSize } from './div-size-obj.js';
import { UIbtnResetObj } from './btn-reset-obj.js';
import { ListTypeMaterial } from './list-child/list-type-material.js';
import { ListChildTrnGeom } from './list-child/list-mod-geom.js';
import { ModalSettingMap } from './list-child/modal-setting-map.js';


export class RightPanel
{
	constructor()
	{
		this.elem = {};
		this.init();
	}
	
	init()
	{	
		new UIbtnResetObj();										// кнопка reset obj		
		this.elem.btnImport = new UIbuttonImportCatalog();			// кнопка импорта модели, вызывает модальное окно
		this.elem.trnInput = new UItrnInput();						// input с кол-во треуг. объекта
		this.elem.gmod = new UIdivModGeom();						// блок со слайдером модификации геометрии объекта
		this.elem.rot = new UIdivRot();								// блок с rotation
		this.elem.size = new UIdivSize();							// блок с size
		this.typeMat = new ListTypeMaterial();						// окно со списком типов материалов
		this.listModG = new ListChildTrnGeom();						// окно со списком оптимизации геометрии
		this.settMap = new ModalSettingMap();						// окно с настройками текстуры (размер, смещение, поворот)
	}
	

}


