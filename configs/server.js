const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'Change this secret';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'Change this secret';

const MONGO_LOGIN = process.env.MONGO_LOGIN;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const serverConfig = {
    jwtSecret: JWT_SECRET,
    cookieSecret: COOKIE_SECRET,
    mongo_login: MONGO_LOGIN,
    mongo_password: MONGO_PASSWORD,
    mongo_dbname: MONGO_DB_NAME
};

module.exports = serverConfig;
