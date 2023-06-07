export interface DenominationResult {
  denominations: number[];
  changeTotal: number;
  total: number;
}

export interface CurrencyField {
  name: string;
  value: number;
}

export interface CalcResult {
  symbol: string;
  currencyCode: string;
  values: CurrencyField[];
  drawerAmount: number;
  total: number;
  depositValues: DenominationResult;
  drawerValues: DenominationResult;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  historyColor: string;
}

export interface Submission {
  currencyCode: string;
  drawerAmount: number;
  denominations: number[];
  notes?: string;
}

export interface Schema {
  name: string;
  symbol: string;
  bills: CurrencyField[];
  coins: CurrencyField[];
}

export const getFields = (schema: Schema) =>
  schema ? schema.bills.concat(schema.coins) : [];
