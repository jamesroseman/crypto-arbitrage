import {
  CryptoCurrencies,
  Currencies,
} from "../types";

const WSS_URL = "wss://api.bitfinex.com/ws";
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
