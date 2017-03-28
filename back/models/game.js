'use strict';
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
  }, {
    classMethods: {
      associate: function(models) {
        Game.belongsTo(models.Table);
        Game.hasMany(models.GameCard, {as:'GameCard'});
        Game.hasMany(models.GamePot, {as:'Pot'});
        Game.hasMany(models.GameUser, {as:'Player'});
      }
    }
  });
  return Game;
};