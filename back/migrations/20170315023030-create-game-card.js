'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GameCards', {
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
      card: {
        type: Sequelize.INTEGER,
        references:{
          model:'Cards',
          key:'id'
        },
        onUpdate:'cascade',
        onDelete:'cascade'
      },
      type:{
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue:1
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
    return queryInterface.dropTable('GameCards');
  }
};