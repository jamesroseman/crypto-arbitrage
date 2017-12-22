import { CryptoCurrencies, Currencies } from "./Currency";
import { ITickerUpdate } from "./TickerUpdate";

export interface ICurrencyHistory {
  latestAskPrice: number;
  latestBidPrice: number;
  lastTimestamp: number;
}

export interface IExchangeState {
  currencies: {
    [cryptoCurrency: string]: ICurrencyHistory;
  };
  getName(): string;
}

export class ExchangeState implements IExchangeState {
  public currencies: { [cryptoCurrency: string]: ICurrencyHistory } = {};
  public timestamps: number[] = [];
  protected name: string;

  constructor(name: string) {
    this.name = name;
    [
      CryptoCurrencies.Bitcoin,
      CryptoCurrencies.Ethereum,
      CryptoCurrencies.Litecoin,
    ].map((cryptoCurr) => {
      this.currencies[cryptoCurr] = {
        latestAskPrice: 0,
        latestBidPrice: 0,
      } as ICurrencyHistory;
    });
  }

  public getName = () => {
    return this.name;
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.currencies[update.cryptoCurrency.toString()].latestAskPrice = update.askPrice;
    this.currencies[update.cryptoCurrency.toString()].latestBidPrice = update.bidPrice;
    this.currencies[update.cryptoCurrency.toString()].lastTimestamp = update.timestamp;
  }
}
