import * as WebSocket from "ws";
import {
  CryptoCurrencies,
  Currencies,
  Exchange,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

const OK_COIN_EXCHANGE_NAME = "OKCoin";
const OK_COIN_EXCHANGE_SHORT_NAME = "OK";
const WSS_URL = "wss://real.okcoin.com:10440/websocket";
const WSS_SUBSCRIBE_EVENT = "addChannel";

const contains = (str: string, toSearch: string) => {
  return str.indexOf(toSearch) >= 0;
};

interface IOKCoinTickerUpdate {
  channel: string;
  data: {
    buy: string,
    high: string,
    last: string,
    low: string,
    sell: string,
    timestamp: string,
    vol: string,
  };
}

export class OKCoinExchange extends Exchange {
  public static getCurrencyPairFromChannel = (channel: string) => {
    let cryptoCurrency: CryptoCurrencies;
    let currency: Currencies;
    if (contains(channel, "_btc_")) {
      cryptoCurrency = CryptoCurrencies.Bitcoin;
    } else if (contains(channel, "_eth_")) {
      cryptoCurrency = CryptoCurrencies.Ethereum;
    } else if (contains(channel, "_ltc_")) {
      cryptoCurrency = CryptoCurrencies.Litecoin;
    } else {
      throw new Error("Invalid OK Coin channel for converting to crypto-currency: " + channel);
    }
    if (contains(channel, "_usd_")) {
      currency = Currencies.USD;
    } else {
      throw new Error("Invalid OK Coin channel for converting to currency: " + channel);
    }
    return { cryptoCurrency, currency } as ICurrencyPair;
  }

  public static getChannelFromCurrencyPair = (currencyPair: ICurrencyPair) => {
    let channel: string = "";
    const cryptoCurrency: CryptoCurrencies = currencyPair.cryptoCurrency;
    const currency: Currencies = currencyPair.currency;
    if (cryptoCurrency === CryptoCurrencies.Bitcoin) {
      channel += "ok_sub_spot_btc";
    } else if (cryptoCurrency === CryptoCurrencies.Ethereum) {
      channel += "ok_sub_spot_eth";
    } else if (cryptoCurrency === CryptoCurrencies.Litecoin) {
      channel += "ok_sub_spot_ltc";
    } else {
      throw new Error("Invalid crypto-currency for OK Coin Exchange channel creation: " + cryptoCurrency);
    }
    if (currency === Currencies.USD) {
      channel += "_usd_ticker";
    } else {
      throw new Error("Invalid currency for OK Coin Exchange channel creation: " + currency);
    }
    return channel;
  }

  private cryptoCurrencies: CryptoCurrencies[];
  private currencies: Currencies[];
  private ws: WebSocket;

  constructor(
    cryptoCurrencies: CryptoCurrencies[],
    currencies: Currencies[],
  ) {
    super(OK_COIN_EXCHANGE_NAME, OK_COIN_EXCHANGE_SHORT_NAME);
    this.cryptoCurrencies = cryptoCurrencies;
    this.currencies = currencies;
    this.setGetCurrencyPairFromMsg(this.getCurrencyPairFromMsg);
    this.setGetTickerUpdateFromMsg(this.getTickerUpdateFromMsg);
  }

  public getCurrencyPairFromMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data)[0];
    if (msgData.hasOwnProperty("channel") && contains(msgData.channel, "ok_sub_spot_")) {
      return OKCoinExchange.getCurrencyPairFromChannel(msgData.channel);
    } else {
      throw new Error("Invalid channel received from OK Coin message: " + msg);
    }
  }

  public getTickerUpdateFromMsg = (msg: any) => {
    const okCoinUpdate: IOKCoinTickerUpdate = JSON.parse(msg.data)[0];
    const currencyPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
    const now: Date = new Date();
    return {
      askPrice: parseFloat(okCoinUpdate.data.sell),
      bidPrice: parseFloat(okCoinUpdate.data.buy),
      cryptoCurrency: currencyPair.cryptoCurrency,
      currency: currencyPair.currency,
      timestamp: now.getTime(),
    } as ITickerUpdate;
  }

  public isValidMsg = (msg: any) => {
    try {
      JSON.parse(msg.data);
      return true;
    } catch (e) {
      return false;
    }
  }

  // There are neither useful heartbeat nor useful subscription messages
  public isHeartbeatMsg = (msg: any) => false;
  public isSubscriptionMsg = (msg: any) => false;

  public isTickerMsg = (msg: any) => {
    try {
      const okCoinUpdate: IOKCoinTickerUpdate = JSON.parse(msg.data)[0];
      return okCoinUpdate.data.hasOwnProperty("buy") && okCoinUpdate.data.hasOwnProperty("sell");
    } catch (e) {
      return false;
    }
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
      channel: OKCoinExchange.getChannelFromCurrencyPair({ cryptoCurrency, currency } as ICurrencyPair),
      event: "addChannel",
    });
  }
}
