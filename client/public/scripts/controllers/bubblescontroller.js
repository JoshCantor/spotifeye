'use strict';

angular.module('spotifeyeApp')
	.controller('BubbleController', function($scope, $http, $location, BubbleData) {

		$scope.bubbleData = BubbleData.data;
		console.log($scope.bubbleData);
		// $scope.data = [];

		// $scope.getData = function() {
		// 	$http.get('/user/bubble').then(function(data) {
		// 		$scope.data = data;
		// 	});
		// };
		// $scope.getData();
	});
