import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromGdaxUpdate,
  WSS_URL,
} from "../constants/GdaxExchange";
import {
  ExchangeState,
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  IExchangeState,
  ITickerUpdate,
} from "../types";

export class GdaxExchange implements IExchange {
  public name: string;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public state: ExchangeState;
  private ws: WebSocket;

  constructor(name: string) {
    this.name = name;
    this.ws = new WebSocket(WSS_URL);
    this.ws.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.onTickerUpdate = req.onTickerUpdate;
    this.state = new ExchangeState(this.name, req.cryptoCurrencies);
    this.ws.onopen = () => {
      this.ws.send(assembleTickerSubscriptionMsg(req.cryptoCurrencies, req.currency));
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data);
    if (msgData.type === "ticker") {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromGdaxUpdate(msgData);
      this.state.addTickerToState(tickerUpdate);
      this.onTickerUpdate(tickerUpdate, this.state);
    }
  }
}
