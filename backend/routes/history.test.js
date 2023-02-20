"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  userToken,
  getSub1Uuid,
  getSub3Uuid,
  randomUuid,
} = require("./routeTestingHelpers");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /history/:id */

describe("GET /history/:id", () => {
  test("works", async () => {
    const id = await getSub1Uuid();

    const resp = await request(app)
      .get(`/history/${id}`)
      .set("authorization", `Bearer ${userToken}`);

    console.log(resp.body.submission);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.submission).toEqual({
      depositValues: {
        changeTotal: 0.65,
        denominations: [4, 2, 10, 0, 0, 3, 2, 1, 1, 0],
        total: 703.65,
      },
      drawerAmount: 100,
      drawerValues: {
        changeTotal: 6,
        denominations: [0, 0, 0, 7, 2, 14, 13, 20, 9, 30],
        total: 100,
      },
      currencyCode: "USD",
      symbol: "$",
      total: 803.65,
      values: [
        {
          name: "$100",
          value: 100,
        },
        {
          name: "$50",
          value: 50,
        },
        {
          name: "$20",
          value: 20,
        },
        {
          name: "$10",
          value: 10,
        },
        {
          name: "$5",
          value: 5,
        },
        {
          name: "$1",
          value: 1,
        },
        {
          name: "Quarters",
          value: 0.25,
        },
        {
          name: "Dimes",
          value: 0.1,
        },
        {
          name: "Nickels",
          value: 0.05,
        },
        {
          name: "Pennies",
          value: 0.01,
        },
      ],
    });
  });

  test("not found if doesn't exist", async () => {
    const id = randomUuid;

    const resp = await request(app)
      .get(`/history/${id}`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /history/user/:username */

describe("GET /history/user/:username", () => {
  test("works", async () => {
    const resp = await request(app)
      .get(`/history/user/user1`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.submissions.length).toEqual(2);
  });

  test("not found if doesn't exist", async () => {
    const id = randomUuid;

    const resp = await request(app)
      .get(`/history/${id}`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(404);
  });
});

//************************************** POST /history/submit */

describe("POST /history/submit", () => {
  test("works", async () => {
    const data = {
      currencyCode: "USD",
      drawerAmount: 100,
      denominations: "[5,2,10,7,2,17,15,21,10,30]",
    };

    const resp = await request(app)
      .post("/history/submit")
      .send(data)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body.submission).toEqual({
      currencyCode: "USD",
      symbol: "$",
      depositValues: {
        changeTotal: 0.65,
        denominations: [5, 2, 10, 0, 0, 3, 2, 1, 1, 0],
        total: 803.65,
      },
      drawerAmount: 100,
      drawerValues: {
        changeTotal: 6,
        denominations: [0, 0, 0, 7, 2, 14, 13, 20, 9, 30],
        total: 100,
      },
      total: 903.65,
      values: [
        { name: "$100", value: 100 },
        { name: "$50", value: 50 },
        { name: "$20", value: 20 },
        { name: "$10", value: 10 },
        { name: "$5", value: 5 },
        { name: "$1", value: 1 },
        { name: "Quarters", value: 0.25 },
        { name: "Dimes", value: 0.1 },
        { name: "Nickels", value: 0.05 },
        { name: "Pennies", value: 0.01 },
      ],
    });
  });
});

//************************************** PUT /history/add-note */

describe("PUT /history/add-note", () => {
  test("works", async () => {
    const id = await getSub1Uuid();
    const data = {
      note: "this is a note",
    };

    const resp = await request(app)
      .put(`/history/${id}/add-note`)
      .send(data)
      .set("authorization", `Bearer ${userToken}`);

    console.log(resp.body);

    expect(resp.body.submission).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      currencyCode: "USD",
      drawerAmount: 100,
      denominations: "[4,2,10,7,2,17,15,21,10,30]",
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
      .put(`/history/${id}/add-note`)
      .send(data)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(401);
  });
});

//************************************** DELETE /history/:id/delete */

describe("DELETE /history/:id/delete", () => {
  test("works", async () => {
    const id = await getSub1Uuid();

    const resp = await request(app)
      .delete(`/history/${id}/delete`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.body.message).toEqual("success");
  });

  test("unauth if not same user", async () => {
    const id = await getSub3Uuid();

    const resp = await request(app)
      .delete(`/history/${id}/delete`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(401);
  });
});

//************************************** DELETE /history/user/:username/delete-history */

describe("DELETE /history/user/:username/delete-history", () => {
  test("works", async () => {
    const resp = await request(app)
      .delete(`/history/user/user1/delete-history`)
      .set("authorization", `Bearer ${userToken}`);

    console.log(resp.body);

    expect(resp.body.message).toEqual("success");
  });

  test("unauth if not same user", async () => {
    const resp = await request(app)
      .delete(`/history/user/user2/delete-history`)
      .set("authorization", `Bearer ${userToken}`);

    expect(resp.statusCode).toEqual(401);
  });
});
