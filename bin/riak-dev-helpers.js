#!/usr/bin/env node
var fn = process.argv[2];
var path = require('path');

require(path.join(__dirname, '..', 'lib', fn));
