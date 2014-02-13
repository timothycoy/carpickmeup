angular.module('carpickmeup.services.exceptions', [])
    .factory('$exceptionHandler', function ($injector, ParseService) {
        return function (exception, cause) {
            ParseService.logException("carpickmeup.global", exception);
        }
    });