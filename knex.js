require("dotenv").config();

// Connect to the database via knex
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.mysql_host,
    port: process.env.mysql_port,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
  },
  migrations: {
    tableName: "migrations",
  },
});

module.exports = knex;
