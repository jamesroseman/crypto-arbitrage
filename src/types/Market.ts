import { CryptoCurrencies, Currencies } from "./Currency";
import { IStreamTickerRequest } from "./ExchangeStreamTickerRequest";

export interface IExchangePrice {
  askPrice: number;
  bidPrice: number;
  exchangeName: string;
}

export interface IMarketPrice {
  timestamp: number;
  exchangePrices: {
    [exchangeName: string]: IExchangePrice;
  };
}

export interface IMarketCurrencyState {
  lastActiveTimestamp: number;
  lowestPrice: number;
  prices: IMarketPrice[];
  timestamps: number[];
}

export interface IMarketState {
  [cryptoCurrency: string]: IMarketCurrencyState;
}

export interface IMarket {
  state: IMarketState;
  streamTickerPrices(req: IStreamTickerRequest): void;
}
