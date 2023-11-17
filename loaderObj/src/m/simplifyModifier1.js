
//import * as THREE from '../node_modules/three/build/three.module.js';
import { BufferGeometry, Face3, Geometry, Vector2, Vector3 } from "../../node_modules/three/build/three.module.js";
import * as Build from '../index.js';
/*
 *  @author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *
 *  Simplification Geometry Modifier
 *    - based on code and technique
 *    - by Stan Melax in 1998
 *    - Progressive Mesh type Polygon Reduction Algorithm
 *    - http://www.melax.com/polychop/
 */

let hostname = document.location.hostname;
let urlParams = new URLSearchParams(document.location.search);					

let php = false;
if(urlParams.get('geomPhp')){ php = true; }		// http://test-webgl/loaderObj/src/?geom=true&geomPhp=true	
	

async function phpMod_1({v, f, uv, actT = false, percentage, radius}) 
{
	let url = 'save-local-file/modGeom_2.php';
	
	//arr = arr.map(o => JSON.stringify( o ));
	v = JSON.stringify( v );
	f = JSON.stringify( f );
	uv = JSON.stringify( uv );
	
	let response = await fetch(url, 
	{
		method: 'POST',
		body: '&v='+encodeURIComponent(v)+'&f='+encodeURIComponent(f)+'&uv='+encodeURIComponent(uv)+'&actT='+actT+'&percentage='+percentage+'&radius='+radius, 
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },				
	});
	let json = await response.json();
	if(json.error) return null;	
	
	return json;
}	


let vertices = []; 
let faces = []; 
let faceUVs = [];
let preserveTexture, radius;
let z, z2;
let oldFaceUVs;
let isBufferGeometry = false;
let triangles_2 = 0;

function animate(child) 
{
		
					
	if(z > -1) 
	{
		Build.infProg.class.modalW.elem.modgeom.infoTxt.innerHTML = (z2 - z) / z2 * 100;
		console.log(z);
		
		setTimeout(()=>
		{ 
			let nextVertex = minimumCostEdge(vertices);			
			if(!nextVertex) { z = 0; }
			else { collapse({nextVertex, preserveTexture, radius}); }	
			z--;
			animate(child);
	

		}, 0);		
	}
	
	if(z === -1) return geom_2(child)
}

function startF() 
{
		new Promise((resolve, reject) => {
			console.log(z);
			if(z === -1) 
			{
				console.log(99999);
				resolve(true);
			}
		});	
}


let countChild = 0;
let currentChild = 0;

