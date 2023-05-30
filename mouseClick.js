

var isMouseDown1 = false;


var onfM = {};
onfM.stop = false;
onfM.rayhitStop = false;

function setMouseStop(value) 
{
	onfM.stop = value;
	myCameraOrbit.stopMove = value;
}











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









function hideMenuObjUI_2D(cdm)
{
	if(objDeActiveColor_2D_selectBox(clickO.obj)) { return; }
	
	var obj = clickO.last_obj;
	if(!cdm) { cdm = {type: ''}; }
	
	var flag = true;
	
	const isCam2D = myCameraOrbit.activeCam.userData.isCam2D;
	const isCam3D = myCameraOrbit.activeCam.userData.isCam3D;

	if(obj)
	{ 
		objDeActiveColor_2D(); 
		console.log(obj.userData.tag);

		var tag = obj.userData.tag;
		
		if(cdm.type == 'down')
		{
			if(tag == 'wall' && isCam2D) { hideMenuUI(obj); }
			else if(tag == 'point' && isCam2D) { hideMenuUI(obj); }
			else if(tag == 'window' && isCam2D) { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'door' && isCam2D) { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'obj' && isCam2D) { hidePivotGizmo(obj); }
			else if(tag == 'roof' && isCam2D) { hidePivotGizmo(obj); }
			else { flag = false; }
		}
		else if(cdm.type == 'up')
		{
			if(tag == 'wall' && isCam3D) { hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'room' && isCam2D) { hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'room' && isCam3D) { hideMenuUI(obj); myComposerRenderer.outlineRemoveObj(); }
			else if(tag == 'obj' && isCam3D) { hidePivotGizmo(obj); }
			else if(tag == 'roof' && isCam3D) { hidePivotGizmo(obj); }
			else if(tag == 'window' && isCam3D) { hidePivotGizmo(obj); }
			else if(tag == 'door' && isCam3D) { hidePivotGizmo(obj); }
			else { flag = false; }
		}
		else
		{
			if(tag == 'wall') { hideMenuUI(obj); }
			else if(tag == 'point') { hideMenuUI(obj); }
			else if(tag == 'window') { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'door') { hideSizeWD(obj); hideMenuUI(obj); }
			else if(tag == 'room') { hideMenuUI(obj); }
			else if(tag == 'obj') { hidePivotGizmo(obj); }
			else if(tag == 'roof') { hidePivotGizmo(obj); }
			else { flag = false; }
		}
	}
	
	if(flag) 
	{		
		clickO.last_obj = null;
	}
}




function hideMenuUI(obj) 
{
	if(!obj) return;  console.log('hideMenuUI', obj);
	if(!obj.userData) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'point') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'window') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'door') { tabObject.activeObjRightPanelUI_1(); }
	else if(tag == 'room') { tabObject.activeObjRightPanelUI_1(); }
}





