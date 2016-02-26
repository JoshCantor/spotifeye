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
        // .when('/', {
        //     templateUrl: 'views/main.html'
        //     controller: 'MainController'
        // })
        .when('/dashboard/bubbles', {
            templateUrl: 'views/bubbleTemplate.html',
            controller: 'BubbleController',
            resolve: {
                BubbleData: function($http){
                    return $http.get('/user/dashboard/bubbles');
                }
            }
        })
        .when('/dashboard/time', {
            templateUrl: 'views/timeTemplate.html',
            controller: 'TimeController'
            // resolve: {
            //     TimeData: function($http){
            //         return $http.get('user/dashboard/time');
            //     }
            // }
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
