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
        $scope.title = "inject me porfavor..."
    }
})();

// (function() {
//     'use strict';
//     angular.module('spotifeyeApp')
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider
//             .when('/', {
//                 templateUrl: '/views/main.html'
//                 controller: 'MainController'
//             })
//             .when('/dashboard/bubbles', {
//                 templateUrl: '/client/public/app/views/bubbleTemplate.html',
//                 controller: 'BubbleController'
//             })
//             .when('/dashboard/edgeBundle', {
//                 templateUrl: '/client/public/app/views/edgeTemplate.html',
//                 controller: 'EdgeController'
//             })
//             .otherwise({
//                 redirectTo: '/'
//             });
//     }]);
// })();
