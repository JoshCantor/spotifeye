'use strict';

angular.module('spotifeye')
	.controller('Dashboard', function($scope, $http, $location) {
		$scope.goToEdge = function() {
			$location.path('/dashboard/edgeBundle');
		};

		$scope.goToBubbles = function() {
			$location.path('/dashboard/bubbles');
		};

		$scope.goToDashboard = function() {
			$location.path('/user');
		};
	});
