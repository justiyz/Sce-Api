
const {devEnv, prodEnv, testEnv} = require('./env/index');

const {SCELLO_NODE_ENV} = process.env;
const config = SCELLO_NODE_ENV === 'development' ? devEnv
    : SCELLO_NODE_ENV === 'production' ? prodEnv
        : testEnv;

module.exports = config;
