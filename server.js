require('dotenv').config();

const {sequelize} = require('./src/sequelize/models')
const express = require('express');
const logger = require('./src/logger/logger');
const config = require('./src/sequelize/config/index');


const cors = require('cors');

const app = express();

// EXTERNAL URLS THAT ARE ALLOWED TO HIT THIS SERVER
const corsOptions = {
  origin: [
    config.SCELLO_FRONTEND_LOCAL,
    config.SCELLO_FRONTEND_STAGING,
    config.SCELLO_FRONTEND_PRODUCTION,
    config.SCELLO_FRONTEND_LOCAL_ADMIN,
    config.SCELLO_FRONTEND_STAGING_ADMIN,
    config.SCELLO_FRONTEND_PRODUCTION_ADMIN,
  ],
  optionsSuccessStatus: 200,
};
app.options('*', cors(corsOptions))
app.use(cors(corsOptions));


app.use(express.json());


// configure(app)
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Scello api' });
});


//db
const connectDB = async () => {
  logger.info('Checking database connection...');
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (e) {
    logger.info('Database connection failed', e);
    process.exit(1);
  }
};




//User Routes
const userRoutes = require('./src/user/routes/route.user');
app.use('/users', userRoutes);
const authRoutes = require('./src/user/routes/route.auth');
app.use('/auth', authRoutes);
const orderRoutes = require('./src/user/routes/route.order');
app.use('/orders', orderRoutes);




app.use((error, req, res, next) => {
  logger.info('Unhandled error:', error)
  res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
});



// Port
const PORT = config.SCELLO_PORT || 4000;

// Wrap the code in an async function
const startServer = async () => {
  await connectDB();
  logger.info(`Attempting to run server on port ${ PORT }`)
  logger.info(`Now running on ${ config.SCELLO_NODE_ENV } environment`)

  // Server
  app.listen(PORT, () => {
    logger.info(`App listening on port ${ PORT }`)
  });
};



// Call the async function to start the server
startServer();
