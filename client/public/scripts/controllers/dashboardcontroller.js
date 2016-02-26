'use strict';

angular.module('spotifeyeApp')
	.controller('DashboardController', function($scope, $http, $location, $routeParams) {

		$scope.goToTime = function() {
			$location.path('/dashboard/time');
		};

		var user_id = $routeParams.user_id;

		$http.get('/user/'+user_id+'/info').then(function(data){
			$scope.displayName = data.data[0].display_name;
			$scope.picture = data.data[0].profile_pic;
		})

		$http.get('/user/'+user_id+'/albumart').then(function(art){
			
			$scope.artArray = art.data;	
		});

		$scope.goToBubbles = function() {
			$location.path('/dashboard/bubbles');
		};

		$scope.goToChords = function() {
			$location.path('/dashboard/chords');
		};

	});
