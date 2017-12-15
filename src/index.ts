import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import * as chalk from "chalk";
import * as WebRequest from "web-request";
import * as WebSocket from "ws";
import {
  BitfinexExchange,
  BitmexExchange,
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

const MAX_HISTORY_LENGTH: number = 50;

const cryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  CryptoCurrencies.Ethereum,
  CryptoCurrencies.Litecoin,
];

const onTickerUpdate = (update: ITickerUpdate, state: IExchangeState) => {
  const date: Date = new Date(update.timestamp);
  const msg: string = date.toLocaleTimeString() + " " + update.buyingPrice + " (" + state.name + ")";
  if (update.cryptoCurrency === CryptoCurrencies.Bitcoin) {
    btcLog.log(msg);
    btcGraph.setData(btcLineGraph.getLineGraphData(btcLineGraphOptions));
  } else if (update.cryptoCurrency === CryptoCurrencies.Ethereum) {
    // Update the log
    ethLog.log(msg);
    // Update the graph
  } else if (update.cryptoCurrency === CryptoCurrencies.Litecoin) {
    // Update the log
    ltcLog.log(msg);
    // Update the graph
  }
};

const streamTickerRequest: ExchangeStreamTickerRequest = new ExchangeStreamTickerRequest(
  cryptoCurrencies,
  Currencies.USD,
  onTickerUpdate,
);

// Exchanges

const bitfinexName: string = "BTFNX";
const bitfinexExchange: BitfinexExchange = new BitfinexExchange(bitfinexName);

const gdaxName: string = "GDAX";
const gdaxExchange: GdaxExchange = new GdaxExchange(gdaxName);

const bitmexName: string = "BTMX";
const bitmexExchange: BitmexExchange = new BitmexExchange(bitmexName);

const okCoinName: string = "OKCOIN";
const okCoinExchange: OKCoinExchange = new OKCoinExchange(okCoinName);

// Market
const exchanges: IExchange[] = [
  bitfinexExchange,
  bitmexExchange,
  gdaxExchange,
  okCoinExchange,
];
const exchangeNames: string[] = exchanges.map((exchange) => exchange.name);
const market: Market = new Market(exchanges);
market.streamTickerPrices(streamTickerRequest);

// Dashboard
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 2, cols: 3, screen });

const btcGraph = grid.set(0, 0, 1, 3, contrib.line, {
  label: "BTC Buying Price",
  legend: { width: 12 },
  minY: 16710,
  showLegend: true,
});

const btcLineGraph: CryptoCurrencyLineGraph = new CryptoCurrencyLineGraph(
  CryptoCurrencies.Bitcoin,
  exchangeNames,
  market,
  MAX_HISTORY_LENGTH,
);
const btcLineGraphOptions: ICryptoCurrencyLineGraphOptions = {
  isBuyingPrice: true,
  options: {
    BTFNX: btcLineGraph.createOptionsFromColor("red"),
    BTMX: btcLineGraph.createOptionsFromColor("blue"),
    GDAX: btcLineGraph.createOptionsFromColor("green"),
    OKCOIN: btcLineGraph.createOptionsFromColor("yellow"),
  },
} as ICryptoCurrencyLineGraphOptions;

const btcLog = grid.set(1, 0, 1, 1, contrib.log, {
  fg: "red",
  label: "BTC Quote Log",
  selectedFg: "green",
});
const ethLog = grid.set(1, 1, 1, 1, contrib.log, {
  fg: "blue",
  label: "ETH Quote Log",
  selectedFg: "green",
});
const ltcLog = grid.set(1, 2, 1, 1, contrib.log, {
  fg: "yellow",
  label: "LTC Quote Log",
  selectedFg: "green",
});

screen.key(["escape", "q", "C-c"], (ch, key) => {
  return process.exit(0);
});
screen.render();
