var events = angular.module('carpickmeup.services.events', []);

events.run(function ($rootScope) {
    $rootScope.$on('addEmit', function (event, args) {
        $rootScope.$broadcast('addBroadcast', args);
    });
});