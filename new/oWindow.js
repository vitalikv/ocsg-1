

class MyWindows 
{	
	createWind()
	{
		this.testMy();
	}
	
	
	formaWind()
	{
		return '{"id":0, "points":[{"id":70, "pos":{"x":-0.5, "y":-0.5, "z":0}}, {"id":71, "pos":{"x":-0.5, "y":1.242102, "z":0}}, {"id":72, "pos":{"x":1.892359, "y":1.242102, "z":0}}, {"id":73, "pos":{"x":1.892359, "y":-0.5, "z":0}}, {"id":79, "pos":{"x":0.2975754, "y":1.242102, "z":0}}, {"id":81, "pos":{"x":0.2975754, "y":-0.5, "z":0}}, {"id":87, "pos":{"x":1.098457, "y":1.242102, "z":0}}, {"id":89, "pos":{"x":1.098457, "y":-0.4999999, "z":0}}], "profileAlias":"sib", "lines":[{"sID":70, "type":0, "radius":0, "id":74, "eID":71}, {"sID":71, "type":1, "radius":0, "id":75, "eID":79}, {"sID":72, "type":0, "radius":0, "id":76, "eID":73}, {"sID":73, "type":1, "radius":0, "id":77, "eID":89}, {"sID":79, "type":1, "radius":0, "id":80, "eID":87}, {"sID":81, "type":1, "radius":0, "id":82, "eID":70}, {"sID":79, "type":0, "radius":0, "id":83, "eID":81}, {"sID":87, "type":1, "radius":0, "id":88, "eID":72}, {"sID":89, "type":1, "radius":0, "id":90, "eID":81}, {"sID":87, "type":0, "radius":0, "id":91, "eID":89}], "sections":[{"id":84, "type":0, "moldingType":0, "lids":[74, 75, 83, 82], "isUnion":false, "pids":[70, 71, 79, 81], "openType":5, "parentId":0}, {"id":93, "type":0, "moldingType":0, "lids":[76, 77, 91, 88], "isUnion":false, "pids":[72, 73, 89, 87], "openType":4, "parentId":0}, {"id":94, "type":0, "moldingType":0, "lids":[80, 91, 90, 83], "isUnion":false, "pids":[79, 87, 89, 81], "openType":4, "parentId":0}], "unions":[], "outContourIDS":[79, 87, 72, 73, 89, 81, 70, 71], "version":2}';		
	}
	
