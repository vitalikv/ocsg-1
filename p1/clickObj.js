





// удаление объекта
function deleteObjectPop(cdm)
{ 
	if(!cdm) { cdm = {}; }
	
	var arr = [];
	
	const obj = myComposerRenderer.getOutlineObj();
	
	if(cdm.obj && cdm.obj.userData.tag === 'roof' || obj && obj.userData.tag === 'roof')
	{
		let o2 = (cdm.obj) ? cdm.obj : obj;
		myHouse.myRoofInit.deleteRoof(o2);
		return;
	}
	
	if(cdm.obj)
	{
		if(cdm.obj.userData.tag == 'obj') { arr[0] = cdm.obj; }
	}
	else
	{
		if(clickO.selectBox.arr.length > 0)
		{
			for(var i = 0; i < clickO.selectBox.arr.length; i++)
			{
				if(clickO.selectBox.arr[i].userData.tag != 'obj') continue;
				
				arr[arr.length] = clickO.selectBox.arr[i];
			}
		}
		else
		{
			if(obj.userData.tag == 'obj') { arr[0] = obj; }
		}
	}	
	
	if(arr.length == 0) return;	
		
	
	var undoRedo = true;
	if(cdm.undoRedo !== undefined) { undoRedo = cdm.undoRedo; }	
	if(undoRedo) { getInfoEvent24({arr: arr}); }	
	
	clickO = resetPop.clickO(); 
	
	for(var i = 0; i < arr.length; i++)
	{	
		deleteValueFromArrya({arr : infProject.scene.array.obj, o : arr[i]});		
		disposeHierchy({obj: arr[i]}); 
		scene.remove(arr[i]); 
	}
	
	myManagerClick.hideMenuObjUI_2D();
	
	renderCamera();
}




 








