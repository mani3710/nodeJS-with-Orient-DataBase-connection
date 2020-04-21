var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   '123'
});
//console.log("server",server);
module.exports = server.use({
    name:     'vienna',
   
 });