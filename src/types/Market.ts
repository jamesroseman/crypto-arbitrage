import { CryptoCurrencies, Currencies } from "./Currency";
import { IStreamTickerRequest } from "./Exchange";
import { IExchangeState } from "./ExchangeState";

export interface IExchangePrice {
  buyingPrice: number;
  exchangeName: string;
  sellingPrice: number;
}

export interface IMarketPrice {
  timestamp: number;
  exchangePrices: {
    [exchangeName: string]: IExchangePrice;
  };
}

export interface IMarketCurrencyState {
  lastActiveTimestamp: number;
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
