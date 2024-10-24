const messages = require('./lib.enum.messages');
const status = require('./lib.enum.status');
const label = require('./lib.enum.labels');

module.exports = {
  ...messages,
  ...status,
  ...label
};

