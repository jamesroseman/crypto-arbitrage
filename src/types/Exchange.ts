import * as WebSocket from "ws";
import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { ExchangeState } from "./ExchangeState";
import { ExchangeStreamTickerRequest } from "./ExchangeStreamTickerRequest";
import { ITickerUpdate } from "./TickerUpdate";

export interface IExchange {
  consumeMsg(msg: string): boolean;
  getName(): string;
  getState(): ExchangeState;
  initializeExchangeTicker(): void;
  isValidMsg(msg: string): boolean;
  isHeartbeatMsg(msg: string): boolean;
  isTickerMsg(msg: string): boolean;
  setOnTickerUpdate(onUpdate: (update: ITickerUpdate, state: ExchangeState) => void): boolean;
}

export abstract class Exchange implements IExchange {
  protected isExchangeConnectionInitialized: boolean;
  protected isTickerInitialized: boolean;
  protected name: string;
  protected state: ExchangeState;
  protected getCurrencyPairFromMsg: (msg: string) => ICurrencyPair;
  protected getTickerUpdateFromMsg: (msg: string, currPair: ICurrencyPair, state: ExchangeState) => ITickerUpdate;
  protected onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void;

  constructor(
    name: string,
    getCurrencyPairFromMsg: (msg: string) => ICurrencyPair,
    getTickerUpdateFromMsg: (msg: string, currPair: ICurrencyPair, state: ExchangeState) => ITickerUpdate,
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
    state?: ExchangeState | undefined,
  ) {
    this.name = name;
    this.getCurrencyPairFromMsg = getCurrencyPairFromMsg,
    this.getTickerUpdateFromMsg = getTickerUpdateFromMsg,
    this.onTickerUpdate = onTickerUpdate;
    this.state = state ? state : new ExchangeState(name + "State");
  }

  public abstract initializeExchangeTicker(): void;
  public abstract isValidMsg(msg: string): boolean;
  public abstract isHeartbeatMsg(msg: string): boolean;
  public abstract isTickerMsg(msg: string): boolean;

  public consumeMsg = (msg: string): boolean => {
    if (!this.isValidMsg(msg)) {
      return false;
    } else if (this.isHeartbeatMsg(msg)) {
      // Do something with HB msg
      return true;
    } else if (this.isTickerMsg(msg)) {
      const currPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
      const tickerUpdate: ITickerUpdate = this.getTickerUpdateFromMsg(msg, currPair, this.state);
      this.state.addTickerToState(tickerUpdate);
      this.onTickerUpdate(tickerUpdate, this.state);
      return true;
    }
    return false;
  }

  public getOnTickerUpdate = () => {
    return this.onTickerUpdate;
  }

  public getName = () => {
    return this.name;
  }

  public getState = () => {
    return this.state;
  }

  public setOnTickerUpdate(onUpdate: (update: ITickerUpdate, state: ExchangeState) => void) {
    this.onTickerUpdate = onUpdate;
    return true;
  }

  protected abstract initializeExchangeConnection(): void;

  protected initialize() {
    this.initializeExchangeConnection();
    this.initializeExchangeTicker();
  }
}
