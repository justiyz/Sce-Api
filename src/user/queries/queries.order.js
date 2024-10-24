
require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('../../sequelize/models');

const {v4: uuidv4} = require('uuid');
const constants = require('../../user/utils/constants');
const UserQueries = require('../queries/queries.user');
const Hash = require('../lib/utils/lib.util.hash');
const Helpers = require('../utils/util.helpers');
const {Op, where} = require('sequelize');
const dayjs = require('dayjs');
const {sequelize} = require('../../sequelize/models');



const User = db.user;
const Order = db.order;



class OrderQueries {

    static async generateUniqueOrderId() {
        while (true) {
            const generatedUuid = uuidv4().replace(/-/g, '')
            const generatedId = constants.ORDER + `${ generatedUuid }`
            const existingOrder = await Order.findOne({where: {user_id: generatedId}})
            if (!existingOrder) {
                return generatedId
            }
        }
    }

    static async generateUniqueOrderNumber() {
        try {
            while (true) {
                const order_number = Hash.generateRandomString(8);
                const generatedId = constants.ORDER + `${ order_number }`
                const existingOrder = await Order.findOne({where: {order_number: generatedId}})
                if (!existingOrder) {
                    return generatedId
                }
            }
        } catch (error) {
            throw error;
        }
    }

    static async createOrder(amount, user_id, status) {
        try {
            const order_id = await OrderQueries.generateUniqueOrderId();
            const order_number = await OrderQueries.generateUniqueOrderNumber();
            await Order.create({
                order_id,
                user_id,
                amount,
                status,
                order_number
            });

            // Retrieve the user with specific fields
            const newOrder = await Order.findOne({
                where: { order_id },
                attributes: ['user_id', 'amount', 'order_number', 'status', ]
            });   
            return newOrder;
        } catch (error) {
            console.error(`Error creating order: ${error}`);
            throw error;
        }
    }

    static async getOrders(query) {
        try {
            let searchPayload = {}
            if (query.search) {
                searchPayload = {
                    [Op.or]: [
                        {order_number: {[Op.iLike]: '%' + query.search + '%'}},
                    ],
                };
            }
            const page = query.page ? (query.page - 1) * (query.per_page || 10) : 0;
            const perPage = query.per_page ? query.per_page : '10';

            const users = await Order.findAndCountAll({where: {...searchPayload}, offset: page, limit: perPage, order: [['order_number', 'ASC']]})

            return {
                page: parseFloat(query.page) || 1,
                total_count: Number(users.count),
                total_pages: Helpers.calculatePages(Number(users.count), Number(query.per_page) || 10),
                users: users.rows
            }
        } catch (error) {
            throw error;
        }
    };

    static async deleteOrder(order_id) {
        try {
            await Order.update({is_deleted: true, status: 'deleted', deleted_at: dayjs()}, {where: {order_id}});   
        } catch (error) {
            console.error(`Error deleting order: ${error}`);
            throw error;
        }
    }

    static async cancelOrder(order_id) {
        try {
            await Order.update({status: 'cancelled'}, {where: {order_id}});
        } catch (error) {
            console.error(`Error cancelling order: ${error}`);
            throw error;
        }
    }

    static async getEndOfDayReport() {
        try {
            const startOfDay = dayjs().startOf('day').toDate();
            const endOfDay = dayjs().endOf('day').toDate();

            const allOrders = await Order.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'total_order_amount'],
                ],
                raw: true,
            });

            const todayOrders = await Order.findAll({
                where: {
                    createdAt: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                },
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('amount')), 'total_order_amount_today'],
                ],
                raw: true,
            });

            const totalOrderAmountAllTime = parseFloat(allOrders[0].total_order_amount) || 0.00;
            const totalOrderAmountToday = parseFloat(todayOrders[0].total_order_amount_today) || 0.00;

            return {
                total_order_amount: totalOrderAmountAllTime,
                total_order_amount_today: totalOrderAmountToday,
            };

        } catch (error) {
            console.error(`Error fetching end of day report: ${error.message}`);
            throw error;
        }
    }


}


module.exports = OrderQueries;