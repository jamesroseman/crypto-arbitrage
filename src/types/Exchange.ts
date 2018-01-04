import { CryptoCurrencies, Currencies, ICurrencyPair } from "./Currency";
import { ExchangeState } from "./ExchangeState";
import { ExchangeStreamTickerRequest } from "./ExchangeStreamTickerRequest";
import { ITickerUpdate } from "./TickerUpdate";

export interface IExchange {
  consumeMsg(msg: any): boolean;
  getName(): string;
  getState(): ExchangeState;
  initialize(): void;
  isValidMsg(msg: any): boolean;
  isHeartbeatMsg(msg: any): boolean;
  isTickerMsg(msg: any): boolean;
  setOnTickerUpdate(onUpdate: (update: ITickerUpdate, state: ExchangeState) => void): boolean;
}

export abstract class Exchange implements IExchange {
  public abstract isValidMsg: (msg: any) => boolean;
  public abstract isHeartbeatMsg: (msg: any) => boolean;
  public abstract isSubscriptionMsg: (msg: any) => boolean;
  public abstract isTickerMsg: (msg: any) => boolean;

  protected isExchangeConnectionInitialized: boolean;
  protected isTickerInitialized: boolean;
  protected name: string;
  protected shortName: string;
  protected state: ExchangeState;
  protected getCurrencyPairFromMsg: (msg: any) => ICurrencyPair;
  protected getTickerUpdateFromMsg: (msg: any, currPair: ICurrencyPair, state: ExchangeState) => ITickerUpdate;
  protected onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void;

  protected abstract initializeExchangeConnection: () => void;
  protected abstract initializeExchangeTicker: () => void;

  constructor(
    name: string,
    shortName: string,
    /* tslint:disable:no-empty */
    onTickerUpdate: (update: ITickerUpdate, state: ExchangeState) => void = (u, s) => {},
    state?: ExchangeState | undefined,
  ) {
    this.name = name;
    this.shortName = shortName;
    this.onTickerUpdate = onTickerUpdate;
    this.state = state ? state : new ExchangeState(name + "State");
  }

  public consumeMsg = (msg: any): boolean => {
    if (!this.isValidMsg(msg)) {
      return false;
    } else if (this.isSubscriptionMsg(msg)) {
      // Do something with subscription msg
      return true;
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

  public setGetCurrencyPairFromMsg = (getCurrencyPairFromMsg: (msg: any) => ICurrencyPair) => {
    this.getCurrencyPairFromMsg = getCurrencyPairFromMsg;
  }

  public setGetTickerUpdateFromMsg = (
    getTickerUpdateFromMsg: (msg: any, currPair: ICurrencyPair, state: ExchangeState) => ITickerUpdate,
  ) => {
    this.getTickerUpdateFromMsg = getTickerUpdateFromMsg;
  }

  public setOnTickerUpdate(onUpdate: (update: ITickerUpdate, state: ExchangeState) => void) {
    this.onTickerUpdate = onUpdate;
    return true;
  }

  public initialize() {
    this.initializeExchangeConnection();
    this.initializeExchangeTicker();
  }
}
