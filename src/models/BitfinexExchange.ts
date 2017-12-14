import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getCurrencyPairFromMsg,
  getTickerUpdateFromMsgData,
  WSS_URL,
} from "../constants/BitfinexExchange";
import {
  BitfinexStreamTickerRequest,
} from "../models";
import {
  ICurrencyPair,
  IExchange,
  ITickerUpdate,
} from "../types";

interface IChannelMap {
    [key: string]: ICurrencyPair;
}

export class BitfinexExchange implements IExchange {
  public onTickerUpdate: (update: ITickerUpdate) => void;
  private wss: WebSocket;
  private channelMap: Map<string, ICurrencyPair> = {};

  constructor(onTickerUpdate: (update: ITickerUpdate) => void) {
    this.onTickerUpdate = onTickerUpdate;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: BitfinexStreamTickerRequest): void => {
    this.wss.onopen = () => {
      req.cryptoCurrencies.forEach((crypto) => {
        this.wss.send(assembleTickerSubscriptionMsg(crypto, req.currency));
      });
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data);
    if (msgData.hasOwnProperty("event") && msgData.event === "subscribed") {
      // This is a Bitfinex subscription message
      this.channelMap[msgData.chanId] = getCurrencyPairFromMsg(msgData.pair);
    } else if (msgData.length === 11) {
      // This is a Bitfinex ticker message
      const currencyPair: ICurrencyPair = this.channelMap[msgData[0]];
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromMsgData(msgData, currencyPair);
      this.onTickerUpdate(tickerUpdate);
    }
  }
}
