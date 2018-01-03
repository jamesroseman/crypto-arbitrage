import { CryptoCurrencies, Currencies } from "./Currency";
import { Exchange } from "./Exchange";
import { ExchangeState } from "./ExchangeState";
import { MarketState } from "./MarketState";
import { ITickerUpdate } from "./TickerUpdate";

export interface IMarket {
  getName(): string;
  initialize(): void;
}

export class Market implements IMarket {
  private exchanges: Exchange[];
  private name: string;
  private onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void;
  private state: MarketState;

  constructor(
    name: string,
    exchanges: Exchange[],
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
    state?: MarketState | undefined,
  ) {
    this.name = name;
    this.exchanges = exchanges;
    this.onTickerUpdate = onTickerUpdate;
    this.state = state ? state : new MarketState(name + "State", exchanges);
  }

  public getName = () => {
    return this.name;
  }

  public getOnTickerUpdate = () => {
    return this.onTickerUpdate;
  }

  public getState = () => {
    return this.state;
  }

  public setOnTickerUpdate = (onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void) => {
    this.onTickerUpdate = onTickerUpdate;
  }

  public initialize = () => {
    this.exchanges.forEach((exchange: Exchange) => {
      const currentOnTickerUpdate = exchange.getOnTickerUpdate();
      exchange.setOnTickerUpdate((update: ITickerUpdate, state: ExchangeState) => {
        this.state.addTickerToState(update, exchange.getName());
        this.onTickerUpdate(update, state);
        currentOnTickerUpdate(update, state);
      });
      exchange.initialize();
    });
  }
}
