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

export function getCurrencyPairFromProductId(productId: string): ICurrencyPair {
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
  sequence: number;
  product_id: string;
  price: number;
  open_24h: number;
  volume_24h: number;
  low_24h: number;
  high_24h: number;
  volume_30d: number;
  best_bid: number;
  best_ask: number;
  side: string;
  time: string;
  trade_id: number;
  last_size: number;
}

export function getTickerUpdateFromGdaxUpdate(gdaxUpdate: IGdaxTickerUpdate): ITickerUpdate {
  const currencyPair: ICurrencyPair = getCurrencyPairFromProductId(gdaxUpdate.product_id);
  return {
    buyingPrice: gdaxUpdate.best_ask,
    cryptoCurrency: currencyPair.cryptoCurrency,
    currency: currencyPair.currency,
    sellingPrice: gdaxUpdate.best_bid,
  } as ITickerUpdate;
}
