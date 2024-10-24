const jwt = require('jsonwebtoken');
const config = require('../../sequelize/config');
require('dotenv').config();

module.exports = {
  generateAccessToken: (user) => {
    try {
      return jwt.sign({user_id: user.user_id}, config.FUNDME_ACCESS_TOKEN_SECRET, {expiresIn: config.FUNDME_ACCESS_TOKEN_EXPIRATION});
    } catch (error) {
      return error;
    }
    
  },
  generateRefreshToken: (user) => {
    try {
      return jwt.sign({userId: user.user_id}, config.FUNDME_REFRESH_TOKEN_SECRET, {expiresIn: config.FUNDME_REFRESH_TOKEN_EXPIRATION});
    } catch (error) {
      return error;
    }
    
  },
  verifyToken: (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return error;
    }

  },
  generateResetPasswordToken: (user) => {
    try {
      return jwt.sign({email: user.email}, config.FUNDME_ACCESS_TOKEN_SECRET, {expiresIn: config.FUNDME_ACCESS_TOKEN_EXPIRATION});
    } catch (error) {
      return error;
    }
    
  },
};
