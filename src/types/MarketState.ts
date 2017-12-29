import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { IMarketUpdate } from "./MarketUpdate";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarketState {
  addTickerToState(tickerUpdate: ITickerUpdate): void;
  createInitialTickerUpdate(exchanges: Exchange[]): IMarketUpdate;
  getExchanges(): Exchange[];
  getLatestMarketUpdate(cryptoCurrency: CryptoCurrencies): IMarketUpdate;
  getLatestTimestamp(): number;
  getMarketUpdateFromTickerUpdate(update: ITickerUpdate): IMarketUpdate;
  getName(): string;
}

export class MarketState implements IMarketState {
  private exchanges: Exchange[];
  private latestTimestamp: number;
  private marketUpdatesByTimestamp: {
    [timestamp: number]: {
      [crypto: string]: IMarketUpdate,
    },
  } = {};
  private name: string;
  private supportedCryptos: CryptoCurrencies[] =
    [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin];

  constructor(name: string, exchanges: Exchange[]) {
    this.name = name;
    this.exchanges = exchanges;
    // [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin].forEach((cryptoCurr) => {
    //   this.addTickerToState(this.createInitialTickerUpdate(cryptoCurr));
    // });
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

  public getExchanges = () => {
    return this.exchanges;
  }

  public getMarketUpdateFromTickerUpdate = (update: ITickerUpdate) => {
    const ts: number = update.timestamp;
  }

  public getName = () => {
    return this.name;
  }
}
