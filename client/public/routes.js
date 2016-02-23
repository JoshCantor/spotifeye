'use strict';

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
        .otherwise({
            redirectTo: '/'
        });
}]);
