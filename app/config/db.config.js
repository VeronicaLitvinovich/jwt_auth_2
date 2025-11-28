const { parse } = require('url');

let dbConfig = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'test_adminname',
  PASSWORD: process.env.DB_PASSWORD || 'test_1234password', 
  DB: process.env.DB_NAME || 'test_lab4db',
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

if (process.env.DATABASE_URL) {
  const dbUrl = parse(process.env.DATABASE_URL);
  dbConfig.HOST = dbUrl.hostname;
  dbConfig.USER = dbUrl.auth.split(':')[0];
  dbConfig.PASSWORD = dbUrl.auth.split(':')[1];
  dbConfig.DB = dbUrl.pathname.slice(1);
  dbConfig.dialect = 'postgres';
}

module.exports = dbConfig;