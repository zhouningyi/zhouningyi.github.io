var querystring = require('querystring');
var path = require('path');
var connect = require('connect');
var urllib = require('urllib');


var app = connect();
app.use(connect.static(path.join(__dirname, "../")));
app.use(connect.directory(path.join(__dirname, "../")));
app.use(connect.query());
app.listen(8886);
console.log("localhost:8886 run...");
