


class MyMath
{

	// проекция точки на линию (3D), получаем точку пересечения
	mathProjectPointOnLine(cdm)
	{
		var A = cdm.p[0];
		var B = cdm.p[1];
		var C = cdm.rayHit;
		
		var x1 = A.x;
		var y1 = A.y;
		var z1 = A.z;
		
		var x2 = B.x;
		var y2 = B.y;
		var z2 = B.z;
		
		var x3 = C.x;
		var y3 = C.y;
		var z3 = C.z;	
		
		var alpha = ((x3-x1)*(x2-x1) + (y3-y1)*(y2-y1) + (z3-z1)*(z2-z1)) / ((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1));
		var pos = new THREE.Vector3(x1+alpha*(x2-x1), y1+alpha*(y2-y1), z1+alpha*(z2-z1));

		return pos;
	}
	

	// попадает ли точка в граница отрезка 3D BoundBox
	checkPointBoundBoxLine(pointA, pointB, pointToCheck) 
	{
		if(pointToCheck.x < Math.min(pointA.x, pointB.x) || pointToCheck.x > Math.max(pointA.x, pointB.x)) { return false; }

		if(pointToCheck.y < Math.min(pointA.y, pointB.y) || pointToCheck.y > Math.max(pointA.y, pointB.y)) { return false; }

		if(pointToCheck.z < Math.min(pointA.z, pointB.z) || pointToCheck.z > Math.max(pointA.z, pointB.z)) { return false; } 

		return true;
	}	
}













