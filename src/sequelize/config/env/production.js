// require('dotenv').config();
require('dotenv').config({path: __dirname + '/./../../../../.env'});

const {

  SCELLO_NODE_ENV,
  SCELLO_PROD_PORT,
  SCELLO_PROD_SECRET_KEY,
  SCELLO_PROD_ACCESS_TOKEN_SECRET,
  SCELLO_PROD_REFRESH_TOKEN_SECRET,
  SCELLO_PROD_REFRESH_TOKEN_EXPIRATION,
  SCELLO_PROD_ACCESS_TOKEN_EXPIRATION, 
 
  SCELLO_PROD_FRONTEND_LOCAL,
  SCELLO_PROD_FRONTEND_STAGING,
  SCELLO_PROD_FRONTEND_PRODUCTION,
  SCELLO_PROD_FRONTEND_PRODUCTION_ADMIN,
  SCELLO_PROD_EXPIRATION_IN_MINUTES,

  SCELLO_PROD_DATABASE_USERNAME,
  SCELLO_PROD_DATABASE_PASSWORD,
  SCELLO_PROD_DATABASE_NAME,
  SCELLO_PROD_DATABASE_HOST,
  SCELLO_PROD_DATABASE_URL,
  SCELLO_PROD_DATABASE_DIALECT,
  
  SCELLO_PROD_FRONTEND_LOCAL_ADMIN,
  SCELLO_PROD_MAX_RETRIES,

  SCELLO_PROD_FRONTEND_STAGING_ADMIN,
 
  SCELLO_PROD_MESSAGE_FORWARDING,
  SCELLO_PROD_BACKEND_BASE_URL,
 
  
  SCELLO_PROD_ENCODING_AUTHENTICATION_SECRET,
 
  SCELLO_PROD_BCRYPT_SALT_ROUND,

} = process.env;


module.exports = {
  SCELLO_NODE_ENV,
  SCELLO_PORT: SCELLO_PROD_PORT,
  SCELLO_SECRET_KEY: SCELLO_PROD_SECRET_KEY,
  SCELLO_ACCESS_TOKEN_SECRET: SCELLO_PROD_ACCESS_TOKEN_SECRET,
  SCELLO_REFRESH_TOKEN_SECRET: SCELLO_PROD_REFRESH_TOKEN_SECRET,
  SCELLO_REFRESH_TOKEN_EXPIRATION: SCELLO_PROD_REFRESH_TOKEN_EXPIRATION,
  SCELLO_ACCESS_TOKEN_EXPIRATION: SCELLO_PROD_ACCESS_TOKEN_EXPIRATION,
 
  SCELLO_MAX_RETRIES: SCELLO_PROD_MAX_RETRIES,
  
  SCELLO_FRONTEND_LOCAL: SCELLO_PROD_FRONTEND_LOCAL,
  SCELLO_FRONTEND_STAGING: SCELLO_PROD_FRONTEND_STAGING,
  SCELLO_FRONTEND_PRODUCTION: SCELLO_PROD_FRONTEND_PRODUCTION, 
  SCELLO_FRONTEND_PRODUCTION_ADMIN: SCELLO_PROD_FRONTEND_PRODUCTION_ADMIN,
  SCELLO_EXPIRATION_IN_MINUTES: SCELLO_PROD_EXPIRATION_IN_MINUTES,

  SCELLO_DATABASE_DIALECT: SCELLO_PROD_DATABASE_DIALECT,
  SCELLO_DATABASE_USERNAME: SCELLO_PROD_DATABASE_USERNAME,
  SCELLO_DATABASE_PASSWORD: SCELLO_PROD_DATABASE_PASSWORD,
  SCELLO_DATABASE_NAME: SCELLO_PROD_DATABASE_NAME,
  SCELLO_DATABASE_HOST: SCELLO_PROD_DATABASE_HOST,
  SCELLO_DATABASE_URL: SCELLO_PROD_DATABASE_URL,
 
 
  SCELLO_FRONTEND_LOCAL_ADMIN: SCELLO_PROD_FRONTEND_LOCAL_ADMIN,

  SCELLO_FRONTEND_STAGING_ADMIN: SCELLO_PROD_FRONTEND_STAGING_ADMIN,
 
  SCELLO_MESSAGE_FORWARDING: SCELLO_PROD_MESSAGE_FORWARDING,
  SCELLO_BACKEND_BASE_URL: SCELLO_PROD_BACKEND_BASE_URL,
 
  SCELLO_ENCODING_AUTHENTICATION_SECRET: SCELLO_PROD_ENCODING_AUTHENTICATION_SECRET,


  SCELLO_BCRYPT_SALT_ROUND: SCELLO_PROD_BCRYPT_SALT_ROUND,  

};