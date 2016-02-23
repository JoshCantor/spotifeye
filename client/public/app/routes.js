'use strict';

angular.module('spotifeye')

.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/main.html'
        controller: 'MainController'
    })
    .when('/dashboard/bubbles', {
        templateUrl: '/client/public/app/views/bubbleTemplate.html',
        controller: 'BubbleController'
    })
    .when('/dashboard/edgeBundle', {
        templateUrl: '/client/public/app/views/edgeTemplate.html',
        controller: 'EdgeController'
    });
    ;.otherwise({redirectTo: '/'});
});
