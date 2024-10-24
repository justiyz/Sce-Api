const db = require('../../sequelize/models');
require('dotenv').config();
const {Op, where} = require('sequelize');
const {v4: uuidv4} = require('uuid');
const constants = require('../../user/utils/constants');
const response = require('../helpers/response');
const Helpers = require('../utils/util.helpers');
const ScelloException = require('../helpers/scello_exception');


const User = db.user;
const Token = db.token;


class UserQueries {

    static async generateUniqueUserId() {
        while (true) {
            const generatedUuid = uuidv4().replace(/-/g, '')
            const generatedId = constants.USER + `${ generatedUuid }`
            const existingUser = await User.findOne({where: {user_id: generatedId}})
            if (!existingUser) {
                return generatedId
            }
        }
    }

    static async getUserById(user_id) {
        try {
            return await User.findByPk(user_id) ||
            (() => {throw new ScelloException('User does not exist', 400)})()
        } catch (error) {
            throw error;
        }
    }

    static async getUserByPhoneNumber(phone_number) {
        try {
            return await User.findOne({where: {phone_number, deleted_at: null}});
        } catch (error) {
            throw error;
        }
        
    }

    static async getUserByEmail(email) {
        try {
            return await User.findOne({where: {email, deleted_at: null}});
        } catch (error) {
            throw error;
        }
    }

    static async getAllUserBvns() {
        try {
            return await User.findAll({
                attributes: ['bvn'],
                where: {
                    bvn: {[Op.not]: null},
                    deleted_at: null
                }
            });
        } catch (error) {
            throw error;
        }
    }

    

    static async getVerificationCode(otp) {
        try {
            return await Token.findOne({
                attributes: ['token'],
                where: {
                    token: otp,
                    deleted_at: null
                }
            });
        } catch (error) {
            throw error;
        }
    }

    static async getUsers(query) {
        try {
            let searchPayload = {}
            if (query.search) {
                searchPayload = {
                    [Op.or]: [
                        {first_name: {[Op.iLike]: '%' + query.search + '%'}},
                        {last_name: {[Op.iLike]: '%' + query.search + '%'}},
                    ],
                };
            }
            const page = query.page ? (query.page - 1) * (query.per_page || 10) : 0;
            const perPage = query.per_page ? query.per_page : '10';

            const users = await User.findAndCountAll({where: {...searchPayload}, offset: page, limit: perPage, order: [['first_name', 'ASC']]})

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
    


}


module.exports = UserQueries;