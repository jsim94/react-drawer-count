const { parseHistory } = require("./parseHistory");

describe("calculate", () => {
  test("works", () => {
    const result = parseHistory({
      currencyCode: "USD",
      drawerAmount: 100,
      denominations: [3, 1, 10, 15, 5, 2, 17, 9, 0, 1],
    });

    expect(result).toEqual({
      currencyCode: "USD",
      drawerAmount: 100,
      symbol: "$",
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
      total: 732.16,
      depositValues: {
        denominations: [3, 1, 10, 8, 0, 2, 0, 1, 0, 1],
        changeTotal: 0.11,
        total: 632.11,
      },
      drawerValues: {
        denominations: [0, 0, 0, 7, 5, 0, 17, 8, 0, 0],
        changeTotal: 5.05,
        total: 100.05,
      },
    });
  });
});
