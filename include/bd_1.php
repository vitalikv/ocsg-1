<?

$upass = '';
if($_SERVER['SERVER_NAME']=='engineering-plan.ru') $upass = 'ns62QYhqMf';

try
{
	$db = new PDO('mysql:host=localhost;dbname=ocsg_2', 'root', $upass);
	$db->exec("set names utf8");
}
catch(PDOException $e)
{
    echo 'Ошибка 1';
}








