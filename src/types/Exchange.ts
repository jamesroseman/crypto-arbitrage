import { CryptoCurrencies, Currencies } from "./Currency";

export enum ExchangeRequestType {
  GetTickerPrice,
}

export interface ITickerUpdate {
  cryptoCurrency: CryptoCurrencies;
  currency: Currencies;
  price: number;
}

// Requests

export interface IExchangeRequest {
  cryptoCurrencies: CryptoCurrencies[];
  currency: Currencies;
  requestType: ExchangeRequestType;
}

export interface IStreamTickerRequest extends IExchangeRequest {
  requestType: ExchangeRequestType.GetTickerPrice;
  onPriceUpdate(update: ITickerUpdate): void;
}

// Responses

export interface IExchange {
  streamTickerPrices(req: IStreamTickerRequest): void;
}
