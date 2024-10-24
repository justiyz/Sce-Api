'use strict';

const ActivityStatus = require('./enum/activity_status');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserActivityLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserActivityLogs.init({
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity_status: {
      type: DataTypes.ENUM(ActivityStatus.FAIL, ActivityStatus.SUCCESS)
    },
    description: {
      type: DataTypes.TEXT
    },
    deleted_at: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'UserActivityLogs',
    tableName: 'UserActivityLogs',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at'
  });
  return UserActivityLogs;
};