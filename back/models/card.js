'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
      name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      value:{
        type: DataTypes.STRING,
        allowNull:false
      },
      suit:{
        type: DataTypes.STRING,
        allowNull:false
      },
      spriteX:{
        type: DataTypes.STRING,
        allowNull:false
      },
      spriteY:{
        type: DataTypes.STRING,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Card;
};