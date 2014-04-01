var riak = require('./getriak');
var async = require('async');
var filteredBuckets = require('./helpers/filtered-buckets');
var emptyBucket = require('./helpers/empty-bucket');
var args = process.argv.slice(3);
var _ = require('underscore');

var buckets = args;

module.exports = function (/*buckets..., [done]*/) {
    var buckets = _.toArray(arguments);
    var done = _.identity;
    if (_.isFunction( _.last(buckets) )) done = buckets.pop();

    if (_.isEmpty(buckets)) {
        console.log('Need at least one bucket to empty');
        return done('Need at least one bucket to empty');
    }

    filteredBuckets(buckets, function (err, buckets) {
        if (err) return done(err);

        async.map(buckets, emptyBucket, function () {
            done();
        });
    });
};

module.exports.doc = "Empty listed buckets.";
