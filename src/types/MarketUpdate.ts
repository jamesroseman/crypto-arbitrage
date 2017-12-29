import { CryptoCurrencies } from "./Currency";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarketUpdate {
  cryptoCurrency: CryptoCurrencies;
  timestamp: number;
  updates: { [exchangeName: string]: ITickerUpdate };
}
