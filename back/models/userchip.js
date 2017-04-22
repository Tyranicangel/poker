'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserChip = sequelize.define('UserChip', {
    value:{
        type: DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        UserChip.belongsTo(models.User);
      }
    }
  });
  return UserChip;
};