export function simplifyMesh(geometry, percentage, preserveTexture, count, child) 
{
	isBufferGeometry = false;
	countChild = count;
	
	if(geometry instanceof BufferGeometry && !geometry.vertices && !geometry.faces) 
	{
		if(geometry.attributes.position.count < 51 * 3) return geometry;

		geometry = new Geometry().fromBufferGeometry(geometry);
		isBufferGeometry = true;
	}
	
	if(geometry.vertices.length < 50) return geometry;
	
	if(!geometry.boundingSphere) geometry.computeBoundingSphere();
	let radius = geometry.boundingSphere.radius;	
	
	
	console.time('merge');
	geometry.mergeVertices();
	geometry.computeVertexNormals();
	console.timeEnd('merge');	
	
	
	let oldVertices = geometry.vertices; 
	let oldFaces = geometry.faces; 
	oldFaceUVs = geometry.faceVertexUvs[0];

	// очищаем старые данные
	vertices = []; 
	faces = []; 
	faceUVs = [];	

	let newGeo = new Geometry();
	if(oldFaceUVs.length) newGeo.faceVertexUvs[0] = [];

	if(!php)
	{		
		for (let i = 0; i < oldVertices.length; i++) 
		{
			vertices[i] = new Vertex(oldVertices[i], i);
		}

		console.log('%c vertices', 'color: #ff0000', vertices);
		
		if (preserveTexture && oldFaceUVs.length) 
		{
			for (let i = 0; i < oldFaceUVs.length; i++) 
			{
				const faceUV = oldFaceUVs[i];

				faceUVs.push([
				new Vector2(faceUV[0].x, faceUV[0].y),
				new Vector2(faceUV[1].x, faceUV[1].y),
				new Vector2(faceUV[2].x, faceUV[2].y)
				]);
			}
		}

		
		// add faces
		for (let i = 0; i < oldFaces.length; i++) 
		{
			faces[i] = new Triangle
			(
				vertices[oldFaces[i].a],
				vertices[oldFaces[i].b],
				vertices[oldFaces[i].c],
				oldFaces[i].a,
				oldFaces[i].b,
				oldFaces[i].c,
				faceUVs[i],
				oldFaces[i].materialIndex
			);
		}	

		
		console.time('computeEdge');
		for (let i = 0; i < vertices.length; i++) 
		{
			computeEdgeCostAtVertex({id: i});
		}
		console.timeEnd('computeEdge')	
		

		console.time('z')
		// console.profile('zz');

		let nextVertex;
		z = Math.round(geometry.vertices.length * percentage);	
		z2 = Math.round(geometry.vertices.length * percentage);

		// console.profileEnd('zz');
		console.timeEnd('z')
		
		return animate(child)
	}
	else 
	{
		console.time('phpMod_1');
		//let data = await phpMod_1({v: oldVertices, f: oldFaces, uv: oldFaceUVs, actT: preserveTexture, percentage: Math.round(geometry.vertices.length * percentage), radius});
		console.log(111, data);
		console.timeEnd('phpMod_1');
		
		for (var i = 0; i < data.v2.length; i++) 
		{
			newGeo.vertices.push(new Vector3(data.v2[i].x, data.v2[i].y, data.v2[i].z));		
		}	

		for (var i = 0; i < data.f2.length; i++) 
		{
			let face3 = new Face3(data.f2[i].a, data.f2[i].b, data.f2[i].c, undefined, undefined, data.f2[i].materialIndex)
			newGeo.faces.push(face3);

			if (oldFaceUVs.length) 
			{
				let uvs = data.f2[i].faceVertexUvs;
				
				let uv = ([
				new Vector2(uvs[0].x, uvs[0].y),
				new Vector2(uvs[1].x, uvs[1].y),
				new Vector2(uvs[2].x, uvs[2].y)
				]);				
				
				newGeo.faceVertexUvs[0].push(uv);
			}
		}
  
		//console.log('newGeo', newGeo);
		//console.log('newGeo2', newGeo2);
	}
	
	
	vertices = []; 
	faces = []; 
	faceUVs = [];	

	console.time('mergeVertices')
	newGeo.mergeVertices();
	newGeo.computeVertexNormals();
	newGeo.computeFaceNormals();
	newGeo.name = geometry.name;
	console.timeEnd('mergeVertices')

	//console.log(`Before ${ oldVertices.length } After ${newGeo.vertices.length}`);
	console.log('-------------');
	
	
	
	return isBufferGeometry ? new BufferGeometry().fromGeometry(newGeo) : newGeo;
}


function geom_2(child)
{
	let newGeo = new Geometry();
	if(oldFaceUVs.length) newGeo.faceVertexUvs[0] = [];	
	
	console.time('newGeo');
	let vertices2 = [];
	for (let i = 0; i < vertices.length; i++) 
	{
		if(!vertices[i]) continue;
		vertices2.push(vertices[i]);
	}
	vertices = vertices2;		
	
	for (let i = 0; i < vertices.length; i++) 
	{
		newGeo.vertices.push(vertices[i].position);
	}
  
	for (let i = 0; i < faces.length; i++) 
	{
		let face = faces[i];
		
		let id1 = vertices.findIndex(item => item.id === face.vid1);
		let id2 = vertices.findIndex(item => item.id === face.vid2);
		let id3 = vertices.findIndex(item => item.id === face.vid3);
		
		newGeo.faces.push(new Face3(id1, id2, id3, undefined, undefined, face.materialIndex));

		//newGeo.faces.push(new Face3(vertices.indexOf(face.v1), vertices.indexOf(face.v2), vertices.indexOf(face.v3), undefined, undefined, face.materialIndex));
		
		if (oldFaceUVs.length) newGeo.faceVertexUvs[0].push(faces[i].faceVertexUvs);
	}
	console.timeEnd('newGeo');	
	
	
	

	console.time('mergeVertices')
	newGeo.mergeVertices();
	newGeo.computeVertexNormals();
	newGeo.computeFaceNormals();
	//newGeo.name = geometry.name;
	console.timeEnd('mergeVertices')

	//console.log(`Before ${ oldVertices.length } After ${newGeo.vertices.length}`);
	
	
	child.geometry = isBufferGeometry ? new BufferGeometry().fromGeometry(newGeo) : newGeo;
	
	triangles_2 += child.geometry.attributes.position.count/3;
	
	currentChild++;
	
	console.log('-------------', currentChild, countChild, child);

	vertices = []; 
	faces = []; 
	faceUVs = [];
	
	if(currentChild === countChild)
	{
		
		Build.infProg.class.modalW.elem.modgeom.hide();
		Build.infProg.class.rPanel.elem.trnInput.divTr_1.innerText = '' +triangles_2;
		currentChild = 0;
	}	
}



