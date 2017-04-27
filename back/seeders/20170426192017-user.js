'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // return queryInterface.bulkInsert("Users",[{
    //   username:"qwe",
    //   name:"qwe",
    //   email:"qwe@gmail.com",
    //   password:"489cd5dbc708c7e541de4d7cd91ce6d0f1613573b7fc5b40d3942ccb9555cf35",
    //   avatar:"../../../assets/default_avatar.jpg",
    //   verificationCode:"642603",
    //   isVerified:true,
    //   createdAt:new Date(),
    //   updatedAt:new Date()
    // },{
    //   username:"qwe1",
    //   name:"qwe",
    //   email:"qwe1@gmail.com",
    //   password:"489cd5dbc708c7e541de4d7cd91ce6d0f1613573b7fc5b40d3942ccb9555cf35",
    //   avatar:"../../../assets/default_avatar.jpg",
    //   verificationCode:"642604",
    //   isVerified:true,
    //   createdAt:new Date(),
    //   updatedAt:new Date()
    // },{
    //   username:"qwe2",
    //   name:"qwe",
    //   email:"qwe2@gmail.com",
    //   password:"489cd5dbc708c7e541de4d7cd91ce6d0f1613573b7fc5b40d3942ccb9555cf35",
    //   avatar:"../../../assets/default_avatar.jpg",
    //   verificationCode:"642605",
    //   isVerified:true,
    //   createdAt:new Date(),
    //   updatedAt:new Date()
    // }])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
