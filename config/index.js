const merge = require('lodash/merge');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const config = require('./env/defaults');

if (process.env.NODE_ENV !== 'production') {
  let localConfig = {};

  try {
    // eslint-disable-next-line
    localConfig = require(`./env/${config.env}`);
    localConfig = localConfig || {};
  } catch (err) {
    console.log(err);
    localConfig = {};
  }

  merge({}, config, localConfig);
}

module.exports = config;
