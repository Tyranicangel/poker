'use strict';
module.exports = function(sequelize, DataTypes) {
  var PotUser = sequelize.define('PotUser', {
    winner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
  }, {
    classMethods: {
      associate: function(models) {
        PotUser.belongsTo(models.GamePot);
        PotUser.belongsTo(models.GameUser);
      }
    }
  });
  return PotUser;
};