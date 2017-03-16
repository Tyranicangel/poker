'use strict';
module.exports = function(sequelize, DataTypes) {
  var Chat = sequelize.define('Chat', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Chat;
};