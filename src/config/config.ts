import sequelize from "sequelize";

// tslint:disable-next-line:no-var-requires
require('dotenv').config();

export const SERVER_PORT = 8000;
export const DB_USER_NAME = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = parseInt(process.env.DB_PORT || "3306");
export const DB_SCHEMA = process.env.DB_SCHEMA;

export const sequelizeConfig = {
    database: DB_SCHEMA,
    username: DB_USER_NAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: 'mysql'
}