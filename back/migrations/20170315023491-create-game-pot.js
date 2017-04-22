'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GamePots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game: {
        type: Sequelize.INTEGER,
        references:{
          model:'Games',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      value:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      },
      winner: {
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
    return queryInterface.dropTable('GamePots');
  }
};