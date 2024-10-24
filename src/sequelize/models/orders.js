'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orders.init({
    order_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      },
      onDelete: 'CASCADE',
    },
    amount: DataTypes.DECIMAL,
    status: {
      allowNull: false,
      type: DataTypes.STRING
    },
    order_number: {
      allowNull: false,
      type: DataTypes.STRING
    },
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Orders',
    tableName: 'Orders',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return Orders;
};