import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';


export function initEdgeExample()
{
	let light = new THREE.DirectionalLight(0xffffff, 1.);
	light.position.setScalar(10);
	Build.scene.add(light);
	Build.scene.add(new THREE.AmbientLight(0xffffff, 0.5));	
	
	let radius = 0.2;
	let height = 1;
	let segments = 16;
	
	// simply cylinder
	let cyl = new THREE.Mesh(
	  new THREE.CylinderBufferGeometry(radius, radius, height, segments),
	  new THREE.MeshLambertMaterial({
		color: 0x000000,
		map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/uv_grid_opengl.jpg"),
		polygonOffset: true,
		polygonOffsetFactor: 1
	  })
	);
	Build.scene.add(cyl);


	
	if(1==2)
	{
		let sidesMat = new THREE.ShaderMaterial({
		  vertexShader: conditionalLineVertShader,
		  fragmentShader: conditionalLineFragShader,
		  uniforms: {
			diffuse: {
			  value: new THREE.Color(0x00ff00)
			},
			opacity: {
			  value: 0
			}
		  },
		  transparent: false
		});
		let sidesLine = new THREE.LineSegments(cyl.geometry, sidesMat);
		Build.scene.add(sidesLine);		
	}
	else if(1==1)
	{
		createOutlineSegments(cyl.geometry, 0x00ff00);
		//cyl.visible = false;
	}
	else
	{
		const geometry = new THREE.BoxGeometry( 100, 100, 100 );
		const edges = new THREE.EdgesGeometry( cyl.geometry, 50 );
		const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x00ff00, transparent: true, depthTest: false } ) );
		Build.scene.add( line );		
	}
	
}


function createOutlineSegments(geometry, color){
  let eg = EdgesGeometry(geometry);
  let m = new THREE.ShaderMaterial({
    vertexShader: conditionalLineVertShader,
    fragmentShader: conditionalLineFragShader,
    uniforms: {
      diffuse: {
        value: new THREE.Color(color)
      },
      opacity: {
        value: 1
      }
    },
    transparent: true,
	depthTest: false
  });
  let line = new THREE.LineSegments(eg, m);
  
  
  Build.scene.add( line );
}

