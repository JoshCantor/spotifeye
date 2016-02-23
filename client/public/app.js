"use strict";

/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */

var app = angular.module("spotifeyeApp", [
    "ngAnimate",
    "ngCookies",
    "ngResource",
    "ngRoute"
  ]);

app.controller("MainController", ["$scope", function($scope) {
        $scope.hello = "hello world";
}]);
