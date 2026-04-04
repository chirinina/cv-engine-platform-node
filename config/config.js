require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "Password123!",
    "database": process.env.DB_NAME || "porta_cv_db",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "Password123!",
    "database": process.env.DB_NAME_TEST || "porta_cv_db_test",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "Password123!",
    "database": process.env.DB_NAME_PROD || "porta_cv_db_prod",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }
};