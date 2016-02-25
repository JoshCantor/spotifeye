'use strict';

angular.module('spotifeyeApp')
	.controller('BubbleController', function($scope, $http, $location, BubbleData) {

		$scope.bubbleData = BubbleData.data;
	});
