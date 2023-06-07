"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  user1Token,
  getSub1Uuid,
  getSub3Uuid,
  randomUuid,
  user2Token,
} = require("./routeTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /api/history/:id */

describe("GET /api/history/:id", () => {
  test("works", async () => {
    const id = await getSub1Uuid();

    const resp = await request(app)
      .get(`/api/history/${id}`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.submission).toEqual({
      depositValues: {
        changeTotal: 65,
        denominations: [4, 2, 10, 0, 0, 3, 2, 1, 1, 0],
        total: 70365,
      },
      drawerAmount: 10000,
      drawerValues: {
        changeTotal: 600,
        denominations: [0, 0, 0, 7, 2, 14, 13, 20, 9, 30],
        total: 10000,
      },
      currencyCode: "USD",
      symbol: "$",
      total: 80365,
      values: [
        {
          name: "$100",
          value: 10000,
        },
        {
          name: "$50",
          value: 5000,
        },
        {
          name: "$20",
          value: 2000,
        },
        {
          name: "$10",
          value: 1000,
        },
        {
          name: "$5",
          value: 500,
        },
        {
          name: "$1",
          value: 100,
        },
        {
          name: "Quarters",
          value: 25,
        },
        {
          name: "Dimes",
          value: 10,
        },
        {
          name: "Nickels",
          value: 5,
        },
        {
          name: "Pennies",
          value: 1,
        },
      ],
    });
  });

  test("not found if doesn't exist", async () => {
    const id = randomUuid;

    const resp = await request(app)
      .get(`/api/history/${id}`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("unauthorized if not correct user", async () => {
    const id = await getSub1Uuid();
    const resp = await request(app)
      .get(`/api/history/${id}`)
      .set("authorization", `Bearer ${user2Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /api/history/user/:username */

describe("GET /api/history/user/:username", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/api/history/user/user1`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.submissions.length).toEqual(2);
  });

  test("not found if doesn't exist", async () => {
    const id = randomUuid;

    const resp = await request(app)
      .get(`/api/history/${id}`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("unauthorized if wrong user", async () => {
    const resp = await request(app)
      .get(`/api/history/user/user1`)
      .set("authorization", `Bearer ${user2Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /api/history/user */

describe("GET /api/history/user", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/api/history/user`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.submissions.length).toEqual(2);
  });

  test("not found if doesn't exist", async () => {
    const id = randomUuid;

    const resp = await request(app)
      .get(`/api/history/${id}`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("unauthorized if wrong user", async () => {
    const resp = await request(app)
      .get(`/api/history/user/user1`)
      .set("authorization", `Bearer ${user2Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /api/history/schema/:schemaName */

describe("GET /api/history/schema/:schemaName", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/api/history/schema/USD`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.symbol).toEqual("$");
  });

  test("404 if not found", async () => {
    const resp = await request(app)
      .get(`/api/history/schema/PPP`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized if not logged in", async () => {
    const resp = await request(app).get(`/api/history/schema/USD`);

    expect(resp.statusCode).toEqual(401);
  });
});

//************************************** POST /api/history/submit */

describe("POST /api/history/submit", () => {
  test("works", async () => {
    const data = {
      currencyCode: "USD",
      drawerAmount: 10000,
      denominations: [5, 2, 10, 7, 2, 17, 15, 21, 10, 30],
    };

    const resp = await request(app)
      .post("/api/history")
      .send(data)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body.submission).toEqual({
      currencyCode: "USD",
      symbol: "$",
      depositValues: {
        changeTotal: 65,
        denominations: [5, 2, 10, 0, 0, 3, 2, 1, 1, 0],
        total: 80365,
      },
      drawerAmount: 10000,
      drawerValues: {
        changeTotal: 600,
        denominations: [0, 0, 0, 7, 2, 14, 13, 20, 9, 30],
        total: 10000,
      },
      total: 90365,
      values: [
        { name: "$100", value: 10000 },
        { name: "$50", value: 5000 },
        { name: "$20", value: 2000 },
        { name: "$10", value: 1000 },
        { name: "$5", value: 500 },
        { name: "$1", value: 100 },
        { name: "Quarters", value: 25 },
        { name: "Dimes", value: 10 },
        { name: "Nickels", value: 5 },
        { name: "Pennies", value: 1 },
      ],
    });
  });
});

//************************************** PUT /api/history/add-note */

describe("PUT /api/history/add-note", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const data = {
      note: "this is a note",
    };

    const resp = await request(app)
      .put(`/api/history/${id}/add-note`)
      .send(data)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.body.submission).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      currencyCode: "USD",
      drawerAmount: 10000,
      denominations: [4, 2, 10, 7, 2, 17, 15, 21, 10, 30],
      note: "this is a note",
      historyColor: 105,
    });
  });

  test("unauth if not same user", async () => {
    const id = await getSub3Uuid();
    const data = {
      note: "this is a note",
    };

    const resp = await request(app)
      .put(`/api/history/${id}/add-note`)
      .send(data)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

//************************************** DELETE /api/history/:id/delete */

describe("DELETE /api/history/:id/delete", () => {
  test("works", async () => {
    const id = await getSub1Uuid();

    const resp = await request(app)
      .delete(`/api/history/${id}/delete`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.body.message).toEqual("success");
  });

  test("unauth if not same user", async () => {
    const id = await getSub3Uuid();

    const resp = await request(app)
      .delete(`/api/history/${id}/delete`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

//************************************** DELETE /api/history/user/:username/delete-history */

describe("DELETE /api/history/user/:username/delete-history", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/api/history/user`)
      .set("authorization", `Bearer ${user1Token}`);

    expect(resp.body.message).toEqual("success");
  });
});
