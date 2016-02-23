/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */
(function() {
    'use strict';

    angular
      .module('spotifeyeApp', [
          'ngAnimate',
          'ngRoute'
      ]);
})();


(function() {
    'use strict';

    angular
      .module('spotifeyeApp')
      .controller('MainController', MainController);

    MainController.$inject = ['$scope'];

    function MainController($scope) {
        $scope.hello = "badbye";
    }
})();
