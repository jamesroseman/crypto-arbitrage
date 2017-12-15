import { CryptoCurrencies, Currencies } from "./Currency";
import { ITickerUpdate } from "./Exchange";

interface ICurrencyHistory {
  latestBuyingPrice: number;
  latestSellingPrice: number;
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
  private maxHistoryLength: number;

  constructor(name: string, cryptoCurrencies: CryptoCurrencies[], maxHistoryLength: number) {
    this.name = name;
    cryptoCurrencies.map((cryptoCurr) => {
      this.currencies[cryptoCurr] = {
        latestBuyingPrice: 0,
        latestSellingPrice: 0,
      } as ICurrencyHistory;
    });
    this.maxHistoryLength = maxHistoryLength;
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.currencies[update.cryptoCurrency.toString()].latestBuyingPrice = update.buyingPrice;
    this.currencies[update.cryptoCurrency.toString()].latestSellingPrice = update.sellingPrice;
  }
}
