import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

export const WSS_URL = "wss://www.bitmex.com/realtime";
const WSS_SUBSCRIBE_EVENT = "subscribe";

function currenciesToInstrument(cryptoCurr: CryptoCurrencies, currency: Currencies) {
  switch (cryptoCurr) {
    case CryptoCurrencies.Bitcoin: {
      if (currency === Currencies.USD) {
        return "XBTUSD";
      } else {
        throw new Error("Unimplemented Bitcoin-currency pairing.");
      }
    }
    case CryptoCurrencies.Ethereum: {
      return "ETHZ17";
    }
    case CryptoCurrencies.Litecoin: {
      return "LTCZ17";
    }
    default: {
      throw new Error("Invalid crypto-currency selected to translate to WSS crypto prefix.");
    }
  }
}

export function assembleTickerSubscriptionMsg(cryptos: CryptoCurrencies[], curr: Currencies) {
  const action: string = "quote:";
  const instruments: string[] = cryptos.map((crypto) => currenciesToInstrument(crypto, curr));
  const args: string[] = [];
  instruments.forEach((i) => {
    args.push(action + i);
    args.push("instrument:" + i);
  });
  if (cryptos.filter((c) => CryptoCurrencies.Bitcoin === c).length <= 0) {
    // We always need a XBT/USD quote because ETH and LTC are only quoted in XBT
    args.push(action + "XBTUSD");
    args.push("instrument:XBTUSD");
  }

  return JSON.stringify({
    args,
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
  const bmexData = bmexUpdate.data[0];
  const currencyPair: ICurrencyPair = getCurrencyPairFromSymbol(bmexData.symbol);
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
