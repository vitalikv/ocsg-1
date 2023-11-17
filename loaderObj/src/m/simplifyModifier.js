
//import * as THREE from '../node_modules/three/build/three.module.js';
import { BufferGeometry, Face3, Geometry, Vector2, Vector3 } from "../../node_modules/three/build/three.module.js";
import * as Build from '../index.js';


const lowerLimit = 51;



export function simplifyMesh({childs, childId, ratio, callback}) 
{
	let percentage = (ratio) ? ratio : 1 - Number(Build.infProg.class.rPanel.elem.gmod.slider.value);
	let child = childs[childId];
	
	let preserveTexture = (child.material.map || child.material.lightMap) ? true : false;
	preserveTexture = true; // если оптимизировать без маппинга, то потом нельзя будет поставить текстуру
	
	let isBufferGeometry = false;
	let geometry = child.geometry.clone();

	if(geometry instanceof BufferGeometry && !geometry.vertices && !geometry.faces) 
	{
		if(geometry.attributes.position.count < lowerLimit * 3) { console.log('%c return', 'color: #ff0000'); return simplifyMesh({childs, childId: childId + 1, ratio}); }

		geometry = new Geometry().fromBufferGeometry(geometry);
		isBufferGeometry = true;
	}

	
	if(!geometry.boundingSphere) geometry.computeBoundingSphere();
	let radius = geometry.boundingSphere;
	if(geometry.vertices.length < 50) { console.log('%c return', 'color: #ff0000'); return simplifyMesh({childs, childId: childId + 1, ratio}); }
	
	//console.time('merge');
	geometry.mergeVertices();
	geometry.computeVertexNormals();
	//console.timeEnd('merge');	
	

	let oldVertices = geometry.vertices; 
	let oldFaces = geometry.faces; 
	let oldFaceUVs = geometry.faceVertexUvs[0];

	let vertices = []; 
	let faces = []; 
	let faceUVs = []; 
	
	
	for(let i = 0; i < oldVertices.length; i++) 
	{
		vertices[i] = new Vertex(oldVertices[i], i);
	}
	
	//console.log('%c vertices', 'color: #ff0000', vertices);
	
	if(preserveTexture && oldFaceUVs.length) 
	{
		for(let i = 0; i < oldFaceUVs.length; i++) 
		{
			const faceUV = oldFaceUVs[i];

			faceUVs.push([
			new Vector2(faceUV[0].x, faceUV[0].y),
			new Vector2(faceUV[1].x, faceUV[1].y),
			new Vector2(faceUV[2].x, faceUV[2].y)
			]);
		}
	}


	for(let i = 0; i < oldFaces.length; i++) 
	{
		let face = oldFaces[i];
		
		faces[i] = new Triangle(
		vertices[face.a],
		vertices[face.b],
		vertices[face.c],
		face.a,
		face.b,
		face.c,
		faceUVs[i],
		face.materialIndex
		);
	}

	//console.time('computeEdge')
	for(let i = 0; i < vertices.length; i++) 
	{
		computeEdgeCostAtVertex(vertices[i]);
	}
	//console.timeEnd('computeEdge')	
	
	
	let z = Math.round(geometry.vertices.length * percentage);		
	
	animate({vertices, faces, preserveTexture, radius, oldFaceUVs, isBufferGeometry, z, z2: z, dfg: 1000, childs, childId, ratio: percentage, callback});
}



function animate({vertices, faces, preserveTexture, radius, oldFaceUVs, isBufferGeometry, z, z2, dfg, childs, childId, ratio, callback}) 
{	
	if(Build.infProg.class.modalW.elem.modgeom.stopModGeom) return finish({childs});
	
	if(z > -1) 
	{
		let item = Build.infProg.class.modalW.elem.modgeom.infoTxt.children[childId];
		if(item) item.children[1].innerText = Math.round(((z2 - z) / z2 * 100) * 100) / 100 + '%';
		
		dfg++;
		
		let nextVertex = minimumCostEdge(vertices);			
		if(!nextVertex) { z = 0; console.log('%c return', 'color: #ff0000'); return simplifyMesh({childs, childId: childId + 1, ratio}); }
		
		collapse( vertices, faces, nextVertex, nextVertex.collapseNeighbor, preserveTexture, radius);
		
		z--;
		
		if(dfg >= 1000) 
		{ 
			dfg = 0; 
			requestAnimationFrame( (time) => animate({vertices, faces, preserveTexture, radius, oldFaceUVs, isBufferGeometry, z, z2, dfg, childs, childId, ratio, callback}) ); 
		}
		else 
		{ 
			animate({vertices, faces, preserveTexture, radius, oldFaceUVs, isBufferGeometry, z, z2, dfg, childs, childId, ratio, callback}); 
		}		
	}
	else //if(z === -1) 
	{
		let item = Build.infProg.class.modalW.elem.modgeom.infoTxt.children[childId];
		if(item) item.children[1].innerText = 100 + '%';
		
		geom_2({vertices, faces, oldFaceUVs, isBufferGeometry, childs, childId, ratio, callback});
	}
	
	
	function minimumCostEdge(vertices) 
	{
		let least = vertices[0];

		for(let i = 0; i < vertices.length; i++) 
		{
			if(vertices[i].collapseCost < least.collapseCost) 
			{
				least = vertices[i];
			}
		}

		return least;
	}
	

}




