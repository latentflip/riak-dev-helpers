var riak = require('riakpbc').createClient({
    host: 'localhost',
    port: 8087
});

module.exports = riak;
