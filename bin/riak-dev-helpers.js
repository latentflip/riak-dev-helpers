#!/usr/bin/env node
var path = require('path');
var riak = require('../lib/getriak');

var fn = process.argv[2];
var args = process.argv.slice(3);

if (fn === 'doc') {
    return doc(args[0]);
} else {
    runScript(fn, args);
}

function requireScript (name) {
    return require(path.join(__dirname, '..', 'lib', name));
}

function doc (name) {
    var script = requireScript(name);
    console.log(script.doc);
    console.log('rdh', name, getArgs(script));
}

function runScript (name, args) {
    process.env.RDH_CONSOLE = 'console';
    var script = requireScript(name);

    args.push(function () {
        riak.disconnect();
        process.exit(0);
    });

    if (typeof script === 'function') {
        script.apply(script, args);
    }
}

function getArgs (fn) {
    fn = fn.toString();
    var reggy = /function\s*[^(]*\(([^)]*)\)/;
    var match = fn.match(reggy);
    var args = match[1];
    args = args.replace(/\/\*/g, '').replace(/\*\//g, '').replace(/\s*,\s*/g, ' ');
    return args;
}
