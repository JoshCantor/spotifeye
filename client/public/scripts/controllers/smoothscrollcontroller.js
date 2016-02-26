// not currently implemented
angular.module('spotifeyeApp')
    .controller('ScrollCtrl', function($scope, $location, anchorSmoothScroll) {
        $scope.gotoElement = function(eID) {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('3');
            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(eID);
        };
    });
