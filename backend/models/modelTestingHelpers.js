const db = require("../db.js");

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

const randomUuid = "00000000-0000-0000-0000-000000000000";

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getSub1Uuid,
  randomUuid,
};
