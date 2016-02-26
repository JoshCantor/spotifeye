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
         $scope.hello = "hello";
         $scope.title = " spotifEYE";
         $scope.lockWindow = lockWindow.showLogin;
         console.log($scope.lockWindow);
     }

 })();
