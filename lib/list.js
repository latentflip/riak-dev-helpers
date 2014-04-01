var riak = require('./getriak');
var _ = require('underscore');
var async = require('async');
var filteredBuckets = require('./helpers/filtered-buckets');

var neverDelete = ['rekon'];

var listBucket = function (bucket, next) {
    console.log('\nListing:', bucket);
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (err) return next(err);
        if (!reply.keys || !reply.keys.length) {
            console.log('Nothing in this bucket');
            return next('Nothing in this bucket');
        }
        async.eachSeries(reply.keys, function (key, done) {
            riak.get({ bucket: bucket, key: key }, function (err, reply) {
                if (!reply.content || !reply.content[0]) return done();
                console.log(key, JSON.stringify(reply.content[0].value).slice(0,100));
                done();
            });
        }, function (err) {
            next(err);
        });
    });
};

module.exports = function (/*[buckets...], done*/) {
    var buckets = _.toArray(arguments);
    var done = _.identity;
    if (_.isFunction( _.last(buckets) )) done = buckets.pop();

    filteredBuckets(buckets, function (err, buckets) {
        if (err || !buckets || !buckets.length) return done(err);

        console.log('Found buckets', buckets);
        async.eachSeries(buckets, listBucket, function () {
            done();
        });
    });
};

module.exports.doc = "List contents of all, or some, buckets";
