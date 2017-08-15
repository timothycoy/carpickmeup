angular.module('carpickmeup.services.backendless', [])
    .factory('BackendlessService', function () {

        Backendless.initApp("C4CCD163-1F6E-A172-FFEC-F01E4BE88000", "ED230901-C86D-788D-FFBF-EDC598853900");

        var BackendlessService = {

            Vote: function Vote(args) {
                args = args || {};
                this.___class = 'Vote';
                this.decision = args.decision || "";
                this.message = args.message || "";
            },
            getVote: function getVote(data, callback) {
                var query = new Backendless.DataQueryBuilder.create();
                query.setWhereClause("google_id='" + data.user.id + "'");
                query.setRelated(["vote"]);

                Backendless.Persistence.of(Backendless.User).find(query)
                    .then(function (users) {
                        if (users.length > 0) {
                            callback(users[0].vote);
                        } else {
                            callback(null);
                        }
                    })
                    .catch(function (error) {
                        BackendlessService.logException("carpickmeup.services.backendless.BackendlessService.getVote", JSON.stringify(error));
                    })
            },
            saveVote: function insertVote(data, callback) {
                console.log('insert');
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
                        console.log(user);
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

                var legalQuery = new Backendless.DataQueryBuilder.create();
                legalQuery.setWhereClause("decision='legal'");

                Backendless.Persistence.of(BackendlessService.Vote).getObjectCount(legalQuery)
                    .then(function (legalVotes) {
                        count.legal = legalVotes;
                        var illegalQuery = new Backendless.DataQueryBuilder.create();
                        illegalQuery.setWhereClause("decision='illegal'");
                        
                        Backendless.Persistence.of(BackendlessService.Vote).getObjectCount(illegalQuery)
                            .then(function (illegalVotes) {
                                count.illegal = illegalVotes;
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
                var query = new Backendless.DataQueryBuilder.create();
                query.setWhereClause("vote.message != ''");
                query.setRelated(["vote"]);
                query.setPageSize(100);
                query.setSortBy(["created desc"]);

                Backendless.Persistence.of(Backendless.User).find(query)
                    .then(function (users) {
                        for (var i = 0; i < users.length; i++) {
                            comments.push({
                                decision: users[i].vote.decision,
                                message: users[i].vote.message,
                                name: users[i].name,
                                time: users[i].created
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
                console.log(exception);
                console.log(source);
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
