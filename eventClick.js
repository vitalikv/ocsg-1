$(document).ready(function(){

$('[data-action="top_panel_1"]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
$('[ui_1=""]').on('mousedown wheel DOMMouseScroll mousewheel mousemove touchstart touchend touchmove', function (e) { e.stopPropagation(); });
		
$('[data-action="top_panel_1"]').mousedown(function () { clickInterface(); });
$('[data-action="left_panel_1"]').mousedown(function () { clickInterface(); });




$('[nameId="butt_camera_2D"]').mousedown(function() { clickOnBtn2D3D(cameraTop); });
$('[nameId="butt_camera_3D"]').mousedown(function() { clickOnBtn2D3D(camera3D); });
$('[nameId="butt_cam_walk"]').mousedown(function() { switchCamera3D(); });


$('[nameId="button_wrap_catalog"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_list_obj"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_object"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_plan"]').mousedown(function () { changeRightMenuUI_1({el: this}); });
$('[nameId="button_wrap_level"]').mousedown(function () { changeRightMenuUI_1({el: this}); });

$('[nameId="sw_dw_1"]').mousedown(function () { swSetDW_1({obj: clickO.last_obj, type: 'r-l'}); }); 
$('[nameId="sw_dw_2"]').mousedown(function () { swSetDW_1({obj: clickO.last_obj, type: 't-b'}); });	

$('[nameId="obj_rotate_reset"]').mousedown(function () { objRotateReset(); });	
$('[nameId="button_copy_obj"]').mousedown(function () { copyObj(); });


$('[data-action="wall"]').mousedown(function () { clickInterface({button:'point_1'}); });
$('[data-action="create_gate_1"]').mousedown(function () { clickInterface({button:'create_gate_1'}); });
//$('[add_lotid]').mousedown(function () { clickInterface({button: 'add_lotid', value: this.attributes.add_lotid.value}); });
$('[nameId="screenshot"]').mousedown(function () { createImageSvg(); createImageScene(); }); 				


$('[nameId="zoom_camera_butt_m"]').mousedown(function () { zoomLoop = 'zoomOut'; });
$('[nameId="zoom_camera_butt_p"]').mousedown(function () { zoomLoop = 'zoomIn'; });
$(window).mouseup(function () { zoomLoop = ''; });



$('[data-action="addPointCenterWall"]').mousedown(function () { addPointCenterWall(); return false; });



$('input').on('focus', function () { actionInputUI({el: $(this), act: 'down'}); });
$('input').on('change', function () { actionInputUI({el: $(this), act: 'up'}); });
$('input').on('keyup', function () {  });

function actionInputUI(cdm)
{
	var el = cdm.el;
	
	infProject.activeInput = el.data('action');
	if(el.data('action') == undefined) { infProject.activeInput = el.data('input'); }
	if(infProject.activeInput == undefined) { infProject.activeInput = el.attr('nameId'); }
	
	infProject.activeInput_2 = {el: el, act: cdm.act};
	
	if(cdm.act == 'down' || cdm.act == 'up')
	{
		console.log(cdm.act, infProject.activeInput);
	}
	
	if(cdm.act == 'up')
	{
		actionChangeInputUI();
	}
		
}


function actionChangeInputUI(cdm)
{
	if(infProject.activeInput == 'rp_wall_width_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_door_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_wind_above_floor_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_gate_length_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}
	else if(infProject.activeInput == 'rp_gate_height_1')
	{
		upRightPlaneInput_1({ el: infProject.activeInput_2.el });
	}	
}


$('input').blur(function () 
{ 
	infProject.activeInput = '';
	infProject.activeInput_2 = null;
});	


// texture UI
$('[nameId="rp_button_wall_texture_1"]').mousedown(function () 
{ 
	clickO.click.side_wall = 1; 
	showHideMenuTexture_1({type: 2});
});

$('[nameId="rp_button_wall_texture_2"]').mousedown(function () 
{ 
	clickO.click.side_wall = 2; 
	showHideMenuTexture_1({type: 2});
});



$('[nameId="but_back_catalog_texture_1"]').mousedown(function () 
{ 
	showHideMenuTexture_1({type: 1});
});



$('[add_texture]').mousedown(function () 
{ 
	var inf = {obj: clickO.last_obj, material: {img: this.attributes.add_texture.value, index: clickO.click.side_wall}, ui: true};
	if(camera == camera3D)
	{ 
		if(clickO.index) 
		{ 
			inf.obj = clickO.last_obj;
			inf.material.index = clickO.index; 
		};
	}
	
	setTexture(inf); 
}); 
// texture UI




$('[data-action="modal_window"]').mousedown(function (e) { e.stopPropagation(); });		


$('[data-action="modal"]').mousedown(function () 
{			
	clickInterface(); 
	$('[data-action="modal"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close"]').mousedown(function () 
{  
	$('[data-action="modal"]').css({"display":"none"}); 
});



$('[data-action="modal_1"]').mousedown(function () 
{	 
	$('[data-action="modal_1"]').css({"display":"none"}); 
});

			
$('[data-action="modal_window_close_1"]').mousedown(function () 
{  
	$('[data-action="modal_1"]').css({"display":"none"}); 
});


//  window_main_sett --->
$('[nameId="butt_main_sett"]').mousedown(function () { $('[nameId="window_main_sett"]').css({"display":"block"}); });

$('[nameId="button_close_main_sett"]').mousedown(function () 
{  
	$('[nameId="window_main_sett"]').css({"display":"none"}); 
});

$('[nameId="checkbox_light_global"]').change(function() { switchLight({visible: this.checked}); });
$('[nameId="checkbox_fxaaPass"]').change(function() { switchFxaaPass({visible: this.checked}); });
//  <--- window_main_sett


//  modal_wind_3 --->

$('[nameId="background_main_menu"]').mousedown(function () 
{	 
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

			
$('[nameId="button_close_main_menu"]').mousedown(function () 
{  
	$('[nameId="background_main_menu"]').css({"display":"none"}); 
});

$('[nameId="window_main_menu"]').mousedown(function (e) { e.stopPropagation(); });
	

//  <--- modal_wind_3 




//  right_panel --->

$('[nameId="button_show_panel_catalog"]').mousedown(function () { showHideCatalogMenuUI({show: true}); });
$('[nameId="button_catalog_close"]').mousedown(function () { showHideCatalogMenuUI({show: false}); });







//  <--- right_panel




});


// скрываем/показываем правое меню UI
function showHideCatalogMenuUI(cdm)
{
	var show = cdm.show;
	
	var block = $('[nameId="panel_catalog_1"]');
	var button = $('[nameId="button_show_panel_catalog"]');
	
	if(show) { block.show(); button.hide(); }
	else { block.hide(); button.show(); }
}




