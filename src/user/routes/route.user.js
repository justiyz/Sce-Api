const express = require('express');
const UserController = require('../controllers/controller.user');
const router = express.Router();
const AuthMiddleware = require('../middlewares/middleware.auth');
const PayloadValidationModel = require('../middlewares/middleware.model');
const UserMiddleware = require('../middlewares/middleware.user');



router.get('/details',
    AuthMiddleware.validateUserAuthToken,
    UserController.getUserProfile
);
router.get('/all',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.getAllUsers,
    UserController.getUsers,
);
router.delete(
    '/:user_id',
    AuthMiddleware.validateUserAuthToken,
    PayloadValidationModel.userIdParams,
    UserMiddleware.checkIfUserExist,
    UserController.deleteUser
); 



module.exports = router;
