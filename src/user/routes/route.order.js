const express = require('express');
const UserController = require('../controllers/controller.user');
const OrderController = require('../controllers/controller.orders');
const router = express.Router();
const AuthMiddleware = require('../middlewares/middleware.auth');
const PayloadValidationModel = require('../middlewares/middleware.model');
const UserMiddleware = require('../middlewares/middleware.user');
const OrderMiddleware = require('../middlewares/middleware.orders');



//ORDERS
router.post('/',
    AuthMiddleware.validateUserAuthToken,
    OrderController.createOrder
);
router.get('/',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.getAllOrders,
    OrderController.getOrders,
);
router.delete('/:order_id',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.orderIdParams,
    OrderMiddleware.checkIfOrderExist,
    OrderController.deleteOrder
);
router.patch('/:order_id',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.orderIdParams,
    OrderMiddleware.checkIfOrderExist,
    OrderController.cancelOrder
);
router.get('/end-of-day-report',
    AuthMiddleware.validateUserAuthToken,
    OrderController.getEndOfDayReport
);



module.exports = router;