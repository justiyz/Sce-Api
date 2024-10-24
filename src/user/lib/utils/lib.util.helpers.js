const Crypto = require('crypto');



module.exports.generateOtp = () => Crypto.randomInt(0, 1000000).toString().padStart(6, '0');
module.exports.generateReferralCode = size => {
  try {
    return Crypto.randomBytes(size).toString('hex').toUpperCase();
  } catch (error) {
    return error;
  }
};

module.exports.generatePassword = length => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let password = '';
  for (let i = 0; i < length; i++) {

    // Generate a random index to select a character from the chars string
    const randomIndex = Crypto.randomInt(0, chars.length);
    password += chars.charAt(randomIndex);
  }

  return password;
};

module.exports.generateElevenDigits = () => Crypto.randomInt(0, 10000000000).toString().padStart(11, '22');