function EdgesGeometry( geometry, thresholdAngle ) {

	let g = new THREE.BufferGeometry();

	g.type = 'EdgesGeometry';

	g.parameters = {
		thresholdAngle: thresholdAngle
	};

	thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

	// buffer

	const vertices = [];
  const control0 = [];
  const control1 = [];
  const direction = [];
  const collapse = [];

	// helper variables

	const thresholdDot = Math.cos( THREE.MathUtils.DEG2RAD * thresholdAngle );
	const edge = [ 0, 0 ], edges = {};
	let edge1, edge2, key;
	const keys = [ 'a', 'b', 'c' ];

	// prepare source geometry

	let geometry2;

	if ( geometry.isBufferGeometry ) {

		geometry2 = new THREE.Geometry();
		geometry2.fromBufferGeometry( geometry );

	} else {

		geometry2 = geometry.clone();

	}

	geometry2.mergeVertices();
	geometry2.computeFaceNormals();

	const sourceVertices = geometry2.vertices;
	const faces = geometry2.faces;

	// now create a data structure where each entry represents an edge with its adjoining faces

	for ( let i = 0, l = faces.length; i < l; i ++ ) {

		const face = faces[ i ];

		for ( let j = 0; j < 3; j ++ ) {

			edge1 = face[ keys[ j ] ];
			edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
			edge[ 0 ] = Math.min( edge1, edge2 );
			edge[ 1 ] = Math.max( edge1, edge2 );

			key = edge[ 0 ] + ',' + edge[ 1 ];

			if ( edges[ key ] === undefined ) {

				edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ], face1: i, face2: undefined };

			} else {

				edges[ key ].face2 = i;

			}

		}

	}

	// generate vertices
  const v3 = new THREE.Vector3();
  const n = new THREE.Vector3();
  const n1 = new THREE.Vector3();
  const n2 = new THREE.Vector3();
  const d = new THREE.Vector3();
	for ( key in edges ) {

		const e = edges[ key ];

		// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

		if ( e.face2 === undefined || faces[ e.face1 ].normal.dot( faces[ e.face2 ].normal ) <= thresholdDot ) {

			let vertex1 = sourceVertices[ e.index1 ];
      let vertex2 = sourceVertices[ e.index2 ];
      
			vertices.push( vertex1.x, vertex1.y, vertex1.z );
      vertices.push( vertex2.x, vertex2.y, vertex2.z );
      
      d.subVectors(vertex2, vertex1);
      collapse.push(0, 1);
      n.copy(d).normalize();
      direction.push(d.x, d.y, d.z);
      n1.copy(faces[ e.face1 ].normal);
      n1.crossVectors(n, n1);
      d.subVectors(vertex1, vertex2);
      n.copy(d).normalize();
      n2.copy(faces[ e.face2 ].normal);
      n2.crossVectors(n, n2);
      direction.push(d.x, d.y, d.z);
      
      v3.copy(vertex1).add(n1); // control0
      control0.push(v3.x, v3.y, v3.z);
      v3.copy(vertex1).add(n2); // control1
      control1.push(v3.x, v3.y, v3.z);
      
      v3.copy(vertex2).add(n1); // control0
      control0.push(v3.x, v3.y, v3.z);
      v3.copy(vertex2).add(n2); // control1
      control1.push(v3.x, v3.y, v3.z);
    }

	}

	// build geometry

	g.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  g.setAttribute( 'control0', new THREE.Float32BufferAttribute( control0, 3 ) );
  g.setAttribute( 'control1', new THREE.Float32BufferAttribute( control1, 3 ) );
  g.setAttribute( 'direction', new THREE.Float32BufferAttribute( direction, 3 ) );
  g.setAttribute( 'collapse', new THREE.Float32BufferAttribute( collapse, 1 ) );
  return g;

}



	var conditionalLineVertShader = /* glsl */`
	attribute vec3 control0;
	attribute vec3 control1;
	attribute vec3 direction;
  attribute float collapse;

	#include <common>
	#include <color_pars_vertex>
	#include <fog_pars_vertex>
	#include <logdepthbuf_pars_vertex>
	#include <clipping_planes_pars_vertex>
	void main() {
		#include <color_vertex>

		// Transform the line segment ends and control points into camera clip space
		vec4 c0 = projectionMatrix * modelViewMatrix * vec4( control0, 1.0 );
		vec4 c1 = projectionMatrix * modelViewMatrix * vec4( control1, 1.0 );
		vec4 p0 = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		vec4 p1 = projectionMatrix * modelViewMatrix * vec4( position + direction, 1.0 );

		c0.xy /= c0.w;
		c1.xy /= c1.w;
		p0.xy /= p0.w;
		p1.xy /= p1.w;

		// Get the direction of the segment and an orthogonal vector
		vec2 dir = p1.xy - p0.xy;
		vec2 norm = vec2( -dir.y, dir.x );

		// Get control point directions from the line
		vec2 c0dir = c0.xy - p1.xy;
		vec2 c1dir = c1.xy - p1.xy;

		// If the vectors to the controls points are pointed in different directions away
		// from the line segment then the line should not be drawn.
		float d0 = dot( normalize( norm ), normalize( c0dir ) );
		float d1 = dot( normalize( norm ), normalize( c1dir ) );
		float discardFlag = float( sign( d0 ) != sign( d1 ) );
    
    vec3 p = position + ((discardFlag > 0.5) ? direction * collapse : vec3(0));    
    vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
		gl_Position = projectionMatrix * mvPosition;

		#include <logdepthbuf_vertex>
		#include <clipping_planes_vertex>
		#include <fog_vertex>
	}
	`;

	var conditionalLineFragShader = /* glsl */`
	uniform vec3 diffuse;
	uniform float opacity;

	#include <common>
	#include <color_pars_fragment>
	#include <fog_pars_fragment>
	#include <logdepthbuf_pars_fragment>
	#include <clipping_planes_pars_fragment>
	void main() {
		#include <clipping_planes_fragment>
		vec3 outgoingLight = vec3( 0.0 );
		vec4 diffuseColor = vec4( diffuse, opacity );
		#include <logdepthbuf_fragment>
		#include <color_fragment>
		outgoingLight = diffuseColor.rgb; // simple shader
		gl_FragColor = vec4( outgoingLight, diffuseColor.a );
		#include <tonemapping_fragment>
		#include <encodings_fragment>
		#include <fog_fragment>
		#include <premultiplied_alpha_fragment>
	}
	`;


