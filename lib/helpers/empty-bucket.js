var riak = require('../getriak');
var async = require('async');

module.exports = function (bucket, next) {
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (err) {
            console.log('Got error', err);
            return next(err);
        }
        var keys = reply.keys || [];

        async.map(keys, function (key, done) {
            riak.del({ bucket: bucket, key: key }, function (err) {
                done(err);
            });
        }, function (err) {
            next(err);
        });
    });
};