class Vertex 
{
	constructor(v, id)
	{
		this.position = v;
		this.id = id; 
		this.faces = []; 
		this.neighbors = []; 

		this.collapseCost = 0; 
		this.collapseNeighborId = null;	
	}

	addUniqueNeighbor(id)
	{				
		if(this.neighbors.indexOf(id) === -1) this.neighbors.push(id);
	}
	
	removeIfNonNeighbor(id)
	{
		for (let i = 0; i < this.faces.length; i++) 
		{
			if (this.faces[i].hasVertexId(id)) return;
		}

		let id2 = this.neighbors.findIndex(item => item === id);
		if(id2 === -1) return;
		this.neighbors.splice(id2, 1);		
	}
}


class Triangle 
{
	constructor(v1, v2, v3, a, b, c, fvuv, materialIndex)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		
		this.vid1 = v1.id;
		this.vid2 = v2.id;
		this.vid3 = v3.id;		

		this.normal = new Vector3();
		this.faceVertexUvs = fvuv;
		this.materialIndex = materialIndex;

		this.computeNormal();

		v1.faces.push(this);
		v1.addUniqueNeighbor(this.vid2);
		v1.addUniqueNeighbor(this.vid3);

		v2.faces.push(this);
		v2.addUniqueNeighbor(this.vid1);
		v2.addUniqueNeighbor(this.vid3);

		v3.faces.push(this);
		v3.addUniqueNeighbor(this.vid1);
		v3.addUniqueNeighbor(this.vid2);		
	}
	
	computeNormal()
	{
		var vA = vertices[this.vid1].position;
		var vB = vertices[this.vid2].position;
		var vC = vertices[this.vid3].position;

		let cb = new Vector3().subVectors(vC, vB);
		let ab = new Vector3().subVectors(vA, vB);
		cb.cross(ab).normalize();

		this.normal.copy(cb);		
	}	

	hasVertexId(id)
	{
		return id === this.vid1 || id === this.vid2 || id === this.vid3;
	}
	
	replaceVertex(oldv, newv)
	{
		if (oldv.id === this.vid1) this.vid1 = newv.id;
		else if (oldv.id === this.vid2) this.vid2 = newv.id;
		else if (oldv.id === this.vid3) this.vid3 = newv.id;
		
		removeFromArray(oldv.faces, this);
		newv.faces.push(this);

		oldv.removeIfNonNeighbor(this.vid1);
		vertices[this.vid1].removeIfNonNeighbor(oldv.id);

		oldv.removeIfNonNeighbor(this.vid2);
		vertices[this.vid2].removeIfNonNeighbor(oldv.id);

		oldv.removeIfNonNeighbor(this.vid3);
		vertices[this.vid3].removeIfNonNeighbor(oldv.id);

		vertices[this.vid1].addUniqueNeighbor(this.vid2);
		vertices[this.vid1].addUniqueNeighbor(this.vid3);

		vertices[this.vid2].addUniqueNeighbor(this.vid1);
		vertices[this.vid2].addUniqueNeighbor(this.vid3);

		vertices[this.vid3].addUniqueNeighbor(this.vid1);
		vertices[this.vid3].addUniqueNeighbor(this.vid2);

		this.computeNormal();		
	}
}


