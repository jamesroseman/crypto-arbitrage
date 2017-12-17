import {
  CryptoCurrencies,
  Currencies,
  ICurrencyPair,
  ITickerUpdate,
} from "../types";

export const WSS_URL = "wss://api2.poloniex.com";
export const WSS_TICKER_CHANNEL_NAME = "ticker";

interface IBitstampOptions {
  diff_order_book?: boolean;
  diff_order_book_ethusd?: boolean;
  diff_order_book_ltcusd?: boolean;
}

export function currenciesToOptions(cryptos: CryptoCurrencies[], curr: Currencies) {
  const options: IBitstampOptions = {};
  if (cryptos.filter((c) => c === CryptoCurrencies.Bitcoin).length > 0) {
    if (curr === Currencies.USD) {
      options.diff_order_book = true;
    }
  } else if (cryptos.filter((c) => c === CryptoCurrencies.Ethereum).length > 0) {
    if (curr === Currencies.USD) {
      options.diff_order_book_ethusd = true;
    }
  } else if (cryptos.filter((c) => c === CryptoCurrencies.Litecoin).length > 0) {
    if (curr === Currencies.USD) {
      options.diff_order_book_ltcusd = true;
    }
  }
  return options;
}

enum BitstampOrderType {
  Buy = 0,
  Sell = 0,
}

interface IBitstampUpdate {
  asks: string[][];
  bids: string[][];
  timestamp: string;
}

export function getTickerUpdateFromBitstampUpdate(
  cryptoCurrency: CryptoCurrencies,
  currency: Currencies,
  latestAsk: number,
  latestBid: number,
  polUpdate: IBitstampUpdate,
): ITickerUpdate {
  const askPriceStr: string =
    polUpdate.asks.length > 0 && polUpdate.asks[0].length > 0 ? polUpdate.asks[0][0] : latestAsk + "";
  const bidPriceStr: string =
    polUpdate.bids.length > 0 && polUpdate.bids[0].length > 0 ? polUpdate.bids[0][0] : latestBid + "";
  return {
    askPrice: parseFloat(askPriceStr),
    bidPrice: parseFloat(bidPriceStr),
    cryptoCurrency,
    currency,
    timestamp: parseInt(polUpdate.timestamp, 10),
  } as ITickerUpdate;
}
