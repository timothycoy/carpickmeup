'use strict';

var vote = app.controller('Vote', function ($scope, GooglePlusService, StackMobService) {
    var decisions = ["illegal", "legal"];

    $scope.reset = function () {
        $scope.displayForm = true;
        $scope.displayThanks = false;
        $scope.form = {
            user: null,
            decision: "illegal",
            message: null
        };
    };

    $scope.makeDecision = function (decision) {
        $scope.form.decision = decisions[decision];
    };

    $scope.addVote = function () {
        GooglePlusService.getUser(function (user) {
            $scope.form.user = user;

            StackMobService.getVote($scope.form, function (vote) {
                if (vote == null) {
                    StackMobService.saveVote($scope.form, function () {
                        var vote = {
                            decision: $scope.form.decision,
                            message: $scope.form.message,
                            name: $scope.form.user.displayName,
                            time: new Date()
                        };
                        $scope.$emit("addEmit", { vote: vote });
                    });
                }
            });

            $scope.safeApply(function () {
                $scope.displayForm = false;
                $scope.displayThanks = true;
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
});

vote.$inject = ['$scope', 'carpickmeup.services.google', 'carpickmeup.services.stackmob'];