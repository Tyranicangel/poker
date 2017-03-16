'use strict';
module.exports = function(sequelize, DataTypes) {
  var TableUser = sequelize.define('TableUser', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TableUser;
};