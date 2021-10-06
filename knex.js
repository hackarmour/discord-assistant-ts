require("dotenv").config();
//connecting to the database using knex
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.mysql_host,
    port: 3306,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
  },
  migrations: {
    tableName: "migrations",
  },
});
module.exports = knex;
