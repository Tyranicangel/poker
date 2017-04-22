'use strict';
module.exports = function(sequelize, DataTypes) {
  var Table = sequelize.define('Table', {
    name: {
        type: DataTypes.STRING,
        unique:true,
        allowNull:false
      },
      bigBlind:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      smallBlind:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      minBuyin:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      maxBuyin:{
        type: DataTypes.INTEGER,
        allowNull:false
      },
      status:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      socket:{
        type: DataTypes.STRING,
        unique:true,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        Table.hasMany(models.Chat, {as:'Chat'});
        Table.hasMany(models.Game, {as:'Game'});
        Table.hasMany(models.TableUser, {as:'People'});
      }
    }
  });
  return Table;
};