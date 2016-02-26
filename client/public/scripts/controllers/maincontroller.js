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
     MainController.$inject = ['$scope', 'lockWindow'];
     
     function MainController($scope, lockWindow) {
         $scope.title = " spotifEYE";
         $scope.lockWindow = lockWindow;
     //     $scope.$watch('lockWindow', function(oldVal, newVal) {
  			// console.log(oldVal, newVal);
     //     });
     }

 })();
