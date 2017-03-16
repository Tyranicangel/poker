'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserCard = sequelize.define('UserCard', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserCard;
};