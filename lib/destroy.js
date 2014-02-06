var riak = require('./getriak');
var _ = require('underscore');
var async = require('async');

var neverDelete = ['rekon'];

var emptyBucket = function (bucket, next) {
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (err) return next(err);
        async.map(reply.keys, function (key, done) {
            riak.del({ bucket: bucket, key: key }, function (err) {
                done(err);
            });
        }, function (err) {
            console.log('Emptied', bucket);
            next(err);
        });
    });
};

riak.getBuckets(function (err, reply) {
    if (err) throw err;
    buckets = _.difference(reply.buckets, neverDelete);
    console.log('Emptying', buckets);
    async.map(buckets, emptyBucket, function (err) {
        riak.disconnect();
        process.exit(0);
    });
});
