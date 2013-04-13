'use strict';

angular.module('carpickmeup.directives.common', [])
    .directive('preventDefault', [function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                event.preventDefault();
            });
        }
    } ])
    .directive('scrollTo', [function () {
        return function (scope, element, attrs) {
            $(element).click(function (event) {
                $.scrollTo(attrs.scrollTo, 1000);
                event.preventDefault();
            });
        };
    } ]);