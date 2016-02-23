var app = angular.module('spotifeye', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/dashboard/bubbles', {
		templateUrl: "/client/bubbleTemplate.html",
		controller: "BubbleController"
	})
	.when('/dashboard/edgeBundle', {
		templateUrl: "/client/edgeTemplate.html",
		controller: "EdgeController"
	})
	.when('/dashboard/chords', {
		templateUrl: "/client/chordTemplate.html",
		controller: "ChordController"
	});
});

app.controller('Dashboard', function($scope, $http, $location) {
	$scope.goToEdge = function() {
		$location.path("/dashboard/edgeBundle");
	}

	$scope.goToBubbles = function() {
		$location.path('/dashboard/bubbles');
	}

	$scope.goToChords = function() {
		$location.path('/dashboard/chords');
	}
	
	$scope.goToDashboard = function() {
		$location.path('/user');
	}
});

app.controller('BubbleController', function($scope, $http, $location) {
	$scope.data = [];

	$scope.getData = function() {
		$http.get('/user/bubble').then(function(data){
			$scope.data = data;
		});
	}
	$scope.getData();
});

app.controller('EdgeController', function($scope, $location) {

});

app.controller('ChordController', function($scope, $location) {
	
});

app.directive('bubbles', function(bubbleService) {
	return {
		link: function(scope, element, attrs) {
			var margin = 20,
			    diameter = 960;

			var color = d3.scale.linear()
			    .domain([-1, 5])
			    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
			    .interpolate(d3.interpolateHcl);

			var pack = d3.layout.pack()
			    .padding(2)
			    .size([diameter - margin, diameter - margin])
			    .value(function(d) { return d.size; })

			var svg = d3.select(".bubbles").append("svg")
			    .attr("width", diameter)
			    .attr("height", diameter)
			    .append("g")
			    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

			var focus = bubbleService,
			      nodes = pack.nodes(bubbleService),
			      view;

			  var circle = svg.selectAll("circle")
			      .data(nodes)
			    .enter().append("circle")
			      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			      .style("fill", function(d) { return d.children ? color(d.depth) : null; })
			      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

			  var text = svg.selectAll("text")
			      .data(nodes)
			    .enter().append("text")
			      .attr("class", "label")
			      .style("fill-opacity", function(d) { return d.parent === bubbleService ? 1 : 0; })
			      .style("display", function(d) { return d.parent === bubbleService ? "inline" : "none"; })
			      .text(function(d) { return d.name; });

			  var node = svg.selectAll("circle,text");

			  d3.select("body")
			      // .style("background", color(-1))
			      .on("click", function() { zoom(bubbleService); });

			  zoomTo([bubbleService.x, bubbleService.y, bubbleService.r * 2 + margin]);

			  function zoom(d) {
			    var focus0 = focus; focus = d;

			    var transition = d3.transition()
			        .duration(d3.event.altKey ? 7500 : 750)
			        .tween("zoom", function(d) {
			          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
			          return function(t) { zoomTo(i(t)); };
			        });

			    transition.selectAll("text")
			      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
			        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
			        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
			        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
			  }

			  function zoomTo(v) {
			    var k = diameter / v[2]; view = v;
			    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
			    circle.attr("r", function(d) { return d.r * k; });
			  }

			d3.select(self.frameElement).style("height", diameter + "px");
		}
	}
});

app.directive('edge', function(edgeService) {
	return {
		link: function(scope, element, attrs) {

			var diameter = 960,
			    radius = diameter / 2,
			    innerRadius = radius - 120;

			var cluster = d3.layout.cluster()
			    .size([360, innerRadius])
			    .sort(null)
			    .value(function(d) { return d.size; });

			var bundle = d3.layout.bundle();

			var line = d3.svg.line.radial()
			    .interpolate("bundle")
			    .tension(.85)
			    .radius(function(d) { return d.y; })
			    .angle(function(d) { return d.x / 180 * Math.PI; });

			var svg = d3.select(".edge").append("svg")
			    .attr("width", diameter)
			    .attr("height", diameter)
			  .append("g")
			    .attr("transform", "translate(" + radius + "," + radius + ")");

			var link = svg.append("g").selectAll(".link"),
			    node = svg.append("g").selectAll(".node");

			  var nodes = cluster.nodes(packageHierarchy(edgeService)),
			      links = packageImports(nodes);

			  link = link
			      .data(bundle(links))
			    .enter().append("path")
			      .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
			      .attr("class", "link")
			      .attr("d", line);

			  node = node
			      .data(nodes.filter(function(n) { return !n.children; }))
			    .enter().append("text")
			      .attr("class", "node")
			      .attr("dy", ".31em")
			      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
			      .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
			      .text(function(d) { return d.key; })
			      .on("mouseover", mouseovered)
			      .on("mouseout", mouseouted);


			function mouseovered(d) {
			  node
			      .each(function(n) { n.target = n.source = false; });

			  link
			      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
			      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
			    .filter(function(l) { return l.target === d || l.source === d; })
			      .each(function() { this.parentNode.appendChild(this); });

			  node
			      .classed("node--target", function(n) { return n.target; })
			      .classed("node--source", function(n) { return n.source; });
			}

			function mouseouted(d) {
			  link
			      .classed("link--target", false)
			      .classed("link--source", false);

			  node
			      .classed("node--target", false)
			      .classed("node--source", false);
			}

			d3.select(self.frameElement).style("height", diameter + "px");

			// Lazily construct the package hierarchy from class names.
			function packageHierarchy(edgeService) {
			  var map = {};

			  function find(name, data) {
			    var node = map[name], i;
			    if (!node) {
			      node = map[name] = data || {name: name, children: []};
			      if (name.length) {
			        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
			        node.parent.children.push(node);
			        node.key = name.substring(i + 1);
			      }
			    }
			    return node;
			  }

			  edgeService.forEach(function(d) {
			    find(d.name, d);
			  });

			  return map[""];
			}

			// Return a list of imports for the given array of nodes.
			function packageImports(nodes) {
			  var map = {},
			      imports = [];

			  // Compute a map from name to node.
			  nodes.forEach(function(d) {
			    map[d.name] = d;
			  });

			  // For each import, construct a link from the source to target node.
			  nodes.forEach(function(d) {
			    if (d.imports) d.imports.forEach(function(i) {
			      imports.push({source: map[d.name], target: map[i]});
			    });
			  });

			  return imports;
			}
		}
	}
});

