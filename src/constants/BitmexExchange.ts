import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

export const WSS_URL = "wss://www.bitmex.com/realtime";
const WSS_SUBSCRIBE_EVENT = "subscribe";

function cryptoPrefixFromCryptoCurrency(cryptoCurr: CryptoCurrencies) {
  switch (cryptoCurr) {
    case CryptoCurrencies.Bitcoin: {
      return "XBT";
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

function currenciesToInstrument(cryptoCurr: CryptoCurrencies, curr: Currencies) {
  // BitMEX only trades XBT/USD, both ETH and LTC are /XBT instead of /USD
  if (cryptoCurr === CryptoCurrencies.Bitcoin) {
    return cryptoPrefixFromCryptoCurrency(cryptoCurr) + currPostfixFromCurrency(curr);
  }
  return cryptoPrefixFromCryptoCurrency(cryptoCurr);
}

export function assembleTickerSubscriptionMsg(cryptos: CryptoCurrencies[], curr: Currencies) {
  const instruments = cryptos.map((crypto) => currenciesToInstrument(crypto, curr));
  const quoteBooks = instruments.map((i) => "quote:" + i);
  if (!(CryptoCurrencies.Bitcoin in cryptos) && curr !== Currencies.XBT) {
    // We always need a XBT/USD quote because ETH and LTC are only quoted in XBT
    quoteBooks.push("quote:XBTUSD");
  }

  return JSON.stringify({
    args: quoteBooks,
    op: WSS_SUBSCRIBE_EVENT,
  });
}

function getCurrencyPairFromSymbol(symbol: string): ICurrencyPair {
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
    throw new Error("Can't find valid currency pair from Bitfinex message.");
  }
  return { currency, cryptoCurrency } as ICurrencyPair;
}

interface IBitmexTickerUpdate {
  table: string;
  action: string;
  data: [{
    timestamp: string,
    symbol: string,
    bidSize: string,
    bidPrice: number,
    askSize: number,
    askPrice: number,
  }];
}

export function getTickerUpdateFromBitmexUpdate(
  bmexUpdate: IBitmexTickerUpdate,
  xbtToCurr: (price: number) => number = (price) => price,
): ITickerUpdate {
  const currencyPair: ICurrencyPair = getCurrencyPairFromSymbol(bmexUpdate.data[0].symbol);
  const bmexData = bmexUpdate.data[0];
  const updateDate: Date = new Date(bmexData.timestamp);
  if (currencyPair.cryptoCurrency !== CryptoCurrencies.Bitcoin && currencyPair.currency !== Currencies.XBT) {
    bmexData.askPrice = xbtToCurr(bmexData.askPrice);
    bmexData.bidPrice = xbtToCurr(bmexData.bidPrice);
  }
  return {
    askPrice: bmexData.askPrice,
    bidPrice: bmexData.bidPrice,
    cryptoCurrency: currencyPair.cryptoCurrency,
    currency: currencyPair.currency,
    timestamp: updateDate.getTime(),
  } as ITickerUpdate;
}
