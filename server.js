var connect = require('connect');

connect.createServer(
  connect.static(__dirname)
).listen(8181);

console.log('Listening on http://localhost:8181/');