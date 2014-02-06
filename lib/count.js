var async = require('async');
var riak = require('./getriak');

var countKeys = function (bucket, next) {
    riak.getKeys({ bucket: bucket }, function (err, reply) {
        if (!err) console.log('Bucket: ', bucket, 'has', reply.keys.length, 'keys');
        next(err);
    });
};


riak.getBuckets(function (err, reply) {
    async.map(reply.buckets, countKeys, function (err) {
        if (err) throw err;
        riak.disconnect();
        process.exit(0);
    });
});
