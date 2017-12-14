import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

export const WSS_URL = "wss://api.bitfinex.com/ws";
const WSS_TICKER_CHANNEL = "ticker";
const WSS_SUBSCRIBE_EVENT = "subscribe";

function cryptoPrefixFromCryptoCurrency(cryptoCurr: CryptoCurrencies) {
  switch (cryptoCurr) {
    case CryptoCurrencies.Bitcoin: {
      return "BTC";
    }
    case CryptoCurrencies.Ethereum: {
      return "ETH";
    }
    case CryptoCurrencies.Litecoin: {
      return "LTC";
    }
    default: {
      throw new Error("Invalid crypto-currency selected to translate to WSS crypto prefix.");
    }
  }
}

function currPostfixFromCurrency(curr: Currencies) {
  switch (curr) {
    case Currencies.USD: {
      return "USD";
    }
    default: {
      throw new Error("Invalid currency selected to translate to WSS currency postfix.");
    }
  }
}

function currenciesToPair(cryptoCurr: CryptoCurrencies, curr: Currencies) {
  return cryptoPrefixFromCryptoCurrency(cryptoCurr) + currPostfixFromCurrency(curr);
}

export function assembleTickerSubscriptionMsg(crypto: CryptoCurrencies, curr: Currencies) {
  return JSON.stringify({
    channel: WSS_TICKER_CHANNEL,
    event: WSS_SUBSCRIBE_EVENT,
    pair: currenciesToPair(crypto, curr),
  });
}

export function getCurrencyPairFromMsg(pairMsg: string): ICurrencyPair {
  let currency: Currencies | null = null;
  let cryptoCurrency: CryptoCurrencies | null = null;
  if (pairMsg.indexOf("BTC") === 0) {
    cryptoCurrency = CryptoCurrencies.Bitcoin;
  } else if (pairMsg.indexOf("ETH") === 0) {
    cryptoCurrency = CryptoCurrencies.Ethereum;
  } else if (pairMsg.indexOf("LTC") === 0) {
    cryptoCurrency = CryptoCurrencies.Litecoin;
  }
  if (pairMsg.indexOf("USD") >= 1) {
    currency = Currencies.USD;
  }
  if (currency == null || cryptoCurrency == null) {
    throw new Error("Can't find valid currency pair from Bitfinex message.");
  }
  return { currency, cryptoCurrency } as ICurrencyPair;
}

export function getTickerUpdateFromMsgData(msgData: number[], currPair: ICurrencyPair): ITickerUpdate {
  if (msgData.length !== 11) {
    throw new Error("Message is not formatted correctly.");
  }
  const now: Date = new Date();
  return {
    buyingPrice: msgData[3],
    cryptoCurrency: currPair.cryptoCurrency,
    currency: currPair.currency,
    sellingPrice: msgData[1],
    timestamp: now.getTime(),
  } as ITickerUpdate;
}
