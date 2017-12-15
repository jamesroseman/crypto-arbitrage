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

const MAX_HISTORY_LENGTH: number = 60;

const cryptoCurrencies: CryptoCurrencies[] = [
  CryptoCurrencies.Bitcoin,
  CryptoCurrencies.Ethereum,
  CryptoCurrencies.Litecoin,
];

const onTickerUpdate = (update: ITickerUpdate, state: IExchangeState) => {
  const date: Date = new Date(update.timestamp);
  const askMsg: string = date.toLocaleTimeString() + " " + update.askPrice + " (" + state.name + ")";
  const bidMsg: string = date.toLocaleTimeString() + " " + update.bidPrice + " (" + state.name + ")";
  if (update.cryptoCurrency === CryptoCurrencies.Bitcoin) {
    btcBuyLog.log(askMsg);
    btcSellLog.log(bidMsg);
    btcPriceTable.setData({
      data: exchanges.map((exchange) => {
        const latestBid: number = exchange.state.currencies[CryptoCurrencies.Bitcoin].latestBidPrice;
        const latestAsk: number = exchange.state.currencies[CryptoCurrencies.Bitcoin].latestAskPrice;
        return [exchange.name, latestBid, latestAsk, (latestBid - latestAsk)];
      }),
      headers: ["Exchange", "Bid", "Ask", "Spread"],
    });
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

const okCoinName: string = "OKC";
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
const grid = new contrib.grid({ rows: 2, cols: 4, screen });

const btcGraph = grid.set(0, 0, 1, 3, contrib.line, {
  label: "BTC Quote",
  legend: { width: 12 },
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
    BTFNX: btcLineGraph.createOptionsFromColor("red"),
    BTMX: btcLineGraph.createOptionsFromColor("blue"),
    GDAX: btcLineGraph.createOptionsFromColor("green"),
    OKCOIN: btcLineGraph.createOptionsFromColor("yellow"),
  },
} as ICryptoCurrencyLineGraphOptions;

setInterval(() => {
  btcGraph.setData(btcLineGraph.getLineGraphData(btcLineGraphOptions));
  const minY: number = market.state[CryptoCurrencies.Bitcoin].lowestPrice;
  btcGraph.options.minY = 0.999 * minY;
}, 1000);

const btcBuyLog = grid.set(1, 0, 1, 1, contrib.log, {
  fg: "red",
  label: "BTC (B) Quote Log",
  selectedFg: "green",
});
const btcSellLog = grid.set(1, 1, 1, 1, contrib.log, {
  fg: "green",
  label: "BTC (S) Quote Log",
  selectedFg: "green",
});
const btcPriceTable = grid.set(1, 2, 1, 2, contrib.table, {
  border: {type: "line", fg: "cyan"},
  columnWidth: [8, 10, 10, 10],
  fg: "white",
  height: "30%",
  interactive: true,
  keys: true,
  label: "BTC Latest Price",
  selectedBg: "blue",
  selectedFg: "white",
});

screen.key(["escape", "q", "C-c"], (ch, key) => {
  return process.exit(0);
});
screen.key(["enter"], (ch, key) => {
  btcGraph.setData(btcLineGraph.getLineGraphData(btcLineGraphOptions));
});
screen.render();