app.directive('chords', function() {
	return {
		link: function(scope, element, attrs) {
			var matrix = [
			  [11975,  5871, 8916, 2868],
			  [ 1951, 10048, 2060, 6171],
			  [ 8010, 16145, 8090, 8045],
			  [ 1013,   990,  940, 6907]
			];

			var width = 720,
			    height = 720,
			    outerRadius = Math.min(width, height) / 2 - 10,
			    innerRadius = outerRadius - 24;

			var formatPercent = d3.format(".1%");

			var arc = d3.svg.arc()
			    .innerRadius(innerRadius)
			    .outerRadius(outerRadius);

			var layout = d3.layout.chord()
			    .padding(.04)
			    .sortSubgroups(d3.descending)
			    .sortChords(d3.ascending);

			var path = d3.svg.chord()
			    .radius(innerRadius);

			var svg = d3.select(".chords").append("svg")
			    .attr("width", width)
			    .attr("height", height)
			  .append("g")
			    .attr("id", "circle")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			svg.append("circle")
			    .attr("r", outerRadius);

			// queue()
			//     .defer(d3.csv, "cities.csv")
			//     .defer(d3.json, "matrix.json")
			//     .await(ready);

			// function ready(error, cities, matrix) {
			//   if (error) throw error;

			  // Compute the chord layout.
			  layout.matrix(matrix);

			  // Add a group per neighborhood.
			  var group = svg.selectAll(".group")
			      .data(layout.groups)
			    .enter().append("g")
			      .attr("class", "group")
			      .on("mouseover", mouseover);

			  // Add a mouseover title.
			  // group.append("title").text(function(d, i) {
			  //   return cities[i].name + ": " + formatPercent(d.value) + " of origins";
			  // });

			  // Add the group arc.
			  var groupPath = group.append("path")
			      .attr("id", function(d, i) { return "group" + i; })
			      .attr("d", arc);
			      // .style("fill", function(d, i) { return cities[i].color; });

			  // Add a text label.
			  var groupText = group.append("text")
			      .attr("x", 6)
			      .attr("dy", 15);

			  groupText.append("textPath")
			      .attr("xlink:href", function(d, i) { return "#group" + i; })
			      // .text(function(d, i) { return cities[i].name; });

			  // Remove the labels that don't fit. :(
			  groupText.filter(function(d, i) { return groupPath[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
			      .remove();

			  // Add the chords.
			  var chord = svg.selectAll(".chord")
			      .data(layout.chords)
			    .enter().append("path")
			      .attr("class", "chord")
			      // .style("fill", function(d) { return cities[d.source.index].color; })
			      .attr("d", path);

			  // Add an elaborate mouseover title for each chord.
			  // chord.append("title").text(function(d) {
			  //   return cities[d.source.index].name
			  //       + " → " + cities[d.target.index].name
			  //       + ": " + formatPercent(d.source.value)
			  //       + "\n" + cities[d.target.index].name
			  //       + " → " + cities[d.source.index].name
			  //       + ": " + formatPercent(d.target.value);
			  // });

			  function mouseover(d, i) {
			    chord.classed("fade", function(p) {
			      return p.source.index != i
			          && p.target.index != i;
			    });
			  }
			// }
		}
	}
});


app.factory('bubbleService', function() {
	var data = {
		 "name": "flare",
		 "children": [
		  {
		   "name": "analytics",
		   "children": [
		    {
		     "name": "cluster",
		     "children": [
		      {"name": "AgglomerativeCluster", "size": 3938},
		      {"name": "CommunityStructure", "size": 3812},
		      {"name": "HierarchicalCluster", "size": 6714},
		      {"name": "MergeEdge", "size": 743}
		     ]
		    },
		    {
		     "name": "graph",
		     "children": [
		      {"name": "BetweennessCentrality", "size": 3534},
		      {"name": "LinkDistance", "size": 5731},
		      {"name": "MaxFlowMinCut", "size": 7840},
		      {"name": "ShortestPaths", "size": 5914},
		      {"name": "SpanningTree", "size": 3416}
		     ]
		    },
		    {
		     "name": "optimization",
		     "children": [
		      {"name": "AspectRatioBanker", "size": 7074}
		     ]
		    }
		   ]
		  },
		  {
		   "name": "animate",
		   "children": [
		    {"name": "Easing", "size": 17010},
		    {"name": "FunctionSequence", "size": 5842},
		    {
		     "name": "interpolate",
		     "children": [
		      {"name": "ArrayInterpolator", "size": 1983},
		      {"name": "ColorInterpolator", "size": 2047},
		      {"name": "DateInterpolator", "size": 1375},
		      {"name": "Interpolator", "size": 8746},
		      {"name": "MatrixInterpolator", "size": 2202},
		      {"name": "NumberInterpolator", "size": 1382},
		      {"name": "ObjectInterpolator", "size": 1629},
		      {"name": "PointInterpolator", "size": 1675},
		      {"name": "RectangleInterpolator", "size": 2042}
		     ]
		    },
		    {"name": "ISchedulable", "size": 1041},
		    {"name": "Parallel", "size": 5176},
		    {"name": "Pause", "size": 449},
		    {"name": "Scheduler", "size": 5593},
		    {"name": "Sequence", "size": 5534},
		    {"name": "Transition", "size": 9201},
		    {"name": "Transitioner", "size": 19975},
		    {"name": "TransitionEvent", "size": 1116},
		    {"name": "Tween", "size": 6006}
		   ]
		  },
		  {
		   "name": "data",
		   "children": [
		    {
		     "name": "converters",
		     "children": [
		      {"name": "Converters", "size": 721},
		      {"name": "DelimitedTextConverter", "size": 4294},
		      {"name": "GraphMLConverter", "size": 9800},
		      {"name": "IDataConverter", "size": 1314},
		      {"name": "JSONConverter", "size": 2220}
		     ]
		    },
		    {"name": "DataField", "size": 1759},
		    {"name": "DataSchema", "size": 2165},
		    {"name": "DataSet", "size": 586},
		    {"name": "DataSource", "size": 3331},
		    {"name": "DataTable", "size": 772},
		    {"name": "DataUtil", "size": 3322}
		   ]
		  },
		  {
		   "name": "display",
		   "children": [
		    {"name": "DirtySprite", "size": 8833},
		    {"name": "LineSprite", "size": 1732},
		    {"name": "RectSprite", "size": 3623},
		    {"name": "TextSprite", "size": 10066}
		   ]
		  },
		  {
		   "name": "flex",
		   "children": [
		    {"name": "FlareVis", "size": 4116}
		   ]
		  },
		  {
		   "name": "physics",
		   "children": [
		    {"name": "DragForce", "size": 1082},
		    {"name": "GravityForce", "size": 1336},
		    {"name": "IForce", "size": 319},
		    {"name": "NBodyForce", "size": 10498},
		    {"name": "Particle", "size": 2822},
		    {"name": "Simulation", "size": 9983},
		    {"name": "Spring", "size": 2213},
		    {"name": "SpringForce", "size": 1681}
		   ]
		  },
		  {
		   "name": "query",
		   "children": [
		    {"name": "AggregateExpression", "size": 1616},
		    {"name": "And", "size": 1027},
		    {"name": "Arithmetic", "size": 3891},
		    {"name": "Average", "size": 891},
		    {"name": "BinaryExpression", "size": 2893},
		    {"name": "Comparison", "size": 5103},
		    {"name": "CompositeExpression", "size": 3677},
		    {"name": "Count", "size": 781},
		    {"name": "DateUtil", "size": 4141},
		    {"name": "Distinct", "size": 933},
		    {"name": "Expression", "size": 5130},
		    {"name": "ExpressionIterator", "size": 3617},
		    {"name": "Fn", "size": 3240},
		    {"name": "If", "size": 2732},
		    {"name": "IsA", "size": 2039},
		    {"name": "Literal", "size": 1214},
		    {"name": "Match", "size": 3748},
		    {"name": "Maximum", "size": 843},
		    {
		     "name": "methods",
		     "children": [
		      {"name": "add", "size": 593},
		      {"name": "and", "size": 330},
		      {"name": "average", "size": 287},
		      {"name": "count", "size": 277},
		      {"name": "distinct", "size": 292},
		      {"name": "div", "size": 595},
		      {"name": "eq", "size": 594},
		      {"name": "fn", "size": 460},
		      {"name": "gt", "size": 603},
		      {"name": "gte", "size": 625},
		      {"name": "iff", "size": 748},
		      {"name": "isa", "size": 461},
		      {"name": "lt", "size": 597},
		      {"name": "lte", "size": 619},
		      {"name": "max", "size": 283},
		      {"name": "min", "size": 283},
		      {"name": "mod", "size": 591},
		      {"name": "mul", "size": 603},
		      {"name": "neq", "size": 599},
		      {"name": "not", "size": 386},
		      {"name": "or", "size": 323},
		      {"name": "orderby", "size": 307},
		      {"name": "range", "size": 772},
		      {"name": "select", "size": 296},
		      {"name": "stddev", "size": 363},
		      {"name": "sub", "size": 600},
		      {"name": "sum", "size": 280},
		      {"name": "update", "size": 307},
		      {"name": "variance", "size": 335},
		      {"name": "where", "size": 299},
		      {"name": "xor", "size": 354},
		      {"name": "_", "size": 264}
		     ]
		    },
		    {"name": "Minimum", "size": 843},
		    {"name": "Not", "size": 1554},
		    {"name": "Or", "size": 970},
		    {"name": "Query", "size": 13896},
		    {"name": "Range", "size": 1594},
		    {"name": "StringUtil", "size": 4130},
		    {"name": "Sum", "size": 791},
		    {"name": "Variable", "size": 1124},
		    {"name": "Variance", "size": 1876},
		    {"name": "Xor", "size": 1101}
		   ]
		  },
		  {
		   "name": "scale",
		   "children": [
		    {"name": "IScaleMap", "size": 2105},
		    {"name": "LinearScale", "size": 1316},
		    {"name": "LogScale", "size": 3151},
		    {"name": "OrdinalScale", "size": 3770},
		    {"name": "QuantileScale", "size": 2435},
		    {"name": "QuantitativeScale", "size": 4839},
		    {"name": "RootScale", "size": 1756},
		    {"name": "Scale", "size": 4268},
		    {"name": "ScaleType", "size": 1821},
		    {"name": "TimeScale", "size": 5833}
		   ]
		  },
		  {
		   "name": "util",
		   "children": [
		    {"name": "Arrays", "size": 8258},
		    {"name": "Colors", "size": 10001},
		    {"name": "Dates", "size": 8217},
		    {"name": "Displays", "size": 12555},
		    {"name": "Filter", "size": 2324},
		    {"name": "Geometry", "size": 10993},
		    {
		     "name": "heap",
		     "children": [
		      {"name": "FibonacciHeap", "size": 9354},
		      {"name": "HeapNode", "size": 1233}
		     ]
		    },
		    {"name": "IEvaluable", "size": 335},
		    {"name": "IPredicate", "size": 383},
		    {"name": "IValueProxy", "size": 874},
		    {
		     "name": "math",
		     "children": [
		      {"name": "DenseMatrix", "size": 3165},
		      {"name": "IMatrix", "size": 2815},
		      {"name": "SparseMatrix", "size": 3366}
		     ]
		    },
		    {"name": "Maths", "size": 17705},
		    {"name": "Orientation", "size": 1486},
		    {
		     "name": "palette",
		     "children": [
		      {"name": "ColorPalette", "size": 6367},
		      {"name": "Palette", "size": 1229},
		      {"name": "ShapePalette", "size": 2059},
		      {"name": "SizePalette", "size": 2291}
		     ]
		    },
		    {"name": "Property", "size": 5559},
		    {"name": "Shapes", "size": 19118},
		    {"name": "Sort", "size": 6887},
		    {"name": "Stats", "size": 6557},
		    {"name": "Strings", "size": 22026}
		   ]
		  },
		  {
		   "name": "vis",
		   "children": [
		    {
		     "name": "axis",
		     "children": [
		      {"name": "Axes", "size": 1302},
		      {"name": "Axis", "size": 24593},
		      {"name": "AxisGridLine", "size": 652},
		      {"name": "AxisLabel", "size": 636},
		      {"name": "CartesianAxes", "size": 6703}
		     ]
		    },
		    {
		     "name": "controls",
		     "children": [
		      {"name": "AnchorControl", "size": 2138},
		      {"name": "ClickControl", "size": 3824},
		      {"name": "Control", "size": 1353},
		      {"name": "ControlList", "size": 4665},
		      {"name": "DragControl", "size": 2649},
		      {"name": "ExpandControl", "size": 2832},
		      {"name": "HoverControl", "size": 4896},
		      {"name": "IControl", "size": 763},
		      {"name": "PanZoomControl", "size": 5222},
		      {"name": "SelectionControl", "size": 7862},
		      {"name": "TooltipControl", "size": 8435}
		     ]
		    },
		    {
		     "name": "data",
		     "children": [
		      {"name": "Data", "size": 20544},
		      {"name": "DataList", "size": 19788},
		      {"name": "DataSprite", "size": 10349},
		      {"name": "EdgeSprite", "size": 3301},
		      {"name": "NodeSprite", "size": 19382},
		      {
		       "name": "render",
		       "children": [
		        {"name": "ArrowType", "size": 698},
		        {"name": "EdgeRenderer", "size": 5569},
		        {"name": "IRenderer", "size": 353},
		        {"name": "ShapeRenderer", "size": 2247}
		       ]
		      },
		      {"name": "ScaleBinding", "size": 11275},
		      {"name": "Tree", "size": 7147},
		      {"name": "TreeBuilder", "size": 9930}
		     ]
		    },
		    {
		     "name": "events",
		     "children": [
		      {"name": "DataEvent", "size": 2313},
		      {"name": "SelectionEvent", "size": 1880},
		      {"name": "TooltipEvent", "size": 1701},
		      {"name": "VisualizationEvent", "size": 1117}
		     ]
		    },
		    {
		     "name": "legend",
		     "children": [
		      {"name": "Legend", "size": 20859},
		      {"name": "LegendItem", "size": 4614},
		      {"name": "LegendRange", "size": 10530}
		     ]
		    },
		    {
		     "name": "operator",
		     "children": [
		      {
		       "name": "distortion",
		       "children": [
		        {"name": "BifocalDistortion", "size": 4461},
		        {"name": "Distortion", "size": 6314},
		        {"name": "FisheyeDistortion", "size": 3444}
		       ]
		      },
		      {
		       "name": "encoder",
		       "children": [
		        {"name": "ColorEncoder", "size": 3179},
		        {"name": "Encoder", "size": 4060},
		        {"name": "PropertyEncoder", "size": 4138},
		        {"name": "ShapeEncoder", "size": 1690},
		        {"name": "SizeEncoder", "size": 1830}
		       ]
		      },
		      {
		       "name": "filter",
		       "children": [
		        {"name": "FisheyeTreeFilter", "size": 5219},
		        {"name": "GraphDistanceFilter", "size": 3165},
		        {"name": "VisibilityFilter", "size": 3509}
		       ]
		      },
		      {"name": "IOperator", "size": 1286},
		      {
		       "name": "label",
		       "children": [
		        {"name": "Labeler", "size": 9956},
		        {"name": "RadialLabeler", "size": 3899},
		        {"name": "StackedAreaLabeler", "size": 3202}
		       ]
		      },
		      {
		       "name": "layout",
		       "children": [
		        {"name": "AxisLayout", "size": 6725},
		        {"name": "BundledEdgeRouter", "size": 3727},
		        {"name": "CircleLayout", "size": 9317},
		        {"name": "CirclePackingLayout", "size": 12003},
		        {"name": "DendrogramLayout", "size": 4853},
		        {"name": "ForceDirectedLayout", "size": 8411},
		        {"name": "IcicleTreeLayout", "size": 4864},
		        {"name": "IndentedTreeLayout", "size": 3174},
		        {"name": "Layout", "size": 7881},
		        {"name": "NodeLinkTreeLayout", "size": 12870},
		        {"name": "PieLayout", "size": 2728},
		        {"name": "RadialTreeLayout", "size": 12348},
		        {"name": "RandomLayout", "size": 870},
		        {"name": "StackedAreaLayout", "size": 9121},
		        {"name": "TreeMapLayout", "size": 9191}
		       ]
		      },
		      {"name": "Operator", "size": 2490},
		      {"name": "OperatorList", "size": 5248},
		      {"name": "OperatorSequence", "size": 4190},
		      {"name": "OperatorSwitch", "size": 2581},
		      {"name": "SortOperator", "size": 2023}
		     ]
		    },
		    {"name": "Visualization", "size": 16540}
		   ]
		  }
		 ]
		}

	return data;
});

app.factory('edgeService', function() {
	var data = [
		{"name":"flare.analytics.cluster.AgglomerativeCluster","size":3938,"imports":["flare.animate.Transitioner","flare.vis.data.DataList","flare.util.math.IMatrix","flare.analytics.cluster.MergeEdge","flare.analytics.cluster.HierarchicalCluster","flare.vis.data.Data"]},
		{"name":"flare.analytics.cluster.CommunityStructure","size":3812,"imports":["flare.analytics.cluster.HierarchicalCluster","flare.animate.Transitioner","flare.vis.data.DataList","flare.analytics.cluster.MergeEdge","flare.util.math.IMatrix"]},
		{"name":"flare.analytics.cluster.HierarchicalCluster","size":6714,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.vis.data.Tree","flare.util.Arrays","flare.analytics.cluster.MergeEdge","flare.util.Sort","flare.vis.operator.Operator","flare.util.Property","flare.vis.data.Data"]},
		{"name":"flare.analytics.cluster.MergeEdge","size":743,"imports":[]},
		{"name":"flare.analytics.graph.BetweennessCentrality","size":3534,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.util.Arrays","flare.vis.data.Data","flare.util.Property","flare.vis.operator.Operator"]},
		{"name":"flare.analytics.graph.LinkDistance","size":5731,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.EdgeSprite","flare.analytics.graph.ShortestPaths","flare.vis.data.Data","flare.util.Property","flare.vis.operator.Operator"]},
		{"name":"flare.analytics.graph.MaxFlowMinCut","size":7840,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.EdgeSprite","flare.vis.data.Data","flare.util.Property","flare.vis.operator.Operator"]},
		{"name":"flare.analytics.graph.ShortestPaths","size":5914,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.animate.Transitioner","flare.vis.operator.Operator","flare.util.heap.HeapNode","flare.util.heap.FibonacciHeap","flare.util.Property","flare.vis.data.Data"]},
		{"name":"flare.analytics.graph.SpanningTree","size":3416,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.operator.IOperator","flare.vis.Visualization","flare.vis.data.TreeBuilder","flare.vis.operator.Operator"]},
		{"name":"flare.analytics.optimization.AspectRatioBanker","size":7074,"imports":["flare.animate.Transitioner","flare.util.Arrays","flare.vis.data.DataSprite","flare.scale.Scale","flare.vis.axis.CartesianAxes","flare.vis.Visualization","flare.util.Property","flare.vis.operator.Operator"]},
		{"name":"flare.animate.Easing","size":17010,"imports":["flare.animate.Transition"]},
		{"name":"flare.animate.FunctionSequence","size":5842,"imports":["flare.util.Maths","flare.animate.Transition","flare.util.Arrays","flare.animate.Sequence","flare.animate.Transitioner"]},
		{"name":"flare.animate.interpolate.ArrayInterpolator","size":1983,"imports":["flare.util.Arrays","flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.ColorInterpolator","size":2047,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.DateInterpolator","size":1375,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.Interpolator","size":8746,"imports":["flare.animate.interpolate.NumberInterpolator","flare.animate.interpolate.ColorInterpolator","flare.animate.interpolate.PointInterpolator","flare.animate.interpolate.ObjectInterpolator","flare.animate.interpolate.MatrixInterpolator","flare.animate.interpolate.RectangleInterpolator","flare.animate.interpolate.DateInterpolator","flare.util.Property","flare.animate.interpolate.ArrayInterpolator"]},
		{"name":"flare.animate.interpolate.MatrixInterpolator","size":2202,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.NumberInterpolator","size":1382,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.ObjectInterpolator","size":1629,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.PointInterpolator","size":1675,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.interpolate.RectangleInterpolator","size":2042,"imports":["flare.animate.interpolate.Interpolator"]},
		{"name":"flare.animate.ISchedulable","size":1041,"imports":["flare.animate.Scheduler"]},
		{"name":"flare.animate.Parallel","size":5176,"imports":["flare.animate.Easing","flare.animate.Transition","flare.util.Arrays"]},
		{"name":"flare.animate.Pause","size":449,"imports":["flare.animate.Transition"]},
		{"name":"flare.animate.Scheduler","size":5593,"imports":["flare.animate.ISchedulable","flare.animate.Pause","flare.animate.Transition"]},
		{"name":"flare.animate.Sequence","size":5534,"imports":["flare.animate.Easing","flare.util.Maths","flare.animate.Transition","flare.util.Arrays"]},
		{"name":"flare.animate.Transition","size":9201,"imports":["flare.animate.Transitioner","flare.animate.TransitionEvent","flare.animate.Scheduler","flare.animate.Pause","flare.animate.Parallel","flare.animate.Easing","flare.animate.Sequence","flare.animate.ISchedulable","flare.util.Maths","flare.animate.Tween"]},
		{"name":"flare.animate.Transitioner","size":19975,"imports":["flare.util.IValueProxy","flare.animate.Parallel","flare.animate.Easing","flare.animate.Sequence","flare.animate.Transition","flare.animate.Tween","flare.util.Property"]},
		{"name":"flare.animate.TransitionEvent","size":1116,"imports":["flare.animate.Transition"]},
		{"name":"flare.animate.Tween","size":6006,"imports":["flare.animate.Transitioner","flare.animate.Transition","flare.animate.interpolate.Interpolator","flare.util.Property"]},
		{"name":"flare.data.converters.Converters","size":721,"imports":["flare.data.converters.IDataConverter","flare.data.converters.GraphMLConverter","flare.data.converters.JSONConverter","flare.data.converters.DelimitedTextConverter"]},
		{"name":"flare.data.converters.DelimitedTextConverter","size":4294,"imports":["flare.data.DataSet","flare.data.DataUtil","flare.data.DataTable","flare.data.converters.IDataConverter","flare.data.DataSchema","flare.data.DataField"]},
		{"name":"flare.data.converters.GraphMLConverter","size":9800,"imports":["flare.data.DataSet","flare.data.DataUtil","flare.data.DataTable","flare.data.converters.IDataConverter","flare.data.DataSchema","flare.data.DataField"]},
		{"name":"flare.data.converters.IDataConverter","size":1314,"imports":["flare.data.DataSet","flare.data.DataSchema"]},
		{"name":"flare.data.converters.JSONConverter","size":2220,"imports":["flare.data.DataSet","flare.data.DataUtil","flare.data.DataTable","flare.data.converters.IDataConverter","flare.data.DataSchema","flare.data.DataField","flare.util.Property"]},
		{"name":"flare.data.DataField","size":1759,"imports":["flare.data.DataUtil"]},
		{"name":"flare.data.DataSchema","size":2165,"imports":["flare.data.DataField","flare.util.Arrays"]},
		{"name":"flare.data.DataSet","size":586,"imports":["flare.data.DataTable"]},
		{"name":"flare.data.DataSource","size":3331,"imports":["flare.data.converters.IDataConverter","flare.data.converters.Converters","flare.data.DataSchema"]},
		{"name":"flare.data.DataTable","size":772,"imports":["flare.data.DataSchema"]},
		{"name":"flare.data.DataUtil","size":3322,"imports":["flare.data.DataField","flare.data.DataSchema"]},
		{"name":"flare.display.DirtySprite","size":8833,"imports":[]},
		{"name":"flare.display.LineSprite","size":1732,"imports":["flare.display.DirtySprite"]},
		{"name":"flare.display.RectSprite","size":3623,"imports":["flare.util.Colors","flare.display.DirtySprite"]},
		{"name":"flare.display.TextSprite","size":10066,"imports":["flare.display.DirtySprite"]},
		{"name":"flare.flex.FlareVis","size":4116,"imports":["flare.display.DirtySprite","flare.data.DataSet","flare.vis.Visualization","flare.vis.axis.CartesianAxes","flare.vis.axis.Axes","flare.vis.data.Data"]},
		{"name":"flare.physics.DragForce","size":1082,"imports":["flare.physics.Simulation","flare.physics.Particle","flare.physics.IForce"]},
		{"name":"flare.physics.GravityForce","size":1336,"imports":["flare.physics.Simulation","flare.physics.Particle","flare.physics.IForce"]},
		{"name":"flare.physics.IForce","size":319,"imports":["flare.physics.Simulation"]},
		{"name":"flare.physics.NBodyForce","size":10498,"imports":["flare.physics.Simulation","flare.physics.Particle","flare.physics.IForce"]},
		{"name":"flare.physics.Particle","size":2822,"imports":[]},
		{"name":"flare.physics.Simulation","size":9983,"imports":["flare.physics.Particle","flare.physics.NBodyForce","flare.physics.DragForce","flare.physics.GravityForce","flare.physics.Spring","flare.physics.SpringForce","flare.physics.IForce"]},
		{"name":"flare.physics.Spring","size":2213,"imports":["flare.physics.Particle"]},
		{"name":"flare.physics.SpringForce","size":1681,"imports":["flare.physics.Simulation","flare.physics.Particle","flare.physics.Spring","flare.physics.IForce"]},
		{"name":"flare.query.AggregateExpression","size":1616,"imports":["flare.query.Expression"]},
		{"name":"flare.query.And","size":1027,"imports":["flare.query.CompositeExpression","flare.query.Expression"]},
		{"name":"flare.query.Arithmetic","size":3891,"imports":["flare.query.BinaryExpression","flare.query.Expression"]},
		{"name":"flare.query.Average","size":891,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.BinaryExpression","size":2893,"imports":["flare.query.Expression"]},
		{"name":"flare.query.Comparison","size":5103,"imports":["flare.query.Not","flare.query.BinaryExpression","flare.query.Expression","flare.query.Or"]},
		{"name":"flare.query.CompositeExpression","size":3677,"imports":["flare.query.Expression","flare.query.If"]},
		{"name":"flare.query.Count","size":781,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.DateUtil","size":4141,"imports":["flare.query.Fn"]},
		{"name":"flare.query.Distinct","size":933,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.Expression","size":5130,"imports":["flare.query.Variable","flare.query.IsA","flare.query.ExpressionIterator","flare.util.IPredicate","flare.query.Literal","flare.util.IEvaluable","flare.query.If"]},
		{"name":"flare.query.ExpressionIterator","size":3617,"imports":["flare.query.Expression"]},
		{"name":"flare.query.Fn","size":3240,"imports":["flare.query.DateUtil","flare.query.CompositeExpression","flare.query.Expression","flare.query.StringUtil"]},
		{"name":"flare.query.If","size":2732,"imports":["flare.query.Expression"]},
		{"name":"flare.query.IsA","size":2039,"imports":["flare.query.Expression","flare.query.If"]},
		{"name":"flare.query.Literal","size":1214,"imports":["flare.query.Expression"]},
		{"name":"flare.query.Match","size":3748,"imports":["flare.query.BinaryExpression","flare.query.Expression","flare.query.StringUtil"]},
		{"name":"flare.query.Maximum","size":843,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.methods.add","size":593,"imports":["flare.query.methods.or","flare.query.Arithmetic"]},
		{"name":"flare.query.methods.and","size":330,"imports":["flare.query.And","flare.query.methods.or"]},
		{"name":"flare.query.methods.average","size":287,"imports":["flare.query.Average","flare.query.methods.or"]},
		{"name":"flare.query.methods.count","size":277,"imports":["flare.query.Count","flare.query.methods.or"]},
		{"name":"flare.query.methods.distinct","size":292,"imports":["flare.query.Distinct","flare.query.methods.or"]},
		{"name":"flare.query.methods.div","size":595,"imports":["flare.query.methods.or","flare.query.Arithmetic"]},
		{"name":"flare.query.methods.eq","size":594,"imports":["flare.query.Comparison","flare.query.methods.or"]},
		{"name":"flare.query.methods.fn","size":460,"imports":["flare.query.methods.or","flare.query.Fn"]},
		{"name":"flare.query.methods.gt","size":603,"imports":["flare.query.Comparison","flare.query.methods.or"]},
		{"name":"flare.query.methods.gte","size":625,"imports":["flare.query.Comparison","flare.query.methods.gt","flare.query.methods.eq","flare.query.methods.or"]},
		{"name":"flare.query.methods.iff","size":748,"imports":["flare.query.methods.or","flare.query.If"]},
		{"name":"flare.query.methods.isa","size":461,"imports":["flare.query.IsA","flare.query.methods.or"]},
		{"name":"flare.query.methods.lt","size":597,"imports":["flare.query.Comparison","flare.query.methods.or"]},
		{"name":"flare.query.methods.lte","size":619,"imports":["flare.query.Comparison","flare.query.methods.lt","flare.query.methods.eq","flare.query.methods.or"]},
		{"name":"flare.query.methods.max","size":283,"imports":["flare.query.Maximum","flare.query.methods.or"]},
		{"name":"flare.query.methods.min","size":283,"imports":["flare.query.Minimum","flare.query.methods.or"]},
		{"name":"flare.query.methods.mod","size":591,"imports":["flare.query.methods.or","flare.query.Arithmetic"]},
		{"name":"flare.query.methods.mul","size":603,"imports":["flare.query.methods.lt","flare.query.methods.or","flare.query.Arithmetic"]},
		{"name":"flare.query.methods.neq","size":599,"imports":["flare.query.Comparison","flare.query.methods.eq","flare.query.methods.or"]},
		{"name":"flare.query.methods.not","size":386,"imports":["flare.query.Not","flare.query.methods.or"]},
		{"name":"flare.query.methods.or","size":323,"imports":["flare.query.Or"]},
		{"name":"flare.query.methods.orderby","size":307,"imports":["flare.query.Query","flare.query.methods.or"]},
		{"name":"flare.query.methods.range","size":772,"imports":["flare.query.methods.max","flare.query.Range","flare.query.methods.or","flare.query.methods.min"]},
		{"name":"flare.query.methods.select","size":296,"imports":["flare.query.Query"]},
		{"name":"flare.query.methods.stddev","size":363,"imports":["flare.query.methods.and","flare.query.Variance","flare.query.methods.or"]},
		{"name":"flare.query.methods.sub","size":600,"imports":["flare.query.methods.or","flare.query.Arithmetic"]},
		{"name":"flare.query.methods.sum","size":280,"imports":["flare.query.Sum","flare.query.methods.or"]},
		{"name":"flare.query.methods.update","size":307,"imports":["flare.query.Query"]},
		{"name":"flare.query.methods.variance","size":335,"imports":["flare.query.Variance","flare.query.methods.or"]},
		{"name":"flare.query.methods.where","size":299,"imports":["flare.query.Query","flare.query.methods.lt","flare.query.methods.lte"]},
		{"name":"flare.query.methods.xor","size":354,"imports":["flare.query.Xor","flare.query.methods.or"]},
		{"name":"flare.query.methods._","size":264,"imports":["flare.query.Literal","flare.query.methods.or"]},
		{"name":"flare.query.Minimum","size":843,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.Not","size":1554,"imports":["flare.query.Expression"]},
		{"name":"flare.query.Or","size":970,"imports":["flare.query.CompositeExpression","flare.query.Expression"]},
		{"name":"flare.query.Query","size":13896,"imports":["flare.query.Variable","flare.query.Sum","flare.query.Expression","flare.util.Sort","flare.query.Not","flare.query.AggregateExpression","flare.query.Literal","flare.util.Filter","flare.util.Property","flare.query.If"]},
		{"name":"flare.query.Range","size":1594,"imports":["flare.query.And","flare.query.Comparison","flare.query.Expression"]},
		{"name":"flare.query.StringUtil","size":4130,"imports":["flare.query.Fn"]},
		{"name":"flare.query.Sum","size":791,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.Variable","size":1124,"imports":["flare.query.Expression","flare.util.Property"]},
		{"name":"flare.query.Variance","size":1876,"imports":["flare.query.Expression","flare.query.AggregateExpression"]},
		{"name":"flare.query.Xor","size":1101,"imports":["flare.query.CompositeExpression","flare.query.Expression"]},
		{"name":"flare.scale.IScaleMap","size":2105,"imports":["flare.scale.Scale"]},
		{"name":"flare.scale.LinearScale","size":1316,"imports":["flare.util.Maths","flare.util.Strings","flare.scale.Scale","flare.scale.QuantitativeScale","flare.scale.ScaleType"]},
		{"name":"flare.scale.LogScale","size":3151,"imports":["flare.util.Maths","flare.util.Strings","flare.scale.Scale","flare.scale.QuantitativeScale","flare.scale.ScaleType"]},
		{"name":"flare.scale.OrdinalScale","size":3770,"imports":["flare.scale.ScaleType","flare.util.Arrays","flare.scale.Scale"]},
		{"name":"flare.scale.QuantileScale","size":2435,"imports":["flare.util.Maths","flare.util.Strings","flare.scale.Scale","flare.scale.ScaleType"]},
		{"name":"flare.scale.QuantitativeScale","size":4839,"imports":["flare.util.Maths","flare.util.Strings","flare.scale.Scale"]},
		{"name":"flare.scale.RootScale","size":1756,"imports":["flare.util.Maths","flare.util.Strings","flare.scale.Scale","flare.scale.QuantitativeScale","flare.scale.ScaleType"]},
		{"name":"flare.scale.Scale","size":4268,"imports":["flare.scale.ScaleType","flare.util.Strings"]},
		{"name":"flare.scale.ScaleType","size":1821,"imports":["flare.scale.Scale"]},
		{"name":"flare.scale.TimeScale","size":5833,"imports":["flare.util.Maths","flare.util.Dates","flare.scale.Scale","flare.scale.ScaleType"]},
		{"name":"flare.util.Arrays","size":8258,"imports":["flare.util.IValueProxy","flare.util.Property","flare.util.IEvaluable"]},
		{"name":"flare.util.Colors","size":10001,"imports":["flare.util.Filter"]},
		{"name":"flare.util.Dates","size":8217,"imports":["flare.util.Maths"]},
		{"name":"flare.util.Displays","size":12555,"imports":["flare.util.IValueProxy","flare.util.Filter","flare.util.Property","flare.util.IEvaluable","flare.util.Sort"]},
		{"name":"flare.util.Filter","size":2324,"imports":["flare.util.IPredicate","flare.util.Property"]},
		{"name":"flare.util.Geometry","size":10993,"imports":[]},
		{"name":"flare.util.heap.FibonacciHeap","size":9354,"imports":["flare.util.heap.HeapNode"]},
		{"name":"flare.util.heap.HeapNode","size":1233,"imports":["flare.util.heap.FibonacciHeap"]},
		{"name":"flare.util.IEvaluable","size":335,"imports":[]},
		{"name":"flare.util.IPredicate","size":383,"imports":[]},
		{"name":"flare.util.IValueProxy","size":874,"imports":[]},
		{"name":"flare.util.math.DenseMatrix","size":3165,"imports":["flare.util.math.IMatrix"]},
		{"name":"flare.util.math.IMatrix","size":2815,"imports":[]},
		{"name":"flare.util.math.SparseMatrix","size":3366,"imports":["flare.util.math.IMatrix"]},
		{"name":"flare.util.Maths","size":17705,"imports":["flare.util.Arrays"]},
		{"name":"flare.util.Orientation","size":1486,"imports":[]},
		{"name":"flare.util.palette.ColorPalette","size":6367,"imports":["flare.util.palette.Palette","flare.util.Colors"]},
		{"name":"flare.util.palette.Palette","size":1229,"imports":[]},
		{"name":"flare.util.palette.ShapePalette","size":2059,"imports":["flare.util.palette.Palette","flare.util.Shapes"]},
		{"name":"flare.util.palette.SizePalette","size":2291,"imports":["flare.util.palette.Palette"]},
		{"name":"flare.util.Property","size":5559,"imports":["flare.util.IPredicate","flare.util.IValueProxy","flare.util.IEvaluable"]},
		{"name":"flare.util.Shapes","size":19118,"imports":["flare.util.Arrays"]},
		{"name":"flare.util.Sort","size":6887,"imports":["flare.util.Arrays","flare.util.Property"]},
		{"name":"flare.util.Stats","size":6557,"imports":["flare.util.Arrays","flare.util.Property"]},
		{"name":"flare.util.Strings","size":22026,"imports":["flare.util.Dates","flare.util.Property"]},
		{"name":"flare.vis.axis.Axes","size":1302,"imports":["flare.animate.Transitioner","flare.vis.Visualization"]},
		{"name":"flare.vis.axis.Axis","size":24593,"imports":["flare.animate.Transitioner","flare.scale.LinearScale","flare.util.Arrays","flare.scale.ScaleType","flare.util.Strings","flare.display.TextSprite","flare.scale.Scale","flare.util.Stats","flare.scale.IScaleMap","flare.vis.axis.AxisLabel","flare.vis.axis.AxisGridLine"]},
		{"name":"flare.vis.axis.AxisGridLine","size":652,"imports":["flare.vis.axis.Axis","flare.display.LineSprite"]},
		{"name":"flare.vis.axis.AxisLabel","size":636,"imports":["flare.vis.axis.Axis","flare.display.TextSprite"]},
		{"name":"flare.vis.axis.CartesianAxes","size":6703,"imports":["flare.animate.Transitioner","flare.display.RectSprite","flare.vis.axis.Axis","flare.display.TextSprite","flare.vis.axis.Axes","flare.vis.Visualization","flare.vis.axis.AxisGridLine"]},
		{"name":"flare.vis.controls.AnchorControl","size":2138,"imports":["flare.vis.controls.Control","flare.vis.Visualization","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.controls.ClickControl","size":3824,"imports":["flare.vis.events.SelectionEvent","flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.Control","size":1353,"imports":["flare.vis.controls.IControl","flare.util.Filter"]},
		{"name":"flare.vis.controls.ControlList","size":4665,"imports":["flare.vis.controls.IControl","flare.util.Arrays","flare.vis.Visualization","flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.DragControl","size":2649,"imports":["flare.vis.controls.Control","flare.vis.data.DataSprite"]},
		{"name":"flare.vis.controls.ExpandControl","size":2832,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.controls.Control","flare.vis.Visualization"]},
		{"name":"flare.vis.controls.HoverControl","size":4896,"imports":["flare.vis.events.SelectionEvent","flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.IControl","size":763,"imports":["flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.PanZoomControl","size":5222,"imports":["flare.util.Displays","flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.SelectionControl","size":7862,"imports":["flare.vis.events.SelectionEvent","flare.vis.controls.Control"]},
		{"name":"flare.vis.controls.TooltipControl","size":8435,"imports":["flare.animate.Tween","flare.display.TextSprite","flare.vis.controls.Control","flare.vis.events.TooltipEvent"]},
		{"name":"flare.vis.data.Data","size":20544,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.util.Arrays","flare.vis.data.DataSprite","flare.vis.data.Tree","flare.vis.events.DataEvent","flare.data.DataSet","flare.vis.data.TreeBuilder","flare.vis.data.DataList","flare.data.DataSchema","flare.util.Sort","flare.data.DataField","flare.util.Property"]},
		{"name":"flare.vis.data.DataList","size":19788,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.util.Arrays","flare.util.math.DenseMatrix","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite","flare.vis.events.DataEvent","flare.util.Stats","flare.util.math.IMatrix","flare.util.Sort","flare.util.Filter","flare.util.Property","flare.util.IEvaluable","flare.vis.data.Data"]},
		{"name":"flare.vis.data.DataSprite","size":10349,"imports":["flare.util.Colors","flare.vis.data.Data","flare.display.DirtySprite","flare.vis.data.render.IRenderer","flare.vis.data.render.ShapeRenderer"]},
		{"name":"flare.vis.data.EdgeSprite","size":3301,"imports":["flare.vis.data.render.EdgeRenderer","flare.vis.data.DataSprite","flare.vis.data.NodeSprite","flare.vis.data.render.ArrowType","flare.vis.data.Data"]},
		{"name":"flare.vis.data.NodeSprite","size":19382,"imports":["flare.animate.Transitioner","flare.util.Arrays","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite","flare.vis.data.Tree","flare.util.Sort","flare.util.Filter","flare.util.IEvaluable","flare.vis.data.Data"]},
		{"name":"flare.vis.data.render.ArrowType","size":698,"imports":[]},
		{"name":"flare.vis.data.render.EdgeRenderer","size":5569,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.vis.data.DataSprite","flare.vis.data.render.IRenderer","flare.util.Shapes","flare.util.Geometry","flare.vis.data.render.ArrowType"]},
		{"name":"flare.vis.data.render.IRenderer","size":353,"imports":["flare.vis.data.DataSprite"]},
		{"name":"flare.vis.data.render.ShapeRenderer","size":2247,"imports":["flare.util.Shapes","flare.vis.data.render.IRenderer","flare.vis.data.DataSprite"]},
		{"name":"flare.vis.data.ScaleBinding","size":11275,"imports":["flare.scale.TimeScale","flare.scale.ScaleType","flare.scale.LinearScale","flare.scale.LogScale","flare.scale.OrdinalScale","flare.scale.RootScale","flare.scale.Scale","flare.scale.QuantileScale","flare.util.Stats","flare.scale.QuantitativeScale","flare.vis.events.DataEvent","flare.vis.data.Data"]},
		{"name":"flare.vis.data.Tree","size":7147,"imports":["flare.vis.data.EdgeSprite","flare.vis.events.DataEvent","flare.vis.data.NodeSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.data.TreeBuilder","size":9930,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.vis.data.Tree","flare.util.heap.HeapNode","flare.util.heap.FibonacciHeap","flare.util.Property","flare.util.IEvaluable","flare.vis.data.Data"]},
		{"name":"flare.vis.events.DataEvent","size":2313,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.vis.data.DataSprite"]},
		{"name":"flare.vis.events.SelectionEvent","size":1880,"imports":["flare.vis.events.DataEvent"]},
		{"name":"flare.vis.events.TooltipEvent","size":1701,"imports":["flare.vis.data.EdgeSprite","flare.vis.data.NodeSprite"]},
		{"name":"flare.vis.events.VisualizationEvent","size":1117,"imports":["flare.animate.Transitioner"]},
		{"name":"flare.vis.legend.Legend","size":20859,"imports":["flare.animate.Transitioner","flare.vis.data.ScaleBinding","flare.util.palette.SizePalette","flare.scale.ScaleType","flare.vis.legend.LegendItem","flare.display.RectSprite","flare.display.TextSprite","flare.scale.Scale","flare.vis.legend.LegendRange","flare.util.Displays","flare.util.Orientation","flare.util.palette.ShapePalette","flare.util.palette.Palette","flare.util.palette.ColorPalette"]},
		{"name":"flare.vis.legend.LegendItem","size":4614,"imports":["flare.util.Shapes","flare.display.TextSprite","flare.vis.legend.Legend","flare.display.RectSprite"]},
		{"name":"flare.vis.legend.LegendRange","size":10530,"imports":["flare.util.Colors","flare.vis.legend.Legend","flare.display.RectSprite","flare.display.TextSprite","flare.scale.Scale","flare.util.Stats","flare.scale.IScaleMap","flare.util.Orientation","flare.util.palette.ColorPalette"]},
		{"name":"flare.vis.operator.distortion.BifocalDistortion","size":4461,"imports":["flare.vis.operator.distortion.Distortion"]},
		{"name":"flare.vis.operator.distortion.Distortion","size":6314,"imports":["flare.animate.Transitioner","flare.vis.data.DataSprite","flare.vis.events.VisualizationEvent","flare.vis.axis.Axis","flare.vis.axis.CartesianAxes","flare.vis.operator.layout.Layout","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.distortion.FisheyeDistortion","size":3444,"imports":["flare.vis.operator.distortion.Distortion"]},
		{"name":"flare.vis.operator.encoder.ColorEncoder","size":3179,"imports":["flare.animate.Transitioner","flare.scale.ScaleType","flare.vis.operator.encoder.Encoder","flare.util.palette.Palette","flare.util.palette.ColorPalette","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.encoder.Encoder","size":4060,"imports":["flare.animate.Transitioner","flare.vis.data.DataSprite","flare.vis.operator.Operator","flare.vis.data.ScaleBinding","flare.util.palette.Palette","flare.util.Filter","flare.util.Property","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.encoder.PropertyEncoder","size":4138,"imports":["flare.animate.Transitioner","flare.vis.data.DataList","flare.vis.data.Data","flare.vis.operator.encoder.Encoder","flare.util.Filter","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.encoder.ShapeEncoder","size":1690,"imports":["flare.util.palette.Palette","flare.scale.ScaleType","flare.util.palette.ShapePalette","flare.vis.operator.encoder.Encoder","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.encoder.SizeEncoder","size":1830,"imports":["flare.util.palette.Palette","flare.scale.ScaleType","flare.vis.operator.encoder.Encoder","flare.util.palette.SizePalette","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.filter.FisheyeTreeFilter","size":5219,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite","flare.vis.data.Tree","flare.vis.operator.Operator","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.filter.GraphDistanceFilter","size":3165,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.operator.Operator","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite"]},
		{"name":"flare.vis.operator.filter.VisibilityFilter","size":3509,"imports":["flare.vis.operator.Operator","flare.animate.Transitioner","flare.util.Filter","flare.vis.data.DataSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.IOperator","size":1286,"imports":["flare.animate.Transitioner","flare.vis.Visualization","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.label.Labeler","size":9956,"imports":["flare.animate.Transitioner","flare.vis.data.DataSprite","flare.display.TextSprite","flare.vis.operator.Operator","flare.util.Shapes","flare.util.Filter","flare.util.Property","flare.util.IEvaluable","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.label.RadialLabeler","size":3899,"imports":["flare.vis.operator.label.Labeler","flare.util.Shapes","flare.display.TextSprite","flare.vis.data.DataSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.label.StackedAreaLabeler","size":3202,"imports":["flare.vis.operator.label.Labeler","flare.display.TextSprite","flare.vis.data.DataSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.AxisLayout","size":6725,"imports":["flare.scale.ScaleType","flare.vis.data.DataSprite","flare.vis.axis.CartesianAxes","flare.vis.data.ScaleBinding","flare.util.Property","flare.vis.operator.layout.Layout","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.BundledEdgeRouter","size":3727,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.util.Arrays","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite","flare.util.Shapes","flare.vis.operator.layout.Layout","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.layout.CircleLayout","size":9317,"imports":["flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.vis.data.ScaleBinding","flare.util.Property","flare.vis.operator.layout.Layout","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.CirclePackingLayout","size":12003,"imports":["flare.vis.data.NodeSprite","flare.vis.data.render.ShapeRenderer","flare.util.Shapes","flare.util.Sort","flare.vis.operator.layout.Layout","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.DendrogramLayout","size":4853,"imports":["flare.util.Property","flare.vis.data.NodeSprite","flare.util.Orientation","flare.vis.operator.layout.Layout","flare.vis.data.EdgeSprite"]},
		{"name":"flare.vis.operator.layout.ForceDirectedLayout","size":8411,"imports":["flare.physics.Simulation","flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.DataSprite","flare.physics.Particle","flare.physics.Spring","flare.vis.operator.layout.Layout","flare.vis.data.EdgeSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.IcicleTreeLayout","size":4864,"imports":["flare.vis.data.NodeSprite","flare.util.Orientation","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.operator.layout.IndentedTreeLayout","size":3174,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.util.Arrays","flare.vis.operator.layout.Layout","flare.vis.data.EdgeSprite"]},
		{"name":"flare.vis.operator.layout.Layout","size":7881,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.vis.data.DataList","flare.vis.data.DataSprite","flare.vis.data.EdgeSprite","flare.vis.Visualization","flare.vis.axis.CartesianAxes","flare.vis.axis.Axes","flare.animate.TransitionEvent","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.layout.NodeLinkTreeLayout","size":12870,"imports":["flare.vis.data.NodeSprite","flare.util.Arrays","flare.util.Orientation","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.operator.layout.PieLayout","size":2728,"imports":["flare.vis.data.DataList","flare.vis.data.DataSprite","flare.util.Shapes","flare.util.Property","flare.vis.operator.layout.Layout","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.RadialTreeLayout","size":12348,"imports":["flare.vis.data.NodeSprite","flare.util.Arrays","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.operator.layout.RandomLayout","size":870,"imports":["flare.vis.operator.layout.Layout","flare.vis.data.DataSprite","flare.vis.data.Data"]},
		{"name":"flare.vis.operator.layout.StackedAreaLayout","size":9121,"imports":["flare.scale.TimeScale","flare.scale.LinearScale","flare.util.Arrays","flare.scale.OrdinalScale","flare.vis.data.NodeSprite","flare.scale.Scale","flare.vis.axis.CartesianAxes","flare.util.Stats","flare.util.Orientation","flare.scale.QuantitativeScale","flare.util.Maths","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.operator.layout.TreeMapLayout","size":9191,"imports":["flare.animate.Transitioner","flare.vis.data.NodeSprite","flare.util.Property","flare.vis.operator.layout.Layout"]},
		{"name":"flare.vis.operator.Operator","size":2490,"imports":["flare.animate.Transitioner","flare.vis.operator.IOperator","flare.util.Property","flare.util.IEvaluable","flare.vis.Visualization"]},
		{"name":"flare.vis.operator.OperatorList","size":5248,"imports":["flare.animate.Transitioner","flare.util.Arrays","flare.vis.operator.IOperator","flare.vis.Visualization","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.OperatorSequence","size":4190,"imports":["flare.animate.Transitioner","flare.util.Arrays","flare.vis.operator.IOperator","flare.vis.operator.OperatorList","flare.animate.FunctionSequence","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.OperatorSwitch","size":2581,"imports":["flare.animate.Transitioner","flare.vis.operator.OperatorList","flare.vis.operator.IOperator","flare.vis.operator.Operator"]},
		{"name":"flare.vis.operator.SortOperator","size":2023,"imports":["flare.vis.operator.Operator","flare.animate.Transitioner","flare.util.Arrays","flare.vis.data.Data"]},
		{"name":"flare.vis.Visualization","size":16540,"imports":["flare.animate.Transitioner","flare.vis.operator.IOperator","flare.animate.Scheduler","flare.vis.events.VisualizationEvent","flare.vis.data.Tree","flare.vis.events.DataEvent","flare.vis.axis.Axes","flare.vis.axis.CartesianAxes","flare.util.Displays","flare.vis.operator.OperatorList","flare.vis.controls.ControlList","flare.animate.ISchedulable","flare.vis.data.Data"]}
	];

	return data;
});






