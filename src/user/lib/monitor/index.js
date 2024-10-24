const logger = require('../../../logger/logger');
const UserLogQueries = require('../../queries/queries.log');
const {operations} = require('./lib.monitor.operations');


const monitor = async(activity_status, type, operation, user_id) => {
  try {
    UserLogQueries.createUserActivityLogs(user_id, operation, activity_status)
    return logger.info(`${type}: activity ${operation} for ${user_id} tracked`);
  } catch (error) {
    logger.error(error);
    return logger.info(`${type}: activity ${operation} for ${user_id} not tracked`);
  }
};

module.exports.userActivityTracking = (user_id, op_code, activity_status) => {
  if (user_id) {
    const operation = operations[op_code];
    return monitor(activity_status, 'userActivityTracking', operation, user_id);
  }
};

