'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserPlay = sequelize.define('UserPlay', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserPlay;
};