
import * as THREE from '../node_modules/three/build/three.module.js';
import * as Build from './index.js';
import * as SendD from './sendData.js';
import { GLTFExporter } from '../node_modules/three/examples/jsm/exporters/GLTFExporter.js';


export function exportGLTF() {

	const gltfExporter = new GLTFExporter();

	const options = {
		trs: false,
		onlyVisible: true,
		truncateDrawRange: true,
		binary: true,
		maxTextureSize: 4090
	};
	gltfExporter.parse(
		Build.infProg.scene,
		function ( result ) {

			if ( result instanceof ArrayBuffer ) {

				saveArrayBuffer( result, 'scene.glb' );

			} else {

				const output = JSON.stringify( result, null, 2 );
				console.log( output );
				saveString( output, 'scene.gltf' );

			}

		},
		function ( error ) {

			console.log( 'An error happened during parsing', error );

		},
		options
	);

}

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

function save( blob, filename ) {

	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
console.log(111, link.href);
	//URL.revokeObjectURL( url ); 

}

function saveString( text, filename ) {

	save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}


function saveArrayBuffer( buffer, filename ) {

	//save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
	
	
	let base64String = arrayBufferToBase64(buffer);
	
	let obj = "data:application/octet-stream;filename:"+filename+";base64," + base64String;
	console.log(222, obj);
	
	let link = document.createElement('a');
	link.style.display = 'none';
	document.body.appendChild(link);
	link.href = obj;
	link.download = filename;
	link.click();
	document.body.removeChild(link);	
}


function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}



function arrayBufferToBase64_test( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
	
	let limit = Math.ceil(1481396/100);
	let n = Math.ceil(len/limit);
	
	console.log('ceil', n);
	
	for (var i = 0; i < n; i++)
	{
		let next = i * limit;
		let finish = (next + limit > len) ? len : next + limit;
		
		console.log(i, 'next', next, finish);
		
		for (var i2 = next; i2 < finish; i2++) {
			binary += String.fromCharCode( bytes[ i2 ] );
		}		
	}
	
    return window.btoa( binary );
}



