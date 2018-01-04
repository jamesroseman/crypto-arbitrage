import * as WebSocket from "ws";
import {
  CryptoCurrencies,
  Currencies,
  Exchange,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

const BITFINEX_EXCHANGE_NAME = "Bitfinex";
const BITFINEX_EXCHANGE_SHORT_NAME = "BFNX";
// From the Bitfinex WebSocket API: https://docs.bitfinex.com/v1/reference#ws-public-ticker
// [ CHANNEL_ID, BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW]
const BITFINEX_MSG_INDEX = {
  ASK: 3,
  BID: 1,
  CHANNEL_ID: 0,
};
const WSS_URL = "wss://api.bitfinex.com/ws";
const WSS_TICKER_CHANNEL = "ticker";
const WSS_SUBSCRIBE_EVENT = "subscribe";

export class BitfinexExchange extends Exchange {
  public static currencyPairToSubscriptionPair = (pair: ICurrencyPair) => {
    let subscriptionPair: string = "";
    // Currency pair crypto prefix
    if (pair.cryptoCurrency === CryptoCurrencies.Bitcoin) {
      subscriptionPair += "BTC";
    } else if (pair.cryptoCurrency === CryptoCurrencies.Ethereum) {
      subscriptionPair += "ETH";
    } else if (pair.cryptoCurrency === CryptoCurrencies.Litecoin) {
      subscriptionPair += "LTC";
    } else {
      throw new Error("Invalid crypto currency for Bitfinex Exchange: " + pair.cryptoCurrency);
    }
    // Currency pair currency postfix
    if (pair.currency === Currencies.USD) {
      subscriptionPair += "USD";
    } else {
      throw new Error("Invalid currency for Bitfinex Exchange: " + pair.currency);
    }
    return subscriptionPair;
  }

  public static subscriptionPairToCurrencyPair = (pair: string) => {
    let currency: Currencies | null = null;
    let cryptoCurrency: CryptoCurrencies | null = null;
    if (pair.indexOf("BTC") === 0) {
      cryptoCurrency = CryptoCurrencies.Bitcoin;
    } else if (pair.indexOf("ETH") === 0) {
      cryptoCurrency = CryptoCurrencies.Ethereum;
    } else if (pair.indexOf("LTC") === 0) {
      cryptoCurrency = CryptoCurrencies.Litecoin;
    }
    if (pair.indexOf("USD") >= 1) {
      currency = Currencies.USD;
    }
    if (currency == null || cryptoCurrency == null) {
      throw new Error("Can't find valid currency pair from Bitfinex message.");
    }
    return { currency, cryptoCurrency } as ICurrencyPair;
  }

  private channelToCurrencyPairMap: { [channelId: number]: ICurrencyPair } = {};
  private cryptoCurrencies: CryptoCurrencies[];
  private currencies: Currencies[];
  private ws: WebSocket;

  constructor(
    cryptoCurrencies: CryptoCurrencies[],
    currencies: Currencies[],
  ) {
    super(BITFINEX_EXCHANGE_NAME, BITFINEX_EXCHANGE_SHORT_NAME);
    this.cryptoCurrencies = cryptoCurrencies;
    this.currencies = currencies;
    this.setGetCurrencyPairFromMsg(this.getCurrencyPairFromMsg);
    this.setGetTickerUpdateFromMsg(this.getTickerUpdateFromMsg);
  }

  public getCurrencyPairFromMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data);
    if (Array.isArray(msgData)) {
      return this.channelToCurrencyPairMap[msgData[BITFINEX_MSG_INDEX.CHANNEL_ID]];
    }
    throw new Error("Invalid Bitfinex message for converting to currency pair: " + msgData);
  }

  public getTickerUpdateFromMsg = (msg: any, currPair: ICurrencyPair, state: ExchangeState) => {
    const msgData = JSON.parse(msg.data);
    if (Array.isArray(msgData) && msgData.length === 11) {
      const now: Date = new Date();
      return {
        askPrice: msgData[BITFINEX_MSG_INDEX.ASK],
        bidPrice: msgData[BITFINEX_MSG_INDEX.BID],
        cryptoCurrency: currPair.cryptoCurrency,
        currency: currPair.currency,
        timestamp: now.getTime(),
      } as ITickerUpdate;
    }
    throw new Error("Invalid Bitfinex message for converting to ticker update: " + msgData);
  }

  public isValidMsg = (msg: any) => {
    try {
      JSON.parse(msg.data);
      return true;
    } catch (e) {
      return false;
    }
  }

  public isHeartbeatMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data);
    return Array.isArray(msgData) && msgData.length === 2;
  }

  public isSubscriptionMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data);
    if (msgData.hasOwnProperty("event") && msgData.event === "subscribed") {
      this.channelToCurrencyPairMap[msgData.chanId] = BitfinexExchange.subscriptionPairToCurrencyPair(msgData.pair);
      return true;
    }
    return false;
  }

  public isTickerMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data);
    return Array.isArray(msgData) && msgData.length === 11;
  }

  protected initializeExchangeConnection = () => {
    this.ws = new WebSocket(WSS_URL);
    this.ws.onmessage = this.consumeMsg;
  }

  protected initializeExchangeTicker = () => {
    this.ws.onopen = () => {
      this.cryptoCurrencies.forEach((cryptoCurrency: CryptoCurrencies) => {
        this.currencies.forEach((currency: Currencies) => {
          this.ws.send(this.assembleTickerSubscriptionMsg(cryptoCurrency, currency));
        });
      });
    };
  }

  private assembleTickerSubscriptionMsg = (cryptoCurrency: CryptoCurrencies, currency: Currencies) => {
    return JSON.stringify({
      channel: WSS_TICKER_CHANNEL,
      event: WSS_SUBSCRIBE_EVENT,
      pair: BitfinexExchange.currencyPairToSubscriptionPair({ cryptoCurrency, currency } as ICurrencyPair),
    });
  }
}
