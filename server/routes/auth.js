var request = require('request');

module.exports = function (env, authUri) {
  return {
    
    // Auth middleware
    middleware: {
      whitelistOnly: function (req, res, next) {
        var whitelist = env.get('WHITELIST');
        var err;
        if (env.get('DEV')) {
          return next();
        }
       
        if (req.session.user.login && whitelist.indexOf(req.session.user.login.toLowerCase()) > -1) {
          return next();
        }
      }
    }

  }
};
