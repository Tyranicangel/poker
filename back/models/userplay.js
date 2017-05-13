'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserPlay = sequelize.define('UserPlay', {
    playType:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      betAmount:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      gameStatus:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1
      }
  }, {
    classMethods: {
      associate: function(models) {
        UserPlay.belongsTo(models.GameUser);
      }
    }
  });
  return UserPlay;
};