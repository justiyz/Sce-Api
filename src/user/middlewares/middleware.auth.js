
const {verifyToken} = require('./auth');
// require('dotenv').config();
const logger = require('../../logger/logger');
const constants = require('../utils/constants');
const { errorResponse } = require('../../user/helpers/response');
const enums = require('../lib/enums');
const {userActivityTracking} = require('../lib/monitor/index');
const AuthQueries = require('../queries/queries.auth');
const UserQueries = require('../queries/queries.user');
const config = require('../../sequelize/config');
const Hash = require('../lib/utils/lib.util.hash');
const db = require('../../sequelize/models');


const User = db.user;

class AuthMiddleware {

    static async validateUserAuthToken(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                logger.info(` Info: successfully decoded that no authentication token was sent with the headers validateUserAuthToken.user.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.NO_TOKEN, enums.HTTP_UNAUTHORIZED));
            }
            if (!token.startsWith(constants.BEARER_PREFIX)) {
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.INVALID_TOKEN, enums.HTTP_UNAUTHORIZED));
            }
            if (token.startsWith(constants.BEARER_PREFIX)) {
                token = token.slice(7, token.length);
                logger.info(`Info: successfully extracts token validateUserAuthToken.user.middlewares.auth.js`);
            }
            const decoded = verifyToken(token, config.SCELLO_ACCESS_TOKEN_SECRET);
            logger.info(`${ decoded.user_id }:::Info: successfully decoded authentication token sent using the authentication secret. validateUserAuthToken.user.middlewares.auth.js`);
            if (decoded.message) {
                if (decoded.message === 'jwt expired') {
                    return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.SESSION_EXPIRED, enums.HTTP_UNAUTHORIZED));
                }
                logger.info(`${ decoded.user_id }:::Info: successfully decoded authentication token has a message which is an error message. validateUserAuthToken.user.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(` ${ decoded.message }.`, enums.HTTP_UNAUTHORIZED));
            }
            const user = await UserQueries.getUserById(decoded.user_id);
            logger.info(` ${ decoded.user_id }:::Info: successfully fetched the user details using the decoded user id. validateUserAuthToken.user.middlewares.auth.js`);

