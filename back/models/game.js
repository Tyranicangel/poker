'use strict';
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
    status:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
      }
  }, {
    classMethods: {
      associate: function(models) {
        Game.belongsTo(models.Table);
        Game.hasMany(models.GameCard);
        Game.hasMany(models.GamePot);
        Game.hasMany(models.GameUser);
      }
    }
  });
  return Game;
};