const dayjs = require('dayjs');

module.exports.CURRENT_TIME_STAMP = `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')}`;
// User related labels
module.exports.VALIDATE_UNAUTHENTICATED_USER_MIDDLEWARE = 'UserMiddleware::validateUnAuthenticatedUser';
module.exports.SIGNUP_CONTROLLER = 'AuthController::signup';
module.exports.RESEND_SIGNUP_OTP_CONTROLLER = 'AuthController::resendSignupOtp';
module.exports.VERIFY_ACCOUNT_CONTROLLER = 'AuthController::verifyAccount';
module.exports.LOGIN_CONTROLLER = 'AuthController::login';
module.exports.COMPLETE_PROFILE_CONTROLLER = 'AuthController::completeProfile';
module.exports.GENERATE_REFERRAL_CODE_MIDDLEWARE = 'AuthMiddleware::generateReferralCode';
module.exports.CHECK_IF_USER_ACCOUNT_NOT_VERIFIED_MIDDLEWARE = 'AuthMiddleware::checkIfUserAccountNotVerified';
module.exports.CHECK_OTP_VERIFICATION_REQUEST_COUNT_MIDDLEWARE = 'AuthMiddleware::checkOtpVerificationRequestCount';
module.exports.VERIFY_VERIFICATION_TOKEN_MIDDLEWARE = 'AuthMiddleware::verifyVerificationToken';
module.exports.VERIFY_EMAIL_VERIFICATION_TOKEN_MIDDLEWARE = 'UserMiddleware::verifyEmailVerificationToken';
module.exports.VALIDATE_AUTH_TOKEN_MIDDLEWARE = 'AuthMiddleware::validateAuthToken';
module.exports.IS_PASSWORD_CREATED_MIDDLEWARE = 'AuthMiddleware::isPasswordCreated';
module.exports.CHECK_IF_EMAIL_ALREADY_EXIST_MIDDLEWARE = 'AuthMiddleware::checkIfEmailAlreadyExist';
module.exports.COMPARE_PASSWORD_MIDDLEWARE = 'AuthMiddleware::comparePassword';
module.exports.CONFIRM_PASSWORD_CONTROLLER = 'AuthController::confirmPassword';
module.exports.FETCH_USERS_ACCOUNT_DETAILS_CONTROLLER = 'UserController::fetchUserAccountDetails';

module.exports.GET_USER_PROFILE_CONTROLLER = 'UserController::getProfile';
module.exports.VALIDATE_PASSWORD_OR_PIN_MIDDLEWARE = 'AuthMiddleware::validatePasswordOrPin';
module.exports.DELETE_USER_ACCOUNT_CONTROLLER = 'UserController::deleteUserAccount';
module.exports.WELCOME = 'Welcome to Scello';
module.exports.COMPLETE_USER_LOGIN_REQUEST_CONTROLLER = 'AuthController::completeUserLoginRequest';