            if (user && (user.is_deleted || user.status === 'suspended' || user.status === 'deactivated')) {
                const userStatus = user.is_deleted ? 'deleted, kindly contact support team' : `${ user.status }, kindly contact support team`;
                logger.info(`${ decoded.user_id }:::Info: successfully confirms that user account is ${ userStatus } in the database validateUserAuthToken.user.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(` User account is ${ userStatus }.`, enums.HTTP_UNAUTHORIZED));
            }
            req.user_id = decoded.user_id;
            req.user = user;
            return next();
        } catch (error) {
            logger.error(`Validating the user auth token sent failed:::UserAuthMiddleware::validateUserAuthToken`, error.message);
            return next(error);
        }
    };

    static isCompletedKyc(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {user} = req;
                    if (user.is_completed_kyc && type === 'complete') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user has been previously completed their kyc::isCompletedKyc.middlewares.auth.js`);
                        userActivityTracking(user.user_id, 7, 'fail');
                        return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.KYC_PREVIOUSLY_COMPLETED, enums.HTTP_FORBIDDEN));
                    }
                    if (!user.is_completed_kyc && type === 'confirm') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user has not completed their kyc isCompletedKyc.middlewares.auth.js`);
                        return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.KYC_NOT_PREVIOUSLY_COMPLETED, enums.HTTP_FORBIDDEN));
                    }
                    return next();
                } catch (error) {
                    userActivityTracking(req.user.user_id, 7, 'fail');
                    error.label = enums.IS_COMPLETED_KYC_MIDDLEWARE;
                    logger.error(`checking if user has completed their kyc failed::${ enums.IS_COMPLETED_KYC_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }

    static async checkOtpVerificationRequestCount(req, res, next) {
        try {
            const {user} = req;
            if (user && user.verification_token_request_count >= 4) {
                // at 5th attempt or greater perform action
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: confirms user has requested for otp verification consistently without using it::checkOtpVerificationRequestCount.middlewares.auth.js`);
                await AuthQueries.deactivateUserAccount(user.user_id);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.USER_CANNOT_REQUEST_VERIFICATION_ANYMORE, enums.HTTP_UNAUTHORIZED));
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: confirms user otp verification request still within limit checkOtpVerificationRequestCount.middlewares.auth.js`);
            return next();
        } catch (error) {
            error.label = enums.CHECK_OTP_VERIFICATION_REQUEST_COUNT_MIDDLEWARE;
            logger.error(`checking if user OTP verification request is still within limit failed::${ enums.CHECK_OTP_VERIFICATION_REQUEST_COUNT_MIDDLEWARE }`, error.message);
            return next(error);
        }
    };

    static async verifyVerificationToken(req, res, next) {
        try {
            const {body: {otp, phone_number, email}, } = req;
            const user = !email ? await UserQueries.getUserByPhoneNumber(phone_number.trim()) : await UserQueries.getUserByEmail(email.trim().toLowerCase());

            if (!user) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully decoded that the user with the decoded id does not exist in the DB validateAuthToken.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.ACCOUNT_NOT_EXIST('User'), enums.HTTP_UNAUTHORIZED));
            }
            const otpUser = await AuthQueries.getUserByVerificationTokenAndUniqueField(otp, user.user_id);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: checked if correct OTP is sent verifyVerificationToken.middlewares.auth.js`);
            if (!otpUser) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: OTP is invalid verifyVerificationToken.middlewares.auth.js`);
                await AuthMiddleware.recordUserInvalidOtpInputCount(res, user);
                return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.INVALID('OTP code'), enums.HTTP_BAD_REQUEST));
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ otpUser.user_id }:::Info: OTP is valid verifyVerificationToken.middlewares.auth.js`);
            if (user.invalid_verification_token_count >= 5) {
                await AuthMiddleware.recordUserInvalidOtpInputCount(res, user);
            }
            const isExpired = new Date().getTime() > new Date(otpUser.verification_token_expires).getTime();
            if (isExpired) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ otpUser.user_id }:::Info: successfully confirms that verification token has expired::verifyVerificationToken.middlewares.auth.js`);
                userActivityTracking(otpUser.user_id, 2, 'fail');
                return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.EXPIRED_VERIFICATION_TOKEN, enums.HTTP_FORBIDDEN));
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ otpUser.user_id }:::Info: successfully confirms that verification token is still active::verifyVerificationToken.middlewares.auth.js`);
            req.user = user;
            return next();
        } catch (error) {
            error.label = enums.VERIFY_VERIFICATION_TOKEN_MIDDLEWARE;
            logger.error(`verify verification token failed::${ enums.VERIFY_VERIFICATION_TOKEN_MIDDLEWARE }`, error.message);
            return next(error);
        }
    };

    

    static async recordUserInvalidOtpInputCount(res, user) {
        await AuthQueries.updateUserInvalidOtpCount(user.user_id);
        if (user.invalid_verification_token_count >= 4) {
            // at 5th attempt or greater perform action
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: confirms user has entered invalid otp more than required limit recordUserInvalidOtpInputCount.middlewares.auth.js`);
            await AuthQueries.deactivateUserAccount(user.user_id);
            return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.ACCOUNT_DEACTIVATED, enums.HTTP_UNAUTHORIZED));
        }
    };

    static async checkIfEmailAlreadyExist(req, res, next) {
        try {
            const {user, body} = req;
            const emailUser = await UserQueries.getUserByEmail(body.email.trim().toLowerCase());
            if (!emailUser) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user's email is not existing in
            the database checkIfEmailAlreadyExist.middlewares.auth.js`);
                return next();
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user's email is existing in the database
          checkIfEmailAlreadyExist.middlewares.auth.js`);
            userActivityTracking(user.user_id, 7, 'fail');
            return res.status(enums.HTTP_CONFLICT).json(errorResponse(enums.USER_EMAIL_EXIST, enums.HTTP_CONFLICT));
        } catch (error) {
            userActivityTracking(req.user.user_id, 7, 'fail');
            error.label = enums.CHECK_IF_EMAIL_ALREADY_EXIST_MIDDLEWARE;
            logger.error(`checking if user email is not already existing failed::${ enums.CHECK_IF_EMAIL_ALREADY_EXIST_MIDDLEWARE }`, error.message);
            return next(error);
        }
    };

    static async comparePassword(req, res, next) {
        try {
            const {body: {password}, user, } = req;
            const userPasswordDetails = await AuthQueries.fetchUserPassword(user.user_id);

            const passwordValid = await Hash.compareData(password, userPasswordDetails.password);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully returned compared passwords response comparePassword.middlewares.auth.js`);
            if (passwordValid) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: login password matches::comparePassword.middlewares.auth.js`);
                return next();
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: login password does not match comparePassword.middlewares.auth.js`);
            return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.INVALID_PHONE_NUMBER_OR_PASSWORD, enums.HTTP_BAD_REQUEST));
        } catch (error) {
            error.label = enums.COMPARE_PASSWORD_MIDDLEWARE;
            logger.error(`comparing incoming and already set password in the DB failed:::${ enums.COMPARE_PASSWORD_MIDDLEWARE }`, error.message);
            return next(error);
        }
    };

    static async validateForgotPasswordAndPinToken(req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully decoded that no authentication token was sent with the headers::validateForgotPasswordAndPinToken.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.NO_TOKEN, enums.HTTP_UNAUTHORIZED));
            }
            if (!token.startsWith('Bearer ')) {
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.INVALID_TOKEN, enums.HTTP_UNAUTHORIZED));
            }
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully extracts token validateForgotPasswordAndPinToken.middlewares.auth.js`);
            const decoded = Hash.decodeToken(token);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully decoded authentication token sent using the authentication secret::validateForgotPasswordAndPinToken.middlewares.auth.js`);
            if (decoded.message) {
                if (decoded.message === 'jwt expired') {
                    return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(enums.SESSION_EXPIRED, enums.HTTP_UNAUTHORIZED));
                }
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully decoded authentication token has a message which is an error message::validateForgotPasswordAndPinToken.middlewares.auth.js`);
                return res.status(enums.HTTP_UNAUTHORIZED).json(errorResponse(decoded.message, enums.HTTP_UNAUTHORIZED));
            }
            if (decoded.email) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: successfully decoded authentication token sent using the authentication secret::validateForgotPasswordAndPinToken.middlewares.auth.js`);
                const user = await UserQueries.getUserByEmail(decoded.email);
                req.user = user;
                return next();
            }
        } catch (error) {
            error.label = enums.VALIDATE_AUTH_TOKEN_MIDDLEWARE;
            logger.error(`validating authentication token failed:::${ enums.VALIDATE_AUTH_TOKEN_MIDDLEWARE }`, error.message);
            return next(error);
        }
    };

    static checkIfResetCredentialsSameAsOld(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {body: {password, pin}, user, } = req;
                    const userPasswordDetails = await AuthMiddleware.fetchUserPassword(user.user_id);
                    const isValidCredentials = Hash.compareData(password, userPasswordDetails.password);
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully returned compared user response checkIfResetCredentialsSameAsOld.middlewares.auth.js`);
                    if (isValidCredentials) {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info::decoded that new ${ type } matches with old ${ type }. checkIfResetCredentialsSameAsOld.middlewares.auth.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.IS_VALID_CREDENTIALS(`${ type }`), enums.HTTP_BAD_REQUEST));
                    }
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info::confirms that users new ${ type } is not the same as the currently set ${ type } checkIfResetCredentialsSameAsOld.middlewares.auth.js`);
                    return next();
                } catch (error) {
                    error.label = enums.CHECK_IF__RESET_CREDENTIALS_IS_SAME_AS_OLD_MIDDLEWARE;
                    logger.error(`Checking if password/pin sent matches in the DB failed:::${ enums.CHECK_IF__RESET_CREDENTIALS_IS_SAME_AS_OLD_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }

    static async fetchUserPassword(user_id) {
        try {
            const user = await User.findOne({
                attributes: ['id', 'user_id', 'password'],
                where: {user_id}
            });
            return user;
        } catch (error) {
            console.error(`Error fetching user password: ${ error.message }`);
            throw error;
        }
    }

    static isPasswordCreated(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {user} = req;
                    if (!user.is_created_password && type === 'confirm') {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: decoded that user have not created password in the DB. isPasswordCreated.middlewares.auth.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.USER_CREDENTIALS('password'), enums.HTTP_BAD_REQUEST));
                    }
                    if (user.is_created_password && type === 'validate') {
                        userActivityTracking(user.user_id, 7, 'fail');
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user has previously created password::isPasswordCreated.middlewares.auth.js`);
                        return res.status(enums.HTTP_FORBIDDEN).json(errorResponse(enums.ALREADY_CREATED('password'), enums.HTTP_FORBIDDEN));
                    }
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully confirms that user has not previously created password::isPasswordCreated.middlewares.auth.js`);
                    return next();
                } catch (error) {
                    userActivityTracking(req.user.user_id, 7, 'fail');
                    error.label = enums.IS_PASSWORD_CREATED_MIDDLEWARE;
                    logger.error(`checking if user already created password failed::${ enums.IS_PASSWORD_CREATED_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }

    static validatePasswordOrPin(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {body, user} = req;
                    const condition = body.oldPin || body.oldPassword;
                    const credentials = await AuthQueries.fetchUserPassword(user.user_id);
                    const isValidCredentials = Hash.compareData(condition, credentials.password);
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully returned compared password/pin in the DB::validatePasswordOrPin.middlewares.auth.js`);
                    if (isValidCredentials) {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully validate password/pin in the DB::validatePasswordOrPin.middlewares.auth.js`);
                        return next();
                    }
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: password/pin does not match in the DB validatePasswordOrPin.middlewares.auth.js`);
                    return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.VALIDATE_PASSWORD_OR_PIN(`${ type }`), enums.HTTP_BAD_REQUEST));
                } catch (error) {
                    error.label = enums.VALIDATE_PASSWORD_OR_PIN_MIDDLEWARE;
                    logger.error(`validate password/pin in the DB failed:::${ enums.VALIDATE_PASSWORD_OR_PIN_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }

    static checkIfNewCredentialsSameAsOld(type = '') {
        return (req, res, next) => {
            (async () => {
                try {
                    const {body: {newPassword, newPin}, user, } = req;
                    const userPasswordDetails = await AuthQueries.fetchUserPassword(user.user_id);
                    const isValidCredentials = await Hash.compareData(newPassword, userPasswordDetails.password);
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully returned compared user response checkIfNewCredentialsSameAsOld.middlewares.auth.js`);
                    if (isValidCredentials) {
                        logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info::decoded that new ${ type } matches with old ${ type }. checkIfNewCredentialsSameAsOld.middlewares.auth.js`);
                        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(enums.IS_VALID_CREDENTIALS(`${ type }`), enums.HTTP_BAD_REQUEST));
                    }
                    logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info::confirms that users new ${ type } pin is not the same as the currently set ${ type } checkIfNewCredentialsSameAsOld.middlewares.auth.js`);
                    return next();
                } catch (error) {
                    error.label = enums.CHECK_IF__NEW_CREDENTIALS_IS_SAME_AS_OLD_MIDDLEWARE;
                    logger.error(`Checking if password/pin sent matches in the DB failed:::${ enums.CHECK_IF__NEW_CREDENTIALS_IS_SAME_AS_OLD_MIDDLEWARE }`, error.message);
                    return next(error);
                }
            })();
        };
    }









}


module.exports = AuthMiddleware;