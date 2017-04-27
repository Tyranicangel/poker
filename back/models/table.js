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
      }
  }, {
    classMethods: {
      associate: function(models) {
        Table.hasMany(models.Chat);
        Table.hasMany(models.Game);
        Table.hasMany(models.TableUser);
      }
    }
  });
  return Table;
};