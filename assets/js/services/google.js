angular.module('carpickmeup.services.google', [])
    .factory('GoogleService', function () {

        (function () {
            var po = document.createElement('script');
            po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js?onload=googleRender';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s);
        })();



        var GoogleService = {
            getUser: function getUser(callback) {
                gapi.client.load('plus', 'v1', function () {
                    gapi.client.plus.people.get({ 'userId': 'me' }).execute(callback);
                });
            }
        };

        return GoogleService;
    });

function googleRender() {
    gapi.signin.render('signinButton', {
        'callback': 'googleSigninCallback',
        'clientid': '64456653882.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'scope': 'https://www.googleapis.com/auth/plus.login'
    });
}

function googleSigninCallback(response) {
    if (typeof response.error === "undefined") {
        var e = document.getElementById("vote");
        var scope = angular.element(e).scope();
        scope.$apply(function () {
            scope.addVote();
        });
    }
}