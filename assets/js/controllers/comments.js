'use strict';

var comments = app.controller('Comments', function ($scope, StackMobService) {
    $scope.reset = function () {
        $scope.comments = [];
    };

    $scope.$on("addBroadcast", function (event, args) {
        $scope.safeApply(function () {
            if (args.vote.message != null && args.vote.message != "") {
                $scope.comments.unshift(args.vote);
            }
        });
    });

    $scope.getComments = function () {
        StackMobService.getComments(function (comments) {
            $scope.safeApply(function () {
                $scope.comments = comments;
            });
        });
    };

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            fn();
        }
        else {
            this.$apply(fn);
        }
    };

    $scope.reset();
    $scope.getComments();
});

vote.$inject = ['$scope', 'carpickmeup.services.stackmob'];