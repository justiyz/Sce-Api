'use strict';

const ActivityStatus = require('../models/enum/activity_status');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserActivityLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activity_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      activity_status: {
        type: Sequelize.ENUM(ActivityStatus.FAIL, ActivityStatus.SUCCESS)
      },
      description: {
        type: Sequelize.TEXT
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserActivityLogs');
  }
};