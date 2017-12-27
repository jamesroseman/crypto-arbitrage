import { CryptoCurrencies, Currencies } from "./Currency";
import { ITickerUpdate } from "./TickerUpdate";

export interface IExchangeState {
  createInitialTickerUpdate(cryptoCurrency: CryptoCurrencies): ITickerUpdate;
  getName(): string;
  getLatestTickerUpdate(cryptoCurrency: CryptoCurrencies): ITickerUpdate;
}

export class ExchangeState implements IExchangeState {
  private latestTickerUpdateByCrypto: { [cryptoCurrency: string]: ITickerUpdate } = {};
  private name: string;

  constructor(name: string) {
    this.name = name;
    [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin].forEach((cryptoCurr) => {
      this.latestTickerUpdateByCrypto[cryptoCurr] = this.createInitialTickerUpdate(cryptoCurr);
    });
  }

  public createInitialTickerUpdate = (cryptoCurrency: CryptoCurrencies) => {
    return {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
  }

  public getName = () => {
    return this.name;
  }

  public getLatestTickerUpdate = (cryptoCurrency: CryptoCurrencies) => {
    return this.latestTickerUpdateByCrypto[cryptoCurrency];
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.latestTickerUpdateByCrypto[update.cryptoCurrency] = update;
  }
}
