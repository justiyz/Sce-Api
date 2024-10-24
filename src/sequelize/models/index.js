'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);


const config = require(__dirname + '/../config/config.js');
const db = {};



let sequelize;
sequelize = new Sequelize(
  config.db_credentials.database,
  config.db_credentials.username,
  config.db_credentials.password,
  {host: config.db_credentials.host, dialect: config.db_credentials.dialect});


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//USER DB
db.user = require('../models/user')(sequelize, Sequelize.DataTypes);
db.token = require('../models/token')(sequelize, Sequelize.DataTypes);
db.userActivityLog = require('../models/useractivitylogs')(sequelize, Sequelize.DataTypes);
db.userActivityType = require('./useractivitytypes')(sequelize, Sequelize.DataTypes);
db.order = require('../models/orders')(sequelize, Sequelize.DataTypes);


// USER & ORDER RELATIONSHIP
db.user.hasMany(db.order, {
  as: 'Orders',
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});
db.order.belongsTo(db.user, {
  as: 'Users',
  foreignKey: 'user_id',
});









module.exports = db;
