angular.module('carpickmeup.services.exceptions', [])
    .factory('$exceptionHandler', function ($injector, BackendlessService) {
        return function (exception, cause) {
            console.log(exception);
            BackendlessService.logException("carpickmeup.global", exception);
        }
    });