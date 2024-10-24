const Labels = {

    SIGNUP_CONTROLLER: 'AuthController::signup',
    RESEND_SIGNUP_OTP_CONTROLLER: 'AuthController::resendSignupOtp',
    VERIFY_ACCOUNT_CONTROLLER: 'AuthController::verifyAccount',
    LOGIN_CONTROLLER: 'AuthController::login',
    COMPLETE_PROFILE_CONTROLLER: 'AuthController::completeProfile',
    VERIFY_VERIFICATION_TOKEN_MIDDLEWARE: 'AuthMiddleware::verifyVerificationToken',
    VERIFY_EMAIL_VERIFICATION_TOKEN_MIDDLEWARE: 'UserMiddleware::verifyEmailVerificationToken',
    VALIDATE_AUTH_TOKEN_MIDDLEWARE: 'AuthMiddleware::validateAuthToken',
    IS_PASSWORD_CREATED_MIDDLEWARE: 'AuthMiddleware::isPasswordCreated',
    CHECK_IF_EMAIL_ALREADY_EXIST_MIDDLEWARE: 'AuthMiddleware::checkIfEmailAlreadyExist',
    ZEEH_BVN_VERIFICATION_SERVICE: 'ZeehService::zeehBnvVerificationCheck',
    LOAN_APPLICATION_ELIGIBILITY_CHECK_SERVICE:'FundmeUnderwritingService::loanApplicationEligibilityCheck',
    LOAN_APPLICATION_AFFORDABILITY_CHECK_SERVICE:'FundmeUnderwritingService::runLoanAffordabilityCheck',
    CREDIT_SCORE_CHECK_SERVICE:'FundmeUnderwritingService::checkCreditScore',
    

    FORGOT_PASSWORD_CONTROLLER: 'AuthMiddleware::forgotPassword',
    RESET_PASSWORD_CONTROLLER: 'AuthMiddleware::resetPassword',
    CHANGE_PASSWORD_CONTROLLER: 'AuthController::changePassword',

    UPDATE_USER_REFRESH_TOKEN_CONTROLLER: 'UserController::updateUserRefreshToken',


    CHECK_IF_SUPER_ADMIN_MIDDLEWARE: 'AdminAdminMiddleware::checkIfSuperAdmin',
    CHECK_IF_AUTHENTICATED_ADMIN_MIDDLEWARE: 'AdminAdminMiddleware::checkIfAuthenticatedAdmin',
    CHECK_IF_ADMIN_EXISTS_MIDDLEWARE: 'AdminAdminMiddleware::checkIfAdminExists',
    IS_ROLE_ACTIVE_MIDDLEWARE: 'AdminRoleMiddleware::isRoleActive',
    FETCH_ALL_ADMINS_CONTROLLER: 'AdminAdminController::fetchAllAdmins',
    EDIT_ADMIN_STATUS_CONTROLLER: 'AdminAdminController::editAdminStatus',
    CHECK_ADMIN_CURRENT_STATUS_MIDDLEWARE: 'AdminAdminMiddleware::checkAdminCurrentStatus',

};

module.exports = Labels;