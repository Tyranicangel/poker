'use strict';
module.exports = function(sequelize, DataTypes) {
  var Password = sequelize.define('Password', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Password;
};