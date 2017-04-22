'use strict';
module.exports = function(sequelize, DataTypes) {
  var Chip = sequelize.define('Chip', {
      name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      value:{
        type: DataTypes.INTEGER,
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
        // associations can be defined here
      }
    }
  });
  return Chip;
};