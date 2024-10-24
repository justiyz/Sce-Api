require('dotenv').config();
const {successResponse, errorResponse} = require('../helpers/response');
const Helpers = require('../lib/utils/lib.util.helpers');
const AuthQueries = require('../queries/queries.auth');
const momentTZ = require('moment-timezone');
const dayjs = require('dayjs');
const AuthPayload = require('../lib/payload/payload.auth');
const config = require('../../sequelize/config/index');
const logger = require('../../logger/logger');
const {userActivityTracking} = require('../lib/monitor/index');
const enums = require('../lib/enums');
const Hash = require('../lib/utils/lib.util.hash');
const UserQueries = require('../queries/queries.user');

const {SCELLO_NODE_ENV} = config;




class AuthController {

    static async signup(req, res, next) {
        try {
            const {body, user} = req;
            const otp = Helpers.generateOtp();
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: random OTP generated::signup.controllers.auth.js`);
            const existingOtp = await AuthQueries.getUserByVerificationToken(otp);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: checked if OTP is existing in the database signup.controllers.auth.js`);
            if (existingOtp) {
                return AuthController.signup(req, res, next);
            }
            const expireAt = dayjs().add(10, 'minutes');
            const expirationTime = dayjs(expireAt);

            // Ensure user.verification_token_request_count is a number
            const signupOtpRequest = user ? (Number(user.verification_token_request_count) || 0) + 1 : 1;
            const payload = AuthPayload.register(body, otp, expireAt, signupOtpRequest);

            const registeredUser = !user ? await AuthQueries.registerUser(payload) : await AuthQueries.updateVerificationToken(payload);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ registeredUser.user_id }:::Info: successfully registered user to the database signup.controllers.auth.js`);

            const data = {...registeredUser.dataValues, otp, otpExpire: expirationTime, otpDuration: `${ 10 } minutes`};
            userActivityTracking(registeredUser.user_id, 1, 'success');

            //THIS LINE HERE SHOULD BE THE CODE THAT SENDS THE USER A VERIFICATION OTP

            if (SCELLO_NODE_ENV === 'test' || SCELLO_NODE_ENV === 'development') {
                return res.status(enums.HTTP_CREATED).json(successResponse(enums.ACCOUNT_CREATED, data));
            }

            //This response is for doesn't return the otp - production
            return res.status(enums.HTTP_CREATED).json(successResponse(enums.ACCOUNT_CREATED, registeredUser));
        } catch (error) {
            error.label = enums.SIGNUP_CONTROLLER;
            logger.error(`User account creation failed::${ enums.SIGNUP_CONTROLLER }`, error.message);
            return next(error);
        }
    }

    static async resendSignupOtp(req, res, next) {
        try {
            const {body, user} = req;
            const otp = Helpers.generateOtp();
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: random OTP generated resendSignupOtp.controllers.auth.js`);

            const existingOtp = await AuthQueries.getUserByVerificationToken(otp);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: checked if OTP is existing in the database resendSignupOtp.controllers.auth.js`);
            if (existingOtp) {
                return AuthController.resendSignupOtp(req, res, next);
            }
            const expireAt = dayjs().add(10, 'minutes');
            const expirationTime = dayjs(expireAt);
            const payload = AuthPayload.register(body, otp, expireAt);
            await AuthQueries.updateVerificationToken(payload);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully updated new verification token into the DB resendSignupOtp.controllers.auth.js`);
            const data = {user_id: user.user_id, otp, otpExpire: expirationTime, otpDuration: `${ 10 } minutes`};
            userActivityTracking(user.user_id, 6, 'success');

             //THIS LINE HERE SHOULD BE THE CODE THAT RESENDS THE USER A VERIFICATION OTP
            // await smsService.sendSms(body.phone_number, verifyAccountOTPSms(data));

            if (SCELLO_NODE_ENV === 'test' || SCELLO_NODE_ENV === 'development') {
                return res.status(enums.HTTP_CREATED).json(successResponse(enums.VERIFICATION_OTP_RESENT, data));
            }

            // not returning otp for production environment
            return res.status(enums.HTTP_CREATED).json(successResponse(enums.VERIFICATION_OTP_RESENT, {user_id: user.user_id})); 
        } catch (error) {
            userActivityTracking(req.user.user_id, 6, 'fail');
            error.label = enums.RESEND_SIGNUP_OTP_CONTROLLER;
            logger.error(`User account creation failed::${ enums.RESEND_SIGNUP_OTP_CONTROLLER }`, error.message);
            return next(error);
        }
    };

    static async verifyAccount(req, res, next) {
        try {
            const {body, user} = req;
            const refreshToken = await Hash.generateRandomString(50);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully generated refresh token verifyAccount.controllers.auth.js`);
            const token = await Hash.generateAuthToken(user);
            logger.info(`${ enums.CURRENT_TIME_STAMP },${ user.user_id }::: Info: successfully generated access token verifyAccount.controllers.auth.js`);
            const tokenExpiration = await JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp;
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully fetched token expiration time verifyAccount.controllers.auth.js`);
            const myDate = new Date(tokenExpiration * 1000);
            const tokenExpireAt = dayjs(myDate);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully converted time from epoch time to a readable format verifyAccount.controllers.auth.js`);

            const payload = AuthPayload.verifyUserAccountAfterSignup(user, refreshToken, body);

            await AuthQueries.verifyUserAccountAfterSignup(payload);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully verified users account in the database verifyAccount.controllers.auth.js`);
            const newUserDetails = UserQueries.getUserByPhoneNumber(user.phone_number);
            const next_profile_update = dayjs().isAfter(dayjs(user.next_profile_update));
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: user updated details fetched from the database verifyAccount.controllers.auth.js`);
            userActivityTracking(user.user_id, 2, 'success');
            return res.status(enums.HTTP_OK).json(successResponse(enums.USER_ACCOUNT_VERIFIED,
                {...newUserDetails, refresh_token: refreshToken, is_updated_advanced_kyc: false, next_profile_update, token, tokenExpireAt}));
        } catch (error) {
            userActivityTracking(req.user.user_id, 2, 'fail');
            error.label = enums.VERIFY_ACCOUNT_CONTROLLER;
            logger.error(`Verifying user account failed::${ enums.VERIFY_ACCOUNT_CONTROLLER }`, error.message);
            return next(error);
        }
    };

    static async completeProfile(req, res, next) {
        try {
            const {user, body} = req;
            const hash = await Hash.hashData(body.password.trim());
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully hashed user password completeProfile.controllers.auth.js`);
            const payload = AuthPayload.completeProfile(user, body, hash);
            const data = await AuthQueries.completeUserProfile(payload);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully saved hashed password in the db completeProfile.controllers.auth.js`);
            userActivityTracking(user.user_id, 7, 'success');
            return res.status(enums.HTTP_OK).json(successResponse(enums.USER_PROFILE_COMPLETED, data));
        } catch (error) {
            userActivityTracking(req.user.user_id, 7, 'fail');
            error.label = enums.COMPLETE_PROFILE_CONTROLLER;
            logger.error(`Completing user profile failed::${ enums.COMPLETE_PROFILE_CONTROLLER }`, error.message);
            return next(error);
        }
    };

    static async completeUserLoginRequest(req, res, next) {
        logger.info(`${ enums.CURRENT_TIME_STAMP }, Info:: now trying to complete user login request completeAdminLoginRequest.controller.auth.js`);
        try {
            const {user, body: {phone_number, password}} = req;

            const otp = Helpers.generateOtp();
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id } Info: random OTP generated:: completeAdminLoginRequest.controller.auth.js`);
            const existingOtp = await AuthQueries.getUserByVerificationToken(otp);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: checked if OTP is existing in the database completeAdminLoginRequest.controller.auth.js`);
            if (existingOtp) {
                logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: user with the generated otp exists in the database completeAdminLoginRequest.controller.auth.js`);
                return AuthController.signup(req, res, next);
            }
            logger.info(`${ enums.CURRENT_TIME_STAMP }, Info: user with the generated otp does not exist in the database completeAdminLoginRequest.controller.auth.js`);

            const expireAt = momentTZ().add(config.SCELLO_EXPIRATION_IN_MINUTES, 'minutes');
            const expirationTime = momentTZ(expireAt).tz('Africa/Lagos').format('hh:mm a');
            const payload = [user.email, otp, expireAt];
            const user_response = await AuthQueries.completeUserLoginRequest(payload);

            //WE CAN FURTHER SEND THE USER A VERIFICATION TOKEN TO THEIR EMAIL OR PHONE NUMBER FOR A SECURE LOGIN PROCESS

            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }, Info: email for user to reset password has been sent successfully to users mail::forgotPassword.controller.auth.js`);
            await userActivityTracking(req.user.user_id, 15, 'success');

            if (SCELLO_NODE_ENV === 'test' || SCELLO_NODE_ENV === 'development') {
                return res.status(enums.HTTP_OK).json(successResponse(enums.LOGIN_REQUEST_SUCCESSFUL, {...user_response, token: otp, expiration: expirationTime}));
            }
            return res.status(enums.HTTP_OK).json(successResponse(enums.LOGIN_REQUEST_SUCCESSFUL, user_response));

        } catch (error) {
            await userActivityTracking(req.user.user_id, 15, 'fail');
            logger.error(`${ enums.CURRENT_TIME_STAMP }, completing user login request failed:::${ enums.COMPLETE_USER_LOGIN_REQUEST_CONTROLLER }`, error.message);
            next(error);
        }
    }


    static async login(req, res, next) {
        try {
            const {user} = req;
            const refreshToken = await Hash.generateRandomString(50);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully generated refresh token login.user.controllers.auth.js`);
            const token = await Hash.generateAuthToken(user);
            logger.info(`${ enums.CURRENT_TIME_STAMP },${ user.user_id }::: Info: successfully generated access token login.user.controllers.auth.js`);
            const tokenExpiration = await JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp;
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully fetched token expiration time login.user.controllers.auth.js`);
            const myDate = new Date(tokenExpiration * 1000);
            const tokenExpireAt = dayjs(myDate);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully converted time from epoch time to a readable format login.user.controllers.auth.js`);

            await AuthQueries.updateLoginToken(user.user_id, null, null, 0, 0);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: login token set to null in the DB login.user.controllers.auth.js`);

            const loggedInUser = await AuthQueries.loginUserAccount(user.user_id, refreshToken);
            logger.info(`${ enums.CURRENT_TIME_STAMP }, ${ user.user_id }:::Info: successfully updated user login login.user.controllers.auth.js`);

            userActivityTracking(user.user_id, 15, 'success');
            return res.status(enums.HTTP_OK).json(successResponse(enums.USER_LOGIN_SUCCESSFULLY, {...loggedInUser, token, tokenExpireAt}));
        } catch (error) {
            userActivityTracking(req.user.user_id, 15, 'fail');
            error.label = enums.LOGIN_CONTROLLER;
            logger.error(`Login user failed::${ enums.LOGIN_CONTROLLER }`, error.message);
            return next(error);
        }
    };
    





}

module.exports = AuthController
