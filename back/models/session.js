'use strict';
module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
      jwtCode:{
        type: DataTypes.STRING,
        allowNull: false
      },
      expiry: {
        type: DataTypes.DATE,
        allowNull: false
      }
  }, {
    classMethods: {
      associate: function(models) {
        Session.belongsTo(models.User);
      }
    }
  });
  return Session;
};