import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromOKCoinUpdate,
  WSS_URL,
} from "../constants/OKCoinExchange";
import {
  ExchangeState,
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  IExchangeState,
  ITickerUpdate,
} from "../types";

export class OKCoinExchange implements IExchange {
  public name: string;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public state: ExchangeState;
  private wss: WebSocket;

  constructor(name: string) {
    this.name = name;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.onTickerUpdate = req.onTickerUpdate;
    this.state = new ExchangeState(this.name, req.cryptoCurrencies);
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
      this.state.addTickerToState(tickerUpdate);
      this.onTickerUpdate(tickerUpdate, this.state);
    }
  }
}
