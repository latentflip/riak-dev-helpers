var riak = require('./getriak');
var _ = require('underscore');

module.exports = function (bucket, index, key, done) {
    done = done || _.identity;

    riak.get({ bucket: bucket, index: index, qtype: 0, key: key }, function (err, reply) {
        if (err) return done(err);
        if (isConsole) {
            console.log(JSON.stringify(reply, null, 2));
        }

        done(null, reply);
    });
};

module.exports.doc = "Get item by an index";
