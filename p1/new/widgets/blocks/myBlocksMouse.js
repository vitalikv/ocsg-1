
// действия с мышей и все что касается с кликами
class MyBlocksMouse
{
	isDown = false;
	isMove = false;
	offset = new THREE.Vector3();
	rayhit = null;
	
	
	constructor({container})
	{
		container.addEventListener( 'mousedown', this.mousedown );
		container.addEventListener( 'mousemove', this.mousemove );
		container.addEventListener( 'mouseup', this.mouseup );		
	}
	
	
	mousedown = (event) =>
	{
		if(!myCalcBlocks.myBlocksMode.getActiveMode()) return;
		
		this.clearPoint();
		
		const getBtnType = (event) =>
		{
			let btn = 'left';
			switch ( event.button ) 
			{
				case 0: btn = 'left'; break;
				case 1: btn = 'right'; break;	// middle
				case 2: btn = 'right'; break;
			}
			
			return btn;
		}
		
		const btnType = getBtnType(event);
		if(btnType === 'right') return;
		
		myMouse.clearClick();
		myComposerRenderer.outlineRemoveObj();		

		this.isDown = true;
		
		if(myCameraOrbit.activeCam.userData.isCam2D)
		{
			const rayhit = this.clickRayhit({event});
			this.actionRayhit({rayhit});
		}		
	}

	mousemove = (event) =>
	{
		if(!this.isDown) return;
		this.isMove = true;		
	}

	mouseup = (event) =>
	{	
		if(!this.isDown) return;
		
		if(!this.isMove && myCameraOrbit.activeCam.userData.isCam3D)
		{
			const rayhit = this.clickRayhit({event});
			this.actionRayhit({rayhit});
		}
		
		myMouse.setMouseStop(false);
		
		this.clearPoint();
	}
	
	
	clearPoint()
	{
		this.isDown = false;
		this.isMove = false;
		this.rayhit = null;
	}	
	
	
	// определяем на что кликнули и возращаем rayhit
	clickRayhit({event})
	{
		let ray = null;
		let rayhit = null;
		
		if(!rayhit) 
		{
			const pointsInfo = myCalcBlocks.myBlocksInfoPoints.getPointsInfo();
			
			ray = rayIntersect( event, pointsInfo, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; }				
		}
		
		if(!rayhit)
		{
			const idActive = myLevels.getIdActLevel();
			const walls = myCalcBlocks.myBlocksWalls.getWallsClone({id: idActive});
			
			if(!rayhit) ray = rayIntersect( event, walls, 'arr' );
			if(ray.length > 0) { rayhit = ray[0]; }				
		}
		
		return rayhit;
	}
	
	
	// действие в зависимости от того какой rayhit
	actionRayhit({rayhit})
	{
		if(!rayhit) 
		{
			myCalcBlocks.myBlocksInfoPoints.deletePointsInfo();
			
			return;
		}
		
		const object = rayhit.object;
		
		if(!object.userData.tag) return;
		
		if(object.userData.tag === 'blockPointInfo')
		{
			myComposerRenderer.outlineAddObj({arr: [object]});
			
			myMouse.setMouseStop(true);
		}
		
		if(object.userData.tag === 'blockWallClone')
		{
			myCalcBlocks.myBlocksInfoPoints.deletePointsInfo();
			
			const arrWClone = object.userData.arrWClone;
			const group = object.userData.group;
			const line = object.userData.line;
			
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
			
			
			const points = myCalcBlocks.myBlocksInfoPoints.getPointsFromGroup({group});
			myCalcBlocks.myBlocksInfoPoints.crPoints({arr: points});
			
			myComposerRenderer.outlineAddObj({arr: arrWClone});			
		}
		
		renderCamera();
	}
	
}







