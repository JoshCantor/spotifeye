/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */
// (function() {
    'use strict';
    angular
        .module('spotifeyeApp', [
            'ngAnimate',
            'ngRoute'
        ]);
// })();

// (function() {
//     'use strict';
//     angular
//         .module('spotifeyeApp')
//         .controller('MainController', MainController);
//     MainController.$inject = ['$scope'];
//     function MainController($scope) {
//         $scope.hello = "badbye";
//         $scope.title = "a;lkdjf;adsfjk"

//     }
// })();

angular.module('spotifeyeApp')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        // .when('/', {
        //     templateUrl: 'views/main.html'
        //     controller: 'MainController'
        // })
        .when('/dashboard/bubbles', {
            templateUrl: 'views/bubbleTemplate.html',
            controller: 'BubbleController'
        })
        .when('/dashboard/edgeBundle', {
            templateUrl: 'views/edgeTemplate.html',
            controller: 'EdgeController'
        })
        .when('/dashboard/chords', {
            templateUrl: 'views/chordTemplate.html',
            controller: 'ChordController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
