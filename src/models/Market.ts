import {
  AllCryptoCurrencies,
  CryptoCurrencies,
  IExchange,
  IExchangePrice,
  IExchangeState,
  IMarket,
  IMarketCurrencyState,
  IMarketPrice,
  IMarketState,
  IStreamTickerRequest,
  ITickerUpdate,
} from "../types";

export class Market implements IMarket {
  public state: IMarketState;
  private exchanges: IExchange[] = [];

  constructor(exchanges: IExchange[]) {
    this.exchanges = exchanges;
    this.state = {} as IMarketState;
    // Initialize state to hold all cryptocurrencies
    AllCryptoCurrencies.forEach((crypto: CryptoCurrencies) => {
      this.state[crypto] = {
        lastActiveTimestamp: 0,
        prices: [],
        timestamps: [],
      } as IMarketCurrencyState;
    });
  }

  public streamTickerPrices = (req: IStreamTickerRequest) => {
    req.onTickerUpdate = this.updateMarketStateFromTicker(req.onTickerUpdate);
    this.exchanges.forEach((exchange: IExchange) => {
      exchange.streamTickerPrices(req);
    });
  }

  private updateMarketStateFromTicker = (onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void) =>
    (update: ITickerUpdate, exchangeState: IExchangeState) => {
      const now: Date = new Date();
      const timestamp: number = now.getTime();
      // If the last stored datapoints are less than 500 milliseconds ago, don't store
      // We check Bitcoin only because it's the first enum and all are updated together
      if (timestamp - this.state[CryptoCurrencies.Bitcoin].lastActiveTimestamp < 500) {
        return;
      }
      AllCryptoCurrencies.forEach((crypto: CryptoCurrencies) => {
        this.state[crypto].lastActiveTimestamp = timestamp;
        let lowestPrice: number = Number.MAX_VALUE;
        const exchangePrices = {};
        this.exchanges.forEach((exchange) => {
          lowestPrice = Math.min(
            lowestPrice,
            exchange.state.currencies[crypto].latestAskPrice,
            exchange.state.currencies[crypto].latestBidPrice,
          );
          this.state[crypto].lowestPrice = lowestPrice;
          exchangePrices[exchange.name] = {
            askPrice: exchange.state.currencies[crypto].latestAskPrice,
            bidPrice: exchange.state.currencies[crypto].latestBidPrice,
            exchangeName: exchange.name,
          } as IExchangePrice;
        });
        // Push market prices and timestamp at the same time
        this.state[crypto].prices.push({
          exchangePrices,
          timestamp,
        } as IMarketPrice);
        this.state[crypto].timestamps.push(timestamp);
      });
      onTickerUpdate(update, exchangeState);
    }
}
