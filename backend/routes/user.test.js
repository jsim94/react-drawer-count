"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  user2Token,
} = require("./routeTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/api/users/user1`)
      .set("authorization", `Bearer ${user1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "user1",
        password: true,
        amount: 10000,
        currency: "USD",
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/api/users/user1`)
      .set("authorization", `Bearer ${user2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/api/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/ */

describe("PATCH /users/:username", () => {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/api/users/user1`)
      .send({
        password: "newPassword",
        currency: "GBP",
      })
      .set("authorization", `Bearer ${user1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "user1",
        password: true,
        amount: 10000,
        currency: "GBP",
      },
    });
  });
});
