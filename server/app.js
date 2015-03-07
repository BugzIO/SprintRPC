var Habitat = require('habitat');

Habitat.load();

// Configuration
var env = new Habitat();

// App
var app = require('./server')();

// Run server
app.listen(1337, function () {
  console.log('Now listening on %d', 1337);
});
