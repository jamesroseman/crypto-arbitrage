import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromBitmexUpdate,
  WSS_URL,
} from "../constants/BitmexExchange";
import {
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  ITickerUpdate,
} from "../types";

export class BitmexExchange implements IExchange {
  public onTickerUpdate: (update: ITickerUpdate) => void;
  private wss: WebSocket;

  constructor(onTickerUpdate: (update: ITickerUpdate) => void) {
    this.onTickerUpdate = onTickerUpdate;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.wss.onopen = () => {
      this.wss.send(assembleTickerSubscriptionMsg(req.cryptoCurrencies, req.currency));
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data);
    if (msgData.hasOwnProperty("table") && msgData.table === "quote") {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromBitmexUpdate(msgData);
      this.onTickerUpdate(tickerUpdate);
    }
  }
}
