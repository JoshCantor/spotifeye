'use strict';

/** DESCRIPTION OF WHAT THIS IS DOING GOES HERE */

angular.module('spotifeyeApp')

.factory('bubbleService', function($http) {
    var data;
    $http.get('/user/dashboard/bubbles').then(function(response){
        data = response;
    })

    return data;
});