	myFormaWind(type)
	{
		let arr = [];
		
		if(type === 1)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(-0.5,0.5),new THREE.Vector2(0.5,0.5),new THREE.Vector2(0.5,-0.5)],
			];			
		}
		
		if(type === 2)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(-0.5,1.242102),new THREE.Vector2(0.2975754,1.242102),new THREE.Vector2(0.2975754,-0.5)],
			[new THREE.Vector2(0.2975754,1.242102),new THREE.Vector2(1.098457,1.242102),new THREE.Vector2(1.098457,-0.4999999),new THREE.Vector2(0.2975754,-0.5)]
			];			
		}		
		
		if(type === 3)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(-0.5,1.242102),new THREE.Vector2(0.2975754,1.242102),new THREE.Vector2(0.2975754,-0.5)],
			[new THREE.Vector2(1.892359,1.242102),new THREE.Vector2(1.892359,-0.5),new THREE.Vector2(1.098457,-0.4999999),new THREE.Vector2(1.098457, 1.242102)],
			[new THREE.Vector2(0.2975754,1.242102),new THREE.Vector2(1.098457,1.242102),new THREE.Vector2(1.098457,-0.4999999),new THREE.Vector2(0.2975754,-0.5)]
			];			
		}
		
		if(type === 4)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(0.0,0.5),new THREE.Vector2(0.5,-0.5)],
			];			
		}

		if(type === 5)
		{
			arr = [
			[new THREE.Vector2(-0.5,-0.5),new THREE.Vector2(0.5,0.5),new THREE.Vector2(0.5,-0.5)],
			];			
		}			

		let sections = [];

		for ( let i = 0; i < arr.length; i++ )
		{
			sections.push({ userDate: {p: arr[i]} });
		}

		return { sections: sections };
	}


	profileWind()
	{
		return  {"close":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.028, "x":0.05447824}, {"y":0.03784855, "x":0.05447824}, {"y":0.03332422, "x":0.06753223}, {"y":0.03312475, "x":0.06788322}, {"y":0.03249204, "x":0.06863455}, {"y":0.03144919, "x":0.06890834}, {"y":0.03104536, "x":0.06896047}, {"y":0.02009192, "x":0.06896051}, {"y":0.0198582, "x":0.06896055}, {"y":0.01976655, "x":0.06941883}, {"y":0.01951668, "x":0.06979332}, {"y":0.01914626, "x":0.07004587}, {"y":0.01869293, "x":0.07013852}, {"y":-5.587935E-09, "x":0.07013852}, {"y":-2.04891E-08, "x":7.450581E-09}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-2.04891E-08, "x":7.450581E-09}, {"y":0.03326762, "x":0}, {"y":0.03419795, "x":0.0002924651}, {"y":0.03506099, "x":0.0008943528}, {"y":0.03565692, "x":0.001666315}, {"y":0.03983337, "x":0.01300793}, {"y":0.03983337, "x":0.01606972}], "frontGlassIndex":-1}, {"matId":"chrome", "matType":"chrome", "backGlassIndex":-1, "points":[{"y":0.03201757, "x":0.05170456}, {"y":0.03, "x":0.05170456}, {"y":0.03, "x":0.01995445}, {"y":0.03201757, "x":0.01995445}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":1, "points":[{"y":0.03201757, "x":0.05170456}, {"y":0.04139249, "x":0.05170456}, {"y":0.04179388, "x":0.05170456}, {"y":0.04179388, "x":0.05273088}, {"y":0.0415984, "x":0.05274985}, {"y":0.04063427, "x":0.052815}, {"y":0.0395487, "x":0.05311083}, {"y":0.03849942, "x":0.05376705}, {"y":0.03826987, "x":0.05395924}, {"y":0.03812422, "x":0.05413867}, {"y":0.03784855, "x":0.05447824}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.03983337, "x":0.01606972}, {"y":0.03989092, "x":0.01624649}, {"y":0.03996658, "x":0.01643684}, {"y":0.04022957, "x":0.01699261}, {"y":0.0405803, "x":0.01793481}, {"y":0.04084247, "x":0.01918744}, {"y":0.04096339, "x":0.01995447}, {"y":0.04072054, "x":0.01995447}, {"y":0.03201757, "x":0.01995445}], "frontGlassIndex":7}], "handlePivot":{"y":0.044, "x":0.089}, "openbase":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.03325864, "x":0.0189605}, {"y":0.01477454, "x":0.0189605}, {"y":0.01477454, "x":0.05840465}, {"y":0.01736655, "x":0.05840465}, {"y":0.01736655, "x":0.06881266}, {"y":0.01717211, "x":0.06928166}, {"y":0.01663017, "x":0.0698236}, {"y":0.01616117, "x":0.07001805}, {"y":-1.862645E-09, "x":0.07001805}, {"y":-1.862645E-09, "x":4.898587E-18}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-1.862645E-09, "x":4.898587E-18}, {"y":0.03058747, "x":-4.618575E-09}, {"y":0.03162217, "x":0.0003262545}, {"y":0.03259628, "x":0.001008116}, {"y":0.033257, "x":0.001868631}, {"y":0.03729935, "x":0.0129647}, {"y":0.03729935, "x":0.01597813}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.03729935, "x":0.01597813}, {"y":0.03726458, "x":0.01629467}, {"y":0.03699952, "x":0.01722378}, {"y":0.03621709, "x":0.01816234}, {"y":0.03512766, "x":0.01875439}, {"y":0.03390681, "x":0.0189605}, {"y":0.03325864, "x":0.0189605}], "frontGlassIndex":-1}], "rotatePivot":{"y":0.004, "x":0.075}, "alias":"sib", "open":[{"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.02931766, "x":0.07001805}, {"y":0.02931765, "x":0.01896051}, {"y":0.03303936, "x":0.01896051}, {"y":0.03769927, "x":0.01896051}, {"y":0.08259266, "x":0.01896051}, {"y":0.08352298, "x":0.01925298}, {"y":0.08438603, "x":0.01985487}, {"y":0.08498196, "x":0.02062683}, {"y":0.0891584, "x":0.03196844}, {"y":0.0891584, "x":0.03503023}, {"y":0.08921596, "x":0.035207}, {"y":0.08929162, "x":0.03539735}, {"y":0.0895546, "x":0.03595312}, {"y":0.08990533, "x":0.03689532}, {"y":0.0901675, "x":0.03814796}, {"y":0.09028842, "x":0.03891498}, {"y":0.09004557, "x":0.03891498}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":-1}, {"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0.08134261, "x":0.07066508}, {"y":0.09071752, "x":0.07066508}, {"y":0.09111892, "x":0.07066508}, {"y":0.09111891, "x":0.07169139}, {"y":0.09092344, "x":0.07171036}, {"y":0.0899593, "x":0.07177551}, {"y":0.08887374, "x":0.07207134}, {"y":0.08782446, "x":0.07272756}, {"y":0.0875949, "x":0.07291976}, {"y":0.08744925, "x":0.07309918}, {"y":0.08717359, "x":0.07343875}, {"y":0.08264925, "x":0.08649275}, {"y":0.08244979, "x":0.08684373}, {"y":0.08181708, "x":0.08759506}, {"y":0.08077423, "x":0.08786885}, {"y":0.0803704, "x":0.08792098}, {"y":0.06941695, "x":0.08792102}, {"y":0.06918323, "x":0.08792107}, {"y":0.06909159, "x":0.08837934}, {"y":0.06884172, "x":0.08875383}, {"y":0.0684713, "x":0.08900638}, {"y":0.06801796, "x":0.08909903}, {"y":0.02931767, "x":0.08909903}, {"y":0.01378862, "x":0.08909903}, {"y":0.01207542, "x":0.08875267}, {"y":0.01067554, "x":0.08780839}, {"y":0.009731265, "x":0.08640848}, {"y":0.009384886, "x":0.08469532}, {"y":0.00938489, "x":0.07296573}, {"y":0.009616737, "x":0.07181899}, {"y":0.01024879, "x":0.07088195}, {"y":0.01118581, "x":0.0702499}, {"y":0.01233255, "x":0.07001804}, {"y":0.02931766, "x":0.07001805}], "frontGlassIndex":-1}, {"matId":"chrome", "matType":"chrome", "backGlassIndex":-1, "points":[{"y":0.0813426, "x":0.07066508}, {"y":0.08, "x":0.07066508}, {"y":0.08, "x":0.03891496}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":-1}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":-1, "points":[{"y":0.0891584, "x":0.03503023}, {"y":0.08921596, "x":0.035207}, {"y":0.08929162, "x":0.03539735}, {"y":0.0895546, "x":0.03595312}, {"y":0.08990533, "x":0.03689532}, {"y":0.0901675, "x":0.03814796}, {"y":0.09028842, "x":0.03891498}, {"y":0.09004557, "x":0.03891498}, {"y":0.0813426, "x":0.03891496}], "frontGlassIndex":7}, {"matId":"rubber", "matType":"rubber", "backGlassIndex":1, "points":[{"y":0.08134261, "x":0.07066508}, {"y":0.09071752, "x":0.07066508}, {"y":0.09111892, "x":0.07066508}, {"y":0.09111891, "x":0.07169139}, {"y":0.09092344, "x":0.07171036}, {"y":0.0899593, "x":0.07177551}, {"y":0.08887374, "x":0.07207134}, {"y":0.08782446, "x":0.07272756}, {"y":0.0875949, "x":0.07291976}, {"y":0.08744925, "x":0.07309918}, {"y":0.08717359, "x":0.07343875}], "frontGlassIndex":-1}], "caption":"SibDesign", "outbase":[{"matId":"in", "matType":"matte", "backGlassIndex":-1, "points":[{"y":0, "x":0.07013854}, {"y":-0.03058747, "x":0.07013854}, {"y":-0.03058747, "x":0}], "frontGlassIndex":-1}, {"matId":"out", "matType":"matte", "backGlassIndex":-1, "points":[{"y":-0.03058747, "x":0}, {"y":0, "x":0}, {"y":0, "x":0.07013854}], "frontGlassIndex":-1}]};		
	}

	testMy()
	{
		const setXJ = this.profileWind();
		const js_1 = this.myFormaWind(5);
				
		console.log(setXJ);
		console.log(js_1);
		
		var group = new THREE.Group();	// собираем все части окна
		
		// начинаем пропускать по контуру профиль (глухое окно)	
		for ( var i = 0; i < setXJ.close.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.close[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.close[i].points[i2].y, setXJ.close[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );				
			shape.autoClose = true;
			
			// помошник для отображения профиля 
			if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x222222}) );	
				scene.add( line );					
			}

			var colorWD = this.getMaterialParamWindow(setXJ.close[i].matType);
			
			for ( var i2 = 0; i2 < js_1.sections.length; i2++ ) 
			{		
				//if(js_1.sections[i2].openType != 0) continue;
				console.log(js_1.sections[i2].userDate.p);
				if(setXJ.close[i].matType == 'chrome')
				{
					group.add(this.crGlassParamWindow(js_1.sections[i2].userDate.p, setXJ.close[i].points));
				}
		
				var o = new THREE.Mesh(this.profiledContourGeometry(shape, js_1.sections[i2].userDate.p, true), new THREE.MeshLambertMaterial( colorWD ) );
				group.add(o);
				
				o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
				o.geometry.mergeVertices();
				//o.geometry.computeFaceNormals();
				//o.geometry.computeVertexNormals();
				//upUvs_3( o );			
				//setTexture({obj:o});
			}		
		}
	
