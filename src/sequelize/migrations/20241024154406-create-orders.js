'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'user_id'
        },
        onDelete: 'CASCADE',
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      order_number: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Orders');
  }
};