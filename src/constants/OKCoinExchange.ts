import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

// Warning: As of 12/15/2017 OKCoin is broken for US traders
export const WSS_URL = "wss://real.okcoin.com:10440/websocket";
const WSS_SUBSCRIBE_EVENT = "addChannel";

function cryptoPrefixFromCryptoCurrency(cryptoCurr: CryptoCurrencies) {
  switch (cryptoCurr) {
    case CryptoCurrencies.Bitcoin: {
      return "ok_sub_spot_btc";
    }
    case CryptoCurrencies.Ethereum: {
      return "ok_sub_spot_eth";
    }
    case CryptoCurrencies.Litecoin: {
      return "ok_sub_spot_ltc";
    }
    default: {
      throw new Error("Invalid crypto-currency selected to translate to WSS crypto prefix.");
    }
  }
}

function currPostfixFromCurrency(curr: Currencies) {
  switch (curr) {
    case Currencies.USD: {
      return "usd_ticker";
    }
    default: {
      throw new Error("Invalid currency selected to translate to WSS currency postfix.");
    }
  }
}

function currenciesToChannel(cryptoCurr: CryptoCurrencies, curr: Currencies) {
  return cryptoPrefixFromCryptoCurrency(cryptoCurr) + "_" + currPostfixFromCurrency(curr);
}

export function assembleTickerSubscriptionMsg(crypto: CryptoCurrencies, curr: Currencies) {
  return JSON.stringify({
    channel: currenciesToChannel(crypto, curr),
    event: "addChannel",
  });
}

function getCurrencyPairFromChannel(channel: string): ICurrencyPair {
  let currency: Currencies | null = null;
  let cryptoCurrency: CryptoCurrencies | null = null;
  if (channel.indexOf("_btc_") >= 0) {
    cryptoCurrency = CryptoCurrencies.Bitcoin;
  } else if (channel.indexOf("_eth_") >= 0) {
    cryptoCurrency = CryptoCurrencies.Ethereum;
  } else if (channel.indexOf("_ltc_") >= 0) {
    cryptoCurrency = CryptoCurrencies.Litecoin;
  }
  if (channel.indexOf("_usd_") >= 0) {
    currency = Currencies.USD;
  }
  if (currency == null || cryptoCurrency == null) {
    throw new Error("Can't find valid currency pair from Bitfinex message.");
  }
  return { currency, cryptoCurrency } as ICurrencyPair;
}

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

export function getTickerUpdateFromOKCoinUpdate(okUpdate: IOKCoinTickerUpdate): ITickerUpdate {
  const currencyPair: ICurrencyPair = getCurrencyPairFromChannel(okUpdate.channel);
  const now: Date = new Date();
  return {
    askPrice: parseFloat(okUpdate.data.sell),
    bidPrice: parseFloat(okUpdate.data.buy),
    cryptoCurrency: currencyPair.cryptoCurrency,
    currency: currencyPair.currency,
    timestamp: now.getTime(),
  } as ITickerUpdate;
}
