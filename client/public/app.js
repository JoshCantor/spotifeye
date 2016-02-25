/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */
// (function() {
    'use strict';
    angular
        .module('spotifeyeApp', [
            'ngAnimate',
            'ngRoute'
        ]);
// })();

angular.module('spotifeyeApp')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/dashboard/user/:user_id', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/dashboard/bubbles', {
            templateUrl: 'views/bubbleTemplate.html',
            controller: 'BubbleController',
            resolve: {
                BubbleData: function($http) {
                    return $http.get('/user/dashboard/bubbles');
                }
            }
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
