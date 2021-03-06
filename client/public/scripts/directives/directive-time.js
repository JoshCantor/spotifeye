'use strict';

/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */

angular.module('spotifeyeApp')

.directive('time', function() {
    return {
        scope: {
            // 'timeService': '='
        },
        link: function(scope, element, attrs) {
            // console.log(timeService);
            // var timeService = scope.timeService;
            var parseTime = d3.time.format.utc("%H:%M").parse,
                midnight = parseTime("00:00");

            var margin = { top: 30, right: 30, bottom: 30, left: 30 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var x = d3.time.scale.utc()
                .domain([midnight, d3.time.day.utc.offset(midnight, 1)])
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var svg = d3.select(".time").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.csv("/user/dashboard/time", type, function(error, data) {
                console.log('inside csv!');
                console.log(data);
                if (error) throw error;

                y.domain([0, d3.max(data, function(d) {
                    return d.rate; })]);

                svg.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(d3.time.format.utc("%I %p")));

                svg.append("g")
                    .attr("class", "dots")
                    .selectAll("path")
                    .data(data)
                    .enter().append("path")
                    .attr("transform", function(d) {
                        return "translate(" + x(d.time) + "," + y(d.rate) + ")"; })
                    .attr("d", d3.svg.symbol()
                        .size(40));

                var tick = svg.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.svg.axis()
                        .scale(y)
                        .tickSize(-width)
                        .orient("left"))
                    .select(".tick:last-of-type");

                var title = tick.append("text")
                    .attr("dy", ".32em")
                    .text("saves per hour");

                tick.select("line")
                    .attr("x1", title.node().getBBox().width + 6);
            });

            function type(d) {
                d.rate = +d.count / 327 * 60; // January 8 to November 30
                d.time = parseTime(d.time);
                d.time.setUTCHours((d.time.getUTCHours() + 24 - 7) % 24);
                return d;
            }
        }
    };
});
