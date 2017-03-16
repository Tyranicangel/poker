'use strict';
module.exports = function(sequelize, DataTypes) {
  var GameCard = sequelize.define('GameCard', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GameCard;
};