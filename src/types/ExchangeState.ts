import { CryptoCurrencies, Currencies } from "./Currency";
import { ITickerUpdate } from "./TickerUpdate";

export interface IExchangeState {
  addTickerToState(update: ITickerUpdate): void;
  getName(): string;
  getLatestTickerUpdate(cryptoCurrency: CryptoCurrencies): ITickerUpdate;
}

export class ExchangeState implements IExchangeState {
  public static createInitialTickerUpdate = (cryptoCurrency: CryptoCurrencies) => {
    return {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
  }

  private latestTickerUpdateByCrypto: { [cryptoCurrency: string]: ITickerUpdate } = {};
  private name: string;
  private supportedCryptos: CryptoCurrencies[] =
    [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin];

  constructor(name: string) {
    this.name = name;
    this.supportedCryptos.forEach((cryptoCurr) => {
      this.addTickerToState(ExchangeState.createInitialTickerUpdate(cryptoCurr));
    });
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.latestTickerUpdateByCrypto[update.cryptoCurrency] = update;
  }

  public getLatestTickerUpdate = (cryptoCurrency: CryptoCurrencies) => {
    return this.latestTickerUpdateByCrypto[cryptoCurrency];
  }

  public getName = () => {
    return this.name;
  }
}
