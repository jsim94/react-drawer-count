"use strict";
/** Database setup for drawer count. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const dbConfig = {
  connectionString: getDatabaseUri(),
};

if (process.env.NODE_ENV === "production") {
  dbConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const db = new Client(dbConfig);

db.connect();

module.exports = db;
