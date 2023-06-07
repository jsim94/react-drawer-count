export const prettifyCurrencyNumber = (num: number, symbol: string) => {
  return symbol.concat(
    Number(num / 100)
      .toFixed(2)
      .toLocaleString()
  );
};

export const prettyifyDate = (date: string): string => {
  return new Date(date).toLocaleString("en-us", {
    dateStyle: "short",
    timeStyle: "short",
  });
};
