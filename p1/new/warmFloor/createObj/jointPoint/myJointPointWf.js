

class MyJointPointWf
{
	geometry;
	material;
	
	constructor()
	{
		this.init();
	}
	
	init()
	{
		this.geometry = new THREE.BoxGeometry( 0.01, 0.01, 0.01 );
		this.material = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false, lightMap: lightMap_1 });
	}


	crJointPoint({objParent, id = 0, name = '', pos = new THREE.Vector3(), rot = new THREE.Vector3()}) 
	{
		const joint = new THREE.Mesh( this.geometry, this.material );
		joint.position.copy(pos); 
		
		//if(cdm.q) { joint.quaternion.copy(cdm.q); }
		joint.rotation.set(rot.x, rot.y, rot.z);
		
		//joint.visible = false;
		joint.renderOrder = 1;						
		
		joint.userData.tag = 'jointWf';
		joint.userData.id = id;  
		joint.userData.centerPoint = { join: null };						 
		joint.userData.centerPoint.nameRus = name;
		
		objParent.add( joint );	
	}	
}







