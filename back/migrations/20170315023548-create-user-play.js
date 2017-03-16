'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('UserPlays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.INTEGER,
        references:{
          model:'GameUsers',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      playType:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
      },
      betAmount:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
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
    return queryInterface.dropTable('UserPlays');
  }
};