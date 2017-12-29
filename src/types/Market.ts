import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { IStreamTickerRequest } from "./ExchangeStreamTickerRequest";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarketState {
  [exchange: string]: {
    tickerUpdates: ITickerUpdate[],
    timestamps: number,
  };
}

export interface IMarket {
  getAllTickerUpdates(exchange?: Exchange): ITickerUpdate[];
  initializeExchangeTickers(): void;
}

export class Market implements IMarket {
  private exchanges: Exchange[] = [];
  private onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void;
  private state: IMarketState;

  constructor(
    exchanges: Exchange[],
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
  ) {
    this.exchanges = exchanges;
    this.onTickerUpdate = onTickerUpdate;
    this.exchanges.forEach((e: Exchange) => {
      const currentOnTickerUpdate = e.getOnTickerUpdate();
      e.setOnTickerUpdate((update: ITickerUpdate, state: ExchangeState) => {
        this.onTickerUpdate(update, state);
        this.addTickerToState(update);
        currentOnTickerUpdate(update, state);
      });
    });
  }

  public addTickerToState = (update: ITickerUpdate) => {
    this.state[exchange.getName()]
  }

  public getAllTickerUpdates = (exchange?: Exchange) => {
    return this.state[exchange.getName()].tickerUpdates;
  }

  public initializeExchangeTickers = () => {
    this.exchanges.forEach((e: Exchange) => {
      e.initializeExchangeTicker();
    });
  }
}
