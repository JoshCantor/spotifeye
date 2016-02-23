'use strict';

angular.module('spotifeyeApp')
	.controller('Dashboard', function($scope, $http, $location) {
		$scope.goToEdge = function() {
			$location.path('/dashboard/edgeBundle');
		};

		$scope.goToBubbles = function() {
			$location.path('/dashboard/bubbles');
		};

		$scope.goToChords = function() {
			$location.path('/dashboard/chords');
		};

		$scope.goToDashboard = function() {
			$location.path('/user');
		};
	});
