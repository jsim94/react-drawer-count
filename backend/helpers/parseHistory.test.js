const { parseHistory } = require("./parseHistory");

describe("calculate", () => {
  test("works", () => {
    const result = parseHistory({
      currencyCode: "USD",
      drawerAmount: 10000,
      denominations: [3, 1, 10, 15, 5, 2, 17, 9, 0, 1],
    });

    expect(result).toEqual({
      currencyCode: "USD",
      drawerAmount: 10000,
      symbol: "$",
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
      total: 73216,
      depositValues: {
        denominations: [3, 1, 10, 8, 0, 2, 0, 1, 0, 1],
        changeTotal: 11,
        total: 63211,
      },
      drawerValues: {
        denominations: [0, 0, 0, 7, 5, 0, 17, 8, 0, 0],
        changeTotal: 505,
        total: 10005,
      },
    });
  });
});
