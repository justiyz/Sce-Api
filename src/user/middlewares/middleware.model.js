const {successResponse, errorResponse} = require('../../user/helpers/response');


const UserSchema = require('../lib/schemas/schema.user');
const AuthSchema = require('../lib/schemas/schema.auth');
const enums = require('../lib/enums');




const validateEmail = (req, res, next) => {
    const {error, value} = UserSchema.verifyEmail.validate(req.body, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const login = (req, res, next) => {
    const {error, value} = AuthSchema.login.validate(req.body, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const signup = (req, res, next) => {
    const {error, value} = AuthSchema.signup.validate(req.body, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};
const verifyPhoneNumber = (req, res, next) => {
    const {error, value} = AuthSchema.verifyPhoneNumber.validate(req.body, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const completeProfile = (req, res, next) => {
    const {error, value} = AuthSchema.completeProfile.validate(req.body, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const getAllUsers = (req, res, next) => {
    const {error, value} = UserSchema.getAllUsers.validate(req.query, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const userIdParams = (req, res, next) => {
    const {error, value} = UserSchema.userIdParams.validate(req.params, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};

const getAllOrders = (req, res, next) => {
    const {error, value} = UserSchema.getAllOrders.validate(req.query, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};
const orderIdParams = (req, res, next) => {
    const {error, value} = UserSchema.orderIdParams.validate(req.params, {allowUnknown: false});
    if (error) {
        return res.status(enums.HTTP_BAD_REQUEST).json(errorResponse(`${ error.details[0].message }`, enums.HTTP_BAD_REQUEST));
    }
    req.validatedData = value;
    next();
};





module.exports = {
    validateEmail,
    login,
    signup,
    verifyPhoneNumber,
    completeProfile,
    getAllUsers,
    userIdParams,
    getAllOrders,
    orderIdParams
}