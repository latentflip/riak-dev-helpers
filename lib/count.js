var filteredBuckets = require('./helpers/filtered-buckets');
var async = require('async');
var riak = require('./getriak');
var colors = require('colors');
var _ = require('underscore');

var isConsole = require('./is-console');

var countKeys = function (result, bucket, next) {
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (err) return next(err);

        if (isConsole) {
            console.log('Bucket:', bucket.blue, 'has', reply.keys.length.toString().blue, 'keys');
        } else {
            result[bucket] = reply.keys.length;
        }
        next(null, result);
    });
};

module.exports = function (/*[matchStrings...], done*/) {
    var matchStrings = _.toArray(arguments);
    var done = _.identity;
    if (_.isFunction(_.last(matchStrings))) done = matchStrings.pop();

    filteredBuckets(matchStrings, function (err, buckets) {
        async.reduce(buckets, {}, countKeys, done);
    });
};

module.exports.doc = "List count of keys in each bucket";
