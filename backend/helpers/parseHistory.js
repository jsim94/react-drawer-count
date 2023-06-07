const currencyJson = require("../currency.json");
const { BadRequestError } = require("../expressError");

function sumQuantities(arr, values) {
  return arr.reduce((pV, cV, idx) => pV + cV * values[idx].value, 0);
}

function parseHistory({ currencyCode, drawerAmount, denominations }) {
  // assert parameters
  if (currencyJson.currencies[currencyCode] === undefined)
    throw new BadRequestError(`currencyCode '${currencyCode}' invalid.`);
  if (drawerAmount < 0)
    throw new BadRequestError(
      `drawerAmount '${drawerAmount}' must be greater than 0`
    );

  const CURRENCY = currencyJson.currencies[currencyCode];

  if (denominations.length !== CURRENCY.bills.length + CURRENCY.coins.length)
    throw new BadRequestError(`denominations length does not equal currency length`);

  const values = [];
  CURRENCY.bills.forEach((bill) => values.push(bill));
  CURRENCY.coins.forEach((coin) => values.push(coin));

  let inputTotal = denominations.reduce(
    (acc, qty, idx) => acc + qty * values[idx].value,
    0
  );

  const depositTotal = inputTotal - drawerAmount;
  let total = 0;

  const depositQtys = denominations.map((qty, idx) => {
    const currValue = values[idx].value;
    const checkTotal = depositTotal - total;
    const checkValue = Math.floor(checkTotal / currValue);

    const result = Math.min(qty, checkValue);
    total += result * currValue;
    return result;
  }, []);

  const drawerQtys = denominations.map(
    (qty, idx) => denominations[idx] - depositQtys[idx],
    []
  );

  console.log(denominations);

  return {
    currencyCode,
    drawerAmount,
    symbol: CURRENCY.symbol,
    values,
    total: inputTotal,
    depositValues: {
      denominations: depositQtys,
      changeTotal: sumQuantities(
        depositQtys.slice(-CURRENCY.coins.length),
        CURRENCY.coins
      ),
      total: sumQuantities(depositQtys, values),
    },
    drawerValues: {
      denominations: drawerQtys,
      changeTotal: sumQuantities(
        drawerQtys.slice(-CURRENCY.coins.length),
        CURRENCY.coins
      ),
      total: sumQuantities(drawerQtys, values),
    },
  };
}

module.exports = { parseHistory };
