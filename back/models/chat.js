'use strict';
module.exports = function(sequelize, DataTypes) {
  var Chat = sequelize.define('Chat', {
      message:{
        type: DataTypes.TEXT,
        allowNull:false
      }
  }, {
    classMethods: {
      associate: function(models) {
        Chat.belongsTo(models.TableUser);
        Chat.belongsTo(models.Table);
      }
    }
  });
  return Chat;
};