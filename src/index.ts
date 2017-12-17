import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import * as chalk from "chalk";
import * as WebRequest from "web-request";
import * as WebSocket from "ws";
import {
  BitfinexExchange,
  BitmexExchange,
  BitstampExchange,
  GdaxExchange,
  Market,
  OKCoinExchange,
} from "./models";
import {
  CryptoCurrencies,
  Currencies,
  ExchangeStreamTickerRequest,
  IExchange,
  IExchangeState,
  ITickerUpdate,
} from "./types";
import {
  CryptoCurrencyLineGraph,
  ICryptoCurrencyLineGraphOptions,
} from "./viz";

// General configuration

const MAX_HISTORY_LENGTH: number = 60;

const cryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  // CryptoCurrencies.Ethereum,
  // CryptoCurrencies.Litecoin,
];

const formatTs = (ts: number) => {
  const date: Date = new Date(ts);
  return date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
};

const onTickerUpdate = (update: ITickerUpdate, state: IExchangeState) => {
  const date: Date = new Date(update.timestamp);
  const askMsg: string = date.toLocaleTimeString() + " " + update.askPrice.toFixed(3) + " (" + state.name + ")";
  const bidMsg: string = date.toLocaleTimeString() + " " + update.bidPrice.toFixed(3) + " (" + state.name + ")";
  if (update.cryptoCurrency === CryptoCurrencies.Bitcoin) {
    const now: Date = new Date();
    btcAskLog.log(askMsg);
    btcBidLog.log(bidMsg);
    btcPriceTable.setData({
      data: exchanges.map((exchange) => {
        const latestBid: number = exchange.state.currencies[CryptoCurrencies.Bitcoin].latestBidPrice;
        const latestAsk: number = exchange.state.currencies[CryptoCurrencies.Bitcoin].latestAskPrice;
        const lastTimestamp: string = formatTs(exchange.state.currencies[CryptoCurrencies.Bitcoin].lastTimestamp);
        return [
          exchange.name,
          latestBid.toFixed(5),
          latestAsk.toFixed(5),
          (latestBid - latestAsk).toFixed(3),
          lastTimestamp,
        ];
      }),
      headers: ["Exchange", "Bid", "Ask", "Spread", formatTs(now.getTime())],
    });
  }
};

const streamTickerRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
  onTickerUpdate,
);

// Exchanges

const bitfinexName: string = "BFNX";
const bitfinexExchange: BitfinexExchange = new BitfinexExchange(bitfinexName);

const gdaxName: string = "GDAX";
const gdaxExchange: GdaxExchange = new GdaxExchange(gdaxName);

const bitmexName: string = "BMEX";
const bitmexExchange: BitmexExchange = new BitmexExchange(bitmexName);

const bitstampName: string = "BSTP";
const bitstampExchange: BitstampExchange = new BitstampExchange(bitstampName);

const okCoinName: string = "OKCO";
const okCoinExchange: OKCoinExchange = new OKCoinExchange(okCoinName);


// Market
const exchanges: IExchange[] = [
  bitfinexExchange,
  bitstampExchange,
  bitmexExchange,
  gdaxExchange,
  okCoinExchange,
];
const exchangeNames: string[] = exchanges.map((exchange) => exchange.name);
const market: Market = new Market(exchanges, cryptoCurrencies);
market.streamTickerPrices(streamTickerRequest);

// Dashboard
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 4, cols: 4, screen });

const btcGraph = grid.set(0, 0, 2, 4, contrib.line, {
  label: "BTC Quote",
  legend: { width: 12, height: 30 },
  showLegend: true,
});

const btcLineGraph: CryptoCurrencyLineGraph = new CryptoCurrencyLineGraph(
  CryptoCurrencies.Bitcoin,
  exchangeNames,
  market,
  MAX_HISTORY_LENGTH,
);
const btcLineGraphOptions: ICryptoCurrencyLineGraphOptions = {
  isAskPrice: true,
  isBidPrice: true,
  options: {
    BFNX: btcLineGraph.createOptionsFromColor("red"),
    BMEX: btcLineGraph.createOptionsFromColor("green"),
    BSTP: btcLineGraph.createOptionsFromColor("yellow"),
    GDAX: btcLineGraph.createOptionsFromColor("blue"),
    OKCO: btcLineGraph.createOptionsFromColor("white"),
  },
} as ICryptoCurrencyLineGraphOptions;

setInterval(() => {
  btcGraph.setData(btcLineGraph.getLineGraphData(btcLineGraphOptions));
  const minY: number = market.state[CryptoCurrencies.Bitcoin].lowestPrice;
  btcGraph.options.minY = 0.999 * minY;
}, 1000);

const btcAskLog = grid.set(2, 0, 1, 1, contrib.log, {
  fg: "red",
  label: "BTC (A) Quote Log",
  selectedFg: "green",
});
const btcBidLog = grid.set(3, 0, 1, 1, contrib.log, {
  fg: "green",
  label: "BTC (B) Quote Log",
  selectedFg: "green",
});
const btcPriceTable = grid.set(2, 1, 1, 2, contrib.table, {
  border: {type: "line", fg: "cyan"},
  columnWidth: [8, 10, 10, 10, 14],
  fg: "white",
  height: "30%",
  interactive: true,
  keys: true,
  label: "BTC Latest Price",
  selectedBg: "blue",
  selectedFg: "white",
});
btcPriceTable.focus();

screen.key(["escape", "q", "C-c"], (ch, key) => {
  return process.exit(0);
});
screen.key(["enter"], (ch, key) => {
  btcGraph.setData(btcLineGraph.getLineGraphData(btcLineGraphOptions));
});
screen.render();
