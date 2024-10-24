const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Crypto = require('crypto');
const CryptoJS = require('crypto-js');
const config = require('../../../sequelize/config/index');

const {SCELLO_ACCESS_TOKEN_SECRET, SCELLO_BCRYPT_SALT_ROUND, } = config;

module.exports = {

  generateAuthToken: (user) => {
    try {
      const { user_id } = user;
      return jwt.sign({ user_id }, SCELLO_ACCESS_TOKEN_SECRET, { expiresIn: '4h' });
    } catch (error) {
      return error;
    }
  },

    encrypt: async (data) => {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), SCELLO_ACCESS_TOKEN_SECRET).toString();
        } catch (error) {
            return error;
        }
    },

    decrypt: async (ciphertext) => {
        try {
            const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), SCELLO_ACCESS_TOKEN_SECRET);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            return error;
        }
    },

    generateRandomString: (size) => {
        try {
          return Crypto.randomBytes(size).toString('hex');
        } catch (error) {
          return error;
        }
    },
    
    hashData: async (data) => {
        const salt = bcrypt.genSaltSync(parseFloat(SCELLO_BCRYPT_SALT_ROUND));
        const hash = bcrypt.hashSync(data, salt);
        if (hash) {
          return hash;
        }
        return false;
    },
    
    compareData: (data, hash) => bcrypt.compareSync(data, hash),

    decodeToken: (token) => {
        try {
          return jwt.verify(token, SCELLO_ACCESS_TOKEN_SECRET);
        } catch (error) {
          return error;
        }
    },
    
    generateAdminResetPasswordToken: (admin) => {
        try {
          const { email } = admin;
          return jwt.sign({ email }, SCELLO_ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
        } catch (error) {
          return error;
        }
    },
    
    generateAdminAuthToken: (admin, permissions) => {
        try {
          const { admin_id, role_type } = admin;
          return jwt.sign({ admin_id, role_type, ...permissions }, SCELLO_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        } catch (error) {
          return error;
        }
  },
    
  generateResetToken: (user) => {
    try {
      const { email } = user;
      return jwt.sign({ email }, SCELLO_ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    } catch (error) {
      return error;
    }
  },



}
