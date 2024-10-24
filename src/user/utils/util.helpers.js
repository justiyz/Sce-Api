const Crypto = require('crypto');

module.exports = {
    calculatePages: (total, limit) => {
      const displayPage = Math.floor(total / limit);
      return total % limit ? displayPage + 1 : displayPage;
    },
    generateRandomString: (size) => {
      return Crypto.randomBytes(size).toString('hex');
    }
}