import * as WebSocket from "ws";
import {
  CryptoCurrencies,
  Currencies,
  Exchange,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

const GDAX_EXCHANGE_NAME = "Gdax";
const GDAX_EXCHANGE_SHORT_NAME = "GDAX";
const WSS_URL = "wss://ws-feed.gdax.com";
const WSS_TICKER_CHANNEL_NAME = "ticker";
const WSS_SUBSCRIBE_EVENT = "subscribe";

interface IGdaxTickerUpdate {
  type: string;
  sequence: string;
  product_id: string;
  price: string;
  open_24h: string;
  volume_24h: string;
  low_24h: string;
  high_24h: string;
  volume_30d: string;
  best_bid: string;
  best_ask: string;
  side: string;
  time: string;
  trade_id: string;
  last_size: string;
}

export class GdaxExchange extends Exchange {
  public static currenciesToProductIds = (cryptoCurrencies: CryptoCurrencies[], currencies: Currencies[]) => {
    const productIds: string[] = [];
    cryptoCurrencies.forEach((cryptoCurrency: CryptoCurrencies) => {
      currencies.forEach((currency: Currencies) => {
        let productId: string = "";
        // The prefix of a GDAX product ID is an encoded crypto currency
        if (cryptoCurrency === CryptoCurrencies.Bitcoin) {
          productId += "BTC-";
        } else if (cryptoCurrency === CryptoCurrencies.Ethereum) {
          productId += "ETH-";
        } else if (cryptoCurrency === CryptoCurrencies.Litecoin) {
          productId += "LTC-";
        } else {
          throw new Error("Invalid crypto-currency selected for Gdax product ID: " + cryptoCurrency);
        }
        // The postfix of a GDAX product ID is an encoded currency
        if (currency === Currencies.USD) {
          productId += "USD";
        } else {
          throw new Error("Invalid currency selected for Gdax product ID: " + currency);
        }
        productIds.push(productId);
      });
    });
    return productIds;
  }

  public static getCurrencyPairFromProductId = (productId: string) => {
    let currency: Currencies | null = null;
    let cryptoCurrency: CryptoCurrencies | null = null;
    const cryptoCurrencyStr: string = productId.split("-")[0];
    const currencyStr: string = productId.split("-")[1];
    if (cryptoCurrencyStr === "BTC") {
      cryptoCurrency = CryptoCurrencies.Bitcoin;
    } else if (cryptoCurrencyStr === "ETH") {
      cryptoCurrency = CryptoCurrencies.Ethereum;
    } else if (cryptoCurrencyStr === "LTC") {
      cryptoCurrency = CryptoCurrencies.Litecoin;
    }
    if (currencyStr === "USD") {
      currency = Currencies.USD;
    }
    if (currency == null || cryptoCurrency == null) {
      throw new Error("Can't find valid currency pair from Gdax message.");
    }
    return { currency, cryptoCurrency } as ICurrencyPair;
  }

  private cryptoCurrencies: CryptoCurrencies[];
  private currencies: Currencies[];
  private ws: WebSocket;

  constructor(
    cryptoCurrencies: CryptoCurrencies[],
    currencies: Currencies[],
  ) {
    super(GDAX_EXCHANGE_NAME, GDAX_EXCHANGE_SHORT_NAME);
    this.cryptoCurrencies = cryptoCurrencies;
    this.currencies = currencies;
    this.setGetCurrencyPairFromMsg(this.getCurrencyPairFromMsg);
    this.setGetTickerUpdateFromMsg(this.getTickerUpdateFromMsg);
  }

  public getCurrencyPairFromMsg = (msg: any) => {
    const productId: string = JSON.parse(msg.data).product_id;
    return GdaxExchange.getCurrencyPairFromProductId(productId);
  }

  public getTickerUpdateFromMsg = (msg: any) => {
    const gdaxUpdate: IGdaxTickerUpdate = JSON.parse(msg.data);
    const currencyPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
    const now: Date = new Date();
    return {
      askPrice: parseFloat(gdaxUpdate.best_ask),
      bidPrice: parseFloat(gdaxUpdate.best_bid),
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
      const gdaxUpdate: IGdaxTickerUpdate = JSON.parse(msg.data);
      return gdaxUpdate.hasOwnProperty("best_ask") && gdaxUpdate.hasOwnProperty("best_bid");
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
      this.ws.send(this.assembleTickerSubscriptionMsg(this.cryptoCurrencies, this.currencies));
    };
  }

  private assembleTickerSubscriptionMsg = (cryptoCurrencies: CryptoCurrencies[], currencies: Currencies[]) => {
    const productIds: string[] = GdaxExchange.currenciesToProductIds(cryptoCurrencies, currencies);
    return JSON.stringify({
      channels: [{
        name: WSS_TICKER_CHANNEL_NAME,
        product_ids: productIds,
      }],
      product_ids: productIds,
      type: WSS_SUBSCRIBE_EVENT,
    });
  }
}
