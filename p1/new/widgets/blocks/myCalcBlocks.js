
// автоматическая расчет кол-во блоков/кирпичей
class MyCalcBlocks
{
	listPathImgs = {};
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.listPathImgs.kirpich = infProject.path+'img/widgets/blocks/one_kirpich.jpg';
		this.listPathImgs.block = infProject.path+'img/widgets/blocks/block_1.jpg';
		
		this.createBlock();
		this.createWall();
	}
	
	createBlock()
	{
		const material = new THREE.MeshStandardMaterial({ color: 0xffffff, lightMap : lightMap_1, wireframe: false });
		let geometry = createGeometryCube(0.6, 0.3, 0.2);		
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		const obj = new THREE.Mesh( geometry, material ); 
		obj.position.set(0, 0, 0);
		scene.add(obj);
		
		this.setImage({material});		
	}
	
	createWall()
	{
		const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, lightMap : lightMap_1, wireframe: false });
		let geometry = createGeometryCube(6, 3, 0.1);		
		geometry = new THREE.BufferGeometry().fromGeometry(geometry);	 
		const cube = new THREE.Mesh( geometry, material ); 
		cube.position.set(0, 0, 0);
		scene.add(cube);		
	}
	
	
	// добавляем img к obj
	async setImage({material})
	{
		const data = await this.xhrImg_1(this.listPathImgs.kirpich);	

		const image = new Image();
		image.src = data;
		
		material.color = new THREE.Color( 0xffffff );
		const texture = new THREE.Texture(image);			
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.anisotropy = renderer.capabilities.getMaxAnisotropy();			
		
		texture.needsUpdate = true;
		
		material.map = texture; 
		material.needsUpdate = true; 			
	}
	
	
	// загрузка файла (img)
	xhrImg_1(url) 
	{
		return new Promise((resolve, reject) => 
		{
			const request = new XMLHttpRequest();
			request.responseType = 'blob';
			request.open('GET', url, true);
			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			request.onload = function () 
			{
				if (request.status >= 200 && request.status < 400) 
				{
					const data = window.URL.createObjectURL(request.response);
					resolve(data);
				}
			};
			
			request.onprogress = (event) => {};

			request.onerror = () => { reject(request.response); };			
			
			request.send();
		});
	}

}







