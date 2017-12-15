import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getCurrencyPairFromMsg,
  getTickerUpdateFromMsgData,
  WSS_URL,
} from "../constants/BitfinexExchange";
import {
  CryptoCurrencies,
  ExchangeState,
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  IExchangeState,
  ITickerUpdate,
} from "../types";

export class BitfinexExchange implements IExchange {
  public name: string;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public state: ExchangeState;
  private wss: WebSocket;
  private channelMap: { [key: string]: ICurrencyPair } = {};
  private cryptos: CryptoCurrencies[];

  constructor(name: string) {
    this.name = name;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.onTickerUpdate = req.onTickerUpdate;
    this.cryptos = req.cryptoCurrencies;
    this.state = new ExchangeState(this.name, this.cryptos);
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
      this.state.addTickerToState(tickerUpdate);
      this.onTickerUpdate(tickerUpdate, this.state);
    }
  }
}
