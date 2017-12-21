import * as WebSocket from "ws";
import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { ExchangeState } from "./ExchangeState";
import { ExchangeStreamTickerRequest } from "./ExchangeStreamTickerRequest";
import { ITickerUpdate } from "./TickerUpdate";

export interface IExchange {
  isValidMsg(msg: string): boolean;
  isHeartbeatMsg(msg: string): boolean;
  isTickerMsg(msg: string): boolean;
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
    isHeartbeatMsg: (msg: string) => boolean,
    isTickerMsg: (msg: string) => boolean,
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void,
    state?: ExchangeState,
  ) {
    this.name = name;
    this.getCurrencyPairFromMsg = getCurrencyPairFromMsg,
    this.getTickerUpdateFromMsg = getTickerUpdateFromMsg,
    this.onTickerUpdate = onTickerUpdate;
    state = state ? state : new ExchangeState(name);
  }

  public abstract isValidMsg(msg: string): boolean;
  public abstract isHeartbeatMsg(msg: string): boolean;
  public abstract isTickerMsg(msg: string): boolean;

  public deconstructMsg = (msg: string): boolean => {
    if (!this.isValidMsg(msg)) {
      return true;
    } else if (this.isHeartbeatMsg(msg)) {
      // Do something with HB msg
      return false;
    } else if (this.isTickerMsg(msg)) {
      const currPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
      const tickerUpdate: ITickerUpdate = this.getTickerUpdateFromMsg(msg, currPair, this.state);
      this.state.addTickerToState(tickerUpdate);
      this.onTickerUpdate(tickerUpdate, this.state);
      return true;
    }
  }

  protected abstract initializeExchangeConnection(): boolean;
  protected abstract initializeExchangeTicker(): boolean;

  protected initialize() {
    this.initializeExchangeConnection();
    this.initializeExchangeTicker();
  }
}
