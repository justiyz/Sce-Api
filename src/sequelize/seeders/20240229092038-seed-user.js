'use strict';

const UserQueries = require('../../user/queries/queries.user')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    const user_id = await UserQueries.generateUniqueUserId();//WIP

  },

  async down(queryInterface, Sequelize) {

  }
};