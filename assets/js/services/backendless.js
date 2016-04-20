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
                var query = new Backendless.DataQuery();
                query.condition = "google_id='" + data.user.id + "'";
                query.options = {
                    relationsDepth: 1
                };

                Backendless.Persistence.of(Backendless.User).find(query)
                    .then(function (users) {
                        callback(users.data[0].vote);
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
                var count = {
                    legal: 0,
                    illegal: 0
                };

                var legalQuery = new Backendless.DataQuery();
                legalQuery.condition = "decision='legal'";

                Backendless.Persistence.of(BackendlessService.Vote).find(legalQuery)
                    .then(function (legalVotes) {
                        count.legal = legalVotes.totalObjects;
                        var illegalQuery = new Backendless.DataQuery();
                        illegalQuery.condition = "decision='illegal'";
                        
                        Backendless.Persistence.of(BackendlessService.Vote).find(illegalQuery)
                            .then(function (illegalVotes) {
                                count.illegal = illegalVotes.totalObjects;
                                callback(count);
                            })
                            .catch(function (error) {
                                BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.countVotes", JSON.stringify(error));
                            })
                    })
                    .catch(function (error) {
                        BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.countVotes", JSON.stringify(error));
                    })
            },
            getComments: function getComments(callback) {
                var comments = [];
                var query = new Backendless.DataQuery();
                query.options = {
                    pageSize: 100,
                    relationsDepth: 1,
                    sortBy: "created desc"
                };

                Backendless.Persistence.of(Backendless.User).find(query)
                    .then(function (users) {
                        for (var i = 0; i < users.data.length; i++) {
                            comments.push({
                                decision: users.data[i].vote.decision,
                                message: users.data[i].vote.message,
                                name: users.data[i].name,
                                time: users.data[i].created
                            });
                        }
                        callback(comments);
                    })
                    .catch(function (error) {
                        BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.getComments", JSON.stringify(error));
                    })
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
