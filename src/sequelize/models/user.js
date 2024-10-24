'use strict';


const AccountStatus = require('./enum/account_status')
const {Model, DataTypes} = require('sequelize');



module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      User.hasOne(models.Token, {
        foreignKey: 'user_id',
        as: 'token',
      });
      

    }


  }

  User.init({

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {isEmail: true, },
    },
    gender: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    address: DataTypes.TEXT,
    verification_text: DataTypes.STRING,
    verification_token_expires: DataTypes.DATE,
    password: {type: DataTypes.TEXT, },
    is_verified_phone_number: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_verified_email: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_created_password: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_completed_kyc: {type: DataTypes.BOOLEAN, defaultValue: false},
    refresh_token: DataTypes.TEXT,  
    is_deleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    status: {
      type: DataTypes.ENUM(AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.DEACTIVATED,
        AccountStatus.OVERDUE, AccountStatus.SUSPENDED, AccountStatus.BLACKLISTED, AccountStatus.WATCHLISTED),
      defaultValue: AccountStatus.INACTIVE,
    },
    deleted_at: DataTypes.DATE,
    
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    deletedAt: 'deleted_at'
  });
  return User;
};