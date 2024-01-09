<? 




$list = 'inputWall.js
crossWall.js
uiInterface.js
uiInterface_catalog.js
meshBSP.js 	
calculationArea.js
addPoint.js
addWD.js
boxScale2D.js
changeCamera.js
clickChangeWD.js
clickMovePoint.js
clickMoveWall.js
clickMoveWD.js
deleteObj.js
floor.js
detectZone.js  	
saveLoad.js
script.js
eventClick.js
clickObj.js
loadObj.js
hideWall.js
substrate.js
svg_1.js
html_1.js
selectionBox.js
undoRedo.js
getScreenshot.js
new/myCookie.js
new/btnDropList.js
new/level.js
new/ghostLevel.js
new/startProject.js
new/csgBox.js
new/myTexture.js
new/ui/panelTop/myPanelTop.js
new/ui/panelTop/switchCamera.js
new/ui/menu/windUI.js
new/ui/menu/tabs.js
new/ui/menu/divAbout.js
new/ui/menu/divAccount.js
new/ui/menu/divProjectSave.js
new/ui/menu/divProjectLoad.js
new/ui/menu/divProjectDemo.js
new/ui/menu/divSubs.js
new/ui/right-panel/myPanelR.js
new/ui/right-panel/myTabsR.js
new/ui/right-panel/myContentLevel.js
new/ui/right-panel/myContentPlan.js
new/ui/right-panel/myLevelVisible.js
new/ui/right-panel/myContentObj.js
new/ui/right-panel/insetObj/myTabObjWall.js
new/ui/right-panel/insetObj/myTabObjRoom.js
new/ui/right-panel/insetObj/myTabObjWD.js
new/ui/right-panel/insetObj/myTabObjRoof.js
new/ui/right-panel/insetObj/myTabObjObject.js
new/ui/right-panel/catalog/myCatalogList.js
new/ui/right-panel/warmFloor/myPanelWF.js
new/tools/myToolPG.js
new/tools/myToolPG_UI.js
new/tools/myPivot.js
new/tools/myGizmo.js
new/tools/myScale.js
new/camera/myCamera.js
new/camera/myCameraPerspective.js
new/camera/cameraMoveKey.js
new/camera/eventMyCamera.js
new/core/composerRender.js
new/core/myMouse.js
new/core/myManagerClick.js
new/core/commonFunc.js
new/house/myHouse.js
new/house/point/myPoint.js
new/house/point/myMovePoint.js
new/house/point/myPointAction.js
new/house/wall/myWall.js
new/house/wall/myWallMove.js
new/house/wd/myWD.js
new/house/wd/myWDMove.js
new/house/wd/myDoor.js
new/house/wd/myWindow.js
new/house/wd/myWDPoints.js
new/house/wd/myWDPointsMove.js
new/house/wd/myWDRulers.js
new/house/roof/roof.js
new/house/roof/myRoofUI.js
new/house/roof/myRoofAction.js
new/house/roof/myRoofObj.js
new/house/roof/myRoofCSG.js
new/house/roof/myRoofMove.js
new/house/obj/myObjUI.js
new/house/obj/myObjAction.js
new/house/obj/myObjPrimitives.js
new/house/obj/myObjMove.js
new/warmFloor/myWarmFloor.js
new/warmFloor/mySaveWf.js
new/warmFloor/myLoadWf.js
new/warmFloor/point/myPointWf.js
new/warmFloor/point/myPointWfMove.js
new/warmFloor/tube/myTubeWf.js
new/warmFloor/tube/myTubeWfMove.js
';

$arrF = array();
$arr = explode(".js", $list);
$file2 = '';

for ($i = 0; $i < count($arr); $i++)
{
	$arr[$i] = trim($arr[$i]).'.js';
}


// Открываем файл, флаг W означает - файл открыт на запись
$newFile = fopen('t/test.js', 'w');


// Записываем в файл $text
for ($i = 0; $i < count($arr)-1; $i++)
{
	echo $arr[$i].'<br>';
	$file = file_get_contents($arr[$i]);
	
	$file = preg_replace("|console.log\((.*)\);|i","",$file);
	$file2 .= $file;
	//getFunct($file);
	
	{
		preg_match_all('|function\s*(\w+)\s*\((.*)\)|Usi', $file, $arr2); 
		
		for ($i2 = 0; $i2 < count($arr2[1]); $i2++)
		{
			$arrF[] = $arr2[1][$i2];
		}

		//getFunct($arr2[1]);
	}
	
	fwrite($newFile, $file);	
}

// Закрывает открытый файл
fclose($newFile);



//getFunct($arrF);


echo '<br><br>';
echo 'Файл до сжатия ' . strlen($file2) . ' байт <br><br>--------<br><br>';


$file2 = preg_replace('#(\/\/(.*?)(\n|$|\r|(\r\n)))|(\/\*(.*?)\*\/)#i','',$file2);	// удаляем комменты



//$file2 = str_replace(array("\r", "\n", "\t"), "", $file2);	// Удаляем символы перевода строк и вертикальной табуляции

echo 'Сжатый файл ' . strlen($file2) . ' байт <br><br>--------<br><br>';


for ($i = 0; $i < count($arrF); $i++)
{
	//preg_match_all('|'.$arrF[$i].'|Usi', $file2, $str);
	//print_r($str[0]);	
	//echo $str[0][0].' '.count($str[0]).'<br>';	
	
	//echo 'fname_s_0'.($i+1).'|'.$arrF[$i].'<br>';

	if (preg_match('#\b'.$arrF[$i].'\b#Us', 'hide')) 
	{
		echo "Пропускаем <br>". $arrF[$i]."<br><br>";
	}	
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'renderCamera')) 
	{
		echo "Пропускаем <br>". $arrF[$i]."<br><br>";
	}
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'showHideLabelSizeWall')) 
	{
		echo "Пропускаем <br>". $arrF[$i]."<br><br>";
	}
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'blockKeyCode')) 
	{
		echo "Пропускаем <br>". $arrF[$i]."<br><br>";
	}	
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'switchCamera3D')) 
	{
		echo "Вхождение найдено <br>". $arrF[$i]."<br><br>";		
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_camera3d_view',$file2);
	}	
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'clickInterface')) 
	{
		echo "Вхождение найдено <br>". $arrF[$i]."<br><br>";		
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_active_int',$file2);
	}	
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'switchPivotGizmo')) 
	{
		echo "Вхождение найдено <br>". $arrF[$i]."<br><br>";		
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_tools_handle',$file2);
	}		
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'loadFilePL')) 
	{
		echo "Вхождение найдено <br>". $arrF[$i]."<br><br>";		
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_load_f',$file2);
	}
	else if (preg_match('#\b'.$arrF[$i].'\b#Us', 'getJsonProject')) 
	{
		echo "Вхождение найдено <br>". $arrF[$i]."<br><br>";		
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_get_json',$file2);
	} 	
	else 
	{
		$file2 = preg_replace('#\b'.$arrF[$i].'\b#Us','fname_s_0'.($i+1),$file2);	// 	\b - границы слова	
	}	
}


//echo $file2;

$newFile = fopen('t/test.js', 'w');
fwrite($newFile, $file2);
fclose($newFile);



// показываем список названий функций 
function getFunct($text) 
{	
	echo '<br>';
	
	for ($i = 0; $i < count($text); $i++)
	{
		echo $text[$i].'<br>';
	}			
	
	echo '<br>';
}




