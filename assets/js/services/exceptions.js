angular.module('carpickmeup.services.exceptions', [])
    .factory('$exceptionHandler', function ($injector, StackMobService) {
        return function (exception, cause) {
            StackMobService.logException("carpickmeup.global", exception);
        }
    });