'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reward = sequelize.define('Reward', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Reward;
};