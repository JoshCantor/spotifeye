'use strict';

angular.module('spotifeyeApp')

	.controller('DashboardController', function($scope, $http, $location, $routeParams, $anchorScroll, lockWindow) {

        $scope.goToTime = function() {
            console.log('this, too');
            $location.path('/dashboard/time');
        };

        var user_id = $routeParams.user_id;

        $http.get('/user/' + user_id + '/info').then(function(data) {
            $scope.displayName = data.data[0].display_name;
            console.log(data.data);
            $scope.picture = data.data[0].profile_pic;
            $location.hash('3');
            // $anchorScroll();
            // $scope.gotoElement = function(eID) {
                // set the location.hash to the id of
                // the element you wish to scroll to.
                // $location.hash('3');
                // call $anchorScroll()
                // anchorSmoothScroll.scrollTo(eID);
            // };
        })

        $http.get('/user/' + user_id + '/albumart').then(function(art) {

            $scope.artArray = art.data;
        });

        $scope.goToBubbles = function() {
            $location.path('/dashboard/bubbles');
        };

		$scope.lockWindow = function() {
			lockWindow.hideLogin()
		}
		$scope.lockWindow();
	});

