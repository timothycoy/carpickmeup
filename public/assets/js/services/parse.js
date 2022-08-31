angular.module('carpickmeup.services.parse', [])
    .factory('ParseService', function () {

        Parse.initialize("EEZwxFScgMUQUxlCsBPIFlvQ3qxtzyk9MaefNss3", "jmBQ7gSx1aZZ0UwGFgi33d5SKs8Md4l6sbTkimDs");

        var User = Parse.Object.extend({ className: "user" });
        var Users = Parse.Collection.extend({ model: User });

        var Vote = Parse.Object.extend({ className: "vote" });
        var Votes = Parse.Collection.extend({ model: Vote });

        var Log = Parse.Object.extend({ className: "log" });
        var Logs = Parse.Collection.extend({ model: Log });

        var ParseService = {

            getVote: function getVote(data, callback) {
                var query = new Parse.Query(Vote);
                var innerQuery = new Parse.Query(User);

                innerQuery.equalTo("user_id", data.user.id);
                query.matchesQuery("user", innerQuery);

                query.first({
                    success: function (vote) {
                        callback(vote);
                    },
                    error: function (error) {
                        ParseService.logException("carpickmeup.services.parse.ParseService.getVote", JSON.stringify(error));
                    }
                });
            },
            saveVote: function insertVote(data, callback) {
                var user = new User();
                user.set("user_id", data.user.id);
                user.set("name", data.user.displayName);

                var vote = new Vote();
                vote.set("decision", data.decision);
                vote.set("message", data.message);
                vote.set("user", user);

                vote.save(null, {
                    success: function (vote) {
                        callback(vote);
                    },
                    error: function (vote, error) {
                        ParseService.logException("carpickmeup.services.parse.ParseService.saveVote", JSON.stringify(error));
                    }
                });
            },
            countVotes: function countVotes(callback) {
                var count = {
                    legal: 0,
                    illegal: 0
                };

                var query = new Parse.Query(Vote);
                query.equalTo("decision", "legal");
                query.count({
                    success: function (countLegal) {
                        count.legal = countLegal;
                        var query = new Parse.Query(Vote);
                        query.equalTo("decision", "illegal");
                        query.count({
                            success: function (countIllegal) {
                                count.illegal = countIllegal;
                                callback(count);
                            },
                            error: function (error) {
                                ParseService.logException("carpickmeup.services.parse.ParseService.getVote", JSON.stringify(error));
                            }
                        });
                    },
                    error: function (vote, error) {
                        ParseService.logException("carpickmeup.services.parse.ParseService.countVotes", JSON.stringify(error));
                    }
                });
            },
            getComments: function getComments(callback) {
                var comments = [];
                var query = new Parse.Query(Vote);

                query.include("user");
                query.descending("createdAt");
                query.find({
                    success: function (results) {
                        for (var i = 0; i < results.length; i++) {
                            comments.push({
                                decision: results[i].get("decision"),
                                message: results[i].get("message"),
                                name: results[i].get("user").get("name"),
                                time: results[i].createdAt
                            });
                        }
                        callback(comments);
                    },
                    error: function (error) {
                        ParseService.logException("carpickmeup.services.parse.ParseService.getComments", JSON.stringify(error));
                    }
                });
            },
            logException: function logException(source, exception) {
                var log = new Log();
                log.set("source", source);
                log.set("exception", exception);

                log.save(null, {
                    success: function (log) {

                    },
                    error: function (log, error) {
                        console.log(error.description);
                    }
                });
            }
        };

        return ParseService;
    });
