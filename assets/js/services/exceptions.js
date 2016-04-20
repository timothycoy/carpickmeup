angular.module('carpickmeup.services.exceptions', [])
    .factory('$exceptionHandler', function ($injector, BackendlessService) {
        return function (exception, cause) {
            BackendlessService.logException("carpickmeup.global", exception);
        }
    });