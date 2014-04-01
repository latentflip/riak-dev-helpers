var riak = require('./getriak');

module.exports = function (bucket, key) {
    riak.del({ bucket: bucket, key: key }, function (err, reply) {
        console.log(JSON.stringify(reply, null, 2));
        riak.disconnect();
    });
};

module.exports.doc = "Delete a key from a bucket";
