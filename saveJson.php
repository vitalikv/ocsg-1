<? 




$array = $_POST['myarray']; 
$nameFile = $_POST['nameFile'];


// Открываем файл, флаг W означает - файл открыт на запись
$f_hdl = fopen($nameFile, 'w');

// Записываем в файл $text
fwrite($f_hdl, $array);

// и $text2
//fwrite($f_hdl, $text2);

// Закрывает открытый файл
fclose($f_hdl);

echo $array;


