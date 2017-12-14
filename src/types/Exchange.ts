import { CryptoCurrencies, Currencies } from "./Currency";

export enum ExchangeRequestType {
  GetTickerPrice,
}

export interface ITickerUpdate {
  cryptoCurrency: CryptoCurrencies;
  currency: Currencies;
  // This is also known as the "bid" price.
  sellingPrice: number;
  // This is also known as the "ask" price.
  buyingPrice: number;
}

// Requests

export interface IExchangeRequest {
  cryptoCurrencies: CryptoCurrencies[];
  currency: Currencies;
  requestType: ExchangeRequestType;
}

export interface IStreamTickerRequest extends IExchangeRequest {
  requestType: ExchangeRequestType.GetTickerPrice;
}

export class ExchangeStreamTickerRequest implements IStreamTickerRequest {
  public cryptoCurrencies: CryptoCurrencies[];
  public currency: Currencies;
  public requestType: ExchangeRequestType;

  constructor(cryptoCurrencies: CryptoCurrencies[], currency: Currencies) {
    this.cryptoCurrencies = cryptoCurrencies;
    this.currency = currency;
    this.requestType = ExchangeRequestType.GetTickerPrice;
  }
}

// Responses

export interface IExchange {
  onTickerUpdate: (update: ITickerUpdate) => void;
  streamTickerPrices(req: IStreamTickerRequest): void;
}
