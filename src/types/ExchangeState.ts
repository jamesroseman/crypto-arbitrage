import { CryptoCurrencies, Currencies } from "./Currency";
import { ITickerUpdate } from "./Exchange";

interface ICurrencyHistory {
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
  public name: string;
  public timestamps: number[] = [];

  constructor(name: string, cryptoCurrencies: CryptoCurrencies[]) {
    this.name = name;
    cryptoCurrencies.map((cryptoCurr) => {
      this.currencies[cryptoCurr] = {
        latestAskPrice: 0,
        latestBidPrice: 0,
      } as ICurrencyHistory;
    });
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.currencies[update.cryptoCurrency.toString()].latestAskPrice = update.askPrice;
    this.currencies[update.cryptoCurrency.toString()].latestBidPrice = update.bidPrice;
    this.currencies[update.cryptoCurrency.toString()].lastTimestamp = update.timestamp;
  }
}
