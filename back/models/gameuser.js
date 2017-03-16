'use strict';
module.exports = function(sequelize, DataTypes) {
  var GameUser = sequelize.define('GameUser', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GameUser;
};