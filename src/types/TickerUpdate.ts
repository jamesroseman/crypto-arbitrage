import { CryptoCurrencies, Currencies } from "./Currency";
import { IExchangeState } from "./ExchangeState";

export interface ITickerUpdate {
  askPrice: number;
  bidPrice: number;
  cryptoCurrency: CryptoCurrencies;
  currency: Currencies;
  timestamp: number;
}
