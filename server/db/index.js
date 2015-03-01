var Sequelize = require('sequelize');

module.exports = function(options) {
  
  var sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: 'sprinter.sqlite'
  });

  // Import models
  var Sprint = sequelize.import(__dirname + '/sprint.js');

  // Sync
  sequelize.sync().complete(function (err) {
    if (err) {
      console.log(err.stack);
    } else {
      console.log('Successfully synced.')
    }
  });

  // Export models
  return {
    sprint: Sprint
  };

};
