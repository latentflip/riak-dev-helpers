/* jshint expr: true */

var Lab = require('lab');
var async = require('async');

var riakpbc = require('riakpbc');
var client = riakpbc.createClient({
    host: 'localhost',
    port: 8087
});
var put = function (bucket, key, value, done) {
    client.put({
        bucket: bucket,
        key: key,
        content: {
            value: JSON.stringify(value),
            content_type: 'application/json'
        }
    }, done);
};
var del = function (bucket, key, value, done) {
    client.del({ bucket: bucket, key: key }, done);
};

var describe = Lab.experiment;
var it = Lab.test;
var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var beforeEach = Lab.beforeEach;
var afterEach = Lab.afterEach;

var rdh = require('./index');

var expectExists = function (bucket, key, done) {
    rdh.get(bucket, key, function (err, reply) {
        expect(reply.content).to.exist;
        done();
    });
};
var expectNotExists = function (bucket, key, done) {
    rdh.get(bucket, key, function (err, reply) {
        console.log(bucket, key, reply);
        expect(reply.content).to.not.exist;
        done();
    });
};

describe('RDH', function () {
    before(function (done) {
        async.parallel([
            put.bind(put, 'rdh::test::foo', 'a', 1),
            put.bind(put, 'rdh::test::foo', 'b', 1),
            put.bind(put, 'rdh::test::bar', 'a', 1),
        ], done);
    });

    //after(function (done) {
    //    async.parallel([
    //        del.bind(del, 'rdh::test::foo', 'a', 1),
    //        del.bind(del, 'rdh::test::foo', 'b', 1),
    //        del.bind(del, 'rdh::test::bar', 'a', 1),
    //    ], done);
    //});

    describe('rdh.listBuckets', function () {
        it('lists buckets', function (done) {
            rdh.listBuckets('rdh::*', function (err, buckets) {
                expect(buckets).to.deep.equal(['rdh::test::foo', 'rdh::test::bar']);
                done();
            });
        });
    });

    describe('rdh.count', function () {
        it('lists bucket counts', function (done) {
            rdh.count('rdh::*', function (err, buckets) {
                expect(buckets['rdh::test::foo']).to.equal(2);
                expect(buckets['rdh::test::bar']).to.equal(1);
                done();
            });
        });
    });

    describe('rdh.empty', function () {
        it('empties buckets', function (done) {
            rdh.empty('rdh::test:f*', function (err) {
            });
        });
    });

});
