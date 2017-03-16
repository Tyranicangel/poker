'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserChip = sequelize.define('UserChip', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserChip;
};