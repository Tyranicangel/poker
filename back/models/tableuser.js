'use strict';
module.exports = function(sequelize, DataTypes) {
  var TableUser = sequelize.define('TableUser', {
      status:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      buyIn:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      currentChips:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      position:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      }
  }, {
    classMethods: {
      associate: function(models) {
        TableUser.belongsTo(models.Table);
        TableUser.belongsTo(models.User);
      }
    }
  });
  return TableUser;
};