group.position.y = 1.7;
		scene.add(group);
	}


	testPop()
	{
		const setXJ = this.profileWind();
		const js_1 = JSON.parse(this.formaWind());
		//const js_1 = this.myFormaWind();
		
		this.getContourPointParamWindow(js_1);
		this.getSectionPointParamWindow(js_1);
		
		console.log(setXJ);
		console.log(js_1);
		
		var group = new THREE.Group();	// собираем все части окна
		
		// начинаем пропускать по контуру профиль (глухое окно)	
		for ( var i = 0; i < setXJ.close.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.close[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.close[i].points[i2].y, setXJ.close[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );				
			shape.autoClose = true;
			
			// помошник для отображения профиля 
			if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x222222}) );	
				scene.add( line );					
			}

			var colorWD = this.getMaterialParamWindow(setXJ.close[i].matType);
			
			for ( var i2 = 0; i2 < js_1.sections.length; i2++ ) 
			{		
				//if(js_1.sections[i2].openType != 0) continue;
				
				if(setXJ.close[i].matType == 'chrome')
				{
					group.add(this.crGlassParamWindow(js_1.sections[i2].userDate.p, setXJ.close[i].points));
				}
		
				var o = new THREE.Mesh(this.profiledContourGeometry(shape, js_1.sections[i2].userDate.p, true), new THREE.MeshLambertMaterial( colorWD ) );
				group.add(o);
				
				o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
				o.geometry.mergeVertices();
				o.geometry.computeFaceNormals();
				o.geometry.computeVertexNormals();
				//upUvs_3( o );			
				//setTexture({obj:o});
			}		
		}
		
		for ( var i = 0; i < setXJ.open.length; i++ )
		{ 
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.open[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.open[i].points[i2].y, setXJ.open[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
			// помошник для отображения профиля 
			if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x00ff00}) );	
				scene.add( line );					
			}	
							
		}

		for ( var i = 0; i < setXJ.openbase.length; i++ )
		{
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.openbase[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.openbase[i].points[i2].y, setXJ.openbase[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
			// помошник для отображения профиля 
			if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0x0000ff}) );	
				scene.add( line );					
			}					
		}

			
		
		
	// пропускаем внешний контру через профиль для внешнего контура 
		for ( var i = 0; i < setXJ.outbase.length; i++ )
		{
			var point_room = [];
			
			for ( var i2 = 0; i2 < setXJ.outbase[i].points.length; i2++ ) 
			{
				point_room[i2] = new THREE.Vector2 ( -setXJ.outbase[i].points[i2].y, setXJ.outbase[i].points[i2].x );	
			}
			
			var shape = new THREE.Shape( point_room );
			shape.autoClose = true;
			
			// помошник для отображения профиля 
			if(1==1)
			{
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial({color: 0xff0000}) );	
				scene.add( line );					
			}

			/*colorWD = getMaterialParamWindow(setXJ.outbase[i].matType);
			var o = new THREE.Mesh(ProfiledContourGeometry(shape, pathV, true), new THREE.MeshLambertMaterial( colorWD ) );
			group.add(o);
		
			o.geometry = new THREE.Geometry().fromBufferGeometry( o.geometry.clone() );
			o.geometry.mergeVertices();
			upUvs_3( o );	*/
			
			//setTexture({obj:o});
		}

		scene.add(group);
	}


	// получаем внешний контур из точек для wd version2
	getContourPointParamWindow(js_1)
	{
		var arr = [];
		
		for ( var i = 0; i < js_1.outContourIDS.length; i++ )
		{
			for ( var i2 = 0; i2 < js_1.points.length; i2++ ) 
			{  
				if(js_1.outContourIDS[i] == js_1.points[i2].id)
				{
					var n = arr.length;				
					arr[n] = {};
					arr[n].pos = new THREE.Vector2( js_1.points[i2].pos.x, js_1.points[i2].pos.y);
					arr[n].id = js_1.outContourIDS[i];
					
					
					
					break;
				}				
			}						
		}
		
		
		var point = [];
		
		for ( var i = 0; i < arr.length; i++ )
		{
			point[point.length] = arr[i].pos;
		}

		// помошник для отображения внешнего контура окна
		if(1==1)
		{
			var shape = new THREE.Shape( point );
			shape.autoClose = true;
			var geometryPoints = new THREE.BufferGeometry().setFromPoints( shape.getPoints() );
			var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color : 0xff0000, transparent: true, opacity: 1, depthTest: false } ) );	
			scene.add( line );		
		}
		
		
		//console.log(point);
		
		return point;
	}


	// получаем секции из точек для wd version2
	getSectionPointParamWindow(js_1)
	{
		
		var pathV_2 = [];		// переконвертируем точки в Vector2 для контуров секций окна
		var colorLine = { color : 0xff0000, transparent: true, opacity: 1, depthTest: false };
		
		for ( var i = 0; i < js_1.sections.length; i++ ) 
		{  
			pathV_2[i] = [];		
			
			for ( var i2 = 0; i2 < js_1.sections[i].pids.length; i2++ )
			{
				for ( var i3 = 0; i3 < js_1.points.length; i3++ ) 
				{  
					if(js_1.sections[i].pids[i2] == js_1.points[i3].id)
					{
						pathV_2[i][i2] = {};
						pathV_2[i][i2].pos = new THREE.Vector2( js_1.points[i3].pos.x, js_1.points[i3].pos.y);
						pathV_2[i][i2].id = js_1.points[i3].id;
						
						//js_1.sections[i].userDate.p[i2] = new THREE.Vector2( js_1.points[i3].pos.x, js_1.points[i3].pos.y );				
						
						break;
					}				
				}						
			}							
					
		}
		
		
		for ( var i = 0; i < pathV_2.length; i++ )
		{
			//var point = calcArcRadius(pathV_2[i], js_1);;
			
			var point = [];
			
			for ( var i2 = 0; i2 < pathV_2[i].length; i2++ )
			{
				point[point.length] = pathV_2[i][i2].pos;
			}

			js_1.sections[i].userDate = {p: point};
			
			// помошник для отображения контура внутренних секций окна
			if(1==1)
			{
				var shape = new THREE.Shape( point );
				shape.autoClose = true;
				var points = shape.getPoints();
				var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
				var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( colorLine ) );	
				scene.add( line );	
			}			
		}
		
		
		return pathV_2;
	}


	// полчаем цвет для поверхности 
	getMaterialParamWindow(matType)
	{
		var colorWD = { color : 0xffffff, lightMap : lightMap_1 };
		
		if(matType == 'matte'){}
		else if(matType == 'chrome'){ colorWD.color = 0xcccccc; }
		else if(matType == 'rubber'){ colorWD.color = 0x222222; }
		
		return colorWD;
	}


	// пускаем профиль по контуру из точек и тем самым создаем Geometry
	profiledContourGeometry(profileShape, contour, contourClosed) 
	{
		contourClosed = contourClosed !== undefined ? contourClosed : true;

		let profileGeometry = new THREE.ShapeBufferGeometry(profileShape);
		profileGeometry.rotateX(Math.PI * .5);
		let profile = profileGeometry.attributes.position;

		let profilePoints = new Float32Array(profile.count * contour.length * 3);

		for (let i = 0; i < contour.length; i++) 
		{
			let v1 = new THREE.Vector2().subVectors(contour[i - 1 < 0 ? contour.length - 1 : i - 1], contour[i]);
			let v2 = new THREE.Vector2().subVectors(contour[i + 1 == contour.length ? 0 : i + 1], contour[i]);
			let angle = v2.angle() - v1.angle();
			let halfAngle = angle * .5;

			let hA = halfAngle;
			let tA = v2.angle() + Math.PI * .5;
			if (!contourClosed)
			{
				if (i == 0 || i == contour.length - 1) {hA = Math.PI * .5;}
				if (i == contour.length - 1) {tA = v1.angle() - Math.PI * .5;}
			}

			let shift = Math.tan(hA - Math.PI * .5);
			//console.log(shift);
			let shiftMatrix = new THREE.Matrix4().set(
				1, 0, 0, 0, -shift, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);


			let tempAngle = tA;
			let rotationMatrix = new THREE.Matrix4().set(
				Math.cos(tempAngle), -Math.sin(tempAngle), 0, 0,
				Math.sin(tempAngle), Math.cos(tempAngle), 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			);

			let translationMatrix = new THREE.Matrix4().set(
				1, 0, 0, contour[i].x,
				0, 1, 0, contour[i].y,
				0, 0, 1, 0,
				0, 0, 0, 1,
			);

			let cloneProfile = profile.clone();
			shiftMatrix.applyToBufferAttribute(cloneProfile);
			rotationMatrix.applyToBufferAttribute(cloneProfile);
			translationMatrix.applyToBufferAttribute(cloneProfile);

			profilePoints.set(cloneProfile.array, cloneProfile.count * i * 3);
		}

		let fullProfileGeometry = new THREE.BufferGeometry();
		fullProfileGeometry.addAttribute("position", new THREE.BufferAttribute(profilePoints, 3));
		let index = [];
		
		let lastCorner = contourClosed == false ? contour.length - 1: contour.length;
		for (let i = 0; i < lastCorner; i++) 
		{
			for (let j = 0; j < profile.count; j++) 
			{
				let currCorner = i;
				let nextCorner = i + 1 == contour.length ? 0 : i + 1;
				let currPoint = j;
				let nextPoint = j + 1 == profile.count ? 0 : j + 1;

				let a = nextPoint + profile.count * currCorner;
				let b = currPoint + profile.count * currCorner;
				let c = currPoint + profile.count * nextCorner;
				let d = nextPoint + profile.count * nextCorner;

				index.push(a, b, d);
				index.push(b, c, d);
			}
		}

		//console.log(index);
		fullProfileGeometry.setIndex(index);
		fullProfileGeometry.computeVertexNormals();

		return fullProfileGeometry;
	}


	// создаем стекло для окна
	crGlassParamWindow(arrP, offset)
	{
		var glass = new THREE.Group();
		
		var colorLine = { color : 0xff0000, transparent: true, opacity: 1, depthTest: false };
		var mLine = []; 
		
		for ( var i2 = 0; i2 < arrP.length; i2++ )
		{
			var s1 = (i2 == 0) ? arrP.length - 1 : i2 - 1;		
			
			var x1 = arrP[s1].y - arrP[i2].y;
			var z1 = arrP[i2].x - arrP[s1].x;	
			var dir = new THREE.Vector3(x1, z1).normalize();						// перпендикуляр стены	
			dir = new THREE.Vector2().addScaledVector( dir, -offset[0].x );
			
			var pos1 = arrP[i2].clone();
			var pos2 = arrP[s1].clone();
			pos1.add( dir );
			pos2.add( dir );

			mLine[mLine.length] = { p1 : new THREE.Vector3(pos1.x, 0, pos1.y), p2 : new THREE.Vector3(pos2.x, 0, pos2.y) };
		}

		
		// находим точки пересекающихся линий 
		var arrP = [];	
		for ( var i2 = 0; i2 < mLine.length; i2++ )
		{
			var i3 = (i2 == mLine.length - 1) ? 0 : i2 + 1;					
			
			var p = crossPointTwoLine(mLine[i2].p1, mLine[i2].p2, mLine[i3].p1, mLine[i3].p2);
			
			arrP[arrP.length] = new THREE.Vector2(p.x, p.z);
		}

		
		// помошник отображения линий
		if(1==2)
		{
			for ( var i2 = 0; i2 < arrP.length; i2++ )
			{
				var i3 = (i2 == mLine.length - 1) ? 0 : i2 + 1;	
				
				var geometry = new THREE.Geometry();
				geometry.vertices.push( new THREE.Vector3(arrP[i2].x, arrP[i2].y, 0), new THREE.Vector3(arrP[i3].x, arrP[i3].y, 0) );
				
				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( colorLine ) );	
				scene.add( line );
			}		
		}
		
		var depth = Math.abs(offset[0].y - offset[1].y);
		if(depth < 0.001) { depth = 0.001; }
		
		var shape = new THREE.Shape( arrP );	
		glass = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: depth } ), new THREE.MeshLambertMaterial( {color: 0xcccccc, transparent: true, opacity: 0.1, side: THREE.DoubleSide }  ) );

		glass.position.z = offset[0].y;
		
		return glass;
	}	



}

const myWindows = new MyWindows()





