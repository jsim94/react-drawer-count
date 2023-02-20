"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./modelTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", () => {
  test("works", async () => {
    const user = await User.authenticate("user1", "password");
    expect(user).toEqual({
      username: "user1",
    });
  });

  test("works if no password", async () => {
    const user = await User.authenticate("user2", null);
    expect(user).toEqual({
      username: "user2",
    });
  });

  test("unauth if no password", async () => {
    expect.assertions(1);
    try {
      await User.authenticate("user1", null);
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("unauth if no such user", async () => {
    expect.assertions(1);
    try {
      await User.authenticate("nope", "password");
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }
  });

  test("unauth if wrong password", async () => {
    expect.assertions(1);
    try {
      await User.authenticate("c1", "wrong");
    } catch (err) {
      expect(err).toBeInstanceOf(UnauthorizedError);
    }
  });
});

/************************************** register */

describe("register", () => {
  const newUser = {
    username: "new1",
  };

  test("works", async () => {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works without password", async () => {
    let user = await User.register({
      ...newUser,
    });
    expect(user).toEqual(newUser);
    const found = await db.query("SELECT * FROM users WHERE username = 'new1'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password).toEqual(null);
  });

  test("bad request with dup data", async () => {
    expect.assertions(1);
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });
});

/************************************** update */

describe("changePassword", () => {
  test("works: set password", async () => {
    let user = await User.changePassword("user1", "newPassword");
    expect(user).toEqual({
      username: "user1",
    });
    const found = await db.query("SELECT * FROM users WHERE username = 'user1'");
    expect(found.rows.length).toEqual(1);
    expect(await User.authenticate("user1", "newPassword")).toEqual({
      username: "user1",
    });
  });

  test("not found if no such user", async () => {
    expect.assertions(1);
    try {
      await User.changePassword("nope", "newPassword");
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });

  test("bad request if no data", async () => {
    expect.assertions(1);
    try {
      await User.changePassword("user1");
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestError);
    }
  });
});

/************************************** remove */

describe("remove", () => {
  test("works", async () => {
    await User.remove("user1");
    const res = await db.query("SELECT * FROM users WHERE username='user1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async () => {
    expect.assertions(1);
    try {
      await User.remove("nope");
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
    }
  });
});
