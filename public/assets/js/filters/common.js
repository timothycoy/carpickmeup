'use strict';

angular.module('carpickmeup.filters.common', [])
    .filter('timeago', function () {
        return function (timestamp) {
            return $.timeago(new Date(timestamp));
        };
    });
    
