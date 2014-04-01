var riak = require('./getriak');
var _ = require('underscore');
var async = require('async');

var emptyBucket = require('./helpers/empty-bucket');

module.exports = function () {
    riak.getBuckets(function (err, reply) {
        if (err) throw err;
        async.map(reply.buckets, emptyBucket, function (err) {
            riak.disconnect();
            process.exit(0);
        });
    });
};

module.exports.doc = "Empty entire riak database.";
