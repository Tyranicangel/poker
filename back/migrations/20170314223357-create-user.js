'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique:true
      },
      name: {
        type: Sequelize.STRING
      },
      email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
      },
      password:{
        type:Sequelize.STRING,
        allowNull:false
      },
      avatar:{
        type:Sequelize.STRING,
      },
      verificationCode:{
        type:Sequelize.STRING,
        allowNull:false
      },
      isVerified:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
      },
      active:{
        type:Sequelize.BOOLEAN,
        defaultValue:true,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};