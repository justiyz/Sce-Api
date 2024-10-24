const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/contoller.auth');
const PayloadValidationModel = require('../middlewares/middleware.model');
const UserMiddleware = require('../middlewares/middleware.user');
const AuthMiddleware = require('../middlewares/middleware.auth');




router.post(
    '/signup',
    PayloadValidationModel.signup,
    UserMiddleware.validateUnAuthenticatedUser('validate'),
    AuthMiddleware.checkOtpVerificationRequestCount,
    AuthController.signup
);

// router.post(
//     '/resend-signup-otp',
//     PayloadValidationModel.resendPhoneNumberVerificationOTP,
//     UserMiddleware.validateUnAuthenticatedUser('authenticate'),
//     AuthMiddleware.checkOtpVerificationRequestCount,
//     AuthController.resendSignupOtp
// );

router.post(
    '/verify-phone-number',
    PayloadValidationModel.verifyPhoneNumber,
    AuthMiddleware.verifyVerificationToken,
    UserMiddleware.validateUnAuthenticatedUser('authenticate'),
    AuthController.verifyAccount
);

router.post(
    '/complete-profile',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.completeProfile,
    AuthMiddleware.isCompletedKyc('complete'),
    AuthMiddleware.checkIfEmailAlreadyExist,
    AuthController.completeProfile
);

router.post('/login',
    PayloadValidationModel.login,
    UserMiddleware.validateUnAuthenticatedUser('login'),
    AuthMiddleware.comparePassword,
    UserMiddleware.checkOtpVerificationRequestCount,
    AuthController.completeUserLoginRequest
);

router.post('/verify-login',
    PayloadValidationModel.verifyPhoneNumber,
    AuthMiddleware.verifyVerificationToken,
    UserMiddleware.validateUnAuthenticatedUser('login'),
    AuthController.login
);

// router.post(
//     '/forgot-password',
//     PayloadValidationModel.forgotPassword,
//     UserMiddleware.validateUnAuthenticatedUser('verify'),
//     AuthMiddleware.checkOtpVerificationRequestCount,
//     AuthController.forgotPassword
// );

// router.post(
//     '/verify-reset-token',
//     PayloadValidationModel.verifyOtpViaPhoneNumber,
//     AuthMiddleware.verifyVerificationToken,
//     AuthController.generateResetToken('password')
// );

// router.post(
//     '/reset-password',
//     PayloadValidationModel.password,
//     AuthMiddleware.validateForgotPasswordAndPinToken,
//     AuthMiddleware.checkIfResetCredentialsSameAsOld('password'),
//     AuthController.resetPassword
// );

// router.post(
//     '/confirm-password',
//     AuthMiddleware.validateUserAuthToken,
//     PayloadValidationModel.password,
//     AuthMiddleware.comparePassword,
//     AuthController.confirmPassword
// );

// router.patch(
//     '/change-password',
//     AuthMiddleware.validateUserAuthToken,
//     PayloadValidationModel.changePassword,
//     AuthMiddleware.isPasswordCreated('confirm'),
//     AuthMiddleware.validatePasswordOrPin('password'),
//     AuthMiddleware.checkIfNewCredentialsSameAsOld('password'),
//     AuthController.changePassword
//   );






module.exports = router;
