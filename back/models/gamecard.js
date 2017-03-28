'use strict';
module.exports = function(sequelize, DataTypes) {
  var GameCard = sequelize.define('GameCard', {
      type:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
      }
  }, {
    classMethods: {
      associate: function(models) {
        GameCard.belongsTo(models.Game);
        GameCard.belongsTo(models.Card);
      }
    }
  });
  return GameCard;
};