function geom_2({vertices, faces, oldFaceUVs, isBufferGeometry, childs, childId, ratio, callback})
{
	let newGeo = new Geometry();
	if(oldFaceUVs && oldFaceUVs.length) newGeo.faceVertexUvs[0] = [];
	
	//console.time('newGeo');
	for(let i = 0; i < vertices.length; i++) 
	{
		newGeo.vertices.push(vertices[i].position);
	}
  
	for(let i = 0; i < faces.length; i++) 
	{
		let tri = faces[i];
		
		newGeo.faces.push(new Face3(vertices.indexOf(tri.v1), vertices.indexOf(tri.v2), vertices.indexOf(tri.v3), undefined, undefined, tri.materialIndex));

		if(oldFaceUVs && oldFaceUVs.length) newGeo.faceVertexUvs[0].push(faces[i].faceVertexUvs);
	}
	//console.timeEnd('newGeo');
	

	//console.time('mergeVertices')
	newGeo.mergeVertices();
	newGeo.computeVertexNormals();
	newGeo.computeFaceNormals();
	//newGeo.name = geometry.name;
	//console.timeEnd('mergeVertices')

	let child = childs[childId];
	child.geometry.dispose();	
	child.geometry = isBufferGeometry ? new BufferGeometry().fromGeometry(newGeo) : newGeo;	
	child.geometry.userData.typeMod = ratio;
	
	console.log('%c ------------- childId', 'color: #ff0000', childs.length - 1 === childId, childs, childId);
	

	if(childs.length - 1 === childId)
	{
		finish({childs, callback});
	}
	else
	{
		simplifyMesh({childs, childId: childId + 1, ratio, callback});
	}
}


function finish({childs, callback})
{			
	Build.render();
	Build.infProg.class.modalW.elem.modgeom.hide();
	Build.infProg.class.rPanel.elem.trnInput.getCountTr_2();	
	
	Build.infProg.class.modalW.elem.modgeom.stopModGeom = false;
	
	
	if(callback) callback();
}



var cb = new Vector3(),
  ab = new Vector3();

function pushIfUnique(array, object) {
  if (array.indexOf(object) === -1) array.push(object);
}



function computeEdgeCollapseCost(u, v) {
  // if we collapse edge uv by moving u to v then how
  // much different will the model change, i.e. the "error".

  var edgelength = v.position.distanceTo(u.position);
  var curvature = 0;

  var sideFaces = [];
  var i,
    uFaces = u.faces,
    il = u.faces.length,
    face,
    sideFace;

  // find the "sides" triangles that are on the edge uv
  for (i = 0; i < il; i++) {
    face = u.faces[i];

    if (face.hasVertex(v)) {
      sideFaces.push(face);
    }
  }

  // use the triangle facing most away from the sides
  // to determine our curvature term
  for (i = 0; i < il; i++) {
    var minCurvature = 1;
    face = u.faces[i];

    for (var j = 0; j < sideFaces.length; j++) {
      sideFace = sideFaces[j];
      // use dot product of face normals.
      var dotProd = face.normal.dot(sideFace.normal);
      minCurvature = Math.min(minCurvature, (1.001 - dotProd) / 2);
    }

    curvature = Math.max(curvature, minCurvature);
  }

  // crude approach in attempt to preserve borders
  // though it seems not to be totally correct
  var borders = 0;
  if (sideFaces.length < 2) {
    // we add some arbitrary cost for borders,
    // borders += 10;
    curvature = 1;
  }

  var amt = edgelength * curvature + borders;

  return amt;
}

