var riak = require('./getriak');
var _ = require('underscore');
var async = require('async');

var neverDelete = ['rekon'];

var listBucket = function (bucket, next) {
    console.log('\nListing:', bucket);
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (err) return next(err);
        async.eachSeries(reply.keys, function (key, done) {
            riak.get({ bucket: bucket, key: key }, function (err, reply) {
                console.log(reply.content[0].value);//[0].value;
                done();
            });
        }, function (err) {
            next(err);
        });
    });
};

riak.getBuckets(function (err, reply) {
    if (err) throw err;
    buckets = _.difference(reply.buckets, neverDelete);
    async.eachSeries(buckets, listBucket, function (err) {
        riak.disconnect();
        process.exit(0);
    });
});
