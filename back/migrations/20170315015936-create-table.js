'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false
      },
      bigBlind:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      smallBlind:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      socket:{
        type: Sequelize.STRING,
        unique:true,
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
    return queryInterface.dropTable('Tables');
  }
};