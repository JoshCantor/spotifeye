'use strict';

angular.module('spotifeyeApp')
	.controller('Dashboard', function($scope, $http, $location) {
		$scope.goToTime = function() {
			$location.path('/dashboard/time');
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
