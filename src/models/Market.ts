import {
  IExchange,
  IExchangePrice,
  IExchangeState,
  IMarket,
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
    this.state = {
      prices: [],
      timestamps: [],
    } as IMarketState;
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
      const exchangePrices = {};
      this.exchanges.forEach((exchange) =>
        exchangePrices[exchange.name] = {
          buyingPrice: exchange.state.currencies[update.cryptoCurrency].latestBuyingPrice,
          exchangeName: exchange.name,
          sellingPrice: exchange.state.currencies[update.cryptoCurrency].latestSellingPrice,
        } as IExchangePrice);
      // Push market prices and timestamp at the same time
      this.state.prices.push({
        exchangePrices,
        timestamp,
      } as IMarketPrice);
      this.state.timestamps.push(timestamp);
      onTickerUpdate(update, exchangeState);
    }
}