// вычислить все затраты на схлопывание граней
function computeEdgeCostAtVertex({id}) 
{
	// compute the edge collapse cost for all edges that start
	// from vertex v.  Since we are only interested in reducing
	// the object by selecting the min cost edge at each step, we
	// only cache the cost of the least cost edge at this vertex
	// (in member variable collapse) as well as the value of the
	// cost (in member variable collapseCost).
	
	let v = vertices[id];	
	
	if (v.neighbors.length === 0) 
	{
		v.collapseNeighborId = null;
		v.collapseCost = -0.01;
		return;
	}

	v.collapseCost = Infinity;
	v.collapseNeighborId = null;
	
	// ищем все соседние грани поблизости 
	for (let i = 0; i < v.neighbors.length; i++) 
	{
		let collapseCost = computeEdgeCollapseCost({parentV: v, id: v.neighbors[i]});
		
		if (v.collapseNeighborId === null) 
		{
			v.collapseNeighborId = v.neighbors[i];
			v.collapseCost = collapseCost;
			v.minCost = collapseCost;
			v.totalCost = 0;
			v.costCount = 0;
		}

		v.costCount++;
		v.totalCost += collapseCost;

		if (collapseCost < v.minCost) 
		{
			v.collapseNeighborId = v.neighbors[i];
			v.minCost = collapseCost;
		}
	}

	// усредняем стоимость коллапса этой вершины
	v.collapseCost = v.totalCost / v.costCount;
	//v.collapseCost = v.minCost;
	
	
	function computeEdgeCollapseCost({parentV, id}) 
	{
		let neighborV = vertices[id];
		
		// if we collapse edge uv by moving parentV to neighborV then how
		// much different will the model change, i.e. the "error".	
		
		let edgelength = neighborV.position.distanceTo(parentV.position);
		let curvature = 0;

		let sideFaces = [];

		// находим стороны(треугольника), которые находятся на ребре uv
		for (let i = 0; i < parentV.faces.length; i++) 
		{
			if (parentV.faces[i].hasVertexId(id)) sideFaces.push(parentV.faces[i]);
		}

		// use the triangle facing most away from the sides 
		// to determine our curvature term
		for (let i = 0; i < parentV.faces.length; i++) 
		{
			let minCurvature = 1;

			for (let j = 0; j < sideFaces.length; j++) 
			{
				let dotProd = parentV.faces[i].normal.dot(sideFaces[j].normal);
				minCurvature = Math.min(minCurvature, (1.001 - dotProd) / 2);
			}

			curvature = Math.max(curvature, minCurvature);
		}

		// crude approach in attempt to preserve borders
		// though it seems not to be totally correct
		let borders = 0;
		if (sideFaces.length < 2) curvature = 1; // we add some arbitrary cost for borders, borders += 10;

		return edgelength * curvature + borders;
	}	
}




function minimumCostEdge(vertices) 
{
	let least = vertices[0];
	
	for (let i = 0; i < vertices.length; i++)
	{
		if(!vertices[i]) continue;
		least = vertices[i];
		break;
	}

	for (let i = 0; i < vertices.length; i++) 
	{
		if(!vertices[i]) continue;
		
		if(vertices[i].collapseCost < least.collapseCost) 
		{
			least = vertices[i];
		}
	}

	return least;
}



