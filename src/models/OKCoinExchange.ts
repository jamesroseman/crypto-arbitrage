import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromOKCoinUpdate,
  WSS_URL,
} from "../constants/OKCoinExchange";
import {
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  ITickerUpdate,
} from "../types";

export class OKCoinExchange implements IExchange {
  public onTickerUpdate: (update: ITickerUpdate) => void;
  private wss: WebSocket;

  constructor(onTickerUpdate: (update: ITickerUpdate) => void) {
    this.onTickerUpdate = onTickerUpdate;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.wss.onopen = () => {
      req.cryptoCurrencies.forEach((crypto) => {
        this.wss.send(assembleTickerSubscriptionMsg(crypto, req.currency));
      });
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data)[0];
    if (msgData.channel.startsWith("ok_sub_spot_")) {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromOKCoinUpdate(msgData);
      this.onTickerUpdate(tickerUpdate);
    }
  }
}
