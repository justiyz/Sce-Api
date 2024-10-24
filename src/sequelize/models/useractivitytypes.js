'use strict';


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserActivityTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  UserActivityTypes.init({
    id: {
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // code: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   references: {
    //     model: 'UserActivityLogs',
    //     key: 'code'
    //   },
    //   onDelete: 'CASCADE',
    // },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }   
  }, {
    sequelize,
    modelName: 'UserActivityTypes',
    tableName: 'UserActivityTypes',
    underscored: true,
  });
  return UserActivityTypes;
};