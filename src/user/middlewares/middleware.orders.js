

require('dotenv').config();
const db = require('../../sequelize/models');
const logger = require('../../logger/logger');
const { errorResponse } = require('../../user/helpers/response');
const {Op} = require('sequelize');
const enums = require('../lib/enums');
const UserQueries = require('../queries/queries.user');
const UserHash = require('../lib/utils/lib.util.hash');
const AccountStatus = require('../../sequelize/models/enum/account_status');



const Order = db.order;


class OrderMiddleware {
    
    static async checkIfOrderExist(req, res, next) {
        try {
            const {params} = req;
            const orderExist = await Order.findOne({where: {order_id: params.order_id}})
            if (!orderExist) {
                logger.info(`:::Info: Successfully validated that the order does not exist checkIfOrderExist.middlewares.customer.js`);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`Order does not exist`, enums.HTTP_BAD_REQUEST));
            }
            logger.info(`:::Info:: Successfully confirms that order is existing in the database checkIfOrderExist.middlewares.customer.js`);
            req.orderDetails = orderExist;
            return next();
        } catch (error) {
            logger.error(`Checking if order exists in the database failed::AdminCustomerMiddleware::checkIfOrderExist`, error.message);
            return next(error);
        }

    }


}

module.exports = OrderMiddleware;


