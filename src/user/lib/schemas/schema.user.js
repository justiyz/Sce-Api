
const Joi = require('joi');




const password = Joi.object().keys({
    password: Joi.string().regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')).messages({
        'string.pattern.base': 'Invalid password combination'
    }).required().min(8)
});

const verifyEmail = Joi.object().keys({
    email: Joi.string().email().required(),
}); 

const getAllUsers = Joi.object().keys({
    search: Joi.string().optional(),
    page: Joi.number().positive().optional(),
    per_page: Joi.number().positive().optional()
});

const userIdParams = Joi.object().keys({
    user_id: Joi.string().required(),
});


const getAllOrders = Joi.object().keys({
    search: Joi.string().optional(),
    page: Joi.number().positive().optional(),
    per_page: Joi.number().positive().optional()
});
const orderIdParams = Joi.object().keys({
    order_id: Joi.string().required(),
});
  




module.exports = {
    password,
    verifyEmail,
    getAllUsers,
    userIdParams,
    getAllOrders,
    orderIdParams

}