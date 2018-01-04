import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { IMarketUpdate } from "./MarketUpdate";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarketUpdateByCrypto {
  [crypto: string]: IMarketUpdate;
}

export interface IMarketUpdatesByTimestamp {
  [timestamp: number]: IMarketUpdateByCrypto;
}

export interface IMarketState {
  addTickerToState(tickerUpdate: ITickerUpdate, exchangeName: string): void;
  getExchanges(): Exchange[];
  getLatestMarketUpdateCryptoMap(): IMarketUpdateByCrypto;
  getMarketUpdateCryptoMapByTimestamp(timestamp: number): IMarketUpdateByCrypto;
  getName(): string;
  getTimestamps(): number[];
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
    this.marketUpdatesByTimestamp = MarketState.createInitialMarketUpdatesByTimestamp(
      this.supportedCryptos,
      this.exchanges,
      0,
    );
    this.latestTimestamp = 0;
  }

  public addTickerToState = (tickerUpdate: ITickerUpdate, exchangeName: string) => {
    // After pushing all latest prices to the new timestamp, update the one exchange
    // named in the ticker update. This keeps market updates synchronized by timestamp
    this.duplicateStateForNewTimestamp(tickerUpdate.timestamp);
    this.marketUpdatesByTimestamp[tickerUpdate.timestamp][tickerUpdate.cryptoCurrency]
        .updates[exchangeName] = tickerUpdate;
    this.latestTimestamp = tickerUpdate.timestamp;
  }

  public getExchanges = () => {
    return this.exchanges;
  }

  public getLatestMarketUpdateCryptoMap = () => {
    return this.marketUpdatesByTimestamp[this.latestTimestamp];
  }

  public getLatestTimestamp = () => {
    return this.latestTimestamp;
  }

  public getMarketUpdateCryptoMapByTimestamp = (timestamp: number) => {
    if (this.marketUpdatesByTimestamp[timestamp]) {
      return this.marketUpdatesByTimestamp[timestamp];
    } else {
      return {};
    }
  }

  public getName = () => {
    return this.name;
  }

  public getTimestamps = () => {
    return Object.keys(this.marketUpdatesByTimestamp)
      .sort((a: string, b: string) => (parseInt(a, 10) - parseInt(b, 10)))
      .map((tsStr: string) => parseInt(tsStr, 10));
  }

  private duplicateStateForNewTimestamp = (timestamp: number) => {
    const duplicateMarketUpdate: IMarketUpdateByCrypto = this.marketUpdatesByTimestamp[this.latestTimestamp];
    // Update the MarketUpdate's timestamp
    this.supportedCryptos.forEach((crypto: CryptoCurrencies) => {
      duplicateMarketUpdate[crypto.valueOf()].timestamp = timestamp;
    });
    this.marketUpdatesByTimestamp[timestamp] = duplicateMarketUpdate;
  }
}
