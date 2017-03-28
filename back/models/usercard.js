'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserCard = sequelize.define('UserCard', {
  }, {
    classMethods: {
      associate: function(models) {
        UserCard.belongsTo(models.GameUser);
        UserCard.belongsTo(models.Card);
      }
    }
  });
  return UserCard;
};