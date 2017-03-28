'use strict';
module.exports = function(sequelize, DataTypes) {
  var Password = sequelize.define('Password', {
      link: {
        type: DataTypes.STRING,
      },
      oldPassword: {
        type: DataTypes.STRING
      },
      newPassword: {
        type: DataTypes.STRING
      }
  }, {
    classMethods: {
      associate: function(models) {
        Password.belongsTo(models.User);
      }
    }
  });
  return Password;
};