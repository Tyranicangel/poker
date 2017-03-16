'use strict';
module.exports = function(sequelize, DataTypes) {
  var PotUser = sequelize.define('PotUser', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PotUser;
};