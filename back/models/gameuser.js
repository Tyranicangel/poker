'use strict';
module.exports = function(sequelize, DataTypes) {
  var GameUser = sequelize.define('GameUser', {
      status:{
        type: DataTypes.INTEGER,
        defaultValue:1
      },
      isBigBlind:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
      },
      isSmallBlind:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
      },
      isDealer:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
      },
      isCurrent:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        GameUser.belongsTo(models.Game);
        GameUser.belongsTo(models.TableUser);
        GameUser.hasMany(models.UserCard);
        GameUser.hasMany(models.UserPlay);
      }
    }
  });
  return GameUser;
};