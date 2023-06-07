"use strict";

const db = require("../db.js");
const { createToken } = require("../helpers/tokens.js");
const User = require("../models/user");

async function commonBeforeAll() {}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

async function getSub1Uuid() {
  const res = await db.query(`SELECT id FROM history WHERE pk = 1`);
  return res.rows[0].id;
}

async function getSub3Uuid() {
  const res = await db.query(`SELECT id FROM history WHERE pk = 3`);
  return res.rows[0].id;
}

const user1Token = createToken({ username: "user1" });
const user2Token = createToken({ username: "user2" });

const randomUuid = "00000000-0000-0000-0000-000000000000";

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  user2Token,
  getSub1Uuid,
  getSub3Uuid,
  randomUuid,
};
