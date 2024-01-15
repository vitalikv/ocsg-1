


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

	
	//if (myMouse.getSelectedObj()) return;
	
	let rayhit = null;

	if(!infProject.scene.block.hover.point)
	{
		var ray = rayIntersect( event, infProject.scene.array.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	

	if(rayhit) 
	{
		const object = rayhit.object;
		const tag = object.userData.tag; 				

		if ( clickO.hover === object ) { return; }				// объект уже подсвечен

		if ( tag == 'point' ) 
		{ 
			object.material.opacity = 1;
			setStyleCursor('move');
		}

		clickO.hover = object;
	}
	else if(clickO.hover)
	{
		const object = clickO.hover;
		const tag = object.userData.tag;  	
		
		if( tag === 'point' ) 
		{ 
			object.material.opacity = 0.75;
			setStyleCursor('default');
		}
		
		clickO.hover = null;
	}
}


function setStyleCursor(cursor)
{
	containerF.style.cursor = cursor;
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
		else if(cdm.button === 'add_pointWf')
		{
			clickO.button = cdm.button;
		}
		else if(cdm.button === 'add_objWf')
		{
			clickO.button = cdm.button;
		}		
	}

}	


