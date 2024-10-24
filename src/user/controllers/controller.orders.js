const db = require('../../sequelize/models');
const {successResponse, errorResponse} = require('../helpers/response');
require('dotenv').config();


const {generateAccessToken} = require('../middlewares/auth');
const logger = require('../../logger/logger');
const enums = require('../lib/enums');

const OrderQueries = require('../queries/queries.order');




class OrderController {

    static async createOrder(req, res, next) {
        const {user_id, user, body: {amount, status}} = req;
        logger.info(`${ user.user_id }:::Info: now trying to create order createOrder.user_controller.js`);
        try {
    
          const data = await OrderQueries.createOrder(amount, user.user_id, 'pending');
          logger.info(`${ user_id }:::Info: fetching order creation successful. createOrder.user.controller.js`);
          return res.status(enums.HTTP_OK).json(successResponse('Order created successfully', data));
        } catch (error) {
          logger.error(`${ user_id }:::Info: order creation failed createOrder.user.controller.js`);
          next(error);
        }
      }

    static async getOrders(req, res, next) {
        try {
            const {query, user_id} = req;
            const {page, total_count, total_pages, users} = await OrderQueries.getOrders(query);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user_id } Info: successfully fetched orders and count from the DB getOrders.controllers.user.js`);

            const data = {page, total_count, total_pages, users};
            return res.status(enums.HTTP_OK).json(successResponse(`successfully fetched orders.`, data));
        } catch (error) {
            logger.error(`${ enums.CURRENT_TIME_STAMP }, trying to fetched orders failed:::getOrders.controllers.user.js`, error.message);
            next(error);
        }
    }


    
    static async cancelOrder(req, res, next) {
        try {
            const {user, orderDetails} = req;

            if (orderDetails.status === 'cancelled' || orderDetails.status === 'completed') {
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse('Order cannot be cancelled.'));
            }
            OrderQueries.cancelOrder(orderDetails.order_id);
            logger.info(`::: Info: order has been cancelled successfully by ${ user.user_id }::::cancelOrder.user.controllers.user.js`);

            logger.info(`::: Info: order cancelled successfully cancelOrder.user.controllers.user.js`);
            return res.status(enums.HTTP_OK).json(successResponse(`Order cancelled successfully.`));
        } catch (error) {
            next(error);
        }
    };

    static async deleteOrder(req, res, next) {
        try {
            const {user, orderDetails, params: {order_id}} = req;
            OrderQueries.deleteOrder(orderDetails.order_id);
            logger.info(`::: Info: order has been deleted successfully by ${ user.user_id }::::deleteOrder.user.controllers.user.js`);

            logger.info(`::: Info: order is_deleted set successfully deleteOrder.user.controllers.user.js`);
            return res.status(enums.HTTP_OK).json(successResponse(`order deleted successfully.`));
        } catch (error) {
            next(error);
        }
    };

    static async getEndOfDayReport(req, res, next) {
        try {
            const {user} = req;
            const data = await OrderQueries.getEndOfDayReport(); 
            logger.info(`::: Info: End of day report fetched successfully`);

            return res.status(enums.HTTP_OK).json(successResponse(`End of day report fetched successfully.`, data));
            
        } catch (error) {
            // Handle error
            logger.error(`Error fetching end of day report: ${error.message}`);
            next(error);
        }
    }

    
    






}

module.exports = OrderController;