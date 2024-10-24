class ScelloException extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.name = 'ScelloException';
    }
  }
  
  module.exports = ScelloException;