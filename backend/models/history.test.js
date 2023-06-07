"use strict";

const { NotFoundError } = require("../expressError");

const db = require("../db.js");
const History = require("./history.js");
const currencyJson = require("../currency.json");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getSub1Uuid,
  randomUuid,
} = require("./modelTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************ getById */

describe("getById", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const submission = await History.getById(id);

    expect(submission).toEqual({
      createdAt: expect.anything(),
      username: "user1",
      currencyCode: "USD",
      drawerAmount: 10000,
      denominations: [4, 2, 10, 7, 2, 17, 15, 21, 10, 30],
      id: expect.any(String),
      note: null,
      historyColor: 105,
    });
  });

  test("throws if not found", async () => {
    expect.assertions(1);
    try {
      await History.getById(randomUuid);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});

/************ getUserHistory */

describe("getUserHistory", () => {
  test("works", async () => {
    const history = await History.getUserHistory("user1");

    expect(history.length).toEqual(2);
  });
});

/************ getSchema */

describe("getSchema", () => {
  test("works", () => {
    const schema = History.getSchema("USD");

    expect(schema.symbol).toEqual("$");
  });

  test("throws if not found", () => {
    expect(() => History.getSchema("NOCURR")).toThrow(NotFoundError);
  });
});

/************ create */

describe("delete", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const status = await History.delete(id);

    expect(status).toEqual({ message: "success" });

    const user1Submissions = await db.query(
      `SELECT *
        FROM history h JOIN users u ON u.id = h.user_id
        WHERE u.username = 'user1'`
    );

    expect(user1Submissions.rows.length).toEqual(1);
  });

  test("throws NotFoundError", async () => {
    expect.assertions(1);
    try {
      await History.delete(randomUuid);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});

/************ addNote */

describe("addNote", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const submission = await History.addNote(id, "this is a new note");

    expect(submission).toEqual({
      createdAt: expect.anything(),
      currencyCode: "USD",
      denominations: [4, 2, 10, 7, 2, 17, 15, 21, 10, 30],
      drawerAmount: 10000,
      id: expect.any(String),
      note: "this is a new note",
      historyColor: 105,
    });
  });

  test("works", async () => {
    const id = await getSub1Uuid();
    const submission = await History.addNote(id, "this is a new note");

    expect(submission).toEqual({
      createdAt: expect.anything(),
      currencyCode: "USD",
      denominations: [4, 2, 10, 7, 2, 17, 15, 21, 10, 30],
      drawerAmount: 10000,
      id: expect.any(String),
      note: "this is a new note",
      historyColor: 105,
    });
  });
});

/************ delete */

describe("delete", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const status = await History.delete(id);

    expect(status).toEqual({ message: "success" });

    const user1Submissions = await db.query(
      `SELECT *
        FROM history h JOIN users u ON u.id = h.user_id
        WHERE u.username = 'user1'`
    );

    expect(user1Submissions.rows.length).toEqual(1);
  });

  test("throws NotFoundError", async () => {
    expect.assertions(1);
    try {
      await History.delete(randomUuid);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});

/************ deleteUserHistory */

describe("deleteUserHistory", () => {
  test("works", async () => {
    const status = await History.deleteUserHistory("user1");

    expect(status).toEqual({ message: "success" });

    const user1Submissions = await db.query(
      `SELECT *
        FROM history
        WHERE user_id = 1`
    );

    expect(user1Submissions.rows.length).toEqual(0);
  });
});
