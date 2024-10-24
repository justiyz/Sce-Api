const db = require('../../sequelize/models');
const {successResponse, errorResponse} = require('../helpers/response');
require('dotenv').config();


const logger = require('../../logger/logger');
const enums = require('../lib/enums');
const UserQueries = require('../queries/queries.user');

const dayjs = require('dayjs');




const User = db.user;


class UserController {


  static async getUserProfile(req, res, next) {
    const {user_id, user} = req;
    logger.info(`${ user.user_id }:::Info: now trying to fetch user profile getUserProfile.user_controller.js`);
    try {
      const data = Object.fromEntries(
        Object.entries(user.dataValues)
          .filter(([key, value]) => value !== null && key !== 'password' && key !== 'verification_text')
      );

      logger.info(`${ user_id }:::Info: fetching user details successful. getUserProfile.user_controller.js`);
      return res.status(enums.HTTP_OK).json(successResponse('User details fetched successfully', data));
    } catch (error) {
      logger.error(`${ user_id }:::Info: fetching user profile failed getUserProfile.user_controller.js`);
      next(error);
    }
  }
  static async getUsers(req, res, next) {
    try {
        const {query, user_id} = req;
        const {page, total_count, total_pages, users} = await UserQueries.getUsers(query);
        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user_id } Info: successfully fetched users and count from the DB getUsers.controllers.user.js`);

        const data = {page, total_count, total_pages, users};
        return res.status(enums.HTTP_OK).json(successResponse(`successfully fetched users.`, data));
    } catch (error) {
        logger.error(`${ enums.CURRENT_TIME_STAMP }, trying to fetched users failed:::getUsers.controllers.user.js`, error.message);
        next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const {user, userDetails, params: {user_id}} = req;
      const userToBeDeleted = userDetails;
      if (user_id === user.user_id) {
        logger.error(`::: error: error trying to delete self deleteUser.user.controllers.user.js`);
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`Oops!!! cannot delete self`, enums.HTTP_BAD_REQUEST));
      }
      if (userToBeDeleted.is_deleted) {
        logger.error(`::: Info: user has been previously deleted deleteUser.user.controllers.user.js`);
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`User has been previously deleted`, enums.HTTP_BAD_REQUEST));
      }
      await User.update({is_deleted: true, status: 'inactive', deleted_at: dayjs()}, {where: {user_id}});

      logger.info(`::: Info: user is_deleted set successfully deleteUser.user.controllers.user.js`);
      return res.status(enums.HTTP_OK).json(successResponse(`User deleted successfully.`));
    } catch (error) {
      next(error);
    }
  };










}

module.exports = UserController;