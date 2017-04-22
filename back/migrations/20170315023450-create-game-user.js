'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('GameUsers', {
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
        type: Sequelize.INTEGER,
        defaultValue:1
      },
      isBigBlind:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      isSmallBlind:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      isDealer:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      isCurrent:{
        type: Sequelize.BOOLEAN,
        defaultValue:false
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
    return queryInterface.dropTable('GameUsers');
  }
};