'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', 
     
      });
    }
  }
  Token.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    token: DataTypes.STRING,
    token_expiration: DataTypes.DATE,
    user_id: {
      type: DataTypes.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    phone_number: {
      type: DataTypes.STRING
    },
    deleted_at: {
      type: DataTypes.DATE
    },

  }, {
    sequelize,
    modelName: 'Token',
    tableName: 'Tokens',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return Token;
};