'use strict';

/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */

angular.module('spotifeyeApp')

.directive('bubbles', function() {
    return {
        scope: {
            'bubbleService': '='
        },
        link: function(scope, element, attrs) {
            var bubbleService = scope.bubbleService;
            // debugger;
            var margin = 20,
                diameter = 0.8 * window.innerWidth;

            var color = d3.scale.linear()
                .domain([-1, 5])
                .range(['hsl(180,93%,51%)', 'hsl(228,30%,40%)'])
                .interpolate(d3.interpolateHcl);

            var color2 = d3.scale.linear()
                .domain([0, 1.0])
                .range(['#C7F60E', 'rgb(249,38,114)'])
                .interpolate(d3.interpolateHcl);

            var pack = d3.layout.pack()
                .padding(2)
                .size([diameter - margin, diameter - margin])
                .value(function(d) {
                    return d.size;
                })

            var svg = d3.select('.bubbles').append('svg')
                .attr('width', diameter)
                .attr('height', diameter)
                .append('g')
                .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')');

            var focus = bubbleService,
                nodes = pack.nodes(bubbleService),
                view;

            var circle = svg.selectAll('circle')
                .data(nodes)
                .enter().append('circle')
                .attr('class', function(d) {
                    return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root';
                })
                .style('fill', function(d) {
                    // debugger;
                    if (d.depth === 0) {
                        return '#C7F60E';
                    } else if (d.depth === 3) {
                        // return 'rgba(249,38,114,'+ d.parent.min + ')';
                        return color2(d.parent.min);
                    } else {
                        return d.children ? color(d.depth) : null;
                    }
                    
                })
                .on('click', function(d) {
                    if (focus !== d) zoom(d), d3.event.stopPropagation();
                });

            var text = svg.selectAll('text')
                .data(nodes)
                .enter().append('text')
                .attr('class', 'label')
                .style('fill-opacity', function(d) {
                    return d.parent === bubbleService ? 1 : 0;
                })
                .style("font-size", function(d) { 
                    // debugger;
                    // return Math.min(1 * d.r, (1 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
                    if (d.depth === 1) {
                        return ((d.r * 3.4)/d.name.length + 0) + "px";    
                    }
                    if (d.depth === 2) {
                        return ((d.r * 8)/d.name.length + 0) + "px";    
                    }
                    if (d.depth === 3) {
                        // console.log((d.r * 16)/d.name.length + 0);
                        // console.log(Math.max(((d.r * 16)/d.name.length + 0),6));
                        return Math.max(((d.r * 16)/d.name.length + 0),12) + "px";    
                    }

                })
                // .style('transform', function(d){
                //     return 'translate(0px,10px)';
                // })
                .style('display', function(d) {
                    return d.parent === bubbleService ? 'inline' : 'none';
                })
                .text(function(d) {
                    return d.name;
                });

            var node = svg.selectAll('circle,text');

            d3.select('body')
                // .style('background', color(-1))
                .on('click', function() {
                    zoom(bubbleService);
                });

            zoomTo([bubbleService.x, bubbleService.y, bubbleService.r * 2 + margin]);

            function zoom(d) {
                var focus0 = focus;
                focus = d;

                var transition = d3.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .tween('zoom', function(d) {
                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                        return function(t) {
                            zoomTo(i(t));
                        };
                    });

                transition.selectAll('text')
                    .filter(function(d) {
                        return d.parent === focus || this.style.display === 'inline';
                    })
                    .style('fill-opacity', function(d) {
                        return d.parent === focus ? 1 : 0;
                    })
                    .each('start', function(d) {
                        if (d.parent === focus) this.style.display = 'inline';
                    })
                    .each('end', function(d) {
                        if (d.parent !== focus) this.style.display = 'none';
                    });
            }

            function zoomTo(v) {
                var k = diameter / v[2];
                view = v;
                node.attr('transform', function(d) {
                    return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')';
                });
                circle.attr('r', function(d) {
                    return d.r * k;
                });
            }

            d3.select(self.frameElement).style('height', diameter + 'px');
        }
    }
});
