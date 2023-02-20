"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./routeTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", () => {
  test("works", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: "user1",
      password: "password",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("works witout password", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: "user2",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: "user1",
      password: "nope",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found with missing data", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: "user1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app).post("/auth/token").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", () => {
  test("works", async () => {
    const resp = await request(app).post("/auth/register").send({
      username: "newUser",
      password: "password",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("works without password", async () => {
    const resp = await request(app).post("/auth/register").send({
      username: "newUser",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app).post("/auth/register").send({});
    expect(resp.statusCode).toEqual(400);
  });
});
