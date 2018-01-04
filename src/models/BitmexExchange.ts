import * as WebSocket from "ws";
import {
  CryptoCurrencies,
  Currencies,
  Exchange,
  ExchangeState,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

const BITMEX_EXCHANGE_NAME = "Bitmex";
const BITMEX_EXCHANGE_SHORT_NAME = "BMEX";
const WSS_URL = "wss://www.bitmex.com/realtime";
const WSS_SUBSCRIBE_EVENT = "subscribe";

export class BitmexExchange extends Exchange {
  public static symbolToCurrencyPair = (symbol: string) => {
    let currency: Currencies | null = null;
    let cryptoCurrency: CryptoCurrencies | null = null;
    if (symbol.indexOf("XBT") === 0) {
      cryptoCurrency = CryptoCurrencies.Bitcoin;
    } else if (symbol.indexOf("ETH") === 0) {
      cryptoCurrency = CryptoCurrencies.Ethereum;
    } else if (symbol.indexOf("LTC") === 0) {
      cryptoCurrency = CryptoCurrencies.Litecoin;
    }
    if (symbol.indexOf("USD") >= 1) {
      currency = Currencies.USD;
    } else {
      currency = Currencies.XBT;
    }
    if (currency == null || cryptoCurrency == null) {
      throw new Error("Can't find valid currency pair from Bitmex message.");
    }
    return { currency, cryptoCurrency } as ICurrencyPair;
  }

  private cryptoCurrencies: CryptoCurrencies[];
  private currency: Currencies;
  private lastXbtAskPrice: number;
  private lastXbtBidPrice: number;
  private isXbtPriceSet: boolean;
  private ws: WebSocket;

  // Currently we only support USD as Bitmex currency.
  constructor(cryptoCurrencies: CryptoCurrencies[]) {
    super(BITMEX_EXCHANGE_NAME, BITMEX_EXCHANGE_SHORT_NAME);
    this.cryptoCurrencies = cryptoCurrencies;
    this.currency = Currencies.USD;
    this.setGetCurrencyPairFromMsg(this.getCurrencyPairFromMsg);
    this.setGetTickerUpdateFromMsg(this.getTickerUpdateFromMsg);
  }

  public getCurrencyPairFromMsg = (msg: any) => {
    const symbol = JSON.parse(msg.data).data[0].symbol;
    return BitmexExchange.symbolToCurrencyPair(symbol);
  }

  public getTickerUpdateFromMsg = (msg: any, currPair: ICurrencyPair) => {
    const bmexData = JSON.parse(msg.data).data[0];
    const updateDate: Date = new Date(bmexData.timestamp);
    const currencyPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
    // Because Bitmex only lists a USD pairing for XBT, every other crypto listed is in a XBT pairing,
    // so if either the crypto isn't XBT or the currency isn't XBT, we need to convert.
    if (currencyPair.cryptoCurrency !== CryptoCurrencies.Bitcoin) {
      bmexData.askPrice *= this.lastXbtAskPrice;
      bmexData.bidPrice *= this.lastXbtBidPrice;
      currencyPair.currency = this.currency;
    }
    return {
      askPrice: bmexData.askPrice,
      bidPrice: bmexData.bidPrice,
      cryptoCurrency: currencyPair.cryptoCurrency,
      currency: currencyPair.currency,
      timestamp: updateDate.getTime(),
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

  // There are no heartbeat or subscription messages on the Bitmex Exchange
  public isHeartbeatMsg = (msg: any) => false;
  public isSubscriptionMsg = (msg: any) => false;

  public isTickerMsg = (msg: any) => {
    const msgData = JSON.parse(msg.data);
    if (msgData.hasOwnProperty("table") && msgData.table === "quote") {
      const currencyPair: ICurrencyPair = this.getCurrencyPairFromMsg(msg);
      const tickerUpdate: ITickerUpdate = this.getTickerUpdateFromMsg(msg, currencyPair);
      // This ticker update will either be for an intentionally subscribed currency, or
      // a XBT-USD pair to be used for conversion.
      if (currencyPair.cryptoCurrency === CryptoCurrencies.Bitcoin) {
        this.lastXbtAskPrice = tickerUpdate.askPrice;
        this.lastXbtBidPrice = tickerUpdate.bidPrice;
        this.isXbtPriceSet = true;
      }
      const updateContainsCrypto: boolean =
        this.cryptoCurrencies.filter((c) => c === tickerUpdate.cryptoCurrency).length > 0;
      // If this message includes a cryptocurrency provided to the constructor and the XBT-USD going
      // rate has been established, this is a valid ticker update message.
      return updateContainsCrypto && this.isXbtPriceSet;
    }
  }

  protected initializeExchangeConnection = () => {
    this.ws = new WebSocket(WSS_URL);
    this.ws.onmessage = this.consumeMsg;
  }

  protected initializeExchangeTicker = () => {
    this.ws.onopen = () => {
      this.ws.send(this.assembleTickerSubscriptionMsg(this.cryptoCurrencies, this.currency));
    };
  }

  private assembleTickerSubscriptionMsg = (cryptoCurrencies: CryptoCurrencies[], currency: Currencies) => {
    const action: string = "quote:";
    const instruments: string[] = [];
    cryptoCurrencies.forEach((cryptoCurrency: CryptoCurrencies) => {
      instruments.push(this.currenciesToInstrument(cryptoCurrency, currency));
    });
    const args: string[] = [];
    instruments.forEach((i) => {
      args.push(action + i);
      args.push("instrument:" + i);
    });
    if (cryptoCurrencies.filter((c) => CryptoCurrencies.Bitcoin === c).length <= 0) {
      // We always need a XBT/USD quote because ETH and LTC are only quoted in XBT
      args.push(action + "XBTUSD");
      args.push("instrument:XBTUSD");
    }
    return JSON.stringify({
      args,
      op: WSS_SUBSCRIBE_EVENT,
    });
  }

  private currenciesToInstrument = (cryptoCurrency: CryptoCurrencies, currency: Currencies) => {
    switch (cryptoCurrency) {
      case CryptoCurrencies.Bitcoin: {
        if (currency === Currencies.USD) {
          return "XBTUSD";
        } else {
          throw new Error("Unimplemented Bitmex Bitcoin-currency pairing.");
        }
      }
      case CryptoCurrencies.Ethereum: {
        return "ETHH18";
      }
      case CryptoCurrencies.Litecoin: {
        return "LTCH18";
      }
      default: {
        throw new Error("Invalid crypto-currency selected to translate to Bitmex crypto prefix.");
      }
    }
  }
}
