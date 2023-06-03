


// находим родитель у дочернего объекта
function getParentObj(cdm)
{
	var obj = cdm.obj;	
	var next = true;
	
	while(next) 
	{
		if(obj.userData)
		{
			if(obj.userData.tag)
			{
				if(obj.userData.tag == 'obj' || obj.userData.tag == 'roof')
				{
					next = false;
					return obj;					
				}
				else
				{
					if(obj.parent)
					{
						obj = obj.parent;
					}
					else
					{
						next = false;
						return null;
					}
				}
			}
			else if(obj.parent)
			{ 
				obj = obj.parent;
			}
			else
			{
				next = false;
				return null;
			}
			
		}
		else if(obj.parent)
		{ 
			obj = obj.parent;
		}
		else
		{
			next = false;
			return null;
		}
	}
}



function activeHover2D( event )
{
	if (!myCameraOrbit.activeCam.userData.isCam2D) { return; }
	//if (isMouseDown1) { return; }

	if ( clickO.move ) 
	{
		var tag = clickO.move.userData.tag;
		
		if (tag == 'free_dw') { return; }
		if (tag == 'point') { if (clickO.move.userData.point.type) return; }		
	}
	
	let rayhit = null;

	if(!infProject.scene.block.hover.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	

	if(rayhit) 
	{
		var object = rayhit.object;
		var tag = object.userData.tag; 				

		if ( clickO.hover == object ) { return; }				// объект уже подсвечен


		if ( tag == 'point' ) 
		{ 
			object.material.opacity = 1;
			containerF.style.cursor = 'move';
		}

		
		activeHover2D_2();

		clickO.hover = object;
	}
	else
	{
		activeHover2D_2();
	}
}



// возращаем стандартный цвет
function activeHover2D_2()
{
	if ( !clickO.hover ) { return; }

	var object = clickO.hover;
	var tag = object.userData.tag;  	
	
	if( tag == 'point' ) 
	{ 
		object.material.opacity = 0.75;
		containerF.style.cursor = 'default';
	}
	
	clickO.hover = null;
}



// возращаем стандартный цвет объекта
function objDeActiveColor_2D() 
{	
	if(!myCameraOrbit.activeCam.userData.isCam2D) return;
	if(!clickO.last_obj){ return; }
	if(myMouse.rayhit && clickO.last_obj === myMouse.rayhit.object){ return; }
	
	
	var o = clickO.last_obj;	

	if(myMouse.rayhit)
	{    
		if(myMouse.rayhit.object.userData.tag == 'controll_wd'){ if(myMouse.rayhit.object.userData.controll_wd.obj === o) { return; } }      		
	}
	 
	if(o.userData.tag == 'wall'){ myComposerRenderer.outlineRemoveObj(); getCalcWall({wall: o}); }	
	else if(o.userData.tag == 'point'){ myComposerRenderer.outlineRemoveObj(); }	
	else if(o.userData.tag == 'window'){ myComposerRenderer.outlineRemoveObj(); }
	else if(o.userData.tag == 'door'){ myComposerRenderer.outlineRemoveObj(); }	
	
	if(clickO.hover == clickO.last_obj) { clickO.hover = null; }
}


function clickInterface(cdm)
{
	if(clickO.move)
	{
		myMouse.clearClick();
		myMouse.mouseDownRight();
	}

	console.log(cdm);
	if(cdm)
	{		
		myMouse.clearClick();	
		
		if(cdm.button === 'point_1') clickO.button = 'create_wall';
		else if(cdm.button === 'create_wd_1') clickO.button = cdm.button;	
		else if(cdm.button === 'create_wd_2') clickO.button = cdm.button;
		else if(cdm.button === 'create_gate_1') clickO.button = cdm.button;
		else if(cdm.button === 'add_wind')
		{
			clickO.button = cdm.button;
			clickO.options = cdm.id;
		}		
		else if(cdm.button === 'add_roof')
		{
			clickO.button = cdm.button;
			clickO.options = cdm.lotid;
		}		
		else if(cdm.button === 'add_lotid')
		{
			clickO.button = cdm.button;
			clickO.options = cdm.value;
		}					
	}

}	


