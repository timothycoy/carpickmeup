angular.module('carpickmeup.services.google', [])
    .factory('GooglePlusService', function () {

        (function () {
            var po = document.createElement('script');
            po.type = 'text/javascript'; po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js?onload=googleRender';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s);
        })();

        var GooglePlusService = {
            getUser: function getUser(callback) {
                gapi.client.load('plus', 'v1', function () {
                    gapi.client.plus.people.get({ 'userId': 'me' }).execute(callback);
                });
            }
        };

        return GooglePlusService;
    })
    .factory('GoogleAnalyticsService', function () {

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-40114880-1']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

        var GoogleAnalyticsService = {

        };

        return GoogleAnalyticsService;
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