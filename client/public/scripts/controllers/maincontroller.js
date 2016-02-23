/**
 * @name MainController
 * @description
 * Controller of the spotifeyeApp
 */
 (function() {
     'use strict';
     angular
         .module('spotifeyeApp')
         .controller('MainController', MainController);
     MainController.$inject = ['$scope'];
     function MainController($scope) {
         $scope.hello = "badbye";
         $scope.title = "a;lkdjf;adsfjk"

     }
 })();
