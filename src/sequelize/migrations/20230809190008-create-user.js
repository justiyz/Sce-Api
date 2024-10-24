'use strict';
/** @type {import('sequelize-cli').Migration} */
const AccountStatus = require('../models/enum/account_status')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      middle_name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      verification_text: {
        type: Sequelize.STRING
      },
      verification_token_expires: {
        type: Sequelize.DATE
      },
      password: {
        type: Sequelize.TEXT
      },
      is_verified_phone_number: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      is_verified_email: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      is_created_password: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      is_completed_kyc: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      refresh_token: {
        type: Sequelize.TEXT
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      status: {
        type: Sequelize.ENUM(AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.DEACTIVATED,
          AccountStatus.OVERDUE, AccountStatus.SUSPENDED, AccountStatus.BLACKLISTED, AccountStatus.WATCHLISTED),
        default: AccountStatus.INACTIVE,
      },

      verification_token_request_count: {
        type: Sequelize.INTEGER,
        default: 0
      },
      invalid_verification_token_count: {
        type: Sequelize.INTEGER,
        default: 0
      },
      deleted_at: {type: Sequelize.DATE},
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
    await queryInterface.dropTable('Users');
  }
};