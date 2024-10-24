// utils.js
class RandomGenerator {
  
  static async generateRandomNumbers(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomValue = Math.floor(Math.random() * (max - min + 1) + min);
    return randomValue;
  }

  static async generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }

    return randomString;
  }
}

module.exports = RandomGenerator;
