'use strict';

/** @type {import('sequelize-cli').Migration} */
const ActivityStatus = require('../models/enum/account_status');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserActivityTypes', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }   
    });

    await queryInterface.sequelize.query(`
        INSERT INTO "UserActivityTypes" (
          code,
          name,
          description,
          created_at,
          updated_at
        ) VALUES
        ('ADMLGR', 'user login request', 'user requests to login', NOW(), NOW()),
        ('ADMLGA', 'user login approved', 'user login request allowed using verified otp', NOW(), NOW()),
        ('ADMCRPD', 'user creates new password', 'user creates new password different from default password', NOW(), NOW());
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("UserActivityLogs");
    await queryInterface.dropTable("UserActivityTypes");

  }
};


