import { CryptoCurrencies, Currencies } from "../Currency";
import { ITickerUpdate } from "../TickerUpdate";

export interface ICurrencyHistory {
  latestAskPrice: number;
  latestBidPrice: number;
  lastTimestamp: number;
}

export interface IExchangeState {
  currencies: {
    [cryptoCurrency: string]: ICurrencyHistory;
  };
  name: string;
}

export class ExchangeState implements IExchangeState {
  public currencies: { [cryptoCurrency: string]: ICurrencyHistory } = {};
  public timestamps: number[] = [];
  public addTickerToState = jest.fn();
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getName = () => {
    return this.name;
  }
}
