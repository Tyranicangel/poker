'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('PotUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pot: {
        type: Sequelize.INTEGER,
        references:{
          model:'GamePots',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
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
    return queryInterface.dropTable('PotUsers');
  }
};