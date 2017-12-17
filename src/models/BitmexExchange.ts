import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromBitmexUpdate,
  WSS_URL,
} from "../constants/BitmexExchange";
import {
  CryptoCurrencies,
  Currencies,
  ExchangeState,
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  IExchangeState,
  ITickerUpdate,
} from "../types";

export class BitmexExchange implements IExchange {
  public name: string;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public state: ExchangeState;
  private ws: WebSocket;
  private cryptos: CryptoCurrencies[];
  private currency: Currencies;
  private lastXbtBidPrice: number;
  private lastXbtAskPrice: number;
  private xbtPriceSet: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.ws = new WebSocket(WSS_URL);
    this.ws.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.onTickerUpdate = req.onTickerUpdate;
    this.cryptos = req.cryptoCurrencies;
    this.state = new ExchangeState(this.name, this.cryptos);
    this.currency = req.currency;
    this.ws.onopen = () => {
      this.ws.send(assembleTickerSubscriptionMsg(req.cryptoCurrencies, req.currency));
    };
  }

  private deconstructMsg = (msg: any): void => {
    let msgData;
    try {
      msgData = JSON.parse(msg.data);
    } catch (e) {
      console.error(e);
    }
    if (msgData.hasOwnProperty("table") && msgData.table === "quote") {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromBitmexUpdate(msgData);
      // Check if this is a XBT/USD price we only need for translating XBT prices,
      // or if it's actually wanted.
      if (tickerUpdate.cryptoCurrency === CryptoCurrencies.Bitcoin) {
        this.lastXbtAskPrice = tickerUpdate.askPrice;
        this.lastXbtBidPrice = tickerUpdate.bidPrice;
        this.xbtPriceSet = true;
      }
      const updateContainsCrypto: boolean = this.cryptos.filter((c) => c === tickerUpdate.cryptoCurrency).length > 0;
      if (updateContainsCrypto && this.xbtPriceSet) {
        if (tickerUpdate.currency !== this.currency && tickerUpdate.currency === Currencies.XBT) {
          // Translate XBT price
          tickerUpdate.askPrice *= this.lastXbtAskPrice;
          tickerUpdate.bidPrice *= this.lastXbtBidPrice;
          tickerUpdate.currency = Currencies.USD;
        }
        this.state.addTickerToState(tickerUpdate);
        this.onTickerUpdate(tickerUpdate, this.state);
      }
    }
  }
}
