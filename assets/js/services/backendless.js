angular.module('carpickmeup.services.backendless', [])
    .factory('BackendlessService', function () {

        Backendless.initApp("48FB06E8-E74D-B632-FFFA-922A7FC5B000", "ED230901-C86D-788D-FFBF-EDC598853900", "v1")
        Backendless.enablePromises();

        var BackendlessService = {

            Vote: function Vote(args) {
                args = args || {};
                this.___class = 'Vote';
                this.decision = args.decision || "";
                this.message = args.message || "";
            },
            getVote: function getVote(data, callback) {
                console.log(data);
                var query = new Backendless.DataQuery();
                query.condition = "google_id=" + data.user.id;

                Backendless.Persistence.of(Backendless.UserService).findFirst(query)
                    .then(function (user) {
                        console.log(user.vote);
                        callback(user.vote);
                    })
                    .catch(function (error) {
                        BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.getVote", JSON.stringify(error));
                    })
            },
            saveVote: function insertVote(data, callback) {
                var user = new Backendless.User();
                user.google_id = data.user.id;
                user.name = data.user.displayName;
                user.password = Math.random().toString(36).substr(2, 8);

                var vote = new BackendlessService.Vote({
                    decision: data.decision,
                    message: data.message
                });

                user.vote = vote;

                Backendless.UserService.register(user)
                    .then(function (user) {
                        callback(user.vote);
                    })
                    .catch(function (error) {
                        BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.saveVote", JSON.stringify(error));
                    })
            },
            countVotes: function countVotes(callback) {

            },
            getComments: function getComments(callback) {

            },
            Log: function Log(args) {
                args = args || {};
                this.source = args.source || "";
                this.exception = args.exception || "";
            },
            logException: function logException(source, exception) {
                var log = new BackendlessService.Log({
                    source: source,
                    exception: exception
                });

                Backendless.Persistence.of(BackendlessService.Log).save(log)
                    .then(function (log) {

                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        };

        return BackendlessService;
    });
