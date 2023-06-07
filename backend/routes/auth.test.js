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

/************************************** POST /api/auth/check */

describe("POST /api/auth/check", () => {
  test("works", async () => {
    const resp = await request(app).post("/api/auth/check").send({
      username: "user1",
    });
    expect(resp.body).toEqual({ found: true, password: true });
  });

  test("works without password", async () => {
    const resp = await request(app).post("/api/auth/check").send({
      username: "user2",
    });
    expect(resp.body).toEqual({ found: true, password: false });
  });

  test("works if not found", async () => {
    const resp = await request(app).post("/api/auth/check").send({
      username: "noUser",
    });
    expect(resp.body).toEqual({ found: false, password: false });
  });
});

/************************************** POST /api/auth/token */

describe("POST /api/auth/token", () => {
  test("works", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: "user1",
      password: "password",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("works witout password", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: "user2",
    });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: "no-such-user",
      password: "password1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: "user1",
      password: "nope7189023",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found with missing data", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: "user1",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app).post("/api/auth/token").send({
      username: 42,
      password: "above-is-a-number",
    });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /api/auth/register */

describe("POST /api/auth/register", () => {
  test("works", async () => {
    const resp = await request(app).post("/api/auth/register").send({
      username: "newUser",
      password: "password",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("works without password", async () => {
    const resp = await request(app).post("/api/auth/register").send({
      username: "newUser",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app).post("/api/auth/register").send({});
    expect(resp.statusCode).toEqual(400);
  });
});
