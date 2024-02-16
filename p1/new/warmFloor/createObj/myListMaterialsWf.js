

class MyListMaterialsWf
{
	listImg = {};
	listMat = {};
	
	constructor()
	{
		this.initImg();
		this.initMat();
	}
	
	initImg()
	{
		this.listImg.rezba_1 = new THREE.TextureLoader().load(infProject.path+'/img/objs/rezba_1.png');		
	}
	
	initMat()
	{		
		this.listMat.rezba_1 = new THREE.MeshStandardMaterial({ color: 0xc1c6c9, map: this.listImg.rezba_1, lightMap: lightMap_1, side: THREE.DoubleSide });
		this.listMat.rezba_1.map.repeat.x = 900; 
		this.listMat.rezba_1.map.rotation = THREE.Math.degToRad( 2 );
		this.listMat.rezba_1.map.wrapS = THREE.RepeatWrapping; 
		this.listMat.rezba_1.map.wrapT = THREE.RepeatWrapping;

		this.listMat.metal_white = new THREE.MeshStandardMaterial({ color: 0xffffff, lightMap: lightMap_1, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5 });
		
		this.listMat.metal_white_edge = this.listMat.metal_white.clone();
		this.listMat.metal_white_edge.flatShading = true;
	
		this.listMat.metal_1 = new THREE.MeshStandardMaterial({ color: 0xc1c6c9, lightMap: lightMap_1, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5 });

		this.listMat.metal_1_edge = this.listMat.metal_1.clone();
		this.listMat.metal_1_edge.flatShading = true;	

		this.listMat.red_1 = new THREE.MeshStandardMaterial({ color: 0xbf2502, lightMap: lightMap_1, side: THREE.DoubleSide });
		
		this.listMat.red_1_edge = this.listMat.red_1.clone();
		this.listMat.red_1_edge.flatShading = true;	

		this.listMat.bronz_1 = new THREE.MeshStandardMaterial({ color: 0xb87c23, lightMap: lightMap_1, side: THREE.DoubleSide, metalness: 0.1, roughness: 0.5 });
	}		


	getListmat()
	{
		return this.listMat;
	}
}







