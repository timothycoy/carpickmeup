angular.module('carpickmeup.services.google', [])
    .factory('GoogleAnalyticsService', function () {

        _gaq.push(['_setAccount', 'UA-40114880-1']);
        _gaq.push(['_trackPageview']);

        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);

        var GoogleAnalyticsService = {

        };

        return GoogleAnalyticsService;
    })
    .factory('GooglePlusService', function () {

        var po = document.createElement('script');
        po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/platform.js?onload=googleInit';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);

        var GooglePlusService = {
            getUser: function getUser(callback) {
                callback({
                    id: gapi.auth2.getAuthInstance().currentUser.get().getId(),
                    displayName: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
                });
            }
        };

        return GooglePlusService;
    });

var _gaq = _gaq || [];

function googleInit() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '64456653882.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile email'
        });

        auth2.attachClickHandler(document.getElementById('signinButton'), {}, googleSigninSuccessCallback);
    });
}

function googleSigninSuccessCallback() {
    var e = document.getElementById("vote");
    var scope = angular.element(e).scope();
    scope.$apply(function () {
        scope.addVote();
    });
}
