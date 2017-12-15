import { CryptoCurrencies, Currencies } from "./Currency";
import { IExchangeState } from "./ExchangeState";

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
  timestamp: number;
}

// Requests

export interface IExchangeRequest {
  cryptoCurrencies: CryptoCurrencies[];
  currency: Currencies;
  requestType: ExchangeRequestType;
}

export interface IStreamTickerRequest extends IExchangeRequest {
  requestType: ExchangeRequestType.GetTickerPrice;
  onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
}

export class ExchangeStreamTickerRequest implements IStreamTickerRequest {
  public cryptoCurrencies: CryptoCurrencies[];
  public currency: Currencies;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public requestType: ExchangeRequestType;

  constructor(
    cryptoCurrencies: CryptoCurrencies[],
    currency: Currencies,
    onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void,
  ) {
    this.cryptoCurrencies = cryptoCurrencies;
    this.currency = currency;
    this.onTickerUpdate = onTickerUpdate;
    this.requestType = ExchangeRequestType.GetTickerPrice;
  }
}

export interface IExchange {
  name: string;
  state: IExchangeState;
  streamTickerPrices(req: IStreamTickerRequest): void;
}
