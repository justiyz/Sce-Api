
const db = require('../../sequelize/models');

const UserActivityLog = db.userActivityLog;

class LogQueries{

    static  createUserActivityLogs(user_id, activity_type, activity_status) {
        try {
          UserActivityLog.create({
              user_id: user_id,
              activity_type: activity_type,
              activity_status: activity_status,
              
            })
        } catch (error) {
            throw error;
        }
    }



}

module.exports = LogQueries;

