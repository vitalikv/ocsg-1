<!DOCTYPE html>
<html lang="en">

<head>
	<title>loader</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<link type="text/css" rel="stylesheet" href="css/style.css">
</head>

<? require_once("include/main.php"); ?>



<script>

let infProject = JSON.parse('<?=$jsonPhp?>');
console.log('infPhp', infProject);
</script>

<body style="">
		
	<div>				
		<div nameId="pickerColor" style="display: block; position: absolute; width: 250px; top: 30%; left: 40%; padding: 4px; border: solid 1px #b3b3b3; background: #f5f5f5; z-index: 1; opacity: 0;">
			<div style="position: relative;">
				<div nameId="line" style="position: absolute; left: 200px; cursor: pointer;">
					<div nameId="arrows" style="position: absolute; top: 0; margin-top: -4px; left: -11px; width: 40px; cursor: pointer;">
						<div class="left_arrow" style="width:0; height:0; position:absolute; border-bottom:6px solid transparent; border-left:10px solid black; border-top:6px solid transparent; border-right:8px solid transparent; cursor: pointer;"></div>
						<div class="right_arrow" style="width:0; height:0; left:23px; position:absolute; border-bottom:6px solid transparent; border-left:10px solid transparent; border-top:6px solid transparent; border-right:10px solid black; cursor: pointer;"></div>
					</div>
				</div>

				<div nameId="block_picker" style="background-color:red; height:180px; width:180px;">
					<img src="img/bgGradient.png" style="width:180px;">
					<div nameId="circle" style="width:8px; height:8px; border:1px solid black; border-radius:50%; position:absolute; left:0; top:0; cursor: default;"></div>
				</div>

				<div nameId="out_color" style="width: 180px; height: 20px; background-color: #FFF; border: solid 1px #b3b3b3; margin-top: 10px;"></div>
				
				<div style="display: -webkit-box; display: flex; margin-top: 10px;">
				
					<div nameId="colorOk" style="display: block; width: 50px; text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; border-radius: 3px; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
						<?=$infPhp['text']['pp']['ok']?>
					</div>

					<div nameId="colorStop" style="display: block; width: 50px; margin-left: 10px; text-decoration: none; text-align: center; padding: 5px; border: solid 1px #b3b3b3; border-radius: 3px; font-size: 12px; font-weight: bold; color: #737373; box-shadow: 0px 0px 2px #bababa, inset 0px 0px 1px #ffffff; background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); cursor: pointer;">
						<?=$infPhp['text']['pp']['cancel']?>
					</div>
				</div>			
			</div>
		</div>		
	
	</div>
	
	<div style="display: -webkit-box; display: flex; position: fixed; width: 100%; height: 100%; top: 0; left: 0;">	
		<div nameId="containerScene" style="position: relative; width: 100%;"></div>
		
		<div nameId="panelR" style="position: relative; flex: 0 0 310px; background: #F0F0F0; border-left: 1px solid #D1D1D1;">


		
			<div style="display: block; position: absolute; left: 0; right: 0; top: 0; bottom: 60px; overflow-y: auto; overflow-x: hidden;">	
			
				<div style="border-bottom: 1px solid #D1D1D1; padding: 12px 0 0 0;">

					<div class="flex_1" style="margin-left: 18px; font-size: 14px; color: #4A4A4A;">
						<div>
							<?=$infPhp['text']['rp']['model']?>:
						</div>
						<div nameId="itemNameObj" style="margin-left: 5px;">
							
						</div>						
					</div>

					<div nameId="divModGeom"></div>

					
				</div>


				
				<div nameId="divRot" style="border-bottom: 1px solid #D1D1D1; padding: 12px 0;">
						
				</div>
				
								
				
				<div nameId="divSize" style="border-bottom: 1px solid #D1D1D1; padding: 12px 0;">
					
				</div>				
				
				
				
				<div nameId="wrap_materials">
					
				</div>
				
			</div>
			

			<div nameId="wrap_btn_import_cat" style="display: block; position: absolute; left: 0; right: 0; bottom: 0; border-top: 1px solid #D1D1D1; user-select: none;">
							
			</div>
			
		</div>
	</div>
		
</body>




<script type="module" src="index.js"></script>



</html>