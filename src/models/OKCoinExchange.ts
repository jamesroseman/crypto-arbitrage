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

// Warning: As of 12/15/2017 OKCoin is broken for US traders
export class OKCoinExchange implements IExchange {
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
      req.cryptoCurrencies.forEach((crypto) => {
        this.ws.send(assembleTickerSubscriptionMsg(crypto, req.currency));
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