function computeEdgeCostAtVertex(v) {
  // compute the edge collapse cost for all edges that start
  // from vertex v.  Since we are only interested in reducing
  // the object by selecting the min cost edge at each step, we
  // only cache the cost of the least cost edge at this vertex
  // (in member variable collapse) as well as the value of the
  // cost (in member variable collapseCost).

  if (v.neighbors.length === 0) {
    // collapse if no neighbors.
    v.collapseNeighbor = null;
    v.collapseCost = -0.01;

    return;
  }

  v.collapseCost = 100000;
  v.collapseNeighbor = null;

  // search all neighboring edges for "least cost" edge
  for (var i = 0; i < v.neighbors.length; i++) {
    var collapseCost = computeEdgeCollapseCost(v, v.neighbors[i]);

    if (!v.collapseNeighbor) {
      v.collapseNeighbor = v.neighbors[i];
      v.collapseCost = collapseCost;
      v.minCost = collapseCost;
      v.totalCost = 0;
      v.costCount = 0;
    }

    v.costCount++;
    v.totalCost += collapseCost;

    if (collapseCost < v.minCost) {
      v.collapseNeighbor = v.neighbors[i];
      v.minCost = collapseCost;
    }
  }

  // we average the cost of collapsing at this vertex
  v.collapseCost = v.totalCost / v.costCount;
  // v.collapseCost = v.minCost;
}



function removeFace(f, faces) {
  removeFromArray(faces, f);

  if (f.v1) removeFromArray(f.v1.faces, f);
  if (f.v2) removeFromArray(f.v2.faces, f);
  if (f.v3) removeFromArray(f.v3.faces, f);

  // TODO optimize this!
  var vs = [f.v1, f.v2, f.v3];
  var v1, v2;

  for (var i = 0; i < 3; i++) {
    v1 = vs[i];
    v2 = vs[(i + 1) % 3];

    if (!v1 || !v2) continue;
    v1.removeIfNonNeighbor(v2);
    v2.removeIfNonNeighbor(v1);
  }
}





let max = 100;
function collapse(vertices, faces, u, v, preserveTexture, radius) {
  // u and v are pointers to vertices of an edge
  // Collapse the edge uv by moving vertex u onto v

  if (!v) {
    // u is a vertex all by itself so just delete it..
	
    removeVertex(u, vertices);
    return;
  }

  var i;
  var tmpVertices = [];

  for (i = 0; i < u.neighbors.length; i++) {
    tmpVertices.push(u.neighbors[i]);
  }

  var moveToThisUvsValues = [];

  // delete triangles on edge uv:
  for (i = u.faces.length - 1; i >= 0; i--) {
    if (u.faces[i].hasVertex(v)) {
      if (preserveTexture) moveToThisUvsValues = getUVsOnVertex(u.faces[i], v);
      removeFace(u.faces[i], faces);
    }
  }

  if (preserveTexture) {
    for (i = u.faces.length - 1; i >= 0; i--) {
      var face = u.faces[i];
      if (max > 0) {
        const dist1 = face.v1.position.distanceTo(face.v2.position);
        const dist2 = face.v2.position.distanceTo(face.v3.position);
        const dist3 = Math.sqrt(dist1 * dist1 + dist2 * dist2);
        const angles = getTriangleAnglesFromDistances(dist1, dist2, dist3);
        const anglesUV = getAnglesFromPoints(face.faceVertexUvs);
        //console.log(angles, anglesUV);
        max--;
      }
      var faceVerticeUVs = getUVsOnVertex(u.faces[i], u);

      var verticeDistance = u.position.distanceTo(v.position);
      var size = radius * 2;
      var percentageChangeVertexShift = 100 / size * verticeDistance;

      var deltaX = Math.abs(100 * (moveToThisUvsValues.x - faceVerticeUVs.x));
      var deltaY = Math.abs(100 * (moveToThisUvsValues.y - faceVerticeUVs.y));
      var percentageChangeTextureCorrds = Math.max(deltaX, deltaY);

      // safety check from strange results:
      // if texture shift percentage is much higher than
      // vertex position shift in relation to object size
      if (Math.abs(percentageChangeTextureCorrds - percentageChangeVertexShift) > 5) continue;

      faceVerticeUVs.x = moveToThisUvsValues.x;
      faceVerticeUVs.y = moveToThisUvsValues.y;
    }
  }

	// update remaining triangles to have v instead of u
	for (let i = u.faces.length - 1; i >= 0; i--) 
	{
		u.faces[i].replaceVertex(u, v);
	}


	removeVertex(u, vertices);

	// recompute the edge collapse costs in neighborhood
	for (let i = 0; i < tmpVertices.length; i++) 
	{
		computeEdgeCostAtVertex(tmpVertices[i]);
	}
	
	
	function removeVertex(v, vertices) 
	{
		while (v.neighbors.length) 
		{
			let n = v.neighbors.pop();		
			removeFromArray(n.neighbors, v);
		}

		removeFromArray(vertices, v);
	}	
}






