const Joi = require('joi');

const signup = Joi.object().keys({
  phone_number: Joi.string()
    .regex(new RegExp('^(\\+[0-9]{2,}[0-9]{4,}[0-9]*)(x?[0-9]{1,})?$'))
    .messages({
      'string.pattern.base': 'Phone number must contain +countryCode and extra required digits',
      'string.empty': 'Phone Number is not allowed to be empty'
    }).required(),
  referral_code: Joi.string().regex(new RegExp('^[a-zA-Z0-9]+$')).messages({
    'string.pattern.base': 'Invalid referral code input'
  }).optional()
});

const login = Joi.object().keys({
  // email: Joi.string().email().required(),
  phone_number: Joi.string()
    .regex(new RegExp('^(\\+[0-9]{2,}[0-9]{4,}[0-9]*)(x?[0-9]{1,})?$'))
    .messages({
      'string.pattern.base': 'Phone number must contain +countryCode and extra required digits',
      'string.empty': 'Phone Number is not allowed to be empty'
    }).required(),
  password: Joi.string().required(),
  device_token: Joi.string().optional()
});


const password = Joi.object().keys({
  password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')).messages({
    'string.pattern.base': 'Invalid password combination'
  }).required().min(8)
});

const verifyPhoneNumber = Joi.object().keys({
  otp: Joi.string().required().length(6),
  phone_number: Joi.string()
    .regex(new RegExp('^(\\+[0-9]{2,}[0-9]{4,}[0-9]*)(x?[0-9]{1,})?$'))
    .messages({
      'string.pattern.base': 'Phone number must contain +countryCode and extra required digits',
      'string.empty': 'Phone Number is not allowed to be empty'
    }).required(),
  fcm_token: Joi.string().optional(),
  device_token: Joi.string().optional()
});

const completeProfile = Joi.object().keys({
  first_name: Joi.string().regex(new RegExp('^[a-zA-Z0-9-]+$')).messages({
    'string.pattern.base': 'Invalid first name input'
  }).required(),
  middle_name: Joi.string().regex(new RegExp('^[a-zA-Z0-9-]+$')).messages({
    'string.pattern.base': 'Invalid middle name input'
  }).optional(),
  last_name: Joi.string().regex(new RegExp('^[a-zA-Z0-9-]+$')).messages({
    'string.pattern.base': 'Invalid last name input'
  }).required(),
  email: Joi.string().email().required(),
  // date_of_birth: Joi.date().format('YYYY-MM-DD').required(),
  date_of_birth: Joi.date().iso().required(),
  gender: Joi.string().required().valid('male', 'female'),
  password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')).messages({
    'string.pattern.base': 'Invalid password combination'
  }).required().min(8)
});

module.exports = {
  signup,
  login,
  password,
  verifyPhoneNumber,
  completeProfile
};
