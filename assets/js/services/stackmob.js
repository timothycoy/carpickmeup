angular.module('carpickmeup.services.stackmob', [])
    .factory('StackMobService', function () {

        StackMob.init({
            publicKey: "51fdcaf7-31c1-4753-a63e-ded9a4dda15f",
            apiVersion: 1.0
        });

        var User = StackMob.Model.extend({ schemaName: "user" });
        var Users = StackMob.Collection.extend({ model: User });

        var Vote = StackMob.Model.extend({ schemaName: "vote" });
        var Votes = StackMob.Collection.extend({ model: Vote });

        var StackMobService = {
            getUser: function getUser(data, callback) {
                var user = new User({ user_id: data.user.id });

                user.fetch({
                    success: function (model, result, options) {
                        callback(result);
                    },
                    error: function (model, result, options) {
                        callback(null);
                    }
                });
            },
            getVote: function getVote(data, callback) {
                var user = new User({ user_id: data.user.id });

                user.fetchExpanded(1, {
                    success: function (model, result, options) {
                        if (result != null && result.vote_id != null) {
                            callback(result.vote_id);
                        }
                        else {
                            callback(null);
                        }
                    },
                    error: function (model, result, options) {
                        callback(null);
                    }
                });
            },
            saveVote: function insertVote(data, callback) {
                var user = new User({
                    user_id: data.user.id,
                    name: data.user.displayName
                });

                var votes = [
                    new Vote({
                        decision: data.decision,
                        message: data.message
                    })
                ];

                user.create({
                    success: function (model, result, options) {
                        user.addRelationship('vote_id', votes, {
                            success: function (model, result, options) {
                                callback(result);
                            },
                            error: function (model, result, options) {
                                //TODO: Log the error.
                            }
                        });
                    },
                    error: function (model, result, options) {
                        //TODO: Log the error.
                    }
                });
            },
            //TODO: Use stackmob count api call.  It was returning the wrong results for me.
            countVotes: function countVotes(callback) {
                var votes = new Votes();
                var count = {
                    legal: 0,
                    illegal: 0
                };

                var query = new StackMob.Collection.Query();
                query.select('decision');

                votes.query(query, {
                    success: function (model, result, options) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].decision == "legal") {
                                count.legal++;
                            }
                            else if (result[i].decision == "illegal") {
                                count.illegal++;
                            }
                        }
                        callback(count);
                    },
                    error: function (model, result, options) {
                        //TODO: Log the error.
                    }
                });
            },
            //TODO: Have StackMob update their documentation.  It makes no note that you must select the vote_id in order to select the vote_id fields.
            //TODO: Also, orderDesc doesn't appear to work based on referenced field.
            //TODO: Additionally, operators do not appear to work on referenced fields.
            getComments: function getComments(callback) {
                var comments = [];
                var users = new Users();
                var query = new StackMob.Collection.Query();
                query.setExpand(1);
                query.select('name').select('vote_id').select('vote_id.createddate').select('vote_id.decision').select('vote_id.message');
                query.isNotNull('vote_id');
                query.orderDesc('createddate');

                users.query(query, {
                    success: function (model, result, options) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].vote_id.message != null && result[i].vote_id.message != '') {
                                comments.push({
                                    decision: result[i].vote_id.decision,
                                    message: result[i].vote_id.message,
                                    name: result[i].name,
                                    time: result[i].vote_id.createddate
                                });
                            }
                        }
                        callback(comments);
                    },
                    error: function (model, result, options) {
                        //TODO: Log the error.
                    }
                });
            }
        };

        return StackMobService;
    });