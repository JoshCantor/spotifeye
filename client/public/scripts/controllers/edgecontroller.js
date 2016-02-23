(function() {
    'use strict';

    angular
      .module('spotifeyeApp')
      .controller('EdgeController', EdgeController);

    EdgeController.$inject = ['$location', '$scope'];

    function EdgeController($location, $scope) {
        $scope.edge = "test"
    }
})();
