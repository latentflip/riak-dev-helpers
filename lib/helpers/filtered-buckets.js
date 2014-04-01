var riak = require('../getriak');
var matcher = require('./string-matcher');
var _ = require('underscore');

module.exports = function (matchStrings, done) {
    if (!done && typeof matchStrings === 'function') {
        done = matchStrings;
        matchStrings = [];
    }

    if (!done) {
        done = function () {};
    }

    riak.getBuckets(function (err, reply) {
        if (err) return done(err);

        var buckets = reply.buckets;       

        if (matchStrings.length > 0) {
            buckets = _.filter(buckets, function (bucket) {
                return _.some(matchStrings, function (matchString) {
                    return matcher(matchString).match(bucket);
                });
            });
        }

        done(null, buckets);
    });
};
