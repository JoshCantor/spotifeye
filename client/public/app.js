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

.config(['$routeProvider','$sceDelegateProvider', function($routeProvider,$sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://p.scdn.co/**']);
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/dashboard/user/:user_id', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController'
        })
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
