
// действия с мышей и все что касается с кликами
class MyBlocksMouse
{

	
	
	clickRayhit({event})
	{
		myMouse.clearClick();
		myComposerRenderer.outlineRemoveObj();		
		
		let rayhit = null;		
		
		const idActive = myLevels.getIdActLevel();
		const walls = myCalcBlocks.myBlocksWalls.getWallsClone({id: idActive});
		
		const ray = rayIntersect( event, walls, 'arr' );
		if(ray.length > 0) { rayhit = ray[0]; }			

		
		
		if(rayhit)
		{
			const arrWClone = rayhit.object.userData.arrWClone;
			const group = rayhit.object.userData.group;
			const line = rayhit.object.userData.line;
			
			console.log(3333, group, line);
			
			const sizeBlock = group.paramsBlock;
			
			const size = { length: sizeBlock.length, height: sizeBlock.height, width: line.width };
			
			// после изменения в input (length или height), получаем key (length или height) и значение
			const callBack = (data) => 
			{ 
				const paramsBlock = {};
				paramsBlock[data.key] = data.result.value;
				
				myCalcBlocks.myBlocksObjs.setParamsBlock({group, paramsBlock, type: 'mm'})
			}
			
			myCalcBlocks.myPanelWidgetsBlocks.setInputSize({size, type: 'm', callBack});
			
			myComposerRenderer.outlineAddObj({arr: arrWClone});
		}
		

		return rayhit;
	}

}







