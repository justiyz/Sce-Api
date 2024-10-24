

require('dotenv').config();
const db = require('../../sequelize/models');
const logger = require('../../logger/logger');
const { errorResponse } = require('../../user/helpers/response');
const {Op} = require('sequelize');
const enums = require('../lib/enums');
const UserQueries = require('../queries/queries.user');
const UserHash = require('../lib/utils/lib.util.hash');
const AccountStatus = require('../../sequelize/models/enum/account_status');



const User = db.user;


class UserMiddleware {
    
    static async checkIfUserExist(req, res, next) {
        try {
            const { params } = req;
            const userExist = await User.findOne({ where: { user_id: params.user_id } })
            if (!userExist) {
                logger.info(`:::Info: Successfully validated that the user does not exist checkIfUserExist.middlewares.customer.js`);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`User id is invalid`, enums.HTTP_BAD_REQUEST));
            }
            logger.info(`:::Info:: Successfully confirms that user is existing in the database checkIfUserExist.middlewares.customer.js`);
            req.userDetails = userExist;
            return next();
        } catch (error) {
            logger.error(`Checking if user exists in the database failed::AdminCustomerMiddleware::checkIfUserExist`, error.message);
            return next(error);
        }

    }

    static async checkIfAccountDetailsExists(req, res, next) {
        try {
            const {user, params: {id, payment_channel_id}, query: {payment_channel}} = req;
            if (!payment_channel || payment_channel === 'bank') {
                logger.info(`${ user.user_id }:::Info:no query payment type sent or query payment type sent is to check for bank repayment. checkIfAccountDetailsExists.middlewares.user.js`);
                const accountIdExists = await UserMiddleware.fetchBankAccountDetailsById(id || payment_channel_id);

                if (!accountIdExists) {
                    logger.info(`${ user.user_id }:::Info: account details does not exist. checkIfAccountDetailsExists.middlewares.user.js`);
                    return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse('Account details does not exist', enums.HTTP_BAD_REQUEST));
                }
                logger.info(`${ user.user_id }:::Info: account details exists in the DB checkIfAccountDetailsExists.middlewares.user.js`);
                if (accountIdExists.user_id !== user.user_id) {
                    logger.info(`${ user.user_id }:::Info: account details does not belong to user checkIfAccountDetailsExists.middlewares.user.js`);
                    return res.status(403).json(errorResponse('Account details does not belong to user', 403));
                }
                logger.info(`${ user.user_id }:::Info: account details belong to user checkIfAccountDetailsExists.middlewares.user.js`);
                req.accountDetails = accountIdExists;
                return next();
            }
            logger.info(`${ user.user_id }:::Info:query payment type is sent and payment query type sent is to check for card repayment checkIfAccountDetailsExists.middlewares.user.js`);
            return next();
        } catch (error) {
            logger.error(`checking if account details exists and belong to user failed::UserMiddleware::checkIfAccountDetailsExists`, error.message);
            return next(error);
        }
    };


    static async checkIfCardOrUserExist(req, res, next) {
        try {
            const {user, params: {id, payment_channel_id}, query: {payment_channel}} = req;
            if (!payment_channel || payment_channel === 'card') {
                logger.info(`${ user.user_id }:::Info:no query payment type sent or query payment type sent is to check for card repayment checkIfCardOrUserExist.middlewares.user.js`);
                const userCard = await UserMiddleware.fetchCardById(id || payment_channel_id);
                logger.info(`${ user.user_id }:::Info:successfully fetched a user's card checkIfCardOrUserExist.middlewares.user.js`);
                if (!userCard) {
                    logger.info(`${ user.user_id }:::Info: successfully confirmed card does not exist in the DB. checkIfCardOrUserExist.middlewares.user.js`);
                    return res.status(400).json(errorResponse('Card does not exist', 400));
                }
                if (user.user_id !== userCard.user_id) {
                    logger.info(`${ user.user_id }:::Info:successfully confirmed the card does not belong to user. checkIfCardOrUserExist.middlewares.user.js`);
                    return res.status(400).json(errorResponse('Card does not belong to user', 400));
                }
                logger.info(`${ user.user_id }:::Info:successfully confirmed the card exists and belongs to user. checkIfCardOrUserExist.middlewares.user.js`);
                req.userDebitCard = userCard;
                return next();
            }
            logger.info(`${ user.user_id }:::Info:query payment type is sent and query payment type sent is to check for bank repayment. checkIfCardOrUserExist.middlewares.user.js`);
            return next();
        } catch (error) {
            logger.error(`checking if card exists failed::UserMiddleware::checkIfCardOrUserExist`, error.message);
            return next(error);
        }
    };

    
    static async fetchBankAccountDetailsById(id) {
        try {
            const userCard = await UserBankAccount.findOne({
                attributes: [
                    'id', 'user_id', 'bank_name', 'bank_code', 'account_number', 'account_name', 'is_default',
                    'is_disbursement_account', 'created_at'
                ],
                where: { id }
            });
            return userCard;
        } catch (error) {
            throw error;
        }
    }

    static async fetchCardsByIdOrUserId(id, user_id) {
        try {
            const userCard = await UserDebitCard.findAll({
                attributes: ['id', 'user_id', 'card_type', 'is_default', 'tokenizing_platform', 'auth_token'],
                where: {
                    [Op.or]: [
                        {id: id},
                        {user_id: user_id}
                    ],
                }
            });
            return userCard;
        } catch (error) {
            throw error;
        }
    }

    static async fetchCardById(id) {
        try {
            const userCard = await UserDebitCard.findOne({
                attributes: ['id', 'user_id', 'card_type', 'is_default', 'tokenizing_platform', 'auth_token'],
                where: {id}
            });
            return userCard;
        } catch (error) {
            throw error;
        }
    }


    static isUploadedVerifiedId(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {user} = req;
                    if (req.user.is_uploaded_identity_card && type === 'complete') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info:decoded that User valid id has been uploaded to the DB. isUploadedVerifiedId.middlewares.user.js`);
                        return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.CHECK_USER_ID_VERIFICATION, enums.HTTP_FORBIDDEN));
                    }
                    if (!req.user.is_uploaded_identity_card && type === 'confirm') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP },${ user.user_id }::: Info:decoded that User valid id has not been uploaded yet to the DB. isUploadedVerifiedId.middlewares.user.js`);
                        return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.USER_VALID_ID_NOT_UPLOADED, enums.HTTP_FORBIDDEN));
                    }
                    return next();
                } catch (error) {
                    error.label = enums.IS_UPDATED_VERIFICATION_ID_MIDDLEWARE;
                    logger.error(`checking if user valid id upload is or is not already existing failed::${ enums.IS_UPDATED_VERIFICATION_ID_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }

    static validateUnAuthenticatedUser(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {body} = req;
                    const payload = body.phone_number || body.email || req.user.phone_number;
                    const user = payload.startsWith('+')
                        ? await UserQueries.getUserByPhoneNumber(payload.trim())
                        : await UserQueries.getUserByEmail(payload.trim().toLowerCase())
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully fetched users details from the database by ${payload}::validateUnAuthenticatedUser.middlewares.user.js`);

                    if (user && user.is_verified_phone_number && user.is_created_password && type === 'validate') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info::successfully confirms that user account already exists in the database::validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.ACCOUNT_EXIST, enums.HTTP_BAD_REQUEST));

                    }
                    if (user && user.is_verified_phone_number && user.is_created_password && type === 'authenticate') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user account already exists in the database::validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.ACCOUNT_ALREADY_VERIFIED, enums.HTTP_BAD_REQUEST));
                    }
                    if (!user && type === 'authenticate') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully confirms that user account does not exists in the database::validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.ACCOUNT_NOT_EXIST('User'), enums.HTTP_BAD_REQUEST));
                    }
                    if (!user && (type === 'login' || type === 'verify')) {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: confirms that user's phone number is not existing in the database validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(type === 'login' ? enums.INVALID_PHONE_NUMBER_OR_PASSWORD : enums.ACCOUNT_NOT_EXIST('User'), enums.HTTP_BAD_REQUEST));
                    }
                    if (user && (user.status === 'suspended' || user.is_deleted || user.status === 'deactivated')) {
                        const userStatus = user.is_deleted ? 'deleted, kindly contact support team' : `${ user.status }, kindly contact support team`;
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user account is ${ userStatus } in the database::validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.USER_ACCOUNT_STATUS(userStatus), enums.HTTP_UNAUTHORIZED));
                    }
                    if (user && !user.is_created_password && (type === 'login')) {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: confirms that user has not created a password hence they have to signup again::validateUnAuthenticatedUser.middlewares.user.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(type === 'login' ? enums.INVALID_PHONE_NUMBER_OR_PASSWORD : enums.ACCOUNT_NOT_EXIST('User'), enums.HTTP_BAD_REQUEST));
                    }
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully confirms that user is clean validateUnAuthenticatedUser.middlewares.user.js`);
                    req.user = user;
                    return next();
                } catch (error) {
                    logger.error(`getting user details from the database failed::${ enums.VALIDATE_UNAUTHENTICATED_USER_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }


    static async validatePhoneNumber(req, res, next) {
        try {
            const {body: {phone_number}} = req;
            logger.info(`${enums.CURRENT_TIME_STAMP}, :::Info: now trying to validate the format and length of phone number. validatePhoneNumber.admin.middlewares.user.js`);
            const phoneNumberRegex = /^\+234[1-9][0-9]{9}$/
            if (phone_number && !phoneNumberRegex.test(phone_number)) {
                logger.info(`${enums.CURRENT_TIME_STAMP},:::ERROR: phone number format validation failed.  validatePhoneNumber.admin.middlewares.user.js`);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`Enter a valid phone number.`, enums.HTTP_BAD_REQUEST));
            }
            logger.info(`${enums.CURRENT_TIME_STAMP}, :::Info:successfully validate format and length of phone number. validatePhoneNumber.admin.middlewares.user.js`);
            return next();
        } catch (error) {
            // logger.info(`${enums.CURRENT_TIME_STAMP}, ${  req.user.user_id }:::ERROR: validating user phone number failed. validatePhoneNumber.admin.middlewares.user.js`);
            throw error;
        }
    }

    static async confirmThatBvnIsUnique(req, res, next) {
        try {
            const {body: {bvn}, user} = req;
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::INFO: now checking if bvn provided is unique. confirmThatBvnIsUnique.user.middlewares.user.js`);
    
            const allExistingBvns = await UserQueries.getAllUserBvns();    
            const plainBvns = await Promise.all(
                allExistingBvns.map(async (data) => {
                    const decryptedBvn = await UserHash.decrypt(decodeURIComponent(data.bvn));
                    return decryptedBvn;
                })
            );    
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::INFO: successfully decrypted all encrypted bvns. confirmThatBvnIsUnique.user.middlewares.user.js`);
    
            if (plainBvns.includes(bvn.trim())) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::INFO: sent bvn has been previously used by another user. confirmThatBvnIsUnique.user.middlewares.user.js`);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`This BVN has been used by another user`, enums.HTTP_BAD_REQUEST));
            }
    
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::INFO: check complete: bvn provided is unique. confirmThatBvnIsUnique.user.middlewares.user.js`);
            return next();
        } catch (error) {
            throw error;
        }
    }

    static async confirmThatUserHasNotPreviosulyverifiedBvn(req, res, next) {
        const {body: {bvn}, user} = req;
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::INFO: now checking user has previously verified bvn. confirmThatUserHasNotPreviosulyverifiedBvn.user.middlewares.user.js`);
        try {
            if (user.bvn && user.is_verified_bvn === true) {
                logger.error(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::ERROR: User bvn has previously been verified. confirmThatUserHasNotPreviosulyverifiedBvn.middlewares.user.js`);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`User has already verified their bvn`, enums.HTTP_BAD_REQUEST));
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: Check complete: User bvn has previously not been verified. confirmThatUserHasNotPreviosulyverifiedBvn..middlewares.user.js`);
            return next();
        } catch (error) {
            throw error;
        }
    }

    static async checkOtpVerificationRequestCount(req, res, next) {
        try {
            const user = req.user;
            if (user && (user.verification_token_request_count >= 4)) { // at 5th attempt or greater perform action
                logger.info(`Info::: confirms user has requested for otp verification consistently without using it. checkOtpVerificationRequestCount.user.middlewares.auth.js`);
                await user.update({status: AccountStatus.DEACTIVATED})
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse('user cannot request verification anymore', enums.HTTP_UNAUTHORIZED));
            }
            logger.info(`Info:: confirms user otp verification request still within limit checkOtpVerificationRequestCount.user.middlewares.auth.js`);
            return next();
        } catch (error) {
            logger.error(`checking if user OTP verification request is still within limit failed.`, error.message);
            return next(error);
        }
    };

    








}

module.exports = UserMiddleware;