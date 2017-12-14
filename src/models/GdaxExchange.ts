import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromGdaxUpdate,
  WSS_URL,
} from "../constants/GdaxExchange";
import {
  GdaxStreamTickerRequest,
} from "../models";
import {
  ICurrencyPair,
  IExchange,
  ITickerUpdate,
} from "../types";

export class GdaxExchange implements IExchange {
  public onTickerUpdate: (update: ITickerUpdate) => void;
  private wss: WebSocket;

  constructor(onTickerUpdate: (update: ITickerUpdate) => void) {
    this.onTickerUpdate = onTickerUpdate;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: GdaxStreamTickerRequest): void => {
    this.wss.onopen = () => {
      this.wss.send(assembleTickerSubscriptionMsg(req.cryptoCurrencies, req.currency));
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data);
    if (msgData.type === "ticker") {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromGdaxUpdate(msgData);
      this.onTickerUpdate(tickerUpdate);
    }
  }
}
