module.exports = function(env, app, dbInit, bugzilla, authUri) {
  var path = require('path');
  var db = require('./dbController')(dbInit);
  var auth = require('./auth')(env, authUri);
  var bz = require('./bz')(bugzilla);

  /*********************************************************
  * Config
  */

  // Serve up virtual configuration "file"
  app.get('/config.js', function (req, res) {

    var config = {};
    config.csrf = req.csrfToken();

    res.type('js');
    res.send('window.angularConfig = ' + JSON.stringify(config) + ';');
  });
  /*********************************************************
  * Angular
  */

  var angularRoute = function (req, res) {
    res.sendfile(path.resolve('./app/index.html'));
  };

  // Pages
  app.get('/', angularRoute);
  app.get('/add', angularRoute);
  app.get('/sprint/:id', angularRoute);
  app.get('/sprint/:id/edit', angularRoute);
  app.get('/sprint/:id/:milestone', angularRoute);
  app.get('/archived', angularRoute);


  /*********************************************************
  * Sprinter db
  */
  app.get('/api/sprints', db.get.all);
  app.get('/api/sprint/:id', db.get.id);

  // Protected routes
  app.post('/api/sprint', auth.middleware.whitelistOnly, db.post);
  app.put('/api/sprint/:id', auth.middleware.whitelistOnly, db.put);
  app.delete('/api/sprint/:id', auth.middleware.whitelistOnly, db.delete);

  /*********************************************************
  * Bugzilla
  */
  app.get('/bugs', bz.bugs);
  app.get('/flags', bz.flags);

  /*********************************************************
  * 404 page
  */
  
  app.get('/error',angularRoute);
  app.get('*',angularRoute);
};
