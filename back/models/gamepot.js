'use strict';
module.exports = function(sequelize, DataTypes) {
  var GamePot = sequelize.define('GamePot', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GamePot;
};