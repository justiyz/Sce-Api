module.exports = {

  successResponse: (message, data = {} ) => {
    
      return {
        status: 'Success',
        message: message,
        code: 200,
        data: data,
      };
    },
  
    errorResponse: (message, code) => {
      return {
        status: 'error',
        message: message,
        code: code || 500
      };
    }
  };
  