'use strict';
/**
 * @name MainController
 * @description
 * Controller of the spotifeyeApp
 */
var app = angular.module('spotifeyeApp');
app.controller("MainController", ["$scope", function($scope) {
        $scope.hello = "hello world";
}]);
