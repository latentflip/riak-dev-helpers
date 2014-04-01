var riak = require('./getriak');
var args = process.argv.slice(3);
var bucket = args[0];
var key = args[1];
var isConsole = require('./is-console');

module.exports = function (bucket, key, done) {
    done = done || function () {};
    riak.get({ bucket: bucket, key: key }, function (err, reply) {
        if (err) return done(err);

        if (isConsole) {
            console.log(JSON.stringify(reply, null, 2));
        }

        done(null, reply);
    });
};

module.exports.doc = "Get a key from a bucket";
