var Habitat = require('habitat');

Habitat.load();

// Configuration
var env = new Habitat();

// Heroku clearbase support
if (!env.get('DB_CONNECTIONSTRING') && env.get('cleardbDatabaseUrl')) {
  env.set('DB_CONNECTIONSTRING', env.get('cleardbDatabaseUrl').replace('?reconnect=true', ''));
}

// App
var app = require('./server')(env);

// Run server
app.listen(1337, function () {
  console.log('Now listening on %d', 1337);
});
