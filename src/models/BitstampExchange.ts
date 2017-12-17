import * as Bitstamp from "bitstamp-ws";
import * as WebSocket from "ws";
import {
  currenciesToOptions,
  getTickerUpdateFromBitstampUpdate,
  WSS_TICKER_CHANNEL_NAME,
  WSS_URL,
} from "../constants/BitstampExchange";
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

export class BitstampExchange implements IExchange {
  public name: string;
  public onTickerUpdate: (update: ITickerUpdate, state: IExchangeState) => void;
  public state: ExchangeState;
  private ws: Bitstamp;
  private crypto: CryptoCurrencies;
  private currency: Currencies;

  constructor(name: string) {
    this.name = name;
  }

  public streamTickerPrices = (req: ExchangeStreamTickerRequest): void => {
    this.crypto = req.cryptoCurrencies[0];
    this.currency = req.currency;
    this.ws = new Bitstamp(currenciesToOptions(req.cryptoCurrencies, req.currency));
    this.ws.on("data", this.deconstructMsg);
    this.onTickerUpdate = req.onTickerUpdate;
    this.state = new ExchangeState(this.name, req.cryptoCurrencies);
  }

  private deconstructMsg = (msg: any): void => {
    const tickerUpdate: ITickerUpdate = getTickerUpdateFromBitstampUpdate(
      this.crypto,
      this.currency,
      this.state.currencies[this.crypto].latestAskPrice,
      this.state.currencies[this.crypto].latestBidPrice,
      msg,
    );
    this.state.addTickerToState(tickerUpdate);
    this.onTickerUpdate(tickerUpdate, this.state);
  }
}
