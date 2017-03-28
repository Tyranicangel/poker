'use strict';
module.exports = function(sequelize, DataTypes) {
  var Reward = sequelize.define('Reward', {
      value:{
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        Reward.belongsTo(models.User);
      }
    }
  });
  return Reward;
};