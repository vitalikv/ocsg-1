<? 
	$show = true;
	if($_SERVER['SERVER_NAME']=='test-webgl') 
	{ 
		$show = false;
	}
	
	$url = $_SERVER['REQUEST_URI'];
	$str = explode("/?", $url)[1];
	parse_str($str, $arrUrl);
	$lang = $arrUrl['lang'];
	$lang = str_replace("/", "", $lang);

	if($lang)
	{
		if($lang == 'ru'){}
		else{ $lang = 'en'; }
	}
	else { $lang = 'en'; }

	//$lang = 'ru'; // del
	
	$infPhp['settings']['lang'] = $lang;
	$infPhp['lang'] = [];
	
	$infPhp['lang']['en']['rp']['loading'] = 'loading';
	$infPhp['lang']['ru']['rp']['loading'] = 'загрузка';
	
	$infPhp['lang']['en']['rp']['model'] = 'Model';
	$infPhp['lang']['ru']['rp']['model'] = 'Модель';
	
	$infPhp['lang']['en']['rp']['tri'] = 'Triangles';
	$infPhp['lang']['ru']['rp']['tri'] = 'Треугольники';
	
	$infPhp['lang']['en']['rp']['rotx'] = 'Rotation X';
	$infPhp['lang']['ru']['rp']['rotx'] = 'Поворот X';
	$infPhp['lang']['en']['rp']['roty'] = 'Rotation Y';
	$infPhp['lang']['ru']['rp']['roty'] = 'Поворот Y';
	$infPhp['lang']['en']['rp']['rotz'] = 'Rotation Z';
	$infPhp['lang']['ru']['rp']['rotz'] = 'Поворот Z';

	$infPhp['lang']['en']['rp']['axis'] = 'Axis Y';
	$infPhp['lang']['ru']['rp']['axis'] = 'Ось Y';
	
	$infPhp['lang']['en']['rp']['orsize'] = 'Original size';
	$infPhp['lang']['ru']['rp']['orsize'] = 'Оригинальный размер';

	$infPhp['lang']['en']['rp']['units'] = 'Units';
	$infPhp['lang']['ru']['rp']['units'] = 'Ед.';

	$infPhp['lang']['en']['rp']['width'] = 'Width';
	$infPhp['lang']['ru']['rp']['width'] = 'Ширина';
	$infPhp['lang']['en']['rp']['length'] = 'Length';
	$infPhp['lang']['ru']['rp']['length'] = 'Длина';
	$infPhp['lang']['en']['rp']['height'] = 'Height';
	$infPhp['lang']['ru']['rp']['height'] = 'Высота';	
	
	$infPhp['lang']['en']['rp']['importcat'] = 'Import to catalog';
	$infPhp['lang']['ru']['rp']['importcat'] = 'Импортировать в каталог';	
	
	
	$infPhp['lang']['en']['pp']['ok'] = 'Ok';
	$infPhp['lang']['ru']['pp']['ok'] = 'Ок';
	
	$infPhp['lang']['en']['pp']['cancel'] = 'Cancel';
	$infPhp['lang']['ru']['pp']['cancel'] = 'Отмена';	
	
	$infPhp['lang']['en']['pp']['howw'] = 'How it works';
	$infPhp['lang']['ru']['pp']['howw'] = 'Как это работает';	

	$infPhp['lang']['en']['pp']['howt'] = 'Check the model rotation, set the correct units if the values in metres are incorrect.<br>Set the material types.';
	$infPhp['lang']['ru']['pp']['howt'] = 'Проверьте вращение модели, установите правильные единицы, если значения в метрах неверны. Установите типы материалов.';	

	$infPhp['lang']['en']['pp']['prev'] = 'Preview';
	$infPhp['lang']['ru']['pp']['prev'] = 'Предварительный просмотр';	

	$infPhp['lang']['en']['pp']['import'] = 'Import';
	$infPhp['lang']['ru']['pp']['import'] = 'Импортировать';	


	$infPhp['lang']['en']['pp']['swrong'] = 'Something wrong!';
	$infPhp['lang']['ru']['pp']['swrong'] = 'Что-то не так!';

	$infPhp['lang']['en']['pp']['loadnewm'] = 'Try uploading another model';
	$infPhp['lang']['ru']['pp']['loadnewm'] = 'Попробуйте загрузить другую 3D-модель';

	$infPhp['lang']['en']['pp']['uploadm'] = 'Upload another 3D-model';
	$infPhp['lang']['ru']['pp']['uploadm'] = 'Выбрать другую 3D-модель';


	$infPhp['lang']['en']['pp']['muchtri_1'] = 'Too much triangles!';
	$infPhp['lang']['ru']['pp']['muchtri_1'] = 'Превышен лимит!';
	
	$infPhp['lang']['en']['pp']['muchtri_2'] = 'Acceptable value';
	$infPhp['lang']['ru']['pp']['muchtri_2'] = 'Приемлемый лимит';	

	$infPhp['lang']['en']['pp']['closet'] = 'Want to close uploader?';
	$infPhp['lang']['ru']['pp']['closet'] = 'Вы хотите закрыть загрузчик моделей ?';
	
	$infPhp['lang']['en']['pp']['closetxt'] = 'Any unsaved changes will be lost and the model will need to be reuploaded';
	$infPhp['lang']['ru']['pp']['closetxt'] = 'Любые несохраненные изменения будут потеряны и модель потребуется повторно загрузить';	

	$infPhp['lang']['en']['pp']['closeu'] = 'Close uploader';
	$infPhp['lang']['ru']['pp']['closeu'] = 'Выйти';


	$infPhp['lang']['en']['pp']['attention'] = 'Attention';
	$infPhp['lang']['ru']['pp']['attention'] = 'Внимание';
	
	$infPhp['lang']['en']['pp']['o_triang_1'] = 'Triangles is more than 200000';
	$infPhp['lang']['ru']['pp']['o_triang_1'] = 'Треугольников больше 200000';
	$infPhp['lang']['en']['pp']['o_triang_2'] = 'Try to delete model elements to reach the minimum allowable value';
	$infPhp['lang']['ru']['pp']['o_triang_2'] = 'Попробуйте удалить элементы модели до достижения минимально допустимого значения';
	
	$infPhp['lang']['en']['pp']['o_size_1'] = 'Object size is more than 10 meters, please set correct sizes';
	$infPhp['lang']['ru']['pp']['o_size_1'] = 'Размер объекта более 10 метров, укажите правильные размеры';

	$infPhp['lang']['en']['pp']['o_size_2'] = 'Object size is more than 200m, please set correct sizes';
	$infPhp['lang']['ru']['pp']['o_size_2'] = 'Размер объекта более 200м, укажите правильные размеры';

	$infPhp['lang']['en']['pp']['editsize'] = 'Edit';
	$infPhp['lang']['ru']['pp']['editsize'] = 'Редактировать';

	$infPhp['lang']['en']['pp']['import'] = 'Import';
	$infPhp['lang']['ru']['pp']['import'] = 'Импорт';		

	$infPhp['lang']['en']['pp']['mod_geom'] = 'Optimise to acceptable value';
	$infPhp['lang']['ru']['pp']['mod_geom'] = 'Оптимизировать модель';

	$infPhp['lang']['en']['tut']['next'] = 'Next';
	$infPhp['lang']['ru']['tut']['next'] = 'Дальше';

	$infPhp['lang']['en']['tut']['skip'] = 'Skip';
	$infPhp['lang']['ru']['tut']['skip'] = 'Закрыть';

	$infPhp['lang']['en']['tut']['step1'] = 'Check the size, rotation and materials of the 3D model in the preview.';
	$infPhp['lang']['ru']['tut']['step1'] = 'Проверьте размер, поворот и материалы модели';
	
	$infPhp['lang']['en']['tut']['step2'] = 'Optimise the total number of polygons or separate elements';
	$infPhp['lang']['ru']['tut']['step2'] = 'Оптимизируйте общее количество полигонов или отдельных элементов';	

	$infPhp['lang']['en']['tut']['step3'] = 'Load the required textures and adjust them. Remove unnecessary elements from the model (press Delete).';
	$infPhp['lang']['ru']['tut']['step3'] = 'Загрузите необходимые текстуры и настройте их. Удалите из модели ненужные элементы (нажмите Delete).';

	$infPhp['lang']['en']['tut']['step4'] = 'Submit the 3D model for import. Check the upload status in the catalogue. When complete, you will receive a notification.';
	$infPhp['lang']['ru']['tut']['step4'] = 'Отправьте модель на импорт. Проверьте статус загрузки в каталоге. По завершении вы получите уведомление.';
	
	$infPhp['lang']['en']['tut']['got'] = 'Got it';
	$infPhp['lang']['ru']['tut']['got'] = 'Понятно';
	
	$infPhp['text'] = $infPhp['lang'][$lang];
	
	$jsonPhp = json_encode($infPhp);
	
	
	
	
	
	
	
	
	
	
	
	
	
	