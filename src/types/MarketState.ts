import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { IMarketUpdate } from "./MarketUpdate";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarketUpdatesByTimestamp {
  [timestamp: number]: {
    [crypto: string]: IMarketUpdate,
  };
}

export interface IMarketState {
  getExchanges(): Exchange[];
  getName(): string;
}

export class MarketState implements IMarketState {
  public static createInitialMarketUpdate = (
    cryptoCurrency: CryptoCurrencies,
    exchanges: Exchange[],
    timestamp: number,
  ) => {
    const exchangeToTickerMap: { [exchangeName: string]: ITickerUpdate } = {};
    exchanges.forEach((exchange: Exchange) => {
      exchangeToTickerMap[exchange.getName()] = MarketState.createInitialTickerUpdate(cryptoCurrency);
    });
    return {
      cryptoCurrency,
      timestamp,
      updates: exchangeToTickerMap,
    } as IMarketUpdate;
  }

  public static createInitialMarketUpdatesByTimestamp = (
    cryptos: CryptoCurrencies[],
    exchanges: Exchange[],
    timestamp: number,
  ) => {
    const initialMarketUpdateByCrypto: { [crypto: string]: IMarketUpdate } = {};
    cryptos.forEach((crypto) => {
      initialMarketUpdateByCrypto[crypto] = MarketState.createInitialMarketUpdate(crypto, exchanges, timestamp);
    });
    return {
      [timestamp]: { ...initialMarketUpdateByCrypto },
    } as IMarketUpdatesByTimestamp;
  }

  public static createInitialTickerUpdate = (cryptoCurrency: CryptoCurrencies) => {
    return {
      askPrice: 0,
      bidPrice: 0,
      cryptoCurrency,
      currency: Currencies.USD,
      timestamp: 0,
    } as ITickerUpdate;
  }

  private exchanges: Exchange[];
  private latestTimestamp: number;
  private marketUpdatesByTimestamp: IMarketUpdatesByTimestamp = {};
  private name: string;
  private supportedCryptos: CryptoCurrencies[] =
    [CryptoCurrencies.Bitcoin, CryptoCurrencies.Ethereum, CryptoCurrencies.Litecoin];

  constructor(name: string, exchanges: Exchange[]) {
    this.name = name;
    this.exchanges = exchanges;
    const nowTimestamp: number = new Date().getTime();
    this.marketUpdatesByTimestamp = MarketState.createInitialMarketUpdatesByTimestamp(
      this.supportedCryptos,
      this.exchanges,
      nowTimestamp,
    );
  }

  public getExchanges = () => {
    return this.exchanges;
  }

  public getName = () => {
    return this.name;
  }
}
