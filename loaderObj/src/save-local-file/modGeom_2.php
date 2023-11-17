<? 
ini_set("memory_limit","512M");

//$v = json_decode($_POST['v'], true);  //Use json_decode($src, true) to get associative array.

$v2 = json_decode($_POST['v'], true);
$f2 = json_decode($_POST['f'], true);
$uv2 = json_decode($_POST['uv'], true);

//saveF('v.txt', $v);
//saveF('f.txt', $f);
//saveF('uv.txt', $uv);

function saveF($nameF, $str)
{
	// Открываем файл, флаг W означает - файл открыт на запись
	$file = fopen($nameF, 'w');

	// Записываем в файл $text
	fwrite($file, $str);

	// Закрывает открытый файл
	fclose($file);	
}


$data = [];
$data['v2'] = $v2;
$data['f2'] = $f2;



header('Content-Type: application/json; charset=utf-8');
echo json_encode( $data );


