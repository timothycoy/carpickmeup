'use strict';

angular.module('carpickmeup.directives.vote', [])
    .directive('currentDecision', [function () {
        return function (scope, element, attrs) {
            function updateDecision(decision) {
                if (decision == "illegal") {
                    $("#decision :nth-child(1)").addClass("btn-danger");
                    $("#decision :nth-child(2)").removeClass("btn-info");
                }
                else if (decision == "legal") {
                    $("#decision :nth-child(1)").removeClass("btn-danger");
                    $("#decision :nth-child(2)").addClass("btn-info")
                }
                else {
                    $("#decision :nth-child(1)").removeClass("btn-danger");
                    $("#decision :nth-child(2)").removeClass("btn-info");
                }
            }

            scope.$watch(attrs.currentDecision, function (value) {
                updateDecision(value);
            });
        }
    } ]);