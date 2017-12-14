import * as WebSocket from "ws";
import {
  assembleTickerSubscriptionMsg,
  getTickerUpdateFromBitmexUpdate,
  WSS_URL,
} from "../constants/BitmexExchange";
import {
  CryptoCurrencies,
  Currencies,
  ExchangeStreamTickerRequest,
  ICurrencyPair,
  IExchange,
  ITickerUpdate,
} from "../types";

export class BitmexExchange implements IExchange {
  public onTickerUpdate: (update: ITickerUpdate) => void;
  private wss: WebSocket;
  private cryptos: CryptoCurrencies[];
  private currency: Currencies;
  private lastXbtBuyPrice: number;
  private lastXbtSellPrice: number;
  private xbtPriceSet: boolean = false;

  constructor(onTickerUpdate: (update: ITickerUpdate) => void) {
    this.onTickerUpdate = onTickerUpdate;
    this.wss = new WebSocket(WSS_URL);
    this.wss.onmessage = this.deconstructMsg;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.cryptos = req.cryptoCurrencies;
    this.currency = req.currency;
    this.wss.onopen = () => {
      this.wss.send(assembleTickerSubscriptionMsg(req.cryptoCurrencies, req.currency));
    };
  }

  private deconstructMsg = (msg: any): void => {
    const msgData = JSON.parse(msg.data);
    if (msgData.hasOwnProperty("table") && msgData.table === "quote") {
      const tickerUpdate: ITickerUpdate = getTickerUpdateFromBitmexUpdate(msgData);
      // Check if this is a XBT/USD price we only need for translating XBT prices,
      // or if it's actually wanted.
      if (tickerUpdate.cryptoCurrency === CryptoCurrencies.Bitcoin) {
        this.lastXbtBuyPrice = tickerUpdate.buyingPrice;
        this.lastXbtSellPrice = tickerUpdate.sellingPrice;
        this.xbtPriceSet = true;
      }
      const updateContainsCrypto: boolean = this.cryptos.filter((c) => c === tickerUpdate.cryptoCurrency).length > 0;
      if (updateContainsCrypto && this.xbtPriceSet) {
        if (tickerUpdate.currency !== this.currency && tickerUpdate.currency === Currencies.XBT) {
          // Translate XBT price
          tickerUpdate.buyingPrice *= this.lastXbtBuyPrice;
          tickerUpdate.sellingPrice *= this.lastXbtSellPrice;
          tickerUpdate.currency = Currencies.USD;
        }
        this.onTickerUpdate(tickerUpdate);
      }
    }
  }
}
