import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

export const WSS_URL = "wss://ws-feed.gdax.com";
const WSS_TICKER_CHANNEL_NAME = "ticker";
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

function currenciesToProductId(cryptoCurr: CryptoCurrencies, curr: Currencies) {
  return cryptoPrefixFromCryptoCurrency(cryptoCurr) + "-" + currPostfixFromCurrency(curr);
}

export function assembleTickerSubscriptionMsg(cryptos: CryptoCurrencies[], curr: Currencies) {
  const productIds = cryptos.map((crypto) => currenciesToProductId(crypto, curr));
  return JSON.stringify({
    channels: [{
      name: WSS_TICKER_CHANNEL_NAME,
      product_ids: productIds,
    }],
    product_ids: productIds,
    type: WSS_SUBSCRIBE_EVENT,
  });
}

function getCurrencyPairFromProductId(productId: string): ICurrencyPair {
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
    throw new Error("Can't find valid currency pair from Bitfinex message.");
  }
  return { currency, cryptoCurrency } as ICurrencyPair;
}

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

export function getTickerUpdateFromGdaxUpdate(gdaxUpdate: IGdaxTickerUpdate): ITickerUpdate {
  const currencyPair: ICurrencyPair = getCurrencyPairFromProductId(gdaxUpdate.product_id);
  const now: Date = new Date();
  return {
    askPrice: parseFloat(gdaxUpdate.best_ask),
    bidPrice: parseFloat(gdaxUpdate.best_bid),
    cryptoCurrency: currencyPair.cryptoCurrency,
    currency: currencyPair.currency,
    timestamp: now.getTime(),
  } as ITickerUpdate;
}
