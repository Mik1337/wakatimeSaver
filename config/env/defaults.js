const config = {
  port: process.env.PORT || 8000,
  wakatimeUrl: process.env.WAKATIME_URL,
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
config.env = process.env.NODE_ENV;

module.exports = config;
