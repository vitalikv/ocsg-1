
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
			
			console.log(3333, group);
			
			myComposerRenderer.outlineAddObj({arr: arrWClone});
		}
		

		return rayhit;
	}

}







