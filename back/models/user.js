'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique:true
    },
    name: {
      type: DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING,
      unique:true,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    avatar:{
      type:DataTypes.STRING,
    },
    verificationCode:{
      type:DataTypes.STRING,
      allowNull:false
    },
    isVerified:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    active:{
      type:DataTypes.BOOLEAN,
      defaultValue:true,
      allowNull:false
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasOne(models.UserChip);
      }
    }
  });
  return User;
};