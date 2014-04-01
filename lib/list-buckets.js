var riak = require('./getriak');
var _ = require('underscore');
var colors =  require('colors');
var filteredBuckets = require('./helpers/filtered-buckets');

var isConsole = require('./is-console');

module.exports = function (/*[match...], [done]*/) {
    var matchStrings = _.toArray(arguments);
    var done = _.identity;
    if (_.isFunction(_.last(matchStrings))) done = matchStrings.pop();

    filteredBuckets(matchStrings, function (err, buckets) {
        if (err) return done(err);

        if (isConsole) {
            console.log('Buckets:'.bold);
            console.log(buckets.sort().join('\n'));
        }

        done(null, buckets);
    });
};
