var request = require('request');

module.exports = function (env, authUri) {
  return {
    
    // Auth middleware
    middleware: {
      whitelistOnly: function (req, res, next) {
        return next();
      }
    }

  }
};
