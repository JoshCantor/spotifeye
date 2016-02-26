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
         $scope.hello = 'hello';
         $scope.title = ' spotifEYE';

     }
 })();
