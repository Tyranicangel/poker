'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('TableUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      table: {
        type: Sequelize.INTEGER,
        references:{
          model:'Tables',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      user: {
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      status:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      buyIn:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      currentChips:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      position:{
        type:Sequelize.INTEGER,
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
    return queryInterface.dropTable('TableUsers');
  }
};