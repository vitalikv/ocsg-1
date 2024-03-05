<? require_once("include/bd.php");  ?>
<?php $vrs = '=31' ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="shortcut icon" href="/img/favicon.ico" />
	<title><?=$title?></title>
	<meta name="description" content="<?=$description?>" />
	<link rel="stylesheet" href="<?=$path?>css/style.css?<?=$vrs?>"> 
</head>

<body>
	<script>
		var vr = "<?=$vrs ?>";
		
		var infProject = JSON.parse('<?=$jsonPhp?>');

		console.log('type '+ vr);		
	</script>
	
			
	
    <script src="<?=$path?>js/three.min.js?<?=$vrs?>"></script>
    <script src="<?=$path?>js/jquery.js"></script>
    <script src="<?=$path?>js/ThreeCSG.js"></script>         
	
	<script src="<?=$path?>js/dp/EffectComposer.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/CopyShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/RenderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/ShaderPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/OutlinePass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/FXAAShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOPass.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/SAOShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/DepthLimitedBlurShader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/dp/UnpackDepthRGBAShader.js?<?=$vrs?>"></script>	
	
	<script src="<?=$path?>js/loader/inflate.min.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/FBXLoader.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/STLExporter.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/loader/GLTFLoader.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>js/BufferGeometryUtils.js?<?=$vrs?>"></script>
	<script src="<?=$path?>js/export/GLTFExporter.js?<?=$vrs?>"></script>
	
	

	
	<div id="canvasFrame" style="position: fixed; width: 100%; height: 100%; top: 0; right: 0; overflow: hidden; font-family: arial,sans-serif;">
		<div class="frame block_select_text">
			
			<noindex>
			<div class="flex_1 height100">
				
				<div style="flex-grow:1; position: relative;" nameId="wrapP1">
					<div style="position: absolute; width: 100%; bottom: 110px; z-index: 2;" nameId="menu_loader_slider_UI">			
						<div style="width: 260px; height: 60px; margin: auto; padding-bottom: 30px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.5);">	
							<div style="padding: 15px 0 0 0; font-size: 18px; text-align: center; color: #666;">Загрузка объектов</div>		
							<div style="padding: 15px 0; font-size: 16px; text-align: center; color: #666;" nameId="txt_loader_slider_UI">0%</div>		
						</div>	
					</div>

					<div style="position: absolute; bottom: 0; right: 20px; width: 170px; height: 80px; z-index: 2;">
						<a href="/documentation" style="font-size: 16px; cursor: pointer; font-weight: normal;" class="button1 button_gradient_1" data-action ='top_panel_1' target="_blank">
							<div>видеоинструкция</div>
						</a>	
					</div>					
				</div>				
				
				<div nameId="wrapP2"></div>

			</div>
			</noindex>
			
		</div>
		
		
		<svg id="svgFrame" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute; z-index: 1">
		</svg>	

		<div id='selectBoxFrame'></div>
		
		<div id='htmlBlock' class="block_select_text"></div>
		
	</div>
	
	<div nameId="wrapDiv" style="display: none; position: fixed; left: 0; top: 0; width: 100%; height: 100%; font-family: arial,sans-serif; background: rgba(0, 0, 0, 0.5);"></div>
	
	
	<style type="text/css">
		#selectBoxFrame
		{
			width: 0;
			height: 0;
			line-height: 0;
			background-color: #707070;
			position: absolute;
			z-index: 100;
			visibility: hidden;
			-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=40)";
			filter: alpha(opacity=40);
			opacity: .4;
		}
	</style>	
	
	<script src="<?=$path?>meshBSP.js"></script> 	
    <script src="<?=$path?>calculationArea.js?<?=$vrs?>"></script>
	<script src="<?=$path?>boxScale2D.js?<?=$vrs?>"></script>
	<script src="<?=$path?>clickObj.js?<?=$vrs?>"></script>
    <script src="<?=$path?>crossWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addPoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>addWD.js?<?=$vrs?>"></script>
	<script src="<?=$path?>changeCamera.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickChangeWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMovePoint.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>clickMoveWD.js?<?=$vrs?>"></script>
    <script src="<?=$path?>deleteObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>loadObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>substrate.js?<?=$vrs?>"></script>
	<script src="<?=$path?>svg_1.js?<?=$vrs?>"></script>
	<script src="<?=$path?>html_1.js?<?=$vrs?>"></script>
	<script src="<?=$path?>selectionBox.js?<?=$vrs?>"></script>
	<script src="<?=$path?>getScreenshot.js?<?=$vrs?>"></script>
	<script src="<?=$path?>undoRedo.js?<?=$vrs?>"></script>
	
	
	<script src="<?=$path?>hideWall.js?<?=$vrs?>"></script>
    <script src="<?=$path?>inputWall.js?<?=$vrs?>"></script>   
    <script src="<?=$path?>saveLoad.js?<?=$vrs?>"></script>
	<script src="<?=$path?>uiInterface.js?<?=$vrs?>"></script>
	<script src="<?=$path?>eventClick.js?<?=$vrs?>"></script>
			
		
	<script src="<?=$path?>new/camera/myCamera.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/camera/myCameraPerspective.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/camera/cameraMoveKey.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/camera/eventMyCamera.js?<?=$vrs?>"></script>
	
	<script src="<?=$path?>new/tools/myToolPG.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/tools/myToolPG_UI.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/tools/myPivot.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/tools/myGizmo.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/tools/myScale.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/panelTop/myPanelTop.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/panelTop/switchCamera.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/windUI.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/tabs.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divAbout.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divAccount.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divProjectSave.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divProjectLoad.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divProjectDemo.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/menu/divSubs.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/ui/right-panel/myPanelR.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/myTabsR.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/myContentLevel.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/myContentPlan.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/myLevelVisible.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/ui/right-panel/myContentObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjWall.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjRoom.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjWD.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjRoof.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjObject.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjWfPoint.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjWfTube.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/insetObj/myTabObjWfObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/colorPicker/myColorPicker.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/catalog/myCatalogList.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/ui/right-panel/warmFloor/myPanelWF.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/myCookie.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/btnDropList.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/level.js?<?=$vrs?>"></script>		
	<script src="<?=$path?>new/myStartProject.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/csgBox.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/myTexture.js?<?=$vrs?>"></script>
	
	
	<script src="<?=$path?>new/core/myMouse.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/core/myManagerClick.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/core/composerRender.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/core/commonFunc.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/core/myMath.js?<?=$vrs?>"></script>
	
	<script src="<?=$path?>new/house/myHouse.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/myGhostLevel.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/point/myPoint.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/point/myMovePoint.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/point/myPointAction.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wall/myWall.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wall/myWallMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/floor/myRoom.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/floor/myFloor.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wd/myWD.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/house/wd/myWDMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wd/myDoor.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wd/myWindow.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/house/wd/myWDPoints.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wd/myWDPointsMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/wd/myWDRulers.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/roof/myRoofInit.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/roof/myRoofUI.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/roof/myRoofAction.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/house/roof/myRoofObj.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/roof/myRoofCSG.js?<?=$vrs?>"></script>	
	<script src="<?=$path?>new/house/roof/myRoofMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/obj/myObjInit.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/obj/myObjUI.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/obj/myObjAction.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/obj/myObjPrimitives.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/house/obj/myObjMove.js?<?=$vrs?>"></script>
	
	<script src="<?=$path?>new/warmFloor/myWarmFloor.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/mySaveWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/myLoadWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridLinesWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridPointWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridLinesPointWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridWfCSG.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridWfMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/grid/myGridPointWfMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/point/myPointWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/point/myPointWfMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/tube/myTubeWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/tube/myTubeWfMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myObjWfInit.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myListObjsWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myListMaterialsWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myObjWfMove.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myCalcFormObjWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/myTestObjsWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/jointPoint/myJointPointWf.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/radiator/myRadiatorAl.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/sharKran/mySharKranNN.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/sharKran/mySharKranVV.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/sharKran/mySharKranVN.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/sharKran/mySharKranSgon.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/sharKran/myHalfSgon.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/perehod/myMplPerehodP.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/perehod/myMplPerehodPR.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/troinik/myMplTroinikP.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/troinik/myMplTroinikPR.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/ugol/myMplUgolP.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/createObj/mpl/ugol/myMplUgolPR.js?<?=$vrs?>"></script>
	<script src="<?=$path?>new/warmFloor/generator/myGeneratorWf.js?<?=$vrs?>"></script>
	
    <script src="<?=$path?>script.js?<?=$vrs?>"></script>    		 
		
		

	<? if($_SERVER['SERVER_NAME']=='engineering-plan.ru') {?>
<!-- Yandex.Metrika counter --> <script type="text/javascript" > (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(40245619, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true }); </script> <noscript><div><img src="https://mc.yandex.ru/watch/40245619" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
	<?}else{?>
		<script>
		console.log('test', window.location.hostname);
		</script> 
	<?}?>
</body>


</html>