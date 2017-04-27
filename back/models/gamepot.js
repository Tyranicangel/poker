'use strict';
module.exports = function(sequelize, DataTypes) {
  var GamePot = sequelize.define('GamePot', {
      value:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      }
  }, {
    classMethods: {
      associate: function(models) {
        GamePot.belongsTo(models.Game);
        GamePot.hasMany(models.PotUser);
      }
    }
  });
  return GamePot;
};