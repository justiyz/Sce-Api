// require('dotenv').config({path: __dirname + '/./../../../.env'});


const config = require('../../../src/sequelize/config/index');


const db_credentials = {
  username: config.SCELLO_DATABASE_USERNAME,
    password: config.SCELLO_DATABASE_PASSWORD,
    database: config.SCELLO_DATABASE_NAME,
    host: config.SCELLO_DATABASE_HOST,
    dialect: config.SCELLO_DATABASE_DIALECT,
}


module.exports = {

  //the test, production and development env db credentials helps connect to the db when running migrations
  test: {
    username: config.SCELLO_DATABASE_NAME,
    password: config.SCELLO_DATABASE_PASSWORD,
    database: config.SCELLO_DATABASE_NAME,
    host: config.SCELLO_DATABASE_HOST,
    dialect: config.SCELLO_DATABASE_DIALECT,
  },

  production: {
    username: config.SCELLO_DATABASE_NAME,
    password: config.SCELLO_DATABASE_PASSWORD,
    database: config.SCELLO_DATABASE_NAME,
    host: config.SCELLO_DATABASE_HOST,
    dialect: config.SCELLO_DATABASE_DIALECT,
  },

  development: {
    username: config.SCELLO_DATABASE_USERNAME,
    password: config.SCELLO_DATABASE_PASSWORD,
    database: config.SCELLO_DATABASE_NAME,
    host: config.SCELLO_DATABASE_HOST,
    dialect: config.SCELLO_DATABASE_DIALECT,
  },

  db_credentials, //this helps connect to the db when running the whole application
  }


