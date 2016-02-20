var app = angular.module('spotifeye', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: "/client/d3template.html",
		controller: "D3"
	});
});

app.controller('D3', function($scope) {
	$scope.test = 'test';
});

// app.directive('d3', function() {
// 	return {
// 		templateUrl: 'd3template.html',
// 		link: function(scope, element, attributes){
// 		}
// 	};
// });