function removeFromArray(array, object) 
{
	let k = array.indexOf(object);
	if (k > -1) array.splice(k, 1);
}


function getUVsOnVertex(face, vertex) {
  return face.faceVertexUvs[getVertexIndexOnFace(face, vertex)];
}

function getVertexIndexOnFace(face, vertex) {
  return [face.v1, face.v2, face.v3].indexOf(vertex);
}



// we use a triangle class to represent structure of face slightly differently

function Triangle(v1, v2, v3, a, b, c, fvuv, materialIndex) {
  this.a = a;
  this.b = b;
  this.c = c;

  this.v1 = v1;
  this.v2 = v2;
  this.v3 = v3;

  this.normal = new Vector3();
  this.faceVertexUvs = fvuv;
  this.materialIndex = materialIndex;

  this.computeNormal();

  v1.faces.push(this);
  v1.addUniqueNeighbor(v2);
  v1.addUniqueNeighbor(v3);

  v2.faces.push(this);
  v2.addUniqueNeighbor(v1);
  v2.addUniqueNeighbor(v3);

  v3.faces.push(this);
  v3.addUniqueNeighbor(v1);
  v3.addUniqueNeighbor(v2);
}

Triangle.prototype.computeNormal = function() {
  var vA = this.v1.position;
  var vB = this.v2.position;
  var vC = this.v3.position;

  cb.subVectors(vC, vB);
  ab.subVectors(vA, vB);
  cb.cross(ab).normalize();

  this.normal.copy(cb);
};

Triangle.prototype.hasVertex = function(v) {
  return v === this.v1 || v === this.v2 || v === this.v3;
};

Triangle.prototype.replaceVertex = function(oldv, newv) {
  if (oldv === this.v1) this.v1 = newv;
  else if (oldv === this.v2) this.v2 = newv;
  else if (oldv === this.v3) this.v3 = newv;

  removeFromArray(oldv.faces, this);
  newv.faces.push(this);

  oldv.removeIfNonNeighbor(this.v1);
  this.v1.removeIfNonNeighbor(oldv);

  oldv.removeIfNonNeighbor(this.v2);
  this.v2.removeIfNonNeighbor(oldv);

  oldv.removeIfNonNeighbor(this.v3);
  this.v3.removeIfNonNeighbor(oldv);

  this.v1.addUniqueNeighbor(this.v2);
  this.v1.addUniqueNeighbor(this.v3);

  this.v2.addUniqueNeighbor(this.v1);
  this.v2.addUniqueNeighbor(this.v3);

  this.v3.addUniqueNeighbor(this.v1);
  this.v3.addUniqueNeighbor(this.v2);

  this.computeNormal();
};

function Vertex(v, id) {
  this.position = v;

  this.id = id; // old index id

  this.faces = []; // faces vertex is connected
  this.neighbors = []; // neighbouring vertices aka "adjacentVertices"

  // these will be computed in computeEdgeCostAtVertex()
  this.collapseCost = 0; // cost of collapsing this vertex, the less the better. aka objdist
  this.collapseNeighbor = null; // best candinate for collapsing
}

Vertex.prototype.addUniqueNeighbor = function(vertex) {
  pushIfUnique(this.neighbors, vertex);
};

Vertex.prototype.removeIfNonNeighbor = function(n) {
  var neighbors = this.neighbors;
  var faces = this.faces;

  var offset = neighbors.indexOf(n);
  if (offset === -1) return;
  for (var i = 0; i < faces.length; i++) {
    if (faces[i].hasVertex(n)) return;
  }

  neighbors.splice(offset, 1);
};









function getTriangleAnglesFromDistances(a, b, c) {
  var A, B, C, R, s, pi, area;
  pi = Math.PI;

  s = (a + b + c) / 2;

  area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

  R = a * b * c / (4 * area);

  A = 180 / pi * Math.asin(a / (2 * R));
  B = 180 / pi * Math.asin(b / (2 * R));
  C = 180 / pi * Math.asin(c / (2 * R));

  return [A, B, C];
}

function getAnglesFromPoints(uvs) {
  const pointA = uvs[0];
  const pointB = uvs[1];
  const pointC = uvs[2];

  const dist1 = Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
  const dist2 = Math.sqrt(
    Math.pow(pointB.x - pointC.x, 2) + Math.pow(pointB.y - pointC.y, 2)
  );
  const dist3 = Math.sqrt(dist1 * dist1 + dist2 * dist2);
  return getTriangleAnglesFromDistances(dist1, dist2, dist3);
}







