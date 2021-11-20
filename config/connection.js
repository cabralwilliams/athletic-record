//Gain access to environment variables
require("dotenv").config();

const Sequelize = require("sequelize");

//Create database connection
const sequelize = process.env.JAWSDB_URL ? new Sequelize(process.env.JAWSDB_URL) : new Sequelize(
    process.env.db_name,
    "root",
    process.env.mysql_pw,
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306
    }
);

module.exports = sequelize;