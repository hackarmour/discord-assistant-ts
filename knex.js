require("dotenv").config();
//connecting to the database using knex
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.mysql_host,
    port: 3306,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: "test",
  },
  migrations: {
    tableName: "migrations",
  },
});
module.exports = knex;
