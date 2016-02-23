'use strict';

var angular.module('spotifeyeApp')
	.controller('BubbleController', function($scope, $http, $location) {
		$scope.data = [];

		$scope.getData = function() {
			$http.get('/user/bubble').then(function(data) {
				$scope.data = data;
			});
		};
		$scope.getData();
	});
