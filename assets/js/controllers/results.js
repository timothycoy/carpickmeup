'use strict';

var results = app.controller('Results', function ($scope, GoogleAnalyticsService, BackendlessService) {
    $scope.reset = function () {
        $scope.display = false;
        $scope.count = {
            illegal: 0,
            legal: 0
        }
    };

    $scope.$on("addBroadcast", function (event, args) {
        $scope.safeApply(function () {
            if (args.vote.decision == "illegal") {
                $scope.count.illegal++;
            }
            else if (args.vote.decision == "legal") {
                $scope.count.legal++;
            }
        });
    });

    $scope.countVotes = function () {
        BackendlessService.countVotes(function (count) {
            $scope.safeApply(function () {
                $scope.count = count;
                $scope.display = true;
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
    $scope.countVotes();
});

results.$inject = ['$scope', 'carpickmeup.services.google', 'carpickmeup.services.backendless'];