let max = 100;
function collapse({nextVertex, preserveTexture, radius}) 
{
	// nextVertex and collapseNeighbor are pointers to vertices of an edge
	// Collapse the edge uv by moving vertex nextVertex onto collapseNeighbor
	
	let collapseNeighborId = nextVertex.collapseNeighborId;
	
	if(collapseNeighborId === null) // это вершина сама по себе, поэтому просто удаляем ее
	{
		removeVertex(nextVertex, vertices);
		return;
	}

	let arrIdNeighbor = [...nextVertex.neighbors];

	let moveToThisUvsValues = [];

	// удаляем треугольники на гранях uv
	for(let i = nextVertex.faces.length - 1; i >= 0; i--) 
	{
		if (nextVertex.faces[i].hasVertexId(collapseNeighborId))
		{
			if (preserveTexture) moveToThisUvsValues = getUVsOnVertexId({face: nextVertex.faces[i], itemId: collapseNeighborId});
			removeFace(nextVertex.faces[i], faces);
		}
	}

	if(preserveTexture) 
	{
		for(let i = nextVertex.faces.length - 1; i >= 0; i--) 
		{
			let face = nextVertex.faces[i];
			
			if(max > 0) 
			{
				let dist1 = vertices[face.vid1].position.distanceTo(vertices[face.vid2].position);
				let dist2 = vertices[face.vid2].position.distanceTo(vertices[face.vid3].position);
				let dist3 = Math.sqrt(dist1 * dist1 + dist2 * dist2);
				let angles = getTriangleAnglesFromDistances(dist1, dist2, dist3);
				let anglesUV = getAnglesFromPoints(face.faceVertexUvs);
				//console.log(angles, anglesUV);
				max--;
			}
			

			let faceVerticeUVs = getUVsOnVertexId({face: nextVertex.faces[i], itemId: nextVertex.id});
			
			let verticeDistance = nextVertex.position.distanceTo(vertices[collapseNeighborId].position);
			let size = radius * 2;
			let percentageChangeVertexShift = 100 / size * verticeDistance;

			let deltaX = Math.abs(100 * (moveToThisUvsValues.x - faceVerticeUVs.x));
			let deltaY = Math.abs(100 * (moveToThisUvsValues.y - faceVerticeUVs.y));
			let percentageChangeTextureCorrds = Math.max(deltaX, deltaY);

			// проверка безопасности от странных результатов:
			// если процент сдвига текстуры намного выше, чем
			// сдвиг позиции вершины относительно размера объекта
			if (Math.abs(percentageChangeTextureCorrds - percentageChangeVertexShift) > 5) continue;

			faceVerticeUVs.x = moveToThisUvsValues.x;
			faceVerticeUVs.y = moveToThisUvsValues.y;
		}
	}

	// обновляем оставшиеся треугольники, вместо nextVertex заменаем на vertices[collapseNeighborId]
	for(let i = nextVertex.faces.length - 1; i >= 0; i--) 
	{
		nextVertex.faces[i].replaceVertex(nextVertex, vertices[collapseNeighborId]);
	}


	removeVertex(nextVertex, vertices);

	// пересчитать стоимость коллапса граней
	for(let i = 0; i < arrIdNeighbor.length; i++) 
	{
		computeEdgeCostAtVertex({id: arrIdNeighbor[i]});
	}
	
	
	function removeVertex(v, vertices) 
	{
		//console.assert(v.faces.length === 0);
		
		while(v.neighbors.length) 
		{
			let n = v.neighbors.pop();
			removeFromArray(n.neighbors, v);
		}
		
		let n = vertices.indexOf(v);
		if(n !== -1) vertices[n] = null;
	}
	
}



function removeFromArray(array, object) 
{
	let k = array.indexOf(object);
	if (k > -1) array.splice(k, 1);
}



function getUVsOnVertexId({face, itemId}) 
{
	let id = [face.vid1, face.vid2, face.vid3].indexOf(itemId);
	
	return face.faceVertexUvs[id];
}


function removeFace(f, faces) 
{
	removeFromArray(faces, f);

	if(f.vid1 !== null) removeFromArray(vertices[f.vid1].faces, f);
	if(f.vid2 !== null) removeFromArray(vertices[f.vid2].faces, f);
	if(f.vid3 !== null) removeFromArray(vertices[f.vid3].faces, f);

	let vs = [vertices[f.vid1], vertices[f.vid2], vertices[f.vid3]];
	let v1, v2;

	for (let i = 0; i < 3; i++) 
	{
		v1 = vs[i];
		v2 = vs[(i + 1) % 3];

		if (!v1 || !v2) continue;
		v1.removeIfNonNeighbor(v2.id);
		v2.removeIfNonNeighbor(v1.id);
	}
}


function getTriangleAnglesFromDistances(a, b, c) 
{
	let A, B, C, R, s, pi, area;
	pi = Math.PI;

	s = (a + b + c) / 2;

	area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

	R = a * b * c / (4 * area);

	A = 180 / pi * Math.asin(a / (2 * R));
	B = 180 / pi * Math.asin(b / (2 * R));
	C = 180 / pi * Math.asin(c / (2 * R));

	return [A, B, C];
}



function getAnglesFromPoints(uvs) 
{
	const pointA = uvs[0];
	const pointB = uvs[1];
	const pointC = uvs[2];

	const dist1 = Math.sqrt( Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2) );
	const dist2 = Math.sqrt( Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2) );
	const dist3 = Math.sqrt(dist1 * dist1 + dist2 * dist2);
	return getTriangleAnglesFromDistances(dist1, dist2, dist3